<?php //phpcs:disable 

/**
 * OrderQuery — focused queries for order data.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Queries
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Queries;

/**
 * Handles all single-purpose SQL queries related to WooCommerce orders.
 *
 * Each method does exactly ONE job.
 * No business logic — raw DB results only.
 */
class OrderQuery extends BaseQuery {

	// =========================================================================
	// List / paginated queries (used by OrderService for REST list endpoints)
	// =========================================================================

	/**
	 * Returns a paginated list of campaign-linked orders.
	 *
	 * Builds its own WHERE clauses from $args.
	 * Max per_page = 20 per spec.
	 *
	 * @param array $args campaign_id, product_id, customer_id, date_from, date_to,
	 *                    orderby, order, page, per_page.
	 * @return array { total: int, pages: int, rows: array }
	 */
	public function get_order_list( array $args ): array {
		$context    = $this->build_list_context( $args );
		$pagination = $this->resolve_pagination( $args );
		$sort       = $this->resolve_order_sort( $args, $context );

		$total = $this->run_count( $this->build_count_sql( $context ), $context['params'] );

		if ( 0 === $total ) {
			return $this->format_list_result( 0, $pagination['per_page'], array() );
		}

		$rows = $this->fetch_order_rows( $context, $sort, $pagination );
		$rows = $this->resolve_order_amounts( $rows, $context['tables'] );
		$rows = $this->resolve_order_customers( $rows, $context['tables'] );

		return $this->format_list_result( $total, $pagination['per_page'], $rows );
	}

	// =========================================================================
	// Single-order queries
	// =========================================================================

	/**
	 * Returns a single order header row (no line items).
	 *
	 * @param int $order_id WooCommerce order ID.
	 * @return object|null
	 */
	public function get_order( int $order_id ) {
		$tables        = $this->get_tables();
		$clauses       = $this->get_order_clauses( $tables, 'o', 'o' );
		$discount_join = "LEFT JOIN {$tables['order_meta']} discount_meta ON discount_meta.order_id = o.ID AND discount_meta.meta_key = '_discount_total'";

		$sql = "SELECT
				o.ID                                                                             AS order_id,
				{$clauses['date_col']}                                                           AS order_date,
				{$clauses['status_col']}                                                         AS order_status,
				{$clauses['customer_expr']}                                                      AS customer_id,
				COALESCE(u.display_name, CONCAT(billing_address.first_name, ' ', billing_address.last_name)) AS customer_name,
				COALESCE(u.user_email, billing_address.email)                                    AS customer_email,
				{$clauses['total_expr']}                                                         AS order_total,
				COALESCE(discount_meta.meta_value, 0)                                            AS discount_amount
			FROM      {$tables['orders']}          o
			{$discount_join}
			LEFT JOIN {$tables['users']}           u               ON u.ID              = {$clauses['customer_expr']}
			LEFT JOIN {$tables['order_addresses']} billing_address ON billing_address.order_id = o.ID AND billing_address.address_type = 'billing'
			WHERE o.ID = %d AND {$clauses['status_where']}";

		return $this->run_row( $sql, array( $order_id ) );
	}

