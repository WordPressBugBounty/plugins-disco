<?php

/**
 * ProductQuery — focused queries for product analytics data.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Queries
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Queries;

/**
 * Handles all single-purpose SQL queries related to products sold in campaign-linked orders.
 *
 * Each method does exactly ONE job.
 * No business logic — raw DB results only.
 */
class ProductQuery extends BaseQuery {

	/**
	 * Returns a paginated product list for the admin table.
	 *
	 * Filters: date range, status, campaign, customer, order.
	 * Categories and campaign names resolved via GROUP_CONCAT.
	 * Variation attribute labels resolved via batch PHP lookup — no per-row subquery.
	 *
	 * @param array $args date_from, date_to, status, campaign_id, customer_id,
	 *                    order_id, orderby, order, per_page, page.
	 * @return array { total: int, pages: int, rows: array }
	 */
	public function get_products_for_table( array $args ): array {
		$context    = $this->build_list_context( $args );
		$pagination = $this->resolve_pagination( $args );
		$sort       = $this->resolve_sort( $args, array( 'revenue', 'orders_count', 'customers_count', 'total_quantity' ), 'revenue' );

		$total = $this->run_count( $this->build_count_sql( $context ), $context['params'] );

		if ( 0 === $total ) {
			return $this->format_list_result( 0, $pagination['per_page'], array() );
		}

		$rows = $this->fetch_product_rows( $context, $sort, $pagination );
		$rows = $this->resolve_unit_prices( $rows, $context['tables'] );
		$rows = $this->resolve_variation_names( $rows, $context['tables'] );
		$rows = $this->resolve_categories( $rows );
		$rows = $this->resolve_campaign_names( $rows, $context['tables'] );

		return $this->format_list_result( $total, $pagination['per_page'], $rows );
	}

	/**
	 * Builds WHERE conditions and params for the product list filters.
	 *
	 * Handles common filters plus product_id and search (numeric search matches
	 * the product ID, text search matches the product title).
	 *
	 * @param array $args date_from, date_to, status, campaign_id, customer_id,
	 *                    order_id, product_id, search.
	 * @return array { tables, clauses, id_col, where, params }
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

		if ( ! empty( $args['product_id'] ) ) {
			$conditions[] = 'product_lookup.product_id = %d';
			$params[]     = (int) $args['product_id'];
		}

		$search = $args['search'] ?? '';

		if ( is_numeric( $search ) && '' !== $search ) {
			$conditions[] = 'product_lookup.product_id = %d';
			$params[]     = (int) $search;
		} elseif ( ! empty( $search ) ) {
			$conditions[] = 'LOWER(product.post_title) LIKE LOWER(%s)';
			$params[]     = '%' . $wpdb->esc_like( $search ) . '%';
		}

		return array(
			'tables'  => $tables,
			'clauses' => $clauses,
			'id_col'  => $tables['order_id_col'],
			'where'   => 'WHERE ' . implode( ' AND ', $conditions ),
			'params'  => $params,
		);
	}

	/**
	 * Builds the COUNT(DISTINCT product/variation) SQL for the current filters.
	 *
	 * Reads from the wc_order_product_lookup table — one row per line item with
	 * product_id / variation_id as real columns, no order_itemmeta self-joins.
	 *
	 * @param array $context From build_list_context().
	 * @return string COUNT SQL with placeholders matching context params.
	 */
	private function build_count_sql( array $context ): string {
		$tables          = $context['tables'];
		$clauses         = $context['clauses'];
		$order_id_column = $context['id_col'];

		return "SELECT COUNT(DISTINCT COALESCE(NULLIF(product_lookup.variation_id, 0), product_lookup.product_id)) FROM {$tables['order_meta']} order_meta JOIN {$tables['orders']} o ON o.ID = order_meta.{$order_id_column} AND {$clauses['status_where']} JOIN {$tables['product_lookup']} product_lookup ON product_lookup.order_id = order_meta.{$order_id_column} LEFT JOIN {$tables['posts']} product ON product.ID = product_lookup.product_id {$context['where']}";
	}

