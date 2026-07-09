<?php //phpcs:ignore

/**
 * Analytics REST API — Orders Endpoints
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @since      1.1.13
 * @category   Rest
 */

namespace Disco\Rest\Analytics;

use Disco\App\Analytics\Services\OrderService;
use WP_REST_Server;

/**
 * Class OrdersApi
 *
 * Registers and handles the following REST API routes:
 *
 * - GET /disco/v1/analytics/orders       — Paginated campaign-linked orders.
 * - GET /disco/v1/analytics/orders/{id}  — Single order with full line items.
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class OrdersApi extends Base {

	/**
	 * Registers the REST API routes for orders analytics endpoints.
	 */
	public function register_routes(): void {
		// GET /analytics/orders
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/orders',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_orders' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_orders_table_params(),
				),
				'schema' => array( $this, 'get_order_schema' ),
			)
		);

		// GET /analytics/orders/{id}
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/orders/(?P<id>[\d]+)',
			array(
				'args'   => array(
					'id' => array(
						'description' => __( 'WooCommerce Order ID.', 'disco' ),
						'type'        => 'integer',
					),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_order' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				),
				'schema' => array( $this, 'get_order_schema' ),
			)
		);
	}

	// =========================================================================
	// Callbacks
	// =========================================================================

	/**
	 * GET /disco/v1/analytics/orders
	 *
	 * Returns a paginated list of completed, Disco-driven orders.
	 * Only orders with a disco_campaign meta are included.
	 *
	 * Query params:
	 *   date_from   (string Y-m-d) Range start. Default: 28 days ago.
	 *   date_to     (string Y-m-d) Range end.   Default: today.
	 *   search      (string)       Numeric = exact order ID; text = customer name/email LIKE search.
	 *   sort_by     (string)       Alias for orderby. One of: revenue (default), date.
	 *   orderby     (string)       Sort field. One of: revenue (default), date.
	 *   order       (string)       Sort direction: asc | desc (default).
	 *   campaign_id (int)          Filter to orders that used this campaign.
	 *   customer_id (int)          Filter to orders by this WP user.
	 *   page        (int ≥ 1)      Page number. Default: 1.
	 *   limit       (int 1–100)    Results per page. Default: 10.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	// phpcs:ignore SlevomatCodingStandard.Complexity.Cognitive.ComplexityTooHigh, SlevomatCodingStandard.Functions.FunctionLength.FunctionLength
	public function get_orders( $request ) {
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
			'revenue' => 'revenue',
			'date'    => 'date',
		);
		$sort_by         = '';
		$default_orderby = 'revenue';

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
			'orderby'     => $orderby,
			'order'       => is_string( $request['order'] ) ? sanitize_text_field( $request['order'] ) : 'desc',
			'page'        => $page,
			'limit'       => $per_page,
		);

		$result      = OrderService::get_orders_table( $args );
		$pagination  = $result['pagination'];
		$total       = (int) ( $pagination['total'] ?? 0 );
		$total_pages = (int) ( $pagination['pages'] ?? 0 );

		$response_data = array(
			'current_period' => $result['current_period'],
			'compare_period' => $result['compare_period'],
			'data'           => $this->add_item_links( $result['data'], 'orders' ),
			'collection'     => $this->build_collection_meta( $total, $per_page, $page ),
			'links'          => $this->build_top_links( $request, 'orders', $total_pages, $page ),
		);

		$response = rest_ensure_response( $response_data );
		$response->header( 'X-WP-Total', $total );
		$response->header( 'X-WP-TotalPages', $total_pages );

		return $response;
	}

	/**
	 * GET /disco/v1/analytics/orders/{id}
	 *
	 * Returns the full detail for a single campaign-linked order, including all
	 * line items with per-item discount amounts.
	 *
	 * Path param:
	 *   id (int) WooCommerce order ID.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_order( $request ) {
		$data = OrderService::get_order( absint( $request['id'] ) );

		if ( is_wp_error( $data ) ) {
			return $data;
		}

		return rest_ensure_response( $data );
	}

}
