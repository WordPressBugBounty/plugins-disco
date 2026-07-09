<?php //phpcs:ignore

/**
 * Analytics REST API — Intent Endpoints
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @since      1.1.13
 * @category   Rest
 */

namespace Disco\Rest\Analytics;

use Disco\App\Analytics\Controllers\IntentPerformanceController;
use WP_REST_Server;

/**
 * Class IntentApi
 *
 * Registers and handles the following REST API route:
 *
 * - GET /disco/v1/analytics/intents-performance — Intent-wise performance (no comparison).
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class IntentApi extends Base {

	/**
	 * Registers the REST API routes for intent endpoints.
	 */
	public function register_routes(): void {
		// GET /analytics/intents-performance
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/intents-performance',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_intents_performance' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_date_params(),
				),
				'schema' => array( $this, 'get_intent_performance_schema' ),
			)
		);
	}

	// =========================================================================
	// Callbacks
	// =========================================================================

	/**
	 * GET /disco/v1/analytics/intents-performance
	 *
	 * Returns intent-wise disco sales for the current period only.
	 * Data items: intent, sales, orders, percentage.
	 * No comparison period — use /intents for growth deltas.
	 *
	 * Query params:
	 *   date_from (string Y-m-d) Start of range. Default: 30 days ago.
	 *   date_to   (string Y-m-d) End of range.   Default: today.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_intents_performance( $request ) {
		$error = $this->validate_date_params( $request );

		if ( is_wp_error( $error ) ) {
			return $error;
		}

		$args = array(
			'date_from' => is_string( $request['date_from'] ) ? sanitize_text_field( $request['date_from'] ) : '',
			'date_to'   => is_string( $request['date_to'] ) ? sanitize_text_field( $request['date_to'] ) : '',
		);

		return rest_ensure_response( IntentPerformanceController::get_intent_performance( $args ) );
	}

	// =========================================================================
	// Schemas
	// =========================================================================

	/**
	 * Retrieves the intent-performance schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_intent_performance_schema() { //phpcs:ignore
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'analytics-intents-performance',
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
				'total_revenue'  => array(
					'description' => __( 'Total revenue across all intents.', 'disco' ),
					'type'        => 'number',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'data'           => array(
					'description' => __( 'Intent-wise sales performance.', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view' ),
					'readonly'    => true,
					'items'       => array(
						'type'       => 'object',
						'properties' => array(
							'intent'     => array(
								'description' => __( 'Campaign intent label, or "Others" for deleted campaigns.', 'disco' ),
								'type'        => 'string',
							),
							'revenue'    => array(
								'description' => __( 'Total order revenue for this intent.', 'disco' ),
								'type'        => 'number',
							),
							'orders'     => array(
								'description' => __( 'Count of completed orders for this intent.', 'disco' ),
								'type'        => 'integer',
							),
							'percentage' => array(
								'description' => __( 'Share of total disco revenue (0–100).', 'disco' ),
								'type'        => 'number',
							),
						),
					),
				),
			),
		);
	}

}
