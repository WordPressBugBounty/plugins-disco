<?php //phpcs:ignore

/**
 * Analytics REST API — Summary Endpoint
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @since      1.1.13
 * @category   Rest
 */

namespace Disco\Rest\Analytics;

use Disco\App\Analytics\Controllers\SummaryController;
use WP_REST_Server;

/**
 * Class SummaryApi
 *
 * Registers and handles the following REST API route:
 *
 * - GET /disco/v1/analytics/summary — Top-level KPI summary with growth comparison.
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class SummaryApi extends Base {

	/**
	 * Registers the REST API routes for the summary endpoint.
	 */
	public function register_routes(): void {
		// GET /analytics/summary
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/summary',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_summary' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_summary_params(),
				),
				'schema' => array( $this, 'get_summary_schema' ),
			)
		);
	}

	// =========================================================================
	// Callbacks
	// =========================================================================

	/**
	 * GET /disco/v1/analytics/summary
	 *
	 * Returns top-level KPI summary with growth comparison against the previous period
	 * of the same duration.
	 *
	 * Query params:
	 *   date_from (string Y-m-d) Start of the current period. Default: 30 days ago.
	 *   date_to   (string Y-m-d) End of the current period.   Default: today.
	 *   compare   (string)       Only accepted value: previous_period (default).
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_summary( $request ) {
		$error = $this->validate_date_params( $request );

		if ( is_wp_error( $error ) ) {
			return $error;
		}

		$args = array(
			'date_from' => is_string( $request['date_from'] ) ? sanitize_text_field( $request['date_from'] ) : '',
			'date_to'   => is_string( $request['date_to'] ) ? sanitize_text_field( $request['date_to'] ) : '',
		);

		return rest_ensure_response( SummaryController::get_summary( $args ) );
	}

	// =========================================================================
	// Schema
	// =========================================================================

	/**
	 * Retrieves the summary schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_summary_schema() { //phpcs:ignore
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'analytics-summary',
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
				'data'           => array(
					'description' => __( 'KPI values with growth comparison.', 'disco' ),
					'type'        => 'object',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
			),
		);
	}

}
