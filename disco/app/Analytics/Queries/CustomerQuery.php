<?php

/**
 * CustomerQuery — focused queries for customer analytics data.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Queries
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Queries;

/**
 * Handles all single-purpose SQL queries related to customers.
 *
 * Each method does exactly ONE job.
 * No business logic — raw DB results only.
 */
class CustomerQuery extends BaseQuery {

	/**
	 * Returns a paginated list of customers for the analytics table view.
	 *
	 * Filters to completed orders with disco_campaign meta.
	 * Campaigns are returned inline via GROUP_CONCAT (id::name::intent).
	 *
	 * @param array $args date_from, date_to, campaign_id, order_id, per_page, page.
	 * @return array { total: int, pages: int, rows: array }
	 */
	public function get_customers_for_table( array $args ): array {
		$context    = $this->build_list_context( $args );
		$pagination = $this->resolve_pagination( $args );
		$sort       = $this->resolve_sort( $args, array( 'total_spent', 'orders_count' ), 'total_spent' );

		$total = $this->run_count( $this->build_count_sql( $context ), $context['params'] );

		if ( 0 === $total ) {
			return $this->format_list_result( 0, $pagination['per_page'], array() );
		}

		$rows = $this->fetch_customer_rows( $context, $sort, $pagination );
		$rows = $this->resolve_customer_identities( $rows, $context['tables'] );
		$rows = $this->resolve_campaign_names( $rows, $context['tables'] );

		return $this->format_list_result( $total, $pagination['per_page'], $rows );
	}

	/**
	 * Builds WHERE conditions and params for the customer list filters.
	 *
	 * Numeric search matches the user ID; text search matches account
	 * name/email and billing name/email. The users / order_addresses JOINs are
	 * only emitted (via search_joins) when a search term needs them — identity
	 * display fields are resolved separately in resolve_customer_identities().
	 *
	 * Also exposes customer_key: registered customers group by user ID,
	 * guests group by billing email.
	 *
	 * @param array $args date_from, date_to, campaign_id, order_id, user_id, search.
	 * @return array { tables, clauses, id_col, where, params, customer_key, search_joins }
	 */
	private function build_list_context( array $args ): array {
		global $wpdb;

		$tables     = $this->get_tables();
		$clauses    = $this->get_order_clauses( $tables );
		$common     = $this->build_common_conditions( $args, $clauses, $tables );
		$conditions = array_merge(
			array( 'order_meta.meta_key = %s', $this->get_campaign_dedup_condition( $tables ) ),
			$common['conditions']
		);
		$params     = array_merge( array( 'disco_campaign' ), $common['params'] );

		$search          = $args['search'] ?? '';
		$order_id_column = $tables['order_id_col'];
		$users_join      = "LEFT JOIN {$tables['users']} u ON u.ID = {$clauses['customer_expr']}";
		$address_join    = "LEFT JOIN {$tables['order_addresses']} billing_address ON billing_address.order_id = order_meta.{$order_id_column} AND billing_address.address_type = 'billing'";
		$search_joins    = '';

		if ( is_numeric( $search ) && '' !== $search ) {
			$search_joins = $users_join;
			$conditions[] = 'u.ID = %d';
			$params[]     = (int) $search;
		} elseif ( ! empty( $search ) ) {
			$search_joins = $users_join . ' ' . $address_join;
			$like         = '%' . $wpdb->esc_like( $search ) . '%';
			$conditions[] = '( LOWER(u.display_name) LIKE LOWER(%s) OR LOWER(u.user_email) LIKE LOWER(%s) OR LOWER(CONCAT(billing_address.first_name, \' \', billing_address.last_name)) LIKE LOWER(%s) OR LOWER(billing_address.email) LIKE LOWER(%s) )';
			$params[]     = $like;
			$params[]     = $like;
			$params[]     = $like;
			$params[]     = $like;
		}

		return array(
			'tables'       => $tables,
			'clauses'      => $clauses,
			'id_col'       => $order_id_column,
			'where'        => 'WHERE ' . implode( ' AND ', $conditions ),
			'params'       => $params,
			'customer_key' => "CASE WHEN {$clauses['customer_expr']} != 0 THEN CAST({$clauses['customer_expr']} AS CHAR) ELSE o.billing_email END",
			'search_joins' => $search_joins,
		);
	}

	/**
	 * Builds the COUNT(DISTINCT customer) SQL for the current filters.
	 *
	 * @param array $context From build_list_context().
	 * @return string COUNT SQL with placeholders matching context params.
	 */
	private function build_count_sql( array $context ): string {
		$tables  = $context['tables'];
		$clauses = $context['clauses'];

		return "SELECT COUNT(DISTINCT {$context['customer_key']})
				FROM      {$tables['order_meta']}  order_meta
				JOIN      {$tables['orders']}       o ON o.ID = order_meta.{$context['id_col']} AND {$clauses['status_where']}
				{$clauses['customer_join']}
				{$context['search_joins']}
				{$context['where']}";
	}

