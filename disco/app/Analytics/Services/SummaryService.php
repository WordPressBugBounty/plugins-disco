<?php //phpcs:ignore

/**
 * SummaryService — assembles KPI data for the /analytics/summary endpoint.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Services
 * @since      1.3.23
 */

namespace Disco\App\Analytics\Services;

use Disco\App\Analytics\Queries\SummaryQuery;

/**
 * Calls SummaryQuery for both periods and builds the summary KPI array.
 *
 * All metrics are scoped to completed orders only (wc-completed).
 * No SQL in this class — pure composition and growth calculation.
 */
class SummaryService {

	/**
	 * Returns all six summary KPIs for the current and comparison periods.
	 *
	 * The active_campaigns metric is date-independent and carries no comparison data.
	 * All other KPIs include growth deltas against the comparison period.
	 *
	 * @param array $current Date range for current period { from: string Y-m-d, to: string Y-m-d }.
	 * @param array $compare Date range for comparison period { from: string Y-m-d, to: string Y-m-d }.
	 */
	public static function get_summary( array $current, array $compare ): array {
		$query = new SummaryQuery;

		$active_campaigns = $query->get_active_campaign_count();

		$current_all   = $query->get_all_order_metrics( $current );
		$current_disco = $query->get_disco_order_metrics( $current );
		$current_cust  = $query->get_disco_customer_count( $current );

		$prev_all   = $query->get_all_order_metrics( $compare );
		$prev_disco = $query->get_disco_order_metrics( $compare );
		$prev_cust  = $query->get_disco_customer_count( $compare );

		return array(
			'active_campaigns' => array(
				'current' => $active_campaigns,
			),
			'net_sales'        => self::build_kpi( $current_all['net_sales'], $prev_all['net_sales'] ),
			'discount_sales'   => self::build_kpi( $current_disco['revenue'], $prev_disco['revenue'] ),
			'total_orders'     => self::build_kpi( $current_all['total_orders'], $prev_all['total_orders'] ),
			'disco_orders'     => self::build_kpi( $current_disco['orders_count'], $prev_disco['orders_count'] ),
			'customers'        => self::build_kpi( $current_cust, $prev_cust ),
		);
	}

	/**
	 * Builds a single KPI block with growth comparison.
	 *
	 * @param int|float $current  Value in the current period.
	 * @param int|float $previous Value in the comparison period.
	 * @return array { current, previous, change, change_percent, trend }
	 */
	private static function build_kpi( $current, $previous ): array {
		$change = $current - $previous;

		return array(
			'current'        => $current,
			'previous'       => $previous,
			'change'         => $change,
			'change_percent' => 0 == $previous ? null : round( ( $change / $previous ) * 100, 2 ), //phpcs:ignore
			'trend'          => $change > 0 ? 'up' : ( $change < 0 ? 'down' : 'flat' ),
		);
	}

}
