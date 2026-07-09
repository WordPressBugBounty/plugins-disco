<?php //phpcs:ignore

/**
 * ProductService — composes product queries into service-level results.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Services
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Services;

use Disco\App\Analytics\Queries\ProductQuery;

/**
 * Provides product analytics at the service layer.
 *
 * Provides product analytics for the products list endpoint.
 * No SQL lives here — all DB work is delegated to ProductQuery.
 */
class ProductService extends BaseService {

	/**
	 * Returns a paginated product performance table for the admin view.
	 *
	 * Only completed orders with disco_campaign meta are included.
	 * Default sort: total_revenue DESC.
	 *
	 * @param array $args date_from, date_to, campaign_id, customer_id, order_id,
	 *                    orderby, order, page, limit.
	 * @return array { current_period, compare_period, pagination, data }
	 */
	public static function get_products_table( array $args ): array {
		$limit = min( absint( $args['limit'] ?? 10 ), 100 );
		$page  = max( 1, absint( $args['page'] ?? 1 ) );

		$date_to   = $args['date_to'] ?? '';
		$date_from = $args['date_from'] ?? '';

		$query  = new ProductQuery;
		$result = $query->get_products_for_table( self::build_table_query_args( $args, $limit, $page ) );

		$data = array();

		foreach ( $result['rows'] as $row ) {
			$data[] = self::format_product_row( $row );
		}

		return array(
			'current_period' => array(
				'from' => $date_from,
				'to'   => $date_to,
			),
			'compare_period' => self::resolve_compare_period( $date_from, $date_to ),
			'pagination'     => self::build_pagination( $result, $page, $limit ),
			'data'           => $data,
		);
	}

	/**
	 * Returns detail for a single product including aggregated metrics, categories, and campaigns.
	 *
	 * @param int   $product_id WooCommerce product ID.
	 * @param array $args       date_from, date_to.
	 * @return array { current_period, compare_period, data }
	 */
	public static function get_product( int $product_id, array $args ): array {
		$date_from = $args['date_from'] ?? '';
		$date_to   = $args['date_to'] ?? '';

		$query  = new ProductQuery;
		$result = $query->get_products_for_table(
			array(
				'date_from'  => $date_from,
				'date_to'    => $date_to,
				'product_id' => $product_id,
				'status'     => 'wc-completed',
				'per_page'   => 1,
				'page'       => 1,
			)
		);

		$data = null;

		if ( ! empty( $result['rows'] ) ) {
			$data = self::format_product_row( $result['rows'][0] );
		}

		return array(
			'current_period' => array(
				'from' => $date_from,
				'to'   => $date_to,
			),
			'compare_period' => self::resolve_compare_period( $date_from, $date_to ),
			'data'           => $data,
		);
	}

	/**
	 * Maps service-level $args onto the argument array ProductQuery expects.
	 *
	 * Whitelists orderby, normalizes sort direction, casts filter IDs.
	 *
	 * @param array $args  Raw service args.
	 * @param int   $limit Sanitized per-page limit.
	 * @param int   $page  Sanitized page number.
	 * @return array Query args for ProductQuery::get_products_for_table().
	 */
	private static function build_table_query_args( array $args, int $limit, int $page ): array {
		$orderby_map = array(
			'total_revenue'   => 'revenue',
			'total_orders'    => 'orders_count',
			'total_customers' => 'customers_count',
			'total_quantity'  => 'total_quantity',
		);
		$orderby     = $orderby_map[ $args['orderby'] ?? 'total_revenue' ] ?? 'revenue';
		$order       = 'desc';

		if ( strtolower( $args['order'] ?? 'desc' ) === 'asc' ) {
			$order = 'asc';
		}

		return array(
			'date_from'   => $args['date_from'] ?? '',
			'date_to'     => $args['date_to'] ?? '',
			'search'      => $args['search'] ?? '',
			'campaign_id' => ! empty( $args['campaign_id'] ) ? (int) $args['campaign_id'] : 0,
			'customer_id' => ! empty( $args['customer_id'] ) ? (int) $args['customer_id'] : 0,
			'order_id'    => ! empty( $args['order_id'] ) ? (int) $args['order_id'] : 0,
			'orderby'     => $orderby,
			'order'       => $order,
			'per_page'    => $limit,
			'page'        => $page,
			'status'      => 'wc-completed',
		);
	}

	/**
	 * Formats one raw query row into the API response shape.
	 *
	 * Parses categories/campaigns raw strings, resolves the thumbnail,
	 * casts and rounds all metrics.
	 *
	 * @param object $row Raw row from ProductQuery::get_products_for_table().
	 * @return array Formatted product row.
	 * @phpstan-param object{product_id: int|string, parent_product_id: int|string|null, product_name: string|null, unit_price: string|null, categories_raw: string|null, campaigns_raw: string|null, orders_count: int|string, customers_count: int|string, total_quantity: int|string, revenue: string|null} $row
	 */
	private static function format_product_row( object $row ): array {
		$product_id        = (int) $row->product_id;
		$parent_product_id = (int) ( $row->parent_product_id ?? $product_id );

		return array(
			'id'              => $product_id,
			'name'            => $row->product_name ?? '',
			'image'           => self::resolve_product_image( $product_id, $parent_product_id ),
			'unit_price'      => round( (float) ( $row->unit_price ?? 0 ), 2 ),
			'categories'      => self::parse_id_name_pairs( (string) ( $row->categories_raw ?? '' ) ),
			'campaigns'       => self::parse_id_name_pairs( (string) ( $row->campaigns_raw ?? '' ) ),
			'total_orders'    => (int) $row->orders_count,
			'total_customers' => (int) $row->customers_count,
			'total_quantity'  => (int) $row->total_quantity,
			'total_revenue'   => round( (float) $row->revenue, 2 ),
		);
	}

	/**
	 * Resolves the product thumbnail URL, falling back to the parent product.
	 *
	 * @param int $product_id        Product (or variation) ID.
	 * @param int $parent_product_id Parent product ID for variations.
	 * @return string Thumbnail URL, or empty string when none exists.
	 */
	private static function resolve_product_image( int $product_id, int $parent_product_id ): string {
		$img = get_the_post_thumbnail_url( $product_id );

		if ( ! $img ) {
			$img = get_the_post_thumbnail_url( $parent_product_id );
		}

		if ( is_string( $img ) ) {
			return $img;
		}

		return '';
	}

}
