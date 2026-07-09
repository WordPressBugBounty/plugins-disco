<?php //phpcs:ignore

/**
 * CampaignService — composes campaign queries into service-level results.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Services
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Services;

use Disco\App\Analytics\Queries\CampaignQuery;

/**
 * Provides campaign analytics at the service layer.
 *
 * Provides campaign analytics for the campaigns list and single-campaign endpoints.
 * No SQL lives here — all DB work is delegated to CampaignQuery.
 */
class CampaignService extends BaseService {

	/**
	 * Returns a paginated list of campaigns with aggregate order metrics.
	 *
	 * @param array $args search, date_from, date_to, sort_by, order, page, per_page.
	 * @return array { current_period, compare_period, pagination, data }
	 */
	public static function get_campaigns( array $args ): array {
		$result    = ( new CampaignQuery )->get_campaign_list( $args );
		$date_to   = $args['date_to'] ?? '';
		$date_from = $args['date_from'] ?? '';
		$per_page  = (int) ( $args['per_page'] ?? 10 );
		$page      = (int) ( $args['page'] ?? 1 );

		$data = array();

		foreach ( $result['rows'] as $row ) {
			$data[] = array(
				'campaign_id'   => (int) $row->campaign_id,
				'campaign_name' => $row->campaign_name,
				'intent'        => $row->intent,
				'valid_date'    => self::resolve_valid_date( $row->campaign_data ),
				'orders'        => (int) $row->total_orders,
				'customers'     => (int) $row->total_customers,
				'revenue'       => round( (float) $row->total_revenue, 2 ),
				'status'        => $row->status,
			);
		}

		return array(
			'current_period' => array( 'from' => $date_from, 'to' => $date_to ),
			'compare_period' => self::resolve_compare_period( $date_from, $date_to ),
			'pagination'     => array(
				'total'        => $result['total'],
				'per_page'     => $per_page,
				'current_page' => $page,
				'total_pages'  => $result['pages'],
			),
			'data'           => $data,
		);
	}

	/**
	 * Returns KPIs for a single campaign including top products and time-series chart.
	 *
	 * @param int   $campaign_id Campaign ID.
	 * @param array $args        date_from, date_to.
	 * @return array|\WP_Error
	 */
	public static function get_campaign( int $campaign_id, array $args ) {
		$period = array(
			'from' => $args['date_from'] ?? '',
			'to'   => $args['date_to'] ?? '',
		);

		$query = new CampaignQuery;
		$row   = $query->get_campaign( $campaign_id, $period );
		/** @var object{campaign_data: string, orders_count: int, revenue: string, campaign_id: int, intent: string, status: string, is_deleted: int, customers_count: int} $row */

		if ( ! $row ) {
			return new \WP_Error(
				'disco_not_found',
				__( 'No order data found for this campaign ID.', 'disco' ),
				array( 'status' => 404 )
			);
		}

		$campaign_data = null;

		if ( $row->campaign_data ) {
			$campaign_data = json_decode( $row->campaign_data, true );
		}

		$campaign_name = 'Unknown';

		if ( is_array( $campaign_data ) ) {
			$campaign_name = $campaign_data['name'] ?? 'Unknown';
		}

		$orders_count = (int) $row->orders_count;
		$revenue      = round( (float) $row->revenue, 2 );

		return array(
			'current_period'      => array( 'from' => $period['from'], 'to' => $period['to'] ),
			'compare_period'      => self::resolve_compare_period( $period['from'], $period['to'] ),
			'campaign_id'         => (int) $row->campaign_id,
			'campaign_name'       => $campaign_name,
			'intent'              => $row->intent,
			'status'              => $row->status,
			'is_deleted'          => (bool) $row->is_deleted,
			'valid_date'          => array(
				'from' => is_array( $campaign_data ) ? ( $campaign_data['discount_valid_from'] ?? '' ) : '',
				'to'   => is_array( $campaign_data ) ? ( $campaign_data['discount_valid_to'] ?? '' ) : '',
			),
			'total_orders'        => $orders_count,
			'total_customers'     => (int) $row->customers_count,
			'revenue'             => $revenue,
			'average_order_value' => $orders_count > 0 ? round( $revenue / $orders_count, 2 ) : 0.0,
		);
	}

	/**
	 * Resolves the validity date range from raw campaign JSON data.
	 *
	 * Returns "Unknown" for deleted campaigns (null data), or an object
	 * { from, to } with the campaign's discount validity dates.
	 *
	 * @param string|null $raw_data JSON string from the campaigns.data column.
	 * @return array|string
	 */
	private static function resolve_valid_date( ?string $raw_data ) {
		if ( null === $raw_data ) {
			return 'Unknown';
		}

		$data = json_decode( $raw_data, true );

		return array(
			'from' => is_array( $data ) ? ( $data['discount_valid_from'] ?? '' ) : '',
			'to'   => is_array( $data ) ? ( $data['discount_valid_to'] ?? '' ) : '',
		);
	}

}
