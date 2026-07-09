<?php //phpcs:ignore

/**
 * Analytics REST API — Products Endpoint
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @since      1.1.13
 * @category   Rest
 */

namespace Disco\Rest\Analytics;

use Disco\App\Analytics\Services\ProductService;
use WP_REST_Server;

/**
 * Class ProductsApi
 *
 * Registers and handles the following REST API routes:
 *
 * - GET /disco/v1/analytics/products       — Paginated products sold via campaigns.
 * - GET /disco/v1/analytics/products/{id}  — Single product detail.
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class ProductsApi extends Base {

	/**
	 * Registers the REST API routes for the products analytics endpoint.
	 */
	public function register_routes(): void {
		// GET /analytics/products
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/products',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_products' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_products_table_params(),
				),
				'schema' => array( $this, 'get_product_schema' ),
			)
		);

		// GET /analytics/products/{id}
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/products/(?P<id>[\d]+)',
			array(
				'args'   => array(
					'id' => array(
						'description' => __( 'WooCommerce product ID.', 'disco' ),
						'type'        => 'integer',
					),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_product' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_date_params(),
				),
				'schema' => array( $this, 'get_product_schema' ),
			)
		);
	}

	// =========================================================================
	// Callbacks
	// =========================================================================

	/**
	 * GET /disco/v1/analytics/products
	 *
	 * Returns a paginated product performance table for Disco-driven orders.
	 * Only completed orders with disco_campaign meta are included.
	 * Includes per-product category list and campaigns (via GROUP_CONCAT).
	 *
	 * Query params:
	 *   date_from   (string Y-m-d) Range start. Default: 28 days ago.
	 *   date_to     (string Y-m-d) Range end.   Default: today.
	 *   search      (string)       Numeric = exact product ID; text = product name LIKE search.
	 *   sort_by     (string)       Alias for orderby. One of: revenue (default), orders, customers.
	 *   orderby     (string)       Sort field. One of: total_revenue (default), total_orders, total_customers.
	 *   order       (string)       Sort direction: asc | desc (default).
	 *   campaign_id (int)          Filter to orders that used this campaign.
	 *   customer_id (int)          Filter to orders by this WP user.
	 *   order_id    (int)          Filter to products from a single order.
	 *   page        (int ≥ 1)      Page number. Default: 1.
	 *   limit       (int 1–100)    Results per page. Default: 10.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	// phpcs:ignore SlevomatCodingStandard.Complexity.Cognitive.ComplexityTooHigh, SlevomatCodingStandard.Functions.FunctionLength.FunctionLength
	public function get_products( $request ) {
		$error = $this->validate_date_params( $request );

		if ( is_wp_error( $error ) ) {
			return $error;
		}

		$page     = 1;
		$per_page = 10;

		if ( isset( $request['page'] ) ) {
			$page = absint( $request['page'] );
		}

		if ( isset( $request['limit'] ) ) {
			$per_page = min( absint( $request['limit'] ), 100 );
		}

		$sort_by_map     = array(
			'revenue'   => 'total_revenue',
			'orders'    => 'total_orders',
			'customers' => 'total_customers',
			'quantity'  => 'total_quantity',
		);
		$sort_by         = '';
		$default_orderby = 'total_revenue';

		if ( is_string( $request['sort_by'] ) ) {
			$sort_by = sanitize_text_field( $request['sort_by'] );
		}

		if ( is_string( $request['orderby'] ) ) {
			$default_orderby = sanitize_text_field( $request['orderby'] );
		}

		$orderby = $sort_by_map[ $sort_by ] ?? $default_orderby;

		$date_to = gmdate( 'Y-m-d' );

		if ( is_string( $request['date_to'] ) && $request['date_to'] ) {
			$date_to = sanitize_text_field( $request['date_to'] );
		}

		$date_from = gmdate( 'Y-m-d', strtotime( '-27 days', (int) strtotime( $date_to ) ) );

		if ( is_string( $request['date_from'] ) && $request['date_from'] ) {
			$date_from = sanitize_text_field( $request['date_from'] );
		}

		$args = array(
			'date_from'   => $date_from,
			'date_to'     => $date_to,
			'search'      => is_string( $request['search'] ) ? sanitize_text_field( $request['search'] ) : '',
			'campaign_id' => isset( $request['campaign_id'] ) ? absint( $request['campaign_id'] ) : 0,
			'customer_id' => isset( $request['customer_id'] ) ? absint( $request['customer_id'] ) : 0,
			'order_id'    => isset( $request['order_id'] ) ? absint( $request['order_id'] ) : 0,
			'orderby'     => $orderby,
			'order'       => is_string( $request['order'] ) ? sanitize_text_field( $request['order'] ) : 'desc',
			'page'        => $page,
			'limit'       => $per_page,
		);

		$result      = ProductService::get_products_table( $args );
		$pagination  = $result['pagination'];
		$total       = (int) ( $pagination['total'] ?? 0 );
		$total_pages = (int) ( $pagination['pages'] ?? 0 );

		$response_data = array(
			'current_period' => $result['current_period'],
			'compare_period' => $result['compare_period'],
			'data'           => $this->add_item_links( $result['data'], 'products' ),
			'collection'     => $this->build_collection_meta( $total, $per_page, $page ),
			'links'          => $this->build_top_links( $request, 'products', $total_pages, $page ),
		);

		$response = rest_ensure_response( $response_data );
		$response->header( 'X-WP-Total', $total );
		$response->header( 'X-WP-TotalPages', $total_pages );

		return $response;
	}

	/**
	 * GET /disco/v1/analytics/products/{id}
	 *
	 * Returns detail for a single product including aggregated campaign metrics.
	 *
	 * Path param:
	 *   id (int) WooCommerce product ID.
	 *
	 * Query params:
	 *   date_from (string Y-m-d) Range start. Default: all-time.
	 *   date_to   (string Y-m-d) Range end.   Default: all-time.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_product( $request ) {
		$error = $this->validate_date_params( $request );

		if ( is_wp_error( $error ) ) {
			return $error;
		}

		$args = array(
			'date_from' => is_string( $request['date_from'] ) ? sanitize_text_field( $request['date_from'] ) : '',
			'date_to'   => is_string( $request['date_to'] ) ? sanitize_text_field( $request['date_to'] ) : '',
		);

		return rest_ensure_response( ProductService::get_product( absint( $request['id'] ), $args ) );
	}

	// =========================================================================
	// Schema
	// =========================================================================

	/**
	 * Retrieves the product analytics schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_product_schema() { //phpcs:ignore
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'analytics-product',
			'type'       => 'object',
			'properties' => array(
				'id'              => array(
					'description' => __( 'Product ID.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'name'            => array(
					'description' => __( 'Product name.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'image'           => array(
					'description' => __( 'Product image URL.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'unit_price'      => array(
					'description' => __( 'Regular (list) price.', 'disco' ),
					'type'        => 'number',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'categories'      => array(
					'description' => __( 'Product categories (id + name).', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'campaigns'       => array(
					'description' => __( 'Campaigns (id + name) this product was sold through.', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'total_orders'    => array(
					'description' => __( 'Orders containing this product via a campaign.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'total_customers' => array(
					'description' => __( 'Distinct customers who bought this product.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'total_quantity'  => array(
					'description' => __( 'Total units sold across all campaign orders.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'total_revenue'   => array(
					'description' => __( 'Revenue from line totals.', 'disco' ),
					'type'        => 'number',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
			),
		);
	}

}
