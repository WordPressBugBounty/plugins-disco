<?php //phpcs:ignore

/**
 * RevenueController — assembles the /analytics/revenue response.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Controllers
 * @since      1.3.23
 */

namespace Disco\App\Analytics\Controllers;

use Disco\App\Analytics\Queries\RevenueQuery;

/**
 * Resolves period, auto-selects interval, and delegates to RevenueQuery.
 *
 * Interval selection rules (based on current-period duration):
 *   ≤ 90 days   → day   (max ~90 data points)
 *   91–365 days → week  (max ~52 data points)
 *   > 365 days  → month (max ~24+ data points)
 *
 * No SQL in this class — pure orchestration.
 */
class RevenueController extends BaseController {

	/**
	 * Returns the full revenue time-series payload.
	 *
	 * @param array $args Request args with date_from and date_to as Y-m-d strings (optional).
	 */
	public static function get_revenue( array $args ): array {
		$current  = self::resolve_current_period( $args );
		$compare  = self::resolve_compare_period( $current );
		$interval = self::resolve_interval( $current['from'], $current['to'] );

		$data = ( new RevenueQuery )->get_revenue_series( $current, $interval );

		return array(
			'current_period' => array( 'from' => $current['from'], 'to' => $current['to'] ),
			'compare_period' => array( 'from' => $compare['from'], 'to' => $compare['to'] ),
			'interval'       => $interval,
			'data'           => $data,
		);
	}

	// =========================================================================
	// Interval resolution
	// =========================================================================

	/**
	 * Auto-selects a grouping interval based on the number of days in the range.
	 *
	 *   ≤ 30 days  → day
	 *   ≤ 180 days → week  (up to ~6 months)
	 *   > 180 days → month
	 *
	 * @param string $from Y-m-d start date.
	 * @param string $to   Y-m-d end date.
	 */
	private static function resolve_interval( string $from, string $to ): string {
		$days = (int) round( ( strtotime( $to ) - strtotime( $from ) ) / DAY_IN_SECONDS ) + 1;

		if ( $days <= 30 ) {
			return 'day';
		}

		if ( $days <= 180 ) {
			return 'week';
		}

		return 'month';
	}

}
