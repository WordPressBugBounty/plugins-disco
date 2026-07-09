<?php //phpcs:ignore

/**
 * Analytics REST API — Customers Endpoints
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @since      1.1.13
 * @category   Rest
 */

namespace Disco\Rest\Analytics;

use Disco\App\Analytics\Services\CustomerService;
use WP_REST_Server;

/**
 * Class CustomersApi
 *
 * Registers and handles the following REST API routes:
 *
 * - GET /disco/v1/analytics/customers       — Paginated customers who bought via campaigns.
 * - GET /disco/v1/analytics/customers/{id}  — Single customer detail.
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class CustomersApi extends Base {

	/**
	 * Registers the REST API routes for customers analytics endpoints.
	 */
	public function register_routes(): void {
		// GET /analytics/customers
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/customers',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_customers' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_customers_table_params(),
				),
				'schema' => array( $this, 'get_customer_schema' ),
			)
		);

		// GET /analytics/customers/{id}
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/customers/(?P<id>[\d]+)',
			array(
				'args'   => array(
					'id' => array(
						'description' => __( 'WP User ID (customer_id).', 'disco' ),
						'type'        => 'integer',
					),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_customer' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_date_params(),
				),
				'schema' => array( $this, 'get_customer_schema' ),
			)
		);
	}

	// =========================================================================
	// Callbacks
	// =========================================================================

	/**
	 * GET /disco/v1/analytics/customers
	 *
	 * Returns a paginated customer table for completed campaign-linked orders.
	 * Includes registered users and guest customers (customer_id=0 grouped by billing_email).
	 * Includes current/compare period metadata and per-customer inline campaign list.
	 *
	 * Query params:
	 *   date_from   (string Y-m-d) Range start. Default: 28 days ago.
	 *   date_to     (string Y-m-d) Range end.   Default: today.
	 *   search      (string)       Numeric = exact customer ID; text = name/email LIKE search (includes guest billing address).
	 *   sort_by     (string)       Alias for orderby. One of: total_spent (default), orders.
	 *   orderby     (string)       Sort field. One of: total_spent (default), orders.
	 *   order       (string)       Sort direction: asc (default) | desc.
	 *   campaign_id (int)          Filter to customers who used this campaign.
	 *   order_id    (int)          Filter to the customer from a single order.
	 *   page        (int ≥ 1)      Page number. Default: 1.
	 *   limit       (int 1–100)    Results per page. Default: 10.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	// phpcs:ignore SlevomatCodingStandard.Complexity.Cognitive.ComplexityTooHigh, SlevomatCodingStandard.Functions.FunctionLength.FunctionLength
	public function get_customers( $request ) {
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
			'total_spent' => 'total_spent',
			'orders'      => 'orders',
		);
		$sort_by         = '';
		$default_orderby = 'total_spent';

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
			'order_id'    => isset( $request['order_id'] ) ? absint( $request['order_id'] ) : 0,
			'orderby'     => $orderby,
			'order'       => is_string( $request['order'] ) ? sanitize_text_field( $request['order'] ) : 'asc',
			'page'        => $page,
			'limit'       => $per_page,
		);

		$result      = CustomerService::get_customers_table( $args );
		$pagination  = $result['pagination'];
		$total       = (int) ( $pagination['total'] ?? 0 );
		$total_pages = (int) ( $pagination['pages'] ?? 0 );

		$response_data = array(
			'current_period' => $result['current_period'],
			'compare_period' => $result['compare_period'],
			'data'           => $this->add_item_links( $result['data'], 'customers' ),
			'collection'     => $this->build_collection_meta( $total, $per_page, $page ),
			'links'          => $this->build_top_links( $request, 'customers', $total_pages, $page ),
		);

		$response = rest_ensure_response( $response_data );
		$response->header( 'X-WP-Total', $total );
		$response->header( 'X-WP-TotalPages', $total_pages );

		return $response;
	}

	/**
	 * GET /disco/v1/analytics/customers/{id}
	 *
	 * Returns detail for a single customer including aggregated metrics and campaigns used.
	 *
	 * Path param:
	 *   id (int) WP User ID (customer_id).
	 *
	 * Query params:
	 *   date_from (string Y-m-d) Range start. Default: all-time.
	 *   date_to   (string Y-m-d) Range end.   Default: all-time.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_customer( $request ) {
		$error = $this->validate_date_params( $request );

		if ( is_wp_error( $error ) ) {
			return $error;
		}

		$args = array(
			'date_from' => is_string( $request['date_from'] ) ? sanitize_text_field( $request['date_from'] ) : '',
			'date_to'   => is_string( $request['date_to'] ) ? sanitize_text_field( $request['date_to'] ) : '',
		);

		return rest_ensure_response( CustomerService::get_customer( absint( $request['id'] ), $args ) );
	}

	// =========================================================================
	// Schema
	// =========================================================================

	/**
	 * Retrieves the customer analytics schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_customer_schema() { //phpcs:ignore
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'analytics-customer',
			'type'       => 'object',
			'properties' => array(
				'id'          => array(
					'description' => __( 'WP User ID.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'name'        => array(
					'description' => __( 'Display name.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'email'       => array(
					'description' => __( 'Email address.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'avatar'      => array(
					'description' => __( 'Gravatar image URL. Empty string when not available.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'user_name'   => array(
					'description' => __( 'Login username.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'state'       => array(
					'description' => __( 'Billing state.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'campaigns'   => array(
					'description' => __( 'Campaigns used by this customer (id, name, intent).', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'orders'      => array(
					'description' => __( 'Total campaign-linked completed orders.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'total_spent' => array(
					'description' => __( 'Sum of order totals.', 'disco' ),
					'type'        => 'number',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
			),
		);
	}

}
