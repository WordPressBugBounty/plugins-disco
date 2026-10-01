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
			disco_finalise_campaign_usage( $order );

			return;
		}

		foreach ( $campaigns as $campaign_id ) {
			$order->add_meta_data( 'disco_campaign', (int) $campaign_id, false );
		}

		// Save once after all meta is added (more efficient)
		$order->save();

		WC()->session->__unset( 'disco_campaign' );

		// Drop the cached usage counts for the campaigns this order just used.
		foreach ( $campaigns as $campaign_id ) {
			\Disco\App\Features\UserLimit::flush_cache( (int) $campaign_id );
		}

		// Clear price cache so user limits are re-evaluated
		if ( !function_exists( 'disco_clear_price_cache' ) ) {
			return;
		}

		disco_clear_price_cache();
	}

	add_action( 'woocommerce_thankyou', 'disco_add_order_meta', PHP_INT_MAX );
	add_action( 'woocommerce_payment_complete', 'disco_add_order_meta', PHP_INT_MAX );
}

if ( ! function_exists( 'disco_finalise_campaign_usage' ) ) {

	/**
	 * Settle the caches and session for an order that already carries its meta.
	 *
	 * Normally the meta was written by disco_add_campaign_order_meta() as the
	 * order was created. The usage caches have to be dropped here rather than
	 * there: at creation the order is not persisted yet, so a flush would
	 * immediately repopulate the old count from the database.
	 *
	 * @param \WC_Order $order Order object.
	 * @return void
	 */
	function disco_finalise_campaign_usage( $order ) {
		foreach ( disco_campaign_ids_on_order( $order ) as $campaign_id ) {
			\Disco\App\Features\UserLimit::flush_cache( $campaign_id );
		}

		if ( WC()->session ) {
			WC()->session->__unset( 'disco_campaign' );
		}

		if ( ! function_exists( 'disco_clear_price_cache' ) ) {
			return;
		}

		disco_clear_price_cache();
	}

}

if ( ! function_exists( 'disco_campaign_ids_on_order' ) ) {

	/**
	 * Campaign IDs already recorded on an order.
	 *
	 * @param \WC_Order $order Order object.
	 * @return array<int, int>
	 */
	function disco_campaign_ids_on_order( $order ): array {
		if ( ! $order instanceof WC_Order ) {
			return array();
		}

		$meta = $order->get_meta( 'disco_campaign', false );

		if ( empty( $meta ) ) {
			return array();
		}

		return array_map( 'intval', wp_list_pluck( $meta, 'value' ) );
	}

}

if ( ! function_exists( 'disco_add_campaign_order_meta' ) ) {

	/**
	 * Record the applied campaigns while the order is being created.
	 *
	 * The campaign IDs are staged in the WC session as the cart is priced, and
	 * were previously read back on woocommerce_thankyou / payment_complete. Those
	 * run in a later request, which is not always the same session: an off site
	 * gateway can return the customer on a fresh one, and a payment webhook has
	 * no customer session at all. The handover then found nothing and returned
	 * silently, leaving a discounted order with no campaign recorded, so its
	 * usage limit never counted it and Analytics never saw it.
	 *
	 * Reading the session here instead keeps both halves in the request that
	 * priced the cart. The later hooks stay in place as a fallback for anything
	 * that reaches them without meta, and to drop the usage caches once the order
	 * actually exists.
	 *
	 * @param \WC_Order $order The order being created.
	 * @return void
	 */
	function disco_add_campaign_order_meta( $order ) {
		if ( ! $order instanceof WC_Order || ! WC()->session ) {
			return;
		}

		$campaigns = WC()->session->get( 'disco_campaign' );

		if ( empty( $campaigns ) || ! is_array( $campaigns ) ) {
			return;
		}

		$existing = disco_campaign_ids_on_order( $order );

		foreach ( $campaigns as $campaign_id ) {
			$campaign_id = (int) $campaign_id;

			if ( in_array( $campaign_id, $existing, true ) ) {
				continue;
			}

			$order->add_meta_data( 'disco_campaign', $campaign_id, false );

			$existing[] = $campaign_id;
		}
	}

	// Classic (shortcode) checkout: order is saved by WC after this action.
	add_action( 'woocommerce_checkout_create_order', 'disco_add_campaign_order_meta', 10 );

	// Block / Store API checkout: WC_Checkout::create_order() does not run, so
	// the action above never fires.
	add_action( 'woocommerce_store_api_checkout_update_order_meta', 'disco_add_campaign_order_meta', 10 );
}

