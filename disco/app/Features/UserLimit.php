<?php
/**
 * UserLimit Feature
 *
 * @package    Disco
 * @subpackage App\Utility
 * @since      1.0.0
 * @category   Utility
 */

namespace Disco\App\Features;

/**
 * Class DiscountLimit
 *
 * @package    Disco
 * @subpackage App\Feature
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Utility
 */
class UserLimit {

	/**
	 * Object cache group for campaign usage counts.
	 */
	public const CACHE_GROUP = 'disco_user_limit';

	/**
	 * Transient / cache key prefix for campaign usage counts.
	 */
	public const CACHE_KEY_PREFIX = 'disco_campaign_usage_';

	/**
	 * Default cache lifetime, in seconds, for campaign usage counts.
	 */
	public const CACHE_TTL = 300;

	/**
     * Disco start session function.
     * Set campaign in WC session as an array.
     *
     * @param int $campaign_id Campaign ID.
     * @return void
     */
	public function disco_start_session_on_checkout( $campaign_id ) {
		if ( ! is_checkout() ) {
			return;
		}

		// Retrieve the current associative array from the session
		$disco_campaign = WC()->session->get( 'disco_campaign', array() );

		if ( !is_array( $disco_campaign ) ) {
			$disco_campaign = (array) $disco_campaign;
		}

		// Check if the key (campaign ID) already exists
		if ( in_array( $campaign_id, $disco_campaign, true ) ) {
			return;
		}

		// Add the new data using the campaign ID as the key
		$disco_campaign[] = $campaign_id;

		// Save the updated associative array back to the session
		WC()->session->set( 'disco_campaign', $disco_campaign );
	}

	/**
	 * Whether a campaign has reached its configured global usage limit.
	 *
	 * This is the entry point callers should use instead of fetching the count
	 * directly: when a campaign has no usage limit configured (the common case)
	 * it returns early and no order/meta query is issued at all.
	 *
	 * @param \Disco\App\Utility\Config|object $campaign Campaign config object.
	 * @return bool
	 */
	public function disco_is_limit_reached( $campaign ) {
		if ( ! $campaign instanceof \Disco\App\Utility\Config || empty( $campaign->id ) ) {
			return false;
		}

		$limit = $campaign->discount_max_user;

		// No limit configured — never query.
		if ( empty( $limit ) || ! is_numeric( $limit ) || (int) $limit < 0 ) {
			return false;
		}

		return $this->disco_get_total_applied_campaign( (int) $campaign->id ) >= (int) $limit;
	}

    /**
     * Retrieve total applied campaign by campaign id.
     *
     * The result is memoized per request and cached (object cache + transient)
     * because the underlying COUNT() joins the order and order-meta tables,
     * which is expensive on large stores. Usage limits do not need real-time
     * precision at cart/fragment-refresh frequency; the cache is invalidated
     * when an order gains campaign meta or changes status.
     *
     * @param int $campaign_id Campaign ID.
     * @return int
     */
	public function disco_get_total_applied_campaign( $campaign_id ) {
		$campaign_id = (int) $campaign_id;
		$cache_key   = self::CACHE_KEY_PREFIX . $campaign_id;
		$cached      = wp_cache_get( $cache_key, self::CACHE_GROUP );

		if ( false === $cached ) {
			$cached = get_transient( $cache_key );
		}

		if ( is_numeric( $cached ) ) {
			return (int) $cached;
		}

		$count = $this->query_total_applied_campaign( $campaign_id );

		/**
		 * Filter the cache lifetime, in seconds, of campaign usage counts.
		 *
		 * @param int $ttl         Lifetime in seconds.
		 * @param int $campaign_id Campaign ID.
		 */
		$ttl = (int) apply_filters( 'disco_campaign_usage_cache_ttl', self::CACHE_TTL, $campaign_id );

		if ( $ttl > 0 ) {
			wp_cache_set( $cache_key, $count, self::CACHE_GROUP, $ttl );
			set_transient( $cache_key, $count, $ttl );
		}

		return $count;
	}

	/**
	 * Invalidate the cached usage count for a campaign, or for all campaigns.
	 *
	 * @param int|null $campaign_id Campaign ID, or null to flush every campaign.
	 * @return void
	 */
	public static function flush_cache( $campaign_id = null ) {
		if ( null !== $campaign_id ) {
			$campaign_id = (int) $campaign_id;
			$cache_key   = self::CACHE_KEY_PREFIX . $campaign_id;

			wp_cache_delete( $cache_key, self::CACHE_GROUP );
			delete_transient( $cache_key );

			return;
		}

		if ( ! class_exists( \Disco\App\Campaign::class ) ) {
			return;
		}

		$campaigns = ( new \Disco\App\Campaign )->get_rows();

		if ( ! is_array( $campaigns ) ) {
			return;
		}

		foreach ( array_keys( $campaigns ) as $id ) {
			self::flush_cache( $id );
		}
	}

	/**
	 * Run the usage count query against the order tables.
	 *
	 * The order-meta table is joined first (via STRAIGHT_JOIN) so MySQL resolves
	 * the small `meta_key`/`meta_value` set before touching the orders table.
	 * Letting the optimizer start from the orders table means scanning every
	 * order on the store, which is what made this query pathologically slow.
	 *
	 * @param int $campaign_id Campaign ID.
	 * @return int
	 */
	private function query_total_applied_campaign( $campaign_id ) { // phpcs:disable
		global $wpdb;

		// Filter the order statuses
		$status = apply_filters(
			'disco_campaign_user_limit_order_statuses',
			array(
				'wc-processing',
				'wc-on-hold',
				'wc-completed',
			),
			$campaign_id
		);

		$placeholders = implode( ',', array_fill( 0, count( $status ), '%s' ) );

		// Check HPOS first
		if ( $this->disco_is_hpos_enabled() ) {
			$sql = "
				SELECT STRAIGHT_JOIN COUNT(DISTINCT om.order_id)
				FROM {$wpdb->prefix}wc_orders_meta AS om
				INNER JOIN {$wpdb->prefix}wc_orders AS o ON o.id = om.order_id
				WHERE om.meta_key = %s
				AND om.meta_value = %s
				AND o.type = 'shop_order'
				AND o.status IN ($placeholders)
			";

			$count = $wpdb->get_var(
				$wpdb->prepare(
					$sql,
					...array_merge( array( 'disco_campaign', (string) $campaign_id ), $status )
				)
			);

			return (int) $count;
		}

		// Legacy query for posts table (non-HPOS only)
		$sql = "
			SELECT STRAIGHT_JOIN COUNT(DISTINCT pm.post_id)
			FROM {$wpdb->postmeta} AS pm
			INNER JOIN {$wpdb->posts} AS p ON p.ID = pm.post_id
			WHERE pm.meta_key = %s
			AND pm.meta_value = %s
			AND p.post_type = 'shop_order'
			AND p.post_status IN ($placeholders)
		";

		$count = $wpdb->get_var(
			$wpdb->prepare(
				$sql,
				...array_merge( array( 'disco_campaign', (string) $campaign_id ), $status )
			)
		);

		return (int) $count;
	}

	/**
	 * Check WooCommerce HPOS is enabled or not.
	 *
	 * @return bool
	 */
	private function disco_is_hpos_enabled() {
		if ( class_exists( \Automattic\WooCommerce\Utilities\OrderUtil::class ) ) {
			return \Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled();
		}

		return false;
	}

}
