<?php //phpcs:ignore

/**
 * BaseService — shared helpers for analytics service classes.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Services
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Services;

/**
 * Shared, side-effect-free helpers used by every analytics service.
 *
 * Holds period math and raw-string parsing only — no SQL, no WP queries.
 */
abstract class BaseService {

	/**
	 * Returns the comparison period (same duration, immediately before the current period).
	 *
	 * @param string $date_from Y-m-d start of current period.
	 * @param string $date_to   Y-m-d end of current period.
	 * @return array { from: string, to: string }
	 */
	protected static function resolve_compare_period( string $date_from, string $date_to ): array {
		if ( ! $date_from || ! $date_to ) {
			return array( 'from' => '', 'to' => '' );
		}

		$ts_from = strtotime( $date_from );
		$ts_to   = strtotime( $date_to );

		if ( ! $ts_from || ! $ts_to ) {
			return array( 'from' => '', 'to' => '' );
		}

		$duration     = (int) round( ( $ts_to - $ts_from ) / DAY_IN_SECONDS );
		$compare_to   = gmdate( 'Y-m-d', $ts_from - DAY_IN_SECONDS );
		$compare_from = gmdate( 'Y-m-d', strtotime( $compare_to ) - $duration * DAY_IN_SECONDS );

		return array( 'from' => $compare_from, 'to' => $compare_to );
	}

	/**
	 * Parses an "id:name||id2:name2" raw string into [{ id, name }] pairs.
	 *
	 * Used for the categories_raw / campaigns_raw columns produced by the
	 * query layer. Entries without a ":" separator are skipped.
	 *
	 * @param string $raw Raw concatenated string from the query layer.
	 * @return array<int, array{id: int, name: string}>
	 */
	protected static function parse_id_name_pairs( string $raw ): array {
		if ( '' === $raw ) {
			return array();
		}

		$pairs = array();

		foreach ( explode( '||', $raw ) as $entry ) {
			$parts = explode( ':', $entry, 2 );

			if ( count( $parts ) < 2 ) {
				continue;
			}

			[ $id_str, $name ] = $parts;
			$pairs[]           = array( 'id' => (int) $id_str, 'name' => $name );
		}

		return $pairs;
	}

	/**
	 * Builds the standard pagination block for table responses.
	 *
	 * @param array $result Query result containing total + pages.
	 * @param int   $page   Current page number.
	 * @param int   $limit  Per-page limit.
	 * @return array { total, pages, page, limit }
	 */
	protected static function build_pagination( array $result, int $page, int $limit ): array {
		return array(
			'total' => $result['total'],
			'pages' => $result['pages'],
			'page'  => $page,
			'limit' => $limit,
		);
	}

}
