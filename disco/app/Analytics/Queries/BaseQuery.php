<?php

/**
 * BaseQuery — shared table helpers for all Analytics query classes.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Queries
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Queries;

/**
 * Abstract base for all analytics query classes.
 *
 * Provides HPOS-aware table name resolution and common SQL fragment builders
 * so every concrete query class stays DRY.
 */
abstract class BaseQuery {

	/**
	 * Resolves table names and the HPOS flag for the current site.
	 *
	 * 'order_meta'   — where disco_campaign (and _discount_total) live.
	 * 'order_id_col' — FK column name in order_meta ('post_id' | 'order_id').
	 * 'postmeta'     — always wp_postmeta, used for product meta only.
	 * 'posts'        — always wp_posts, used for product rows only.
	 */
	protected function get_tables(): array {
		global $wpdb;

		return array(
			'orders'             => $wpdb->prefix . 'wc_orders',
			'order_meta'         => $wpdb->prefix . 'wc_orders_meta',
			'order_id_col'       => 'order_id',
			'posts'              => $wpdb->posts,
			'postmeta'           => $wpdb->postmeta,
			'users'              => $wpdb->users,
			'terms'              => $wpdb->terms,
			'term_taxonomy'      => $wpdb->term_taxonomy,
			'term_relationships' => $wpdb->term_relationships,
			'order_items'        => $wpdb->prefix . 'woocommerce_order_items',
			'order_itemmeta'     => $wpdb->prefix . 'woocommerce_order_itemmeta',
			'order_addresses'    => $wpdb->prefix . 'wc_order_addresses',
			'product_lookup'     => $wpdb->prefix . 'wc_order_product_lookup',
			'campaigns'          => $wpdb->prefix . 'disco_campaigns',
		);
	}

	/**
	 * Returns SQL fragments for HPOS order columns.
	 *
	 * The wp_wc_orders table stores total_amount and customer_id as direct columns.
	 * _discount_total is still stored in wp_wc_orders_meta.
	 * total_join and customer_join are kept as empty strings so existing query
	 * interpolations remain valid without any changes.
	 *
	 * @param array  $tables       Tables from get_tables().
	 * @param string $order_alias  SQL alias for the orders table      (default 'o').
	 * @param string $meta_alias   SQL alias for the order_meta anchor (default 'order_meta').
	 */
	protected function get_order_clauses(
		array $tables,
		string $order_alias = 'o',
		string $meta_alias = 'order_meta'
	): array {
		$order_meta_table = $tables['order_meta'];
		$order_id_column  = $tables['order_id_col'];

		return array(
			'date_col'      => "{$order_alias}.date_created_gmt",
			'status_where'  => "{$order_alias}.type = 'shop_order'",
			'status_col'    => "{$order_alias}.status",
			'total_expr'    => "{$order_alias}.total_amount",
			'customer_expr' => "{$order_alias}.customer_id",
			'discount_expr' => 'COALESCE(discount_meta.meta_value, 0)',
			'total_join'    => '',
			'customer_join' => '',
			'discount_join' => "LEFT JOIN {$order_meta_table} discount_meta ON discount_meta.{$order_id_column} = {$meta_alias}.{$order_id_column} AND discount_meta.meta_key = '_discount_total'",
		);
	}