	/**
	 * Returns line items for a single order.
	 *
	 * @param int $order_id WooCommerce order ID.
	 */
	public function get_line_items( int $order_id ): array {
		$tables = $this->get_tables();

		$sql = "SELECT
				order_item.order_item_id          AS item_id,
				item_product_meta.meta_value      AS product_id,
				product.post_title                AS product_name,
				item_qty_meta.meta_value          AS qty,
				product_price_meta.meta_value     AS unit_price,
				item_line_total_meta.meta_value   AS line_total,
				item_subtotal_meta.meta_value     AS line_subtotal
			FROM      {$tables['order_items']}   order_item
			JOIN      {$tables['order_itemmeta']} item_product_meta    ON item_product_meta.order_item_id    = order_item.order_item_id AND item_product_meta.meta_key = '_product_id'
			JOIN      {$tables['order_itemmeta']} item_qty_meta        ON item_qty_meta.order_item_id        = order_item.order_item_id AND item_qty_meta.meta_key = '_qty'
			JOIN      {$tables['order_itemmeta']} item_line_total_meta ON item_line_total_meta.order_item_id = order_item.order_item_id AND item_line_total_meta.meta_key = '_line_total'
			JOIN      {$tables['order_itemmeta']} item_subtotal_meta   ON item_subtotal_meta.order_item_id   = order_item.order_item_id AND item_subtotal_meta.meta_key = '_line_subtotal'
			LEFT JOIN {$tables['posts']}          product              ON product.ID = item_product_meta.meta_value
			LEFT JOIN {$tables['postmeta']}       product_price_meta   ON product_price_meta.post_id = product.ID AND product_price_meta.meta_key = '_regular_price'
			WHERE order_item.order_id = %d AND order_item.order_item_type = 'line_item'";

		return $this->run_rows( $sql, array( $order_id ) );
	}

	/**
	 * Returns campaigns attached to a single order.
	 *
	 * @param int $order_id WooCommerce order ID.
	 */
	public function get_campaigns_for_order( int $order_id ): array {
		$tables          = $this->get_tables();
		$order_id_column = $tables['order_id_col'];

		$dedup = $this->get_campaign_dedup_condition( $tables );

		$sql = "SELECT
				CAST(order_meta.meta_value AS UNSIGNED)                                          AS campaign_id,
				COALESCE(JSON_UNQUOTE(JSON_EXTRACT(campaign.data, '$.name')), 'Unknown')         AS campaign_name,
				COALESCE(campaign.intent, '')                                                    AS campaign_intent,
				CASE WHEN campaign.id IS NULL THEN 1 ELSE 0 END                                  AS is_deleted
			FROM      {$tables['order_meta']} order_meta
			LEFT JOIN {$tables['campaigns']}  campaign ON campaign.id = CAST(order_meta.meta_value AS UNSIGNED)
			WHERE order_meta.{$order_id_column} = %d AND order_meta.meta_key = %s
			  AND {$dedup}";

		$rows = $this->run_rows( $sql, array( $order_id, 'disco_campaign' ) );

		return array_map(
			function ( $row ) {
				return array(
					'campaign_id'     => (int) $row->campaign_id,
					'campaign_name'   => $row->campaign_name,
					'campaign_intent' => $row->campaign_intent,
					'is_deleted'      => (bool) $row->is_deleted,
				);
			},
			$rows
		);
	}

	/**
	 * Builds WHERE conditions, params, and filter JOINs for the order list.
	 *
	 * The product_id filter adds line-item JOINs; numeric search matches the
	 * order ID, text search matches customer name/email via an extra users JOIN.
	 *
	 * @param array $args campaign_id, product_id, customer_id, date_from, date_to, search.
	 * @return array { tables, clauses, id_col, where, params, joins }
	 */
	private function build_list_context( array $args ): array {
		global $wpdb;

		$tables          = $this->get_tables();
		$clauses         = $this->get_order_clauses( $tables );
		$order_id_column = $tables['order_id_col'];
		$common          = $this->build_common_conditions( $args, $clauses, $tables );
		$conditions      = array_merge(
			array( 'order_meta.meta_key = %s', $this->get_campaign_dedup_condition( $tables ) ),
			$common['conditions']
		);

		// JOIN placeholders precede WHERE placeholders in the final SQL, so their
		// params must be collected separately and merged join-params-first.
		$where_params = array_merge( array( 'disco_campaign' ), $common['params'] );
		$join_params  = array();
		$extra_joins  = array();

		if ( ! empty( $args['product_id'] ) ) {
			$extra_joins[] = "JOIN {$tables['order_items']}    filter_order_item   ON filter_order_item.order_id = order_meta.{$order_id_column} AND filter_order_item.order_item_type = 'line_item'";
			$extra_joins[] = "JOIN {$tables['order_itemmeta']} filter_product_meta ON filter_product_meta.order_item_id = filter_order_item.order_item_id AND filter_product_meta.meta_key = '_product_id' AND filter_product_meta.meta_value = %d";
			$join_params[] = (int) $args['product_id'];
		}

		$search = $args['search'] ?? '';

		if ( is_numeric( $search ) && '' !== $search ) {
			$conditions[]   = "order_meta.{$order_id_column} = %d";
			$where_params[] = (int) $search;
		} elseif ( ! empty( $search ) ) {
			$extra_joins[] = "LEFT JOIN {$tables['users']} search_user ON search_user.ID = {$clauses['customer_expr']}";
			$like          = '%' . $wpdb->esc_like( $search ) . '%';
			$conditions[]  = '( LOWER(search_user.display_name) LIKE LOWER(%s) OR LOWER(search_user.user_email) LIKE LOWER(%s) )';
			array_push( $where_params, $like, $like );
		}

		return array(
			'tables'  => $tables,
			'clauses' => $clauses,
			'id_col'  => $order_id_column,
			'where'   => 'WHERE ' . implode( ' AND ', $conditions ),
			'params'  => array_merge( $join_params, $where_params ),
			'joins'   => implode( ' ', $extra_joins ),
		);
	}

