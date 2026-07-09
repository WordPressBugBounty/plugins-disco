<?php //phpcs:ignore

/**
 * SummaryController — composes the /analytics/summary response.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Controllers
 * @since      1.3.23
 */

namespace Disco\App\Analytics\Controllers;

use Disco\App\Analytics\Services\SummaryService;

/**
 * Resolves periods and delegates to SummaryService.
 *
 * No SQL and no query building here — pure orchestration.
 */
class SummaryController extends BaseController {

	/**
	 * Returns the full summary payload for the given request args.
	 *
	 * @param array $args Request args with date_from and date_to as Y-m-d strings (optional).
	 */
	public static function get_summary( array $args ): array {
		$current = self::resolve_current_period( $args );
		$compare = self::resolve_compare_period( $current );

		return array(
			'current_period' => array( 'from' => $current['from'], 'to' => $current['to'] ),
			'compare_period' => array( 'from' => $compare['from'], 'to' => $compare['to'] ),
			'data'           => SummaryService::get_summary( $current, $compare ),
		);
	}

}
