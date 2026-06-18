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
		/**
		 * Guard against double execution.
		 *
		 * This callback fires on both woocommerce_thankyou and
		 * woocommerce_payment_complete. Depending on the gateway and page
		 * reloads either can run first, so skip if campaign meta is already
		 * stored to avoid duplicate disco_campaign entries.
		 */
		$existing = $order->get_meta( 'disco_campaign', false );

		if ( ! empty( $existing ) ) {
			WC()->session->__unset( 'disco_campaign' );

			return;
		}

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

if ( ! function_exists( 'disco_add_free_shipping_order_meta' ) ) {

	/**
	 * Persist free-shipping campaign IDs to the order meta during checkout.
	 *
	 * Free shipping is applied through the woocommerce_package_rates filter,
	 * whose results WooCommerce caches per package. Because of that cache, the
	 * filter is not guaranteed to run on the final order-placement recalculation,
	 * so the campaign ID cannot be reliably staged in the WC session like the
	 * product and cart intents are. Instead we evaluate the Shipping intents
	 * fresh here, where the order object and cart are both available, and write
	 * the campaign IDs straight to the order.
	 *
	 * @param \WC_Order $order The order being created.
	 * @return void
	 */
	function disco_add_free_shipping_order_meta( $order ) {
		if ( ! $order instanceof WC_Order ) {
			return;
		}

		$campaign_ids = ( new \Disco\App\Disco )->get_applied_free_shipping_campaign_ids();

		if ( empty( $campaign_ids ) ) {
			return;
		}

		// Avoid duplicating IDs already staged from product/cart intents.
		$existing = array_map( 'intval', $order->get_meta( 'disco_campaign', false ) ? wp_list_pluck( $order->get_meta( 'disco_campaign', false ), 'value' ) : array() );

		foreach ( $campaign_ids as $campaign_id ) {
			if ( in_array( (int) $campaign_id, $existing, true ) ) {
				continue;
			}

			$order->add_meta_data( 'disco_campaign', (int) $campaign_id, false );
		}
	}

	// Classic (shortcode) checkout: order is saved by WC after this action.
	add_action( 'woocommerce_checkout_create_order', 'disco_add_free_shipping_order_meta', 20 );

	// Block / Store API checkout: WC_Checkout::create_order() does not run, so
	// the action above never fires. This Store API hook also passes the WC_Order
	// (as its first arg) before the order is persisted.
	add_action( 'woocommerce_store_api_checkout_update_order_meta', 'disco_add_free_shipping_order_meta', 20 );
}