	/**
	 * Resolves the SQL sort column expression, direction, and the JOINs the
	 * sort expression needs.
	 *
	 * Whitelist: order_date, order_total, discount_amount, quantity. Totals/discounts
	 * are cast to DECIMAL so sorting is numeric, not lexicographic. Quantity sums the
	 * order's line-item quantities from wc_order_product_lookup. The order_stats,
	 * discount-meta, and product-lookup JOINs are emitted only when the chosen sort
	 * actually references them — display amounts are resolved separately in PHP.
	 *
	 * The product-lookup JOIN is safe against SUM inflation because the WHERE clause
	 * already restricts order_meta to a single disco_campaign row per order via
	 * get_campaign_dedup_condition().
	 *
	 * @param array $args    orderby, order.
	 * @param array $context From build_list_context().
	 * @return array { column: string, direction: 'ASC'|'DESC', joins: string }
	 */
	private function resolve_order_sort( array $args, array $context ): array {
		global $wpdb;

		$tables  = $context['tables'];
		$clauses = $context['clauses'];
		$id_col  = $context['id_col'];
		$sort    = $this->resolve_sort( $args, array( 'order_date', 'order_total', 'discount_amount', 'quantity' ), 'order_date' );

		$orderby_column_map = array(
			'order_date'      => $clauses['date_col'],
			'order_total'     => "CAST(({$clauses['total_expr']} - COALESCE(order_stats.shipping_total, 0)) AS DECIMAL(10,2))",
			'discount_amount' => "CAST({$clauses['discount_expr']} AS DECIMAL(10,2))",
			'quantity'        => 'COALESCE(SUM(sort_qty_lookup.product_qty), 0)',
		);

		$sort_join_map = array(
			'order_date'      => '',
			'order_total'     => "LEFT JOIN {$wpdb->prefix}wc_order_stats order_stats ON order_stats.order_id = order_meta.{$id_col}",
			'discount_amount' => $clauses['discount_join'],
			'quantity'        => "LEFT JOIN {$tables['product_lookup']} sort_qty_lookup ON sort_qty_lookup.order_id = order_meta.{$id_col}",
		);

		return array(
			'column'    => $orderby_column_map[ $sort['orderby'] ],
			'direction' => $sort['direction'],
			'joins'     => $sort_join_map[ $sort['orderby'] ],
		);
	}

	/**
	 * Builds the COUNT(DISTINCT order) SQL for the current filters.
	 *
	 * @param array $context From build_list_context().
	 * @return string COUNT SQL with placeholders matching context params.
	 */
	private function build_count_sql( array $context ): string {
		$tables  = $context['tables'];
		$clauses = $context['clauses'];

		return "SELECT COUNT(DISTINCT order_meta.{$context['id_col']}) FROM {$tables['order_meta']} order_meta JOIN {$tables['orders']} o ON o.ID = order_meta.{$context['id_col']} AND {$clauses['status_where']} {$clauses['customer_join']} {$context['joins']} {$context['where']}";
	}