	/**
	 * Returns a SQL condition that restricts order_meta to the last disco_campaign row per order.
	 *
	 * Prevents revenue / discount SUM inflation when an order has more than one
	 * disco_campaign meta entry — only the row with the highest id is used.
	 *
	 * @param array  $tables     Tables from get_tables().
	 * @param string $meta_alias SQL alias for the order_meta table (default 'order_meta').
	 * @return string Raw SQL fragment (no leading AND).
	 */
	protected function get_campaign_dedup_condition( array $tables, string $meta_alias = 'order_meta' ): string {
		$meta_table   = $tables['order_meta'];
		$order_id_col = $tables['order_id_col'];

		return "{$meta_alias}.id = (
			SELECT MAX(dedup_meta.id) FROM {$meta_table} dedup_meta
			WHERE dedup_meta.meta_key = 'disco_campaign'
			  AND dedup_meta.{$order_id_col} = {$meta_alias}.{$order_id_col}
		)";
	}

	/**
	 * Builds shared WHERE conditions and params for common filter args.
	 *
	 * Handles: date_from, date_to, campaign_id, customer_id (or user_id), order_id, status.
	 * Special filters (product_id, search) must be added by the caller.
	 *
	 * @param array $args    Filter args from the request.
	 * @param array $clauses From get_order_clauses().
	 * @param array $tables  From get_tables().
	 * @return array { conditions: string[], params: array }
	 */
	protected function build_common_conditions( array $args, array $clauses, array $tables ): array {
		$conditions = array();
		$params     = array();

		if ( ! empty( $args['date_from'] ) ) {
			$conditions[] = "{$clauses['date_col']} >= %s";
			$params[]     = $args['date_from'] . ' 00:00:00';
		}

		if ( ! empty( $args['date_to'] ) ) {
			$conditions[] = "{$clauses['date_col']} <= %s";
			$params[]     = $args['date_to'] . ' 23:59:59';
		}

		if ( ! empty( $args['campaign_id'] ) ) {
			// Sargable string compare so the (meta_key, meta_value) index is used.
			// meta_value stores campaign IDs as bare digit strings; CAST would force
			// a full scan of all disco_campaign rows.
			$conditions[] = 'order_meta.meta_value = %s';
			$params[]     = (string) (int) $args['campaign_id'];
		}

		$customer_id = $args['customer_id'] ?? $args['user_id'] ?? '';

		if ( ! empty( $customer_id ) ) {
			$conditions[] = "{$clauses['customer_expr']} = %s";
			$params[]     = (string) $customer_id;
		}

		if ( ! empty( $args['order_id'] ) ) {
			$conditions[] = "order_meta.{$tables['order_id_col']} = %d";
			$params[]     = (int) $args['order_id'];
		}

		if ( ! empty( $args['status'] ) ) {
			$conditions[] = 'o.status = %s';
			$params[]     = sanitize_text_field( $args['status'] );
		}

		return array( 'conditions' => $conditions, 'params' => $params );
	}

	/**
	 * Fetches name and intent for a set of campaign IDs in a single query.
	 *
	 * Used by resolve_campaign_names() implementations in concrete query classes
	 * to replace per-row JSON_EXTRACT calls inside GROUP_CONCAT.
	 *
	 * @param array<int> $ids    Campaign IDs to fetch.
	 * @param array      $tables From get_tables().
	 * @return array Map of campaign_id => { name: string, intent: string }
	 */
	protected function batch_campaign_meta( array $ids, array $tables ): array {
		if ( empty( $ids ) ) {
			return array();
		}

		$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );

		$rows = $this->run_rows(
			"SELECT id, intent, data FROM {$tables['campaigns']} WHERE id IN ({$placeholders})",
			array_map( 'intval', $ids )
		);

		if ( ! is_array( $rows ) ) {
			$rows = array();
		}

		$map = array();

		foreach ( $rows as $row ) {
			$data                  = json_decode( $row->data, true );
			$map[ (int) $row->id ] = array(
				'name'   => is_array( $data ) ? ( $data['name'] ?? 'Unknown' ) : 'Unknown',
				'intent' => $row->intent ?? 'Unknown',
			);
		}

		return $map;
	}

	/**
	 * Fetches display_name / user_email / user_login for a set of user IDs in one query.
	 *
	 * @param array<int> $user_ids WP user IDs.
	 * @param array      $tables   Table name map from get_tables().
	 * @return array Map of user_id => user row object.
	 */
	protected function fetch_users( array $user_ids, array $tables ): array {
		if ( empty( $user_ids ) ) {
			return array();
		}

		$placeholders = implode( ',', array_fill( 0, count( $user_ids ), '%d' ) );

		$user_rows = $this->run_rows(
			"SELECT ID, display_name, user_email, user_login
			 FROM {$tables['users']}
			 WHERE ID IN ({$placeholders})",
			$user_ids
		);

		$user_by_id = array();

		foreach ( $user_rows as $user_row ) {
			$user_by_id[ (int) $user_row->ID ] = $user_row;
		}

		return $user_by_id;
	}

	/**
	 * Fetches the billing address rows for a set of order IDs in one query.
	 *
	 * @param array<int> $order_ids Order IDs.
	 * @param array      $tables    Table name map from get_tables().
	 * @return array Map of order_id => address row object.
	 */
	protected function fetch_billing_addresses( array $order_ids, array $tables ): array {
		if ( empty( $order_ids ) ) {
			return array();
		}

		$placeholders = implode( ',', array_fill( 0, count( $order_ids ), '%d' ) );

		$address_rows = $this->run_rows(
			"SELECT order_id, first_name, last_name, email, state
			 FROM {$tables['order_addresses']}
			 WHERE order_id IN ({$placeholders})
			   AND address_type = 'billing'",
			$order_ids
		);

		$address_by_oid = array();

		foreach ( $address_rows as $address_row ) {
			$address_by_oid[ (int) $address_row->order_id ] = $address_row;
		}

		return $address_by_oid;
	}

	// =========================================================================
	// List-query plumbing shared by all paginated table queries
	// =========================================================================

	/**
	 * Resolves per_page / page / offset from request args.
	 *
	 * @param array $args             Request args (per_page, page).
	 * @param int   $default_per_page Default page size.
	 * @param int   $max_per_page     Hard cap for page size.
	 * @return array { per_page: int, page: int, offset: int }
	 */
	protected function resolve_pagination( array $args, int $default_per_page = 10, int $max_per_page = 100 ): array {
		$per_page = min( absint( $args['per_page'] ?? $default_per_page ), $max_per_page );
		$page     = max( 1, absint( $args['page'] ?? 1 ) );

		return array(
			'per_page' => $per_page,
			'page'     => $page,
			'offset'   => ( $page - 1 ) * $per_page,
		);
	}

	/**
	 * Resolves a whitelisted ORDER BY field and direction from request args.
	 *
	 * Falls back to $default_orderby when args['orderby'] is not whitelisted.
	 * Direction defaults to DESC; only an explicit 'asc'/'ASC' flips it.
	 *
	 * @param array         $args            Request args (orderby, order).
	 * @param array<string> $allowed_orderby Whitelist of sortable fields.
	 * @param string        $default_orderby Fallback field.
	 * @return array { orderby: string, direction: 'ASC'|'DESC' }
	 */
	protected function resolve_sort( array $args, array $allowed_orderby, string $default_orderby ): array {
		$orderby = $default_orderby;

		if ( in_array( $args['orderby'] ?? '', $allowed_orderby, true ) ) {
			$orderby = $args['orderby'];
		}

		$direction = 'DESC';

		if ( strtoupper( $args['order'] ?? 'DESC' ) === 'ASC' ) {
			$direction = 'ASC';
		}

		return array(
			'orderby'   => $orderby,
			'direction' => $direction,
		);
	}

	/**
	 * Runs a COUNT query through $wpdb->prepare().
	 *
	 * $sql must contain at least one placeholder matching $params; callers
	 * build it from trusted fragments (table names, whitelisted columns) only.
	 *
	 * @param string $sql    COUNT SQL with %d/%s placeholders.
	 * @param array  $params Values for the placeholders (must not be empty).
	 * @return int The count.
	 */
	protected function run_count( string $sql, array $params ): int {
		global $wpdb;

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $sql contains only trusted fragments (table names from $wpdb->prefix, whitelisted columns); every value is bound here via prepare(). Real-time analytics aggregates must not be cached.
		return (int) $wpdb->get_var( $wpdb->prepare( $sql, ...$params ) );
	}

	/**
	 * Runs a single-row SELECT through $wpdb->prepare().
	 *
	 * $sql must contain at least one placeholder matching $params; callers
	 * build it from trusted fragments (table names, whitelisted columns) only.
	 *
	 * @param string $sql    SELECT SQL with %d/%s placeholders.
	 * @param array  $params Values for the placeholders (must not be empty).
	 * @return object|null Row object, or null when no row matches.
	 */
	protected function run_row( string $sql, array $params ) {
		global $wpdb;

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $sql contains only trusted fragments (table names from $wpdb->prefix, whitelisted columns); every value is bound here via prepare(). Real-time analytics aggregates must not be cached.
		return $wpdb->get_row( $wpdb->prepare( $sql, ...$params ) );
	}

	/**
	 * Runs a SELECT query through $wpdb->prepare() and always returns an array of row objects.
	 *
	 * $sql must contain at least one placeholder matching $params; callers
	 * build it from trusted fragments only.
	 *
	 * @param string $sql    SELECT SQL with %d/%s placeholders.
	 * @param array  $params Values for the placeholders (must not be empty).
	 * @return array Row objects (empty array on no result / error).
	 */
	protected function run_rows( string $sql, array $params ): array {
		global $wpdb;

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- $sql contains only trusted fragments (table names from $wpdb->prefix, whitelisted columns); every value is bound here via prepare(). Real-time analytics aggregates must not be cached.
		$rows = $wpdb->get_results( $wpdb->prepare( $sql, ...$params ) );

		if ( is_array( $rows ) ) {
			return $rows;
		}

		return array();
	}

	/**
	 * Formats the standard { total, pages, rows } result for list queries.
	 *
	 * @param int   $total    Total matching rows.
	 * @param int   $per_page Page size used for the pages calculation.
	 * @param array $rows     Result rows for the current page.
	 * @return array { total: int, pages: int, rows: array }
	 */
	protected function format_list_result( int $total, int $per_page, array $rows ): array {
		$pages = 0;

		if ( $total > 0 && $per_page > 0 ) {
			$pages = (int) ceil( $total / $per_page );
		}

		return array(
			'total' => $total,
			'pages' => $pages,
			'rows'  => $rows,
		);
	}

}
