<?php

/**
 * CampaignQuery — focused queries for campaign data.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Queries
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Queries;

/**
 * Handles all single-purpose SQL queries related to campaigns.
 *
 * Each method does exactly ONE job.
 * LEFT JOINs to the campaigns table preserve data for deleted campaigns.
 */
class CampaignQuery extends BaseQuery {

	/**
	 * Only completed orders count toward campaign metrics.
	 *
	 * Keeps orders_count / revenue / customers_count from including on-hold,
	 * cancelled, refunded, or other non-final order statuses.
	 */
	private const STATUS_COMPLETED = 'wc-completed';

	// =========================================================================
	// List / paginated queries (used by CampaignService for REST list endpoints)
	// =========================================================================

	/**
	 * Returns a paginated campaign list with aggregate order metrics.
	 *
	 * Runs three separate queries:
	 *   1. COUNT — how many distinct campaigns match the filters.
	 *   2. AGG   — paginated campaign_id + metrics (no JOIN with campaigns table).
	 *   3. META  — campaign name/intent/status/data for the IDs found in step 2.
	 * PHP merges the results. No subqueries, no multi-level prepare issues.
	 *
	 * @param array $args search, date_from, date_to, sort_by, page, per_page.
	 * @return array { total: int, pages: int, rows: array }
	 */
	public function get_campaign_list( array $args ): array {
		$context    = $this->build_list_context( $args );
		$pagination = $this->resolve_pagination( $args );
		$sort       = $this->resolve_campaign_sort( $args );

		// Name search matched no campaigns — nothing can match downstream.
		if ( $context['no_match'] ) {
			return $this->format_list_result( 0, $pagination['per_page'], array() );
		}

		// QUERY 1: COUNT distinct campaigns.
		$total = $this->run_count( $this->build_count_sql( $context ), $context['params'] );

		if ( 0 === $total ) {
			return $this->format_list_result( 0, $pagination['per_page'], array() );
		}

		// QUERY 2: Aggregated metrics per campaign (paginated).
		$agg_rows = $this->fetch_campaign_aggregates( $context, $sort, $pagination );

		if ( empty( $agg_rows ) ) {
			return $this->format_list_result( $total, $pagination['per_page'], array() );
		}

		// QUERY 3 + merge: campaign meta mapped onto aggregated rows.
		$campaign_map = $this->fetch_campaign_meta_map( $agg_rows, $context['tables'] );
		$rows         = $this->merge_campaign_rows( $agg_rows, $campaign_map );

		return $this->format_list_result( $total, $pagination['per_page'], $rows );
	}

	/**
	 * Returns aggregate metrics for a single campaign in a period.
	 *
	 * @param int   $campaign_id Campaign ID.
	 * @param array $period      { from: string, to: string } — empty strings skip date filter.
	 * @return object|null
	 */
	public function get_campaign( int $campaign_id, array $period ) {
		$tables = $this->get_tables();

		/** @var object{campaign_id: int|string, orders_count: int|string, customers_count: int|string, revenue: string|null}|null $aggregates */
		$aggregates = $this->fetch_campaign_aggregate_row( $campaign_id, $period, $tables );

		if ( ! $aggregates ) {
			return null;
		}

		// QUERY 2 + merge: campaign meta resolved separately, like the list query.
		$campaign_map = $this->fetch_campaign_meta_map( array( $aggregates ), $tables );
		$campaign     = $campaign_map[ $campaign_id ] ?? null;

		return (object) array(
			'campaign_id'     => (int) $aggregates->campaign_id,
			'intent'          => $campaign->intent ?? 'Unknown',
			'status'          => $this->resolve_campaign_status( $campaign ),
			'is_deleted'      => null === $campaign ? 1 : 0,
			'campaign_data'   => $campaign->data ?? null,
			'orders_count'    => $aggregates->orders_count,
			'customers_count' => $aggregates->customers_count,
			'revenue'         => $aggregates->revenue,
		);
	}