	/**
	 * Fetches the paginated per-customer aggregate rows.
	 *
	 * Pure aggregates only — identity display fields (name, email, login, state)
	 * are resolved afterwards in resolve_customer_identities(), so the users and
	 * order_addresses tables are joined only when a search term filters on them.
	 * sample_order_id carries one order per customer for the address lookup.
	 *
	 * Campaign IDs are concatenated raw; names resolved later in PHP.
	 *
	 * @param array $context    From build_list_context().
	 * @param array $sort       From resolve_sort().
	 * @param array $pagination From resolve_pagination().
	 * @return array Customer row objects.
	 */
	private function fetch_customer_rows( array $context, array $sort, array $pagination ): array {
		$tables          = $context['tables'];
		$clauses         = $context['clauses'];
		$order_id_column = $context['id_col'];

		$rows_sql = "SELECT
				{$clauses['customer_expr']}                   AS customer_id,
				MAX(order_meta.{$order_id_column})            AS sample_order_id,
				COUNT(DISTINCT order_meta.{$order_id_column}) AS orders_count,
				SUM({$clauses['total_expr']})                 AS total_spent,
				GROUP_CONCAT(
					DISTINCT CAST(order_meta.meta_value AS UNSIGNED)
					ORDER BY CAST(order_meta.meta_value AS UNSIGNED)
					SEPARATOR '||'
				) AS campaign_ids_raw
			FROM      {$tables['order_meta']}  order_meta
			JOIN      {$tables['orders']}       o ON o.ID = order_meta.{$order_id_column} AND {$clauses['status_where']}
			{$clauses['total_join']}
			{$clauses['customer_join']}
			{$context['search_joins']}
			{$context['where']}
			GROUP BY  {$context['customer_key']}
			ORDER BY  {$sort['orderby']} {$sort['direction']}
			LIMIT %d OFFSET %d";

		$params = array_merge( $context['params'], array( $pagination['per_page'], $pagination['offset'] ) );

		return $this->run_rows( $rows_sql, $params );
	}

	/**
	 * Resolves name / email / login / state for each row via two batch lookups.
	 *
	 * Replaces the unconditional users and order_addresses LEFT JOINs that were
	 * previously inline in the SQL. Mirrors the old COALESCE semantics: account
	 * fields win, billing address (from the customer's sampled order) is the
	 * fallback; CONCAT of first/last name is null when either part is null.
	 *
	 * @param array $rows   Raw query result rows (stdClass objects).
	 * @param array $tables Table name map from get_tables().
	 * @return array Rows with customer_name, customer_email, user_login, billing_state set.
	 */
	private function resolve_customer_identities( array $rows, array $tables ): array {
		$user_ids  = array();
		$order_ids = array();

		foreach ( $rows as $row ) {
			if ( (int) $row->customer_id > 0 ) {
				$user_ids[ (int) $row->customer_id ] = true;
			}

			$order_ids[ (int) $row->sample_order_id ] = true;
		}

		$user_by_id     = $this->fetch_users( array_keys( $user_ids ), $tables );
		$address_by_oid = $this->fetch_billing_addresses( array_keys( $order_ids ), $tables );

		foreach ( $rows as &$row ) {
			$user    = $user_by_id[ (int) $row->customer_id ] ?? null;
			$address = $address_by_oid[ (int) $row->sample_order_id ] ?? null;

			$billing_name = null;

			if ( $address && null !== $address->first_name && null !== $address->last_name ) {
				$billing_name = $address->first_name . ' ' . $address->last_name;
			}

			$row->customer_name  = $user->display_name ?? $billing_name;
			$row->customer_email = $user->user_email ?? ( $address->email ?? null );
			$row->user_login     = $user->user_login ?? null;
			$row->billing_state  = $address->state ?? null;
		}

		unset( $row );

		return $rows;
	}


	/**
	 * Resolves campaigns_raw for each row via a single batch_campaign_meta() call.
	 *
	 * Replaces LEFT JOIN campaigns + JSON_EXTRACT inside GROUP_CONCAT which executed
	 * once per order row during the GROUP BY scan. Rebuilds "id::name::intent||..." format
	 * expected by CustomerService.
	 *
	 * @param array $rows   Raw query result rows (stdClass objects with campaign_ids_raw).
	 * @param array $tables Table name map from get_tables().
	 * @return array Rows with campaigns_raw set on every item.
	 */
	// phpcs:ignore SlevomatCodingStandard.Complexity.Cognitive.ComplexityTooHigh
	private function resolve_campaign_names( array $rows, array $tables ): array {
		$all_ids = array();

		foreach ( $rows as $row ) {
			if ( empty( $row->campaign_ids_raw ) ) {
				continue;
			}

			foreach ( explode( '||', $row->campaign_ids_raw ) as $id ) {
				$id = (int) $id;

				if ( $id <= 0 ) {
					continue;
				}

				$all_ids[ $id ] = true;
			}
		}

		$campaign_map = $this->batch_campaign_meta( array_keys( $all_ids ), $tables );

		foreach ( $rows as &$row ) {
			if ( empty( $row->campaign_ids_raw ) ) {
				$row->campaigns_raw = '';

				continue;
			}

			$parts = array();

			foreach ( explode( '||', $row->campaign_ids_raw ) as $id ) {
				$id      = (int) $id;
				$name    = $campaign_map[ $id ]['name'] ?? 'Unknown';
				$intent  = $campaign_map[ $id ]['intent'] ?? 'Unknown';
				$parts[] = $id . '::' . $name . '::' . $intent;
			}

			// @phpstan-ignore-next-line
			$row->campaigns_raw = implode( '||', $parts );
		}

		unset( $row );

		return $rows;
	}

}