	/**
	 * Fetches the paginated per-product aggregate rows.
	 *
	 * Reads from the wc_order_product_lookup table — WooCommerce keeps one row
	 * per line item with product_id, variation_id, product_qty, and
	 * product_net_revenue (= the item's _line_total) as real indexed columns,
	 * replacing four order_itemmeta self-joins.
	 *
	 * Groups by variation ID when present, parent product ID otherwise.
	 * Campaign IDs are concatenated raw; names resolved later in PHP.
	 *
	 * @param array $context    From build_list_context().
	 * @param array $sort       From resolve_sort().
	 * @param array $pagination From resolve_pagination().
	 * @return array Aggregate row objects.
	 */
	private function fetch_product_rows( array $context, array $sort, array $pagination ): array {
		$tables          = $context['tables'];
		$clauses         = $context['clauses'];
		$order_id_column = $context['id_col'];

		$rows_sql = "SELECT
				COALESCE(NULLIF(product_lookup.variation_id, 0), product_lookup.product_id)  AS product_id,
				product_lookup.product_id                                                     AS parent_product_id,
				MAX(product.post_title)                                                       AS parent_title,
				COUNT(DISTINCT order_meta.{$order_id_column})                                 AS orders_count,
				COUNT(DISTINCT
					CASE WHEN o.billing_email != ''
					     THEN o.billing_email END)                                            AS customers_count,
				SUM(product_lookup.product_net_revenue)                                       AS revenue,
				SUM(product_lookup.product_qty)                                               AS total_quantity,
				GROUP_CONCAT(
					DISTINCT CAST(order_meta.meta_value AS UNSIGNED)
					ORDER BY CAST(order_meta.meta_value AS UNSIGNED)
					SEPARATOR '||'
				)                                                                              AS campaign_ids_raw
			FROM      {$tables['order_meta']}     order_meta
			JOIN      {$tables['orders']}          o              ON o.ID                    = order_meta.{$order_id_column} AND {$clauses['status_where']}
			JOIN      {$tables['product_lookup']}  product_lookup ON product_lookup.order_id = order_meta.{$order_id_column}
			LEFT JOIN {$tables['posts']}           product        ON product.ID              = product_lookup.product_id
			{$clauses['customer_join']}
			{$context['where']}
			GROUP BY COALESCE(NULLIF(product_lookup.variation_id, 0), product_lookup.product_id)
			ORDER BY {$sort['orderby']} {$sort['direction']}
			LIMIT %d OFFSET %d";

		$params = array_merge( $context['params'], array( $pagination['per_page'], $pagination['offset'] ) );

		return $this->run_rows( $rows_sql, $params );
	}

	// =========================================================================
	// Row post-processing (batch lookups, no per-row queries)
	// =========================================================================

	/**
	 * Resolves unit_price for each row via one batch postmeta lookup.
	 *
	 * Replaces the two _regular_price LEFT JOINs that were previously inline in
	 * the SQL: variation price wins when set and non-empty, parent price is the
	 * fallback, null when neither exists — same semantics as the old COALESCE.
	 *
	 * @param array $rows   Raw query result rows (stdClass objects).
	 * @param array $tables Table name map from get_tables().
	 * @return array Rows with unit_price set on every item.
	 */
	private function resolve_unit_prices( array $rows, array $tables ): array {
		$ids = array();

		foreach ( $rows as $row ) {
			$ids[ (int) $row->product_id ]        = true;
			$ids[ (int) $row->parent_product_id ] = true;
		}

		$price_by_id = $this->fetch_regular_prices( array_keys( $ids ), $tables );

		foreach ( $rows as &$row ) {
			$variation_price = $price_by_id[ (int) $row->product_id ] ?? '';

			if ( '' !== $variation_price ) {
				$row->unit_price = $variation_price;
			} else {
				$row->unit_price = $price_by_id[ (int) $row->parent_product_id ] ?? null;
			}
		}

		unset( $row );

		return $rows;
	}