	/**
	 * Fetches the aggregate metrics row for a single campaign (no campaigns JOIN).
	 *
	 * @param int   $campaign_id Campaign ID.
	 * @param array $period      { from: string, to: string } — empty strings skip date filter.
	 * @param array $tables      From get_tables().
	 * @return object|null Aggregate row, or null when the campaign has no matching orders.
	 */
	private function fetch_campaign_aggregate_row( int $campaign_id, array $period, array $tables ) {
		global $wpdb;

		$clauses          = $this->get_order_clauses( $tables );
		$order_id_column  = $tables['order_id_col'];
		$where_conditions = array( 'order_meta.meta_key = %s', 'CAST(order_meta.meta_value AS UNSIGNED) = %d', 'o.status = %s', $this->get_campaign_dedup_condition( $tables ) );
		$query_params     = array( 'disco_campaign', $campaign_id, self::STATUS_COMPLETED );

		if ( ! empty( $period['from'] ) ) {
			$where_conditions[] = "{$clauses['date_col']} >= %s";
			$query_params[]     = $period['from'] . ' 00:00:00';
		}

		if ( ! empty( $period['to'] ) ) {
			$where_conditions[] = "{$clauses['date_col']} <= %s";
			$query_params[]     = $period['to'] . ' 23:59:59';
		}

		$where_clause = 'WHERE ' . implode( ' AND ', $where_conditions );

		$sql = "SELECT
				CAST(order_meta.meta_value AS UNSIGNED)              AS campaign_id,
				COUNT(DISTINCT order_meta.{$order_id_column})        AS orders_count,
				COUNT(DISTINCT CASE WHEN {$clauses['customer_expr']} != 0 THEN CAST({$clauses['customer_expr']} AS CHAR) ELSE o.billing_email END) AS customers_count,
				SUM({$clauses['total_expr']} - COALESCE(order_stats.shipping_total, 0))  AS revenue
			FROM      {$tables['order_meta']}   order_meta
			JOIN      {$tables['orders']}       o ON o.ID = order_meta.{$order_id_column} AND {$clauses['status_where']}
			LEFT JOIN {$wpdb->prefix}wc_order_stats order_stats ON order_stats.order_id = order_meta.{$order_id_column}
			{$clauses['total_join']}
			{$clauses['customer_join']}
			{$where_clause}
			GROUP BY CAST(order_meta.meta_value AS UNSIGNED)";

		return $this->run_row( $sql, $query_params );
	}

	/**
	 * Builds WHERE conditions and params for the campaign list filters.
	 *
	 * Numeric search matches the campaign ID. Text search pre-resolves matching
	 * campaign IDs in a separate small query, so the COUNT and aggregate queries
	 * need no campaigns JOIN and no per-row JSON_EXTRACT; no_match short-circuits
	 * the list to an empty result.
	 *
	 * @param array $args search, date_from, date_to, etc.
	 * @return array { tables, clauses, id_col, where, params, no_match }
	 */
	private function build_list_context( array $args ): array {
		$tables     = $this->get_tables();
		$clauses    = $this->get_order_clauses( $tables );
		$common     = $this->build_common_conditions( $args, $clauses, $tables );
		$conditions = array_merge(
			array( 'order_meta.meta_key = %s', 'o.status = %s', $this->get_campaign_dedup_condition( $tables ) ),
			$common['conditions']
		);
		$params     = array_merge( array( 'disco_campaign', self::STATUS_COMPLETED ), $common['params'] );

		$search   = $args['search'] ?? '';
		$no_match = false;

		if ( is_numeric( $search ) && '' !== $search ) {
			// Sargable string compare so the (meta_key, meta_value) index is used.
			$conditions[] = 'order_meta.meta_value = %s';
			$params[]     = (string) (int) $search;
		} elseif ( ! empty( $search ) ) {
			$matching_ids = $this->find_campaign_ids_by_name( $search, $tables );

			if ( empty( $matching_ids ) ) {
				$no_match = true;
			} else {
				$id_placeholders = implode( ',', array_fill( 0, count( $matching_ids ), '%s' ) );
				// Sargable string compare so the (meta_key, meta_value) index is used.
				$conditions[] = "order_meta.meta_value IN ({$id_placeholders})";
				$params       = array_merge( $params, $matching_ids );
			}
		}

		return array(
			'tables'   => $tables,
			'clauses'  => $clauses,
			'id_col'   => $tables['order_id_col'],
			'where'    => 'WHERE ' . implode( ' AND ', $conditions ),
			'params'   => $params,
			'no_match' => $no_match,
		);
	}

