<?php //phpcs:ignore

/**
 * IntentPerformanceController — assembles the /analytics/intents-performance response.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Controllers
 * @since      1.3.23
 */

namespace Disco\App\Analytics\Controllers;

use Disco\App\Analytics\Queries\IntentQuery;

/**
 * Returns intent-wise sales for the current period only (no comparison).
 *
 * Reuses IntentQuery; keeps data flat: intent, sales, orders, percentage.
 */
class IntentPerformanceController extends BaseController {

	/**
	 * Returns intent performance data for the given request args.
	 *
	 * @param array $args Request args with date_from and date_to as Y-m-d strings (optional).
	 */
	public static function get_intent_performance( array $args ): array {
		$current = self::resolve_current_period( $args );
		$compare = self::resolve_compare_period( $current );

		$rows  = ( new IntentQuery )->get_intent_sales( $current );
		$total = array_sum( array_column( $rows, 'revenue' ) );

		$data = array_map(
			function ( $row ) use ( $total ) {
				return array(
					'intent'     => $row['intent'],
					'revenue'    => $row['revenue'],
					'orders'     => $row['orders'],
					'percentage' => $total > 0 ? round( $row['revenue'] / $total * 100, 2 ) : 0,
				);
			},
			$rows
		);

		return array(
			'current_period' => array( 'from' => $current['from'], 'to' => $current['to'] ),
			'compare_period' => array( 'from' => $compare['from'], 'to' => $compare['to'] ),
			'total_revenue'  => round( $total, 2 ),
			'data'           => $data,
		);
	}

}
