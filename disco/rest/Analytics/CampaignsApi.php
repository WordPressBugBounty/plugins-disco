<?php //phpcs:ignore

/**
 * Analytics REST API — Campaigns Endpoints
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @since      1.1.13
 * @category   Rest
 */

namespace Disco\Rest\Analytics;

use Disco\App\Analytics\Services\CampaignService;
use WP_REST_Server;

/**
 * Class CampaignsApi
 *
 * Registers and handles the following REST API routes:
 *
 * - GET /disco/v1/analytics/campaigns           — Paginated campaign list.
 * - GET /disco/v1/analytics/campaigns/{id}      — Single campaign KPIs + chart.
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class CampaignsApi extends Base {

	/**
	 * Registers the REST API routes for campaign analytics endpoints.
	 */
	public function register_routes(): void {
		// GET /analytics/campaigns
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/campaigns',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_campaigns' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_campaigns_params(),
				),
				'schema' => array( $this, 'get_campaign_schema' ),
			)
		);

		// GET /analytics/campaigns/{id}
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/campaigns/(?P<id>[\d]+)',
			array(
				'args'   => array(
					'id' => array(
						'description' => __( 'Campaign ID.', 'disco' ),
						'type'        => 'integer',
					),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_campaign' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_date_params(),
				),
				'schema' => array( $this, 'get_campaign_schema' ),
			)
		);
	}

	// =========================================================================
	// Callbacks
	// =========================================================================

	/**
	 * GET /disco/v1/analytics/campaigns
	 *
	 * Returns a paginated list of campaigns with aggregated order metrics.
	 *
	 * Query params:
	 *   date_from (string Y-m-d)  Range start. Default: all-time.
	 *   date_to   (string Y-m-d)  Range end.   Default: all-time.
	 *   search    (string)        Numeric = exact campaign ID; text = name LIKE search.
	 *   sort_by   (string)        Sort field. One of: orders, customers, revenue (default).
	 *   page      (int ≥ 1)       Page number. Default: 1.
	 *   limit     (int 1–100)     Results per page. Default: 10.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	// phpcs:ignore SlevomatCodingStandard.Complexity.Cognitive.ComplexityTooHigh
	public function get_campaigns( $request ) {
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
			'customer_id' => isset( $request['customer_id'] ) ? absint( $request['customer_id'] ) : 0,
			'sort_by'     => is_string( $request['sort_by'] ) ? sanitize_text_field( $request['sort_by'] ) : 'revenue',
			'order'       => is_string( $request['order'] ) ? strtoupper( sanitize_text_field( $request['order'] ) ) : 'DESC',
			'page'        => $page,
			'per_page'    => $per_page,
		);

		$result      = CampaignService::get_campaigns( $args );
		$pagination  = $result['pagination'];
		$total       = (int) ( $pagination['total'] ?? 0 );
		$total_pages = (int) ( $pagination['total_pages'] ?? 0 );

		$response_data = array(
			'current_period' => $result['current_period'],
			'compare_period' => $result['compare_period'],
			'data'           => $this->add_item_links( $result['data'], 'campaigns', 'campaign_id' ),
			'collection'     => $this->build_collection_meta( $total, $per_page, $page ),
			'links'          => $this->build_top_links( $request, 'campaigns', $total_pages, $page ),
		);

		$response = rest_ensure_response( $response_data );
		$response->header( 'X-WP-Total', $total );
		$response->header( 'X-WP-TotalPages', $total_pages );

		return $response;
	}

	/**
	 * GET /disco/v1/analytics/campaigns/{id}
	 *
	 * Returns aggregated KPIs, a daily chart, and top-10 products for a single campaign.
	 * Includes campaigns that have been soft-deleted (is_deleted=true) so historical
	 * data is never lost.
	 *
	 * Path param:
	 *   id (int) Campaign ID.
	 *
	 * Query params:
	 *   date_from (string Y-m-d) Range start. Default: all-time.
	 *   date_to   (string Y-m-d) Range end.   Default: all-time.
	 *
	 * @param  \WP_REST_Request $request Incoming REST request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_campaign( $request ) {
		$error = $this->validate_date_params( $request );

		if ( is_wp_error( $error ) ) {
			return $error;
		}

		$args = array(
			'date_from' => is_string( $request['date_from'] ) ? sanitize_text_field( $request['date_from'] ) : '',
			'date_to'   => is_string( $request['date_to'] ) ? sanitize_text_field( $request['date_to'] ) : '',
		);

		$data = CampaignService::get_campaign( absint( $request['id'] ), $args );

		if ( is_wp_error( $data ) ) {
			return $data;
		}

		return rest_ensure_response( $data );
	}

	// =========================================================================
	// Param Builders
	// =========================================================================

	/**
	 * Returns params for the campaign list endpoint.
	 */
	private function get_campaigns_params(): array {
		return array_merge(
			$this->get_date_params(),
			array(
				'search'      => array(
					'description'       => __( 'Search term. Numeric = exact ID; text = name LIKE search.', 'disco' ),
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'customer_id' => array(
					'description'       => __( 'Filter by customer (WP user) ID.', 'disco' ),
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'sort_by'     => array(
					'description'       => __( 'Sort field.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'orders', 'customers', 'revenue' ),
					'default'           => 'revenue',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'order'       => array(
					'description'       => __( 'Sort direction.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'asc', 'desc' ),
					'default'           => 'desc',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'page'        => array(
					'description'       => __( 'Page number.', 'disco' ),
					'type'              => 'integer',
					'default'           => 1,
					'minimum'           => 1,
					'sanitize_callback' => 'absint',
				),
				'limit'       => array(
					'description'       => __( 'Results per page (max 100).', 'disco' ),
					'type'              => 'integer',
					'default'           => 10,
					'minimum'           => 1,
					'maximum'           => 100,
					'sanitize_callback' => 'absint',
				),
			)
		);
	}

	// =========================================================================
	// Schema
	// =========================================================================

	/**
	 * Retrieves the campaign analytics schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_campaign_schema() { //phpcs:ignore
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'analytics-campaign',
			'type'       => 'object',
			'properties' => array(
				'campaign_id'   => array(
					'description' => __( 'Campaign ID.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'campaign_name' => array(
					'description' => __( 'Campaign name. "Unknown" if deleted.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'intent'        => array(
					'description' => __( 'Campaign intent. "Unknown" if deleted.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'valid_date'    => array(
					'description' => __( 'Validity date range (from ~ to). "Unknown" if deleted.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'orders'        => array(
					'description' => __( 'Total orders using this campaign.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'customers'     => array(
					'description' => __( 'Distinct customers.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'revenue'       => array(
					'description' => __( 'Total revenue from this campaign.', 'disco' ),
					'type'        => 'number',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'status'        => array(
					'description' => __( 'Campaign status: active, inactive, or deleted.', 'disco' ),
					'type'        => 'string',
					'enum'        => array( 'active', 'inactive', 'deleted' ),
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
			),
		);
	}

}