	/**
	 * Returns the IDs of campaigns whose JSON name matches the search term.
	 *
	 * The campaigns table only holds user-created campaigns, so the result
	 * (and the IN list built from it) stays small and bounded.
	 *
	 * @param string $search Raw search term.
	 * @param array  $tables From get_tables().
	 * @return array<string> Campaign IDs as bare digit strings (matching meta_value storage).
	 */
	private function find_campaign_ids_by_name( string $search, array $tables ): array {
		global $wpdb;

		$rows = $this->run_rows(
			"SELECT id FROM {$tables['campaigns']} WHERE LOWER(JSON_UNQUOTE(JSON_EXTRACT(data, '$.name'))) LIKE LOWER(%s)",
			array( '%' . $wpdb->esc_like( $search ) . '%' )
		);

		return array_map(
			function ( $row ) {
				return (string) (int) $row->id;
			},
			$rows
		);
	}

	/**
	 * Resolves the aggregate column and direction to sort the campaign list by.
	 *
	 * Accepts sort_by (REST param) or orderby; whitelist: orders, customers, revenue.
	 *
	 * @param array $args sort_by / orderby, order.
	 * @return array { column: string, direction: 'ASC'|'DESC' }
	 */
	private function resolve_campaign_sort( array $args ): array {
		$args['orderby'] = $args['sort_by'] ?? $args['orderby'] ?? '';

		$sort = $this->resolve_sort( $args, array( 'orders', 'customers', 'revenue' ), 'revenue' );

		$sort_col_map = array(
			'orders'    => 'total_orders',
			'customers' => 'total_customers',
			'revenue'   => 'total_revenue',
		);

		return array(
			'column'    => $sort_col_map[ $sort['orderby'] ],
			'direction' => $sort['direction'],
		);
	}

	/**
	 * Builds the COUNT(DISTINCT campaign) SQL for the current filters.
	 *
	 * @param array $context From build_list_context().
	 * @return string COUNT SQL with placeholders matching context params.
	 */
	private function build_count_sql( array $context ): string {
		$tables  = $context['tables'];
		$clauses = $context['clauses'];

		return "SELECT COUNT(DISTINCT CAST(order_meta.meta_value AS UNSIGNED))
			FROM {$tables['order_meta']} order_meta
			JOIN {$tables['orders']} o ON o.ID = order_meta.{$context['id_col']} AND {$clauses['status_where']}
			{$context['where']}";
	}

	/**
	 * Fetches the paginated per-campaign aggregate rows (orders, customers, revenue).
	 *
	 * No JOIN with the campaigns table — meta is resolved separately so deleted
	 * campaigns keep their metrics.
	 *
	 * @param array $context    From build_list_context().
	 * @param array $sort       From resolve_campaign_sort().
	 * @param array $pagination From resolve_pagination().
	 * @return array Aggregate row objects.
	 */
	private function fetch_campaign_aggregates( array $context, array $sort, array $pagination ): array {
		global $wpdb;

		$tables          = $context['tables'];
		$clauses         = $context['clauses'];
		$order_id_column = $context['id_col'];

		$agg_sql = "SELECT
				CAST(order_meta.meta_value AS UNSIGNED)                AS campaign_id,
				COUNT(DISTINCT order_meta.{$order_id_column})          AS total_orders,
				COUNT(DISTINCT CASE WHEN {$clauses['customer_expr']} != 0 THEN CAST({$clauses['customer_expr']} AS CHAR) ELSE o.billing_email END) AS total_customers,
				SUM({$clauses['total_expr']} - COALESCE(order_stats.shipping_total, 0))  AS total_revenue
			FROM {$tables['order_meta']} order_meta
			JOIN {$tables['orders']} o ON o.ID = order_meta.{$order_id_column} AND {$clauses['status_where']}
			LEFT JOIN {$wpdb->prefix}wc_order_stats order_stats ON order_stats.order_id = order_meta.{$order_id_column}
			{$context['where']}
			GROUP BY CAST(order_meta.meta_value AS UNSIGNED)
			ORDER BY {$sort['column']} {$sort['direction']}
			LIMIT %d OFFSET %d";

		$params = array_merge( $context['params'], array( $pagination['per_page'], $pagination['offset'] ) );

		return $this->run_rows( $agg_sql, $params );
	}