	/**
	 * Fetches the paginated order rows — order scalars only.
	 *
	 * Customer identity, totals, discount, and item counts are resolved
	 * afterwards in resolve_order_amounts() / resolve_order_customers(), so
	 * the only JOINs left are the anchor, the orders table, any filter JOINs,
	 * and the JOIN the active sort expression needs.
	 *
	 * @param array $context    From build_list_context().
	 * @param array $sort       From resolve_order_sort().
	 * @param array $pagination From resolve_pagination().
	 * @return array Order row objects.
	 */
	private function fetch_order_rows( array $context, array $sort, array $pagination ): array {
		$tables          = $context['tables'];
		$clauses         = $context['clauses'];
		$order_id_column = $context['id_col'];

		$rows_sql = "SELECT
				order_meta.{$order_id_column}  AS order_id,
				{$clauses['date_col']}         AS order_date,
				{$clauses['status_col']}       AS order_status,
				{$clauses['customer_expr']}    AS customer_id,
				{$clauses['total_expr']}       AS total_amount
			FROM      {$tables['order_meta']} order_meta
			JOIN      {$tables['orders']}      o ON o.ID = order_meta.{$order_id_column} AND {$clauses['status_where']}
			{$clauses['total_join']}
			{$clauses['customer_join']}
			{$sort['joins']}
			{$context['joins']}
			{$context['where']}
			GROUP BY order_meta.{$order_id_column}
			ORDER BY {$sort['column']} {$sort['direction']}
			LIMIT %d OFFSET %d";

		$params = array_merge( $context['params'], array( $pagination['per_page'], $pagination['offset'] ) );

		return $this->run_rows( $rows_sql, $params );
	}

	/**
	 * Resolves order_total, discount_amount, and items_count via three batch lookups.
	 *
	 * Replaces the order_stats, discount-meta, and order_items LEFT JOINs that
	 * were previously inline in the SQL: order_total = total_amount minus the
	 * order's shipping_total, discount defaults to 0, items_count counts the
	 * order's line items.
	 *
	 * @param array $rows   Raw query result rows (stdClass objects).
	 * @param array $tables Table name map from get_tables().
	 * @return array Rows with order_total, discount_amount, items_count set.
	 */
	private function resolve_order_amounts( array $rows, array $tables ): array {
		$order_ids = array_map(
			function ( $row ) {
				return (int) $row->order_id;
			},
			$rows
		);

		if ( empty( $order_ids ) ) {
			return $rows;
		}

		$shipping_by_oid = $this->fetch_shipping_totals( $order_ids, $tables );
		$discount_by_oid = $this->fetch_discount_totals( $order_ids, $tables );
		$items_by_oid    = $this->fetch_item_counts( $order_ids, $tables );

		foreach ( $rows as &$row ) {
			$order_id = (int) $row->order_id;

			$row->order_total     = (float) $row->total_amount - ( $shipping_by_oid[ $order_id ] ?? 0.0 );
			$row->discount_amount = $discount_by_oid[ $order_id ] ?? 0;
			$row->items_count     = $items_by_oid[ $order_id ] ?? 0;
		}

		unset( $row );

		return $rows;
	}

	/**
	 * Fetches shipping_total from wc_order_stats for a set of order IDs in one query.
	 *
	 * @param array<int> $order_ids Order IDs.
	 * @param array      $tables    Table name map from get_tables().
	 * @return array Map of order_id => shipping total (float).
	 */
	private function fetch_shipping_totals( array $order_ids, array $tables ): array {
		global $wpdb;

		$placeholders = implode( ',', array_fill( 0, count( $order_ids ), '%d' ) );

		$stat_rows = $this->run_rows(
			"SELECT order_id, shipping_total FROM {$wpdb->prefix}wc_order_stats WHERE order_id IN ({$placeholders})",
			$order_ids
		);

		$shipping_by_oid = array();

		foreach ( $stat_rows as $stat_row ) {
			$shipping_by_oid[ (int) $stat_row->order_id ] = (float) $stat_row->shipping_total;
		}

		return $shipping_by_oid;
	}

