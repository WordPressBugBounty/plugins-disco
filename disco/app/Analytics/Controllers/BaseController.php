<?php //phpcs:ignore

/**
 * BaseController — shared period helpers for analytics controllers.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Controllers
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Controllers;

/**
 * Shared period-resolution helpers used by every analytics controller.
 *
 * No SQL and no query building here — date math only.
 */
abstract class BaseController {

	/**
	 * Resolves the current period, defaulting to the last 28 days ending today.
	 *
	 * @param array $args Request args with optional date_from / date_to (Y-m-d).
	 * @return array { from: string, to: string }
	 */
	protected static function resolve_current_period( array $args ): array {
		if ( ! empty( $args['date_to'] ) ) {
			$to = $args['date_to'];
		} else {
			$to = gmdate( 'Y-m-d' );
		}

		if ( ! empty( $args['date_from'] ) ) {
			$from = $args['date_from'];
		} else {
			$from = gmdate( 'Y-m-d', strtotime( '-27 days', strtotime( $to ) ) );
		}

		return array(
			'from' => $from,
			'to'   => $to,
		);
	}

	/**
	 * Resolves the comparison period as the same duration immediately before the current period.
	 *
	 * @param array $current Period array with from and to date strings.
	 * @return array { from: string, to: string }
	 */
	protected static function resolve_compare_period( array $current ): array {
		if ( ! $current['from'] || ! $current['to'] ) {
			return array(
				'from' => '',
				'to'   => '',
			);
		}

		$duration     = (int) round( ( strtotime( $current['to'] ) - strtotime( $current['from'] ) ) / DAY_IN_SECONDS );
		$compare_to   = gmdate( 'Y-m-d', strtotime( $current['from'] ) - DAY_IN_SECONDS );
		$compare_from = gmdate( 'Y-m-d', strtotime( $compare_to ) - $duration * DAY_IN_SECONDS );

		return array(
			'from' => $compare_from,
			'to'   => $compare_to,
		);
	}

}