	/**
	 * Fetches id/intent/status/data for the campaigns present in the aggregate rows.
	 *
	 * @param array $agg_rows Aggregate rows from fetch_campaign_aggregates().
	 * @param array $tables   From get_tables().
	 * @return array Map of campaign_id => campaign row object.
	 */
	private function fetch_campaign_meta_map( array $agg_rows, array $tables ): array {
		$campaign_ids = array_map(
			function ( $row ) {
				return (int) $row->campaign_id;
			},
			$agg_rows
		);

		$placeholders = implode( ',', array_fill( 0, count( $campaign_ids ), '%d' ) );

		$campaign_rows = $this->run_rows(
			"SELECT id, intent, status, data FROM {$tables['campaigns']} WHERE id IN ({$placeholders})",
			$campaign_ids
		);

		$campaign_map = array();

		foreach ( $campaign_rows as $campaign_row ) {
			$campaign_map[ (int) $campaign_row->id ] = $campaign_row;
		}

		return $campaign_map;
	}

	/**
	 * Merges campaign meta (name/intent/status) onto the aggregated metric rows.
	 *
	 * Campaigns missing from the map are flagged 'deleted' with name 'Unknown'.
	 *
	 * @param array $agg_rows     Aggregate rows from fetch_campaign_aggregates().
	 * @param array $campaign_map Map from fetch_campaign_meta_map().
	 * @return array Final merged row objects.
	 */
	private function merge_campaign_rows( array $agg_rows, array $campaign_map ): array {
		$rows = array();

		foreach ( $agg_rows as $row ) {
			$cid      = (int) $row->campaign_id;
			$campaign = $campaign_map[ $cid ] ?? null;

			$rows[] = (object) array(
				'campaign_id'     => $cid,
				'campaign_name'   => $this->resolve_campaign_name( $campaign ),
				'intent'          => $campaign->intent ?? 'Unknown',
				'status'          => $this->resolve_campaign_status( $campaign ),
				'campaign_data'   => $campaign->data ?? null,
				'total_orders'    => $row->total_orders,
				'total_customers' => $row->total_customers,
				'total_revenue'   => $row->total_revenue,
			);
		}

		return $rows;
	}

	/**
	 * Resolves the display name from a campaign row's JSON data column.
	 *
	 * @param object|null $campaign Campaign row, or null when deleted.
	 * @return string Campaign name, 'Unknown' when unresolvable.
	 * @phpstan-param object{data: string|null}|null $campaign
	 */
	private function resolve_campaign_name( ?object $campaign ): string {
		if ( null === $campaign ) {
			return 'Unknown';
		}

		$campaign_data = json_decode( (string) $campaign->data, true );
		$name          = '';

		if ( is_array( $campaign_data ) ) {
			$name = $campaign_data['name'] ?? '';
		}

		if ( '' !== $name ) {
			return $name;
		}

		return 'Unknown';
	}

	/**
	 * Resolves the status label for a campaign row.
	 *
	 * @param object|null $campaign Campaign row, or null when deleted.
	 * @return string One of 'deleted' | 'active' | 'inactive'.
	 * @phpstan-param object{status: string|null}|null $campaign
	 */
	private function resolve_campaign_status( ?object $campaign ): string {
		if ( null === $campaign ) {
			return 'deleted';
		}

		if ( '1' === $campaign->status ) {
			return 'active';
		}

		return 'inactive';
	}

}