	/**
	 * Fetches _regular_price for a set of product/variation IDs in one query.
	 *
	 * @param array<int> $ids    Product and variation post IDs.
	 * @param array      $tables Table name map from get_tables().
	 * @return array Map of post_id => price string.
	 */
	private function fetch_regular_prices( array $ids, array $tables ): array {
		if ( empty( $ids ) ) {
			return array();
		}

		$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );

		$price_rows = $this->run_rows(
			"SELECT post_id, meta_value FROM {$tables['postmeta']} WHERE post_id IN ({$placeholders}) AND meta_key = '_regular_price'",
			$ids
		);

		$price_by_id = array();

		foreach ( $price_rows as $price_row ) {
			$price_by_id[ (int) $price_row->post_id ] = $price_row->meta_value;
		}

		return $price_by_id;
	}

	/**
	 * Resolves product_name for each row via a batch postmeta + terms lookup.
	 *
	 * For simple products: product_name = parent_title.
	 * For variations: product_name = "Parent - Attr1, Attr2", with term names
	 * replacing raw attribute slugs where a matching term exists.
	 *
	 * Replaces the per-row correlated subquery that was previously inline in the SQL,
	 * reducing query count from N+1 to 2 extra queries regardless of result size.
	 *
	 * @param array $rows   Raw query result rows (stdClass objects).
	 * @param array $tables Table name map from get_tables().
	 * @return array Rows with product_name set on every item.
	 */
	private function resolve_variation_names( array $rows, array $tables ): array {
		$variation_ids     = $this->collect_variation_ids( $rows );
		$attr_by_variation = $this->fetch_variation_attributes( $variation_ids, $tables );
		$term_name_by_slug = $this->fetch_term_names( $attr_by_variation, $tables );

		return $this->apply_variation_names( $rows, $attr_by_variation, $term_name_by_slug );
	}

	/**
	 * Collects variation IDs from the result rows.
	 *
	 * The product_id equals parent_product_id for simple products; differs for variations.
	 *
	 * @param array $rows Raw query result rows.
	 * @return array<int> Variation IDs.
	 */
	private function collect_variation_ids( array $rows ): array {
		$variation_ids = array();

		foreach ( $rows as $row ) {
			if ( (int) $row->product_id === (int) $row->parent_product_id ) {
				continue;
			}

			$variation_ids[ (int) $row->product_id ] = true;
		}

		return array_keys( $variation_ids );
	}

	/**
	 * Fetches attribute slugs for a set of variation IDs in one query.
	 *
	 * @param array<int> $variation_ids Variation post IDs.
	 * @param array      $tables        Table name map from get_tables().
	 * @return array Map of variation_id => string[] attribute slugs.
	 */
	private function fetch_variation_attributes( array $variation_ids, array $tables ): array {
		if ( empty( $variation_ids ) ) {
			return array();
		}

		$placeholders = implode( ',', array_fill( 0, count( $variation_ids ), '%d' ) );

		$attr_rows = $this->run_rows(
			"SELECT post_id, meta_value FROM {$tables['postmeta']} WHERE post_id IN ({$placeholders}) AND meta_key LIKE 'attribute_%%' AND meta_value != '' ORDER BY post_id, meta_key",
			$variation_ids
		);

		$attr_by_variation = array();

		foreach ( $attr_rows as $attr ) {
			$attr_by_variation[ (int) $attr->post_id ][] = $attr->meta_value;
		}

		return $attr_by_variation;
	}

	/**
	 * Fetches term names for every distinct attribute slug in one query.
	 *
	 * @param array $attr_by_variation Map of variation_id => attribute slugs.
	 * @param array $tables            Table name map from get_tables().
	 * @return array Map of slug => term name.
	 */
	private function fetch_term_names( array $attr_by_variation, array $tables ): array {
		$slugs = array();

		foreach ( $attr_by_variation as $attrs ) {
			foreach ( $attrs as $slug ) {
				$slugs[ $slug ] = true;
			}
		}

		if ( empty( $slugs ) ) {
			return array();
		}

		$placeholders = implode( ',', array_fill( 0, count( $slugs ), '%s' ) );
		$term_rows    = $this->run_rows(
			"SELECT slug, name FROM {$tables['terms']} WHERE slug IN ({$placeholders})",
			array_keys( $slugs )
		);

		$term_name_by_slug = array();

		foreach ( $term_rows as $term ) {
			$term_name_by_slug[ $term->slug ] = $term->name;
		}

		return $term_name_by_slug;
	}

	/**
	 * Sets product_name on every row using the batch-fetched attribute data.
	 *
	 * @param array $rows              Raw query result rows.
	 * @param array $attr_by_variation Map of variation_id => attribute slugs.
	 * @param array $term_name_by_slug Map of slug => term name.
	 * @return array Rows with product_name set on every item.
	 */
	private function apply_variation_names( array $rows, array $attr_by_variation, array $term_name_by_slug ): array {
		foreach ( $rows as &$row ) {
			$variation_id = 0;

			if ( (int) $row->product_id !== (int) $row->parent_product_id ) {
				$variation_id = (int) $row->product_id;
			}

			if ( $variation_id > 0 && ! empty( $attr_by_variation[ $variation_id ] ) ) {
				$attr_labels       = array_map(
					function ( $slug ) use ( $term_name_by_slug ) {
						return $term_name_by_slug[ $slug ] ?? $slug;
					},
					$attr_by_variation[ $variation_id ]
				);
				$row->product_name = ( $row->parent_title ?? '' ) . ' - ' . implode( ', ', $attr_labels );
			} else {
				$row->product_name = $row->parent_title ?? '';
			}
		}

		unset( $row );

		return $rows;
	}

	/**
	 * Resolves campaigns_raw for each row via a single batch_campaign_meta() call.
	 *
	 * Replaces LEFT JOIN campaigns + JSON_EXTRACT inside GROUP_CONCAT which executed
	 * once per order row during the GROUP BY scan. Collects all distinct campaign IDs
	 * across all page rows, fetches names in one query, rebuilds "id:name||..." format.
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
				$parts[] = $id . ':' . ( $campaign_map[ $id ]['name'] ?? 'Unknown' );
			}

			// @phpstan-ignore-next-line
			$row->campaigns_raw = implode( '||', $parts );
		}

		unset( $row );

		return $rows;
	}

	/**
	 * Resolves categories_raw for each row via a single wp_get_object_terms() call.
	 *
	 * Replaces the per-row correlated subquery that fetched from term_relationships,
	 * term_taxonomy, and terms tables — reducing those N subquery executions to 1 query.
	 *
	 * Sets $row->categories_raw in the same "id:name||id2:name2" format that
	 * ProductService already parses, so the service layer needs no changes.
	 *
	 * @param array $rows Raw query result rows (stdClass objects).
	 * @return array Rows with categories_raw set on every item.
	 */
	private function resolve_categories( array $rows ): array {
		if ( empty( $rows ) ) {
			return $rows;
		}

		$parent_ids = array_unique(
			array_map(
				function ( $row ) {
					return (int) $row->parent_product_id;
				},
				$rows
			)
		);

		$terms = wp_get_object_terms( $parent_ids, 'product_cat', array( 'fields' => 'all_with_object_id' ) );

		$terms_by_product = array();

		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				/** @var object{object_id: int, term_id: int, name: string} $term */
				$terms_by_product[ (int) $term->object_id ][] = $term->term_id . ':' . $term->name;
			}
		}

		foreach ( $rows as &$row ) {
			$pid = (int) $row->parent_product_id;

			if ( ! empty( $terms_by_product[ $pid ] ) ) {
				$row->categories_raw = implode( '||', $terms_by_product[ $pid ] );
			} else {
				$row->categories_raw = '';
			}
		}

		unset( $row );

		return $rows;
	}

}
