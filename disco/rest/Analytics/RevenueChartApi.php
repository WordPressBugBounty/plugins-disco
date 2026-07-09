<?php //phpcs:ignore

/**
 * Analytics REST API — Revenue Chart Endpoint
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @since      1.1.13
 * @category   Rest
 */

namespace Disco\Rest\Analytics;

use Disco\App\Analytics\Controllers\RevenueController;
use WP_REST_Server;

/**
 * Class RevenueChartApi
 *
 * Registers and handles the following REST API route:
 *
 * - GET /disco/v1/analytics/revenue-chart — Time-bucketed net_sales and discount_sales.
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class RevenueChartApi extends Base {

	/**
	 * Registers the REST API routes for the revenue chart endpoint.
	 */
	public function register_routes(): void {
		// GET /analytics/revenue-chart
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/revenue-chart',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_revenue' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_date_params(),
				),
				'schema' => array( $this, 'get_revenue_schema' ),
			)
		);
	}

	// =========================================================================
	// Callbacks
	// =========================================================================

	/**
	 * GET /disco/v1/analytics/revenue-chart
	 *
	 * Returns time-bucketed net_sales and discount_sales for completed orders.
	 * The grouping interval is auto-selected from the date range:
	 *   ≤ 30 days → day  |  31–180 days → week  |  > 180 days → month
	 *
	 * Query params:
	 *   date_from (string Y-m-d) Start of range. Default: 30 days ago.
	 *   date_to   (string Y-m-d) End of range.   Default: today.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_revenue( $request ) {
		$error = $this->validate_date_params( $request );

		if ( is_wp_error( $error ) ) {
			return $error;
		}

		$args = array(
			'date_from' => is_string( $request['date_from'] ) ? sanitize_text_field( $request['date_from'] ) : '',
			'date_to'   => is_string( $request['date_to'] ) ? sanitize_text_field( $request['date_to'] ) : '',
		);

		return rest_ensure_response( RevenueController::get_revenue( $args ) );
	}

	// =========================================================================
	// Schema
	// =========================================================================

	/**
	 * Retrieves the revenue time-series schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_revenue_schema() { //phpcs:ignore
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'analytics-revenue-chart',
			'type'       => 'object',
			'properties' => array(
				'current_period' => array(
					'description' => __( 'Current period date range.', 'disco' ),
					'type'        => 'object',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'compare_period' => array(
					'description' => __( 'Comparison period date range.', 'disco' ),
					'type'        => 'object',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'interval'       => array(
					'description' => __( 'Grouping interval: day, week, or month.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'data'           => array(
					'description' => __( 'Time-series revenue rows.', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view' ),
					'readonly'    => true,
					'items'       => array(
						'type'       => 'object',
						'properties' => array(
							'date'            => array(
								'description' => __( 'Period start date (Y-m-d).', 'disco' ),
								'type'        => 'string',
							),
							'net_sales'       => array(
								'description' => __( 'Total revenue from all completed orders.', 'disco' ),
								'type'        => 'number',
							),
							'discount_sales'  => array(
								'description' => __( 'Revenue from completed disco campaign orders.', 'disco' ),
								'type'        => 'number',
							),
							'total_orders'    => array(
								'description' => __( 'Count of all completed orders.', 'disco' ),
								'type'        => 'integer',
							),
							'discount_orders' => array(
								'description' => __( 'Count of completed disco campaign orders.', 'disco' ),
								'type'        => 'integer',
							),
						),
					),
				),
			),
		);
	}

}
