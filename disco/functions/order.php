<?php
/**
 * Disco
 *
 * @package   Disco
 * @author    Ohidul Islam <wahid0003@gmail.com>
 * @link      http://domain.tld
 * @license   GPL 2.0+
 * @copyright 2022 WebAppick
 */

// Ensure the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'disco_add_order_meta' ) ) {

	/**
	 * Get a campaign id from WC session and set into post meta after place order.
	 * Unset WC session after update post-meta.
	 *
	 * @param int $order_id Order ID.
	 * @return void
	 */
	function disco_add_order_meta( $order_id ) {
		// Validate session exists
		if ( ! WC()->session ) {
			return;
		}

		$campaigns = WC()->session->get( 'disco_campaign' );

		if ( empty( $campaigns ) || ! is_array( $campaigns ) ) {
			return;
		}

		$order = wc_get_order( $order_id );

		// Validate order exists
		if ( ! $order instanceof WC_Order ) {
			return;
		}

		/**
		 * Add each campaign ID as separate meta entry.
		 * Using unique=false allows multiple campaign IDs per order.
		 */
		foreach ( $campaigns as $campaign_id ) {
			$order->add_meta_data( 'disco_campaign', (int) $campaign_id, false );
		}

		// Save once after all meta is added (more efficient)
		$order->save();

		WC()->session->__unset( 'disco_campaign' );

		// Clear price cache so user limits are re-evaluated
		if ( !function_exists( 'disco_clear_price_cache' ) ) {
			return;
		}

		disco_clear_price_cache();
	}

	add_action( 'woocommerce_thankyou', 'disco_add_order_meta', PHP_INT_MAX );
	add_action( 'woocommerce_payment_complete', 'disco_add_order_meta', PHP_INT_MAX );
}

if ( ! function_exists( 'disco_reset_campaign_session' ) ) {

	/**
	 * Clear the disco_campaign session before cart totals are recalculated.
	 *
	 * This prevents stale campaign IDs (from previously discounted products
	 * that were later removed from the cart) from being saved to order meta.
	 * The session is rebuilt fresh each time checkout prices are recalculated.
	 *
	 * @return void
	 */
	function disco_reset_campaign_session() {
		if ( ! is_checkout() ) {
			return;
		}

		if ( ! WC()->session ) {
			return;
		}

		WC()->session->__unset( 'disco_campaign' );
	}

	add_action( 'woocommerce_before_calculate_totals', 'disco_reset_campaign_session', 0 );
}