	/**
	 * Fetches _discount_total order meta for a set of order IDs in one query.
	 *
	 * @param array<int> $order_ids Order IDs.
	 * @param array      $tables    Table name map from get_tables().
	 * @return array Map of order_id => discount meta value (string).
	 */
	private function fetch_discount_totals( array $order_ids, array $tables ): array {
		$order_id_column = $tables['order_id_col'];
		$placeholders    = implode( ',', array_fill( 0, count( $order_ids ), '%d' ) );

		$discount_rows = $this->run_rows(
			"SELECT {$order_id_column} AS order_id, meta_value FROM {$tables['order_meta']} WHERE {$order_id_column} IN ({$placeholders}) AND meta_key = '_discount_total'",
			$order_ids
		);

		$discount_by_oid = array();

		foreach ( $discount_rows as $discount_row ) {
			$discount_by_oid[ (int) $discount_row->order_id ] = $discount_row->meta_value;
		}

		return $discount_by_oid;
	}

	/**
	 * Fetches line-item counts for a set of order IDs in one query.
	 *
	 * @param array<int> $order_ids Order IDs.
	 * @param array      $tables    Table name map from get_tables().
	 * @return array Map of order_id => line item count (int).
	 */
	private function fetch_item_counts( array $order_ids, array $tables ): array {
		$placeholders = implode( ',', array_fill( 0, count( $order_ids ), '%d' ) );

		$item_rows = $this->run_rows(
			"SELECT order_id, COUNT(*) AS items_count FROM {$tables['order_items']} WHERE order_id IN ({$placeholders}) AND order_item_type = 'line_item' GROUP BY order_id",
			$order_ids
		);

		$items_by_oid = array();

		foreach ( $item_rows as $item_row ) {
			$items_by_oid[ (int) $item_row->order_id ] = (int) $item_row->items_count;
		}

		return $items_by_oid;
	}

	/**
	 * Resolves customer_name / customer_email via two batch lookups.
	 *
	 * Replaces the users and order_addresses LEFT JOINs that were previously
	 * inline in the SQL. Mirrors the old COALESCE semantics: account fields
	 * win, the order's own billing address is the fallback; CONCAT of
	 * first/last name is null when either part is null.
	 *
	 * @param array $rows   Raw query result rows (stdClass objects).
	 * @param array $tables Table name map from get_tables().
	 * @return array Rows with customer_name and customer_email set.
	 */
	private function resolve_order_customers( array $rows, array $tables ): array {
		$user_ids  = array();
		$order_ids = array();

		foreach ( $rows as $row ) {
			if ( (int) $row->customer_id > 0 ) {
				$user_ids[ (int) $row->customer_id ] = true;
			}

			$order_ids[ (int) $row->order_id ] = true;
		}

		$user_by_id     = $this->fetch_users( array_keys( $user_ids ), $tables );
		$address_by_oid = $this->fetch_billing_addresses( array_keys( $order_ids ), $tables );

		foreach ( $rows as &$row ) {
			$user    = $user_by_id[ (int) $row->customer_id ] ?? null;
			$address = $address_by_oid[ (int) $row->order_id ] ?? null;

			$billing_name = null;

			if ( $address && null !== $address->first_name && null !== $address->last_name ) {
				$billing_name = $address->first_name . ' ' . $address->last_name;
			}

			$row->customer_name  = $user->display_name ?? $billing_name;
			$row->customer_email = $user->user_email ?? ( $address->email ?? null );
		}

		unset( $row );

		return $rows;
	}

}