if ( ! function_exists( 'disco_flush_campaign_usage_cache_on_status_change' ) ) {

	/**
	 * Invalidate cached campaign usage counts when an order changes status.
	 *
	 * The usage count only counts orders in processing / on-hold / completed, so
	 * any status transition can change it. Flushing here keeps the cached count
	 * correct without querying on every cart or fragment-refresh request.
	 *
	 * @param int $order_id Order ID.
	 * @return void
	 */
	function disco_flush_campaign_usage_cache_on_status_change( $order_id ) {
		$order = wc_get_order( $order_id );

		if ( ! $order instanceof WC_Order ) {
			return;
		}

		$meta = $order->get_meta( 'disco_campaign', false );

		if ( empty( $meta ) || ! is_array( $meta ) ) {
			return;
		}

		foreach ( wp_list_pluck( $meta, 'value' ) as $campaign_id ) {
			\Disco\App\Features\UserLimit::flush_cache( (int) $campaign_id );
		}
	}

	add_action( 'woocommerce_order_status_changed', 'disco_flush_campaign_usage_cache_on_status_change', 10, 1 );
	add_action( 'woocommerce_trash_order', 'disco_flush_campaign_usage_cache_on_status_change', 10, 1 );
	add_action( 'woocommerce_untrash_order', 'disco_flush_campaign_usage_cache_on_status_change', 10, 1 );
	add_action( 'woocommerce_before_delete_order', 'disco_flush_campaign_usage_cache_on_status_change', 10, 1 );
	add_action( 'woocommerce_delete_order', 'disco_flush_campaign_usage_cache_on_status_change', 10, 1 );
}

if ( ! function_exists( 'disco_flush_campaign_usage_cache_on_meta_write' ) ) {

	/**
	 * Invalidate cached campaign usage counts when disco_campaign meta is written
	 * outside of this plugin.
	 *
	 * Imports, migrations and third-party code write order meta directly rather
	 * than going through disco_add_order_meta(), so without this the cached count
	 * would stay stale until its TTL expired.
	 *
	 * @param int|array $meta_id    Meta ID (array on delete).
	 * @param int       $object_id  Order ID.
	 * @param string    $meta_key   Meta key.
	 * @param mixed     $meta_value Meta value.
	 * @return void
	 */
	// $meta_id and $object_id are unused but required: the meta hooks pass their
	// arguments positionally, so $meta_key and $meta_value cannot be reached
	// without declaring them.
	function disco_flush_campaign_usage_cache_on_meta_write( $meta_id, $object_id, $meta_key, $meta_value ) { //phpcs:ignore
		if ( 'disco_campaign' !== $meta_key ) {
			return;
		}

		\Disco\App\Features\UserLimit::flush_cache( (int) $meta_value );
	}

	// Legacy (post table) orders.
	add_action( 'added_post_meta', 'disco_flush_campaign_usage_cache_on_meta_write', 10, 4 );
	add_action( 'updated_post_meta', 'disco_flush_campaign_usage_cache_on_meta_write', 10, 4 );
	add_action( 'deleted_post_meta', 'disco_flush_campaign_usage_cache_on_meta_write', 10, 4 );

	// HPOS orders.
	add_action( 'added_wc_order_meta', 'disco_flush_campaign_usage_cache_on_meta_write', 10, 4 );
	add_action( 'updated_wc_order_meta', 'disco_flush_campaign_usage_cache_on_meta_write', 10, 4 );
	add_action( 'deleted_wc_order_meta', 'disco_flush_campaign_usage_cache_on_meta_write', 10, 4 );
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
