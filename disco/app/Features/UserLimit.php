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
     * Retrieve total applied campaign by campaign id.
     *
     * @param int $campaign_id Campaign ID.
     * @return int
     */
	public function disco_get_total_applied_campaign( $campaign_id ) { // phpcs:disable
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
				SELECT COUNT(DISTINCT o.id)
				FROM {$wpdb->prefix}wc_orders AS o
				INNER JOIN {$wpdb->prefix}wc_orders_meta AS om ON o.id = om.order_id
				WHERE o.status IN ($placeholders)
				AND om.meta_key = %s
				AND om.meta_value = %s
			";

			$count = $wpdb->get_var(
				$wpdb->prepare(
					$sql,
					...array_merge( $status, array( 'disco_campaign', (string) $campaign_id ) )
				)
			);

			return (int) $count;
		}

		// Legacy query for posts table (non-HPOS only)
		$sql = "
			SELECT COUNT(p.ID)
			FROM {$wpdb->posts} AS p
			INNER JOIN {$wpdb->postmeta} AS pm ON p.ID = pm.post_id
			WHERE p.post_type = 'shop_order'
			AND p.post_status IN ($placeholders)
			AND pm.meta_key = %s
			AND pm.meta_value = %s
		";

		$count = $wpdb->get_var(
			$wpdb->prepare(
				$sql,
				...array_merge( $status, array( 'disco_campaign', (string) $campaign_id ) )
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
