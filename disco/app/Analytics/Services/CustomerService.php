<?php //phpcs:ignore

/**
 * CustomerService — composes customer queries into service-level results.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Services
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Services;

use Disco\App\Analytics\Queries\CustomerQuery;

/**
 * Provides customer analytics at the service layer.
 *
 * Used by the REST controller for the customers list and customer-orders endpoints.
 * No SQL lives here — all DB work is delegated to CustomerQuery / OrderQuery.
 */
class CustomerService extends BaseService {

	/**
	 * Returns a paginated customer table with current/compare periods and inline campaigns.
	 *
	 * Only completed orders with disco_campaign meta are included.
	 * Default sort: total_spent ASC.
	 *
	 * @param array $args date_from, date_to, campaign_id, order_id, page, limit.
	 * @return array { current_period, compare_period, pagination, data }
	 */
	public static function get_customers_table( array $args ): array {
		$limit = min( absint( $args['limit'] ?? 10 ), 100 );
		$page  = max( 1, absint( $args['page'] ?? 1 ) );

		$date_to   = $args['date_to'] ?? '';
		$date_from = $args['date_from'] ?? '';

		$query  = new CustomerQuery;
		$result = $query->get_customers_for_table( self::build_table_query_args( $args, $limit, $page ) );

		$data = array();

		foreach ( $result['rows'] as $row ) {
			$data[] = self::format_customer_row( $row );
		}

		return array(
			'current_period' => array(
				'from' => $date_from,
				'to'   => $date_to,
			),
			'compare_period' => self::resolve_compare_period( $date_from, $date_to ),
			'pagination'     => self::build_pagination( $result, $page, $limit ),
			'data'           => $data,
		);
	}

	/**
	 * Returns detail for a single customer including aggregated metrics and inline campaigns.
	 *
	 * @param int   $customer_id WP User ID.
	 * @param array $args        date_from, date_to.
	 * @return array { current_period, compare_period, data }
	 */
	public static function get_customer( int $customer_id, array $args ): array {
		$date_from = $args['date_from'] ?? '';
		$date_to   = $args['date_to'] ?? '';

		$query  = new CustomerQuery;
		$result = $query->get_customers_for_table(
			array(
				'date_from' => $date_from,
				'date_to'   => $date_to,
				'user_id'   => $customer_id,
				'per_page'  => 1,
				'page'      => 1,
				'status'    => 'wc-completed',
			)
		);

		$data = null;

		if ( ! empty( $result['rows'] ) ) {
			$data = self::format_customer_row( $result['rows'][0] );
		}

		return array(
			'current_period' => array(
				'from' => $date_from,
				'to'   => $date_to,
			),
			'compare_period' => self::resolve_compare_period( $date_from, $date_to ),
			'data'           => $data,
		);
	}

	/**
	 * Maps service-level $args onto the argument array CustomerQuery expects.
	 *
	 * Whitelists orderby, normalizes sort direction, casts filter IDs.
	 *
	 * @param array $args  Raw service args.
	 * @param int   $limit Sanitized per-page limit.
	 * @param int   $page  Sanitized page number.
	 * @return array Query args for CustomerQuery::get_customers_for_table().
	 */
	private static function build_table_query_args( array $args, int $limit, int $page ): array {
		$orderby_map = array(
			'total_spent' => 'total_spent',
			'orders'      => 'orders_count',
		);
		$orderby     = $orderby_map[ $args['orderby'] ?? 'total_spent' ] ?? 'total_spent';
		$order       = 'ASC';

		if ( strtolower( $args['order'] ?? 'asc' ) === 'desc' ) {
			$order = 'DESC';
		}

		return array(
			'date_from'   => $args['date_from'] ?? '',
			'date_to'     => $args['date_to'] ?? '',
			'search'      => $args['search'] ?? '',
			'campaign_id' => ! empty( $args['campaign_id'] ) ? (int) $args['campaign_id'] : 0,
			'order_id'    => ! empty( $args['order_id'] ) ? (int) $args['order_id'] : 0,
			'orderby'     => $orderby,
			'order'       => $order,
			'per_page'    => $limit,
			'page'        => $page,
			'status'      => 'wc-completed',
		);
	}

	/**
	 * Formats one raw query row into the API response shape.
	 *
	 * Parses inline campaigns, resolves the avatar, casts and rounds metrics.
	 *
	 * @param object $row Raw row from CustomerQuery::get_customers_for_table().
	 * @return array Formatted customer row.
	 * @phpstan-param object{customer_id: int|string, customer_name: string|null, customer_email: string|null, user_login: string|null, billing_state: string|null, campaigns_raw: string|null, orders_count: int|string, total_spent: string|null} $row
	 */
	private static function format_customer_row( object $row ): array {
		$customer_id = (int) $row->customer_id;
		$email       = $row->customer_email ?? '';

		return array(
			'id'          => $customer_id,
			'name'        => $row->customer_name ?? '',
			'email'       => $email,
			'avatar'      => self::resolve_avatar( $customer_id, $email ),
			'user_name'   => $row->user_login ?? '',
			'state'       => $row->billing_state ?? '',
			'campaigns'   => self::parse_campaigns( (string) ( $row->campaigns_raw ?? '' ) ),
			'orders'      => (int) $row->orders_count,
			'total_spent' => round( (float) $row->total_spent, 2 ),
		);
	}

	/**
	 * Parses the "id::name::intent||..." campaigns_raw string into structured campaigns.
	 *
	 * @param string $raw Raw concatenated string from the query layer.
	 * @return array<int, array{id: int, name: string, intent: string}>
	 */
	private static function parse_campaigns( string $raw ): array {
		if ( '' === $raw ) {
			return array();
		}

		$campaigns = array();

		foreach ( explode( '||', $raw ) as $entry ) {
			[ $id_str, $name, $intent ] = explode( '::', $entry, 3 );

			$campaigns[] = array(
				'id'     => (int) $id_str,
				'name'   => $name,
				'intent' => $intent,
			);
		}

		return $campaigns;
	}

	/**
	 * Returns the Gravatar URL only when the user has a real avatar set.
	 *
	 * Probes Gravatar with d=404 so the request 404s when no custom avatar exists.
	 * Result is transient-cached per email hash for 24 hours to avoid repeat HTTP calls.
	 *
	 * @param int    $customer_id WP user ID (0 for guests).
	 * @param string $email       Billing/account email used for Gravatar hash.
	 * @return string Avatar URL, or empty string if no avatar is set.
	 */
	private static function resolve_avatar( int $customer_id, string $email ): string {
		if ( $customer_id > 0 ) {
			$user = get_userdata( $customer_id );

			if ( $user ) {
				$email = $user->user_email;
			}
		}

		if ( ! $email ) {
			return '';
		}

		$hash      = md5( strtolower( trim( $email ) ) );
		$cache_key = 'disco_av_' . $hash;
		$cached    = get_transient( $cache_key );

		if ( false !== $cached ) {
			if ( is_string( $cached ) ) {
				return $cached;
			}

			return '';
		}

		$response = wp_remote_head( "https://www.gravatar.com/avatar/{$hash}?d=404&r=pg", array( 'timeout' => 2 ) );

		$url = '';

		if ( ! is_wp_error( $response ) && 200 === (int) wp_remote_retrieve_response_code( $response ) ) {
			$url = "https://www.gravatar.com/avatar/{$hash}?s=80&r=pg";
		}

		set_transient( $cache_key, $url, DAY_IN_SECONDS );

		return $url;
	}

}
