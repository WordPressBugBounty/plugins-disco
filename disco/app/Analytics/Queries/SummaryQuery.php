<?php

/**
 * SummaryQuery — queries for the /analytics/summary endpoint.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Queries
 * @since      1.3.23
 */

namespace Disco\App\Analytics\Queries;

/**
 * All queries for the summary endpoint, scoped to completed orders only.
 *
 * Every method adds `o.status = 'wc-completed'` so raw totals are not
 * inflated by pending/refunded/failed orders.
 */
class SummaryQuery extends BaseQuery {

	/**
	 * WooCommerce status value for completed orders.
	 */
	private const STATUS_COMPLETED = 'wc-completed';

	/**
	 * Returns the number of campaigns whose status is currently '1' (active).
	 *
	 * Not date-filtered — reflects live DB state. Counts directly in SQL
	 * instead of loading every campaign row into PHP; the intent IS NOT NULL
	 * guard mirrors Campaign::get_campaigns(), which skips rows without intent.
	 */
	public function get_active_campaign_count(): int {
		$tables = $this->get_tables();

		return $this->run_count(
			"SELECT COUNT(*) FROM {$tables['campaigns']} WHERE status = %s AND intent IS NOT NULL",
			array( '1' )
		);
	}

	/**
	 * Returns total_orders and net_sales for ALL completed shop orders in a period.
	 *
	 * Does NOT filter by disco_campaign — site-wide WooCommerce totals.
	 *
	 * @param array $period { from: string Y-m-d, to: string Y-m-d }.
	 * @return array { total_orders: int, net_sales: float }
	 */
	public function get_all_order_metrics( array $period ): array {
		global $wpdb;

		$from_datetime = $period['from'] . ' 00:00:00';
		$to_datetime   = $period['to'] . ' 23:59:59';

		$sql = "SELECT
				COUNT(*)                         AS total_orders,
				COALESCE(SUM(order_stats.net_total), 0)   AS net_sales
			FROM {$wpdb->prefix}wc_order_stats order_stats
			WHERE order_stats.status = %s
			  AND order_stats.parent_id = 0
			  AND order_stats.date_created BETWEEN %s AND %s";

		$row = $this->run_row( $sql, array( self::STATUS_COMPLETED, $from_datetime, $to_datetime ) );

		return array(
			'total_orders' => (int) ( $row->total_orders ?? 0 ),
			'net_sales'    => round( (float) ( $row->net_sales ?? 0 ), 2 ),
		);
	}

	/**
	 * Returns disco_orders count and discount_sales for completed disco orders in a period.
	 *
	 * Scoped to wc-completed orders only.
	 *
	 * @param array $period { from: string Y-m-d, to: string Y-m-d }.
	 * @return array { orders_count: int, revenue: float }
	 */
	public function get_disco_order_metrics( array $period ): array {
		global $wpdb;

		$tables          = $this->get_tables();
		$clauses         = $this->get_order_clauses( $tables );
		$order_id_column = $tables['order_id_col'];
		$from_datetime   = $period['from'] . ' 00:00:00';
		$to_datetime     = $period['to'] . ' 23:59:59';

		$dedup = $this->get_campaign_dedup_condition( $tables );

		$sql = "SELECT
				COUNT(DISTINCT order_meta.{$order_id_column})                                   AS orders_count,
				SUM({$clauses['total_expr']} - COALESCE(order_stats.shipping_total, 0))         AS revenue
			FROM      {$tables['order_meta']}         order_meta
			JOIN      {$tables['orders']}             o           ON o.ID              = order_meta.{$order_id_column} AND {$clauses['status_where']}
			LEFT JOIN {$wpdb->prefix}wc_order_stats   order_stats ON order_stats.order_id = order_meta.{$order_id_column}
			{$clauses['total_join']}
			WHERE order_meta.meta_key = %s
			  AND o.status = %s
			  AND {$clauses['date_col']} BETWEEN %s AND %s
			  AND {$dedup}";

		$row = $this->run_row( $sql, array( 'disco_campaign', self::STATUS_COMPLETED, $from_datetime, $to_datetime ) );

		return array(
			'orders_count' => (int) ( $row->orders_count ?? 0 ),
			'revenue'      => round( (float) ( $row->revenue ?? 0 ), 2 ),
		);
	}

	/**
	 * Returns the distinct customer count from completed disco orders in a period.
	 *
	 * Counts by billing_email so guest checkouts are included.
	 * Scoped to wc-completed orders only.
	 *
	 * @param array $period { from: string Y-m-d, to: string Y-m-d }.
	 */
	public function get_disco_customer_count( array $period ): int {
		$tables          = $this->get_tables();
		$clauses         = $this->get_order_clauses( $tables );
		$order_id_column = $tables['order_id_col'];
		$from_datetime   = $period['from'] . ' 00:00:00';
		$to_datetime     = $period['to'] . ' 23:59:59';

		$dedup = $this->get_campaign_dedup_condition( $tables );

		$sql = "SELECT COUNT(DISTINCT o.billing_email)
			FROM      {$tables['order_meta']} order_meta
			JOIN      {$tables['orders']}     o  ON o.ID = order_meta.{$order_id_column} AND {$clauses['status_where']}
			WHERE order_meta.meta_key = %s
			  AND o.status = %s
			  AND {$clauses['date_col']} BETWEEN %s AND %s
			  AND o.billing_email != ''
			  AND {$dedup}";

		return $this->run_count( $sql, array( 'disco_campaign', self::STATUS_COMPLETED, $from_datetime, $to_datetime ) );
	}

}
