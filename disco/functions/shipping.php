<?php

// Ensure the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Disco\App\Disco;

if ( ! function_exists( 'disco_add_free_shipping_rate' ) ) {

	/**
	 * Replace the package rates with free shipping when a campaign grants it.
	 *
	 * The paid rates are dropped rather than kept alongside a free one. Leaving
	 * them in place only offers free shipping, it does not apply it: WooCommerce
	 * keeps charging whichever rate is already chosen in the session, and the
	 * customer has to pick the free one by hand. That is impossible on the cart
	 * page unless the shipping calculator is enabled, so the same campaign looked
	 * applied at checkout and ignored in the cart.
	 *
	 * A free shipping method the merchant configured themselves is kept in
	 * preference to ours, so their own title and settings survive.
	 *
	 * @param array $rates Array of rates found for the package.
	 * @return array
	 */
	function disco_add_free_shipping_rate( $rates ) {
		$is_free_shipping = ( new Disco )->apply_free_shipping( WC()->cart );

		if ( ! $is_free_shipping ) {
			return $rates;
		}

		$free_rates = array();

		foreach ( $rates as $rate_id => $rate ) {
			if ( 'free_shipping' !== $rate->method_id ) {
				continue;
			}

			$free_rates[ $rate_id ] = $rate;
		}

		if ( ! empty( $free_rates ) ) {
			return $free_rates;
		}

		// TODO: Add Label from campaign
		return array(
			'disco_free_shipping' => new WC_Shipping_Rate( 'disco_free_shipping', __( 'Free Shipping', 'disco' ), 0, array(), 'disco_free_shipping' ),
		);
	}

	add_filter( 'woocommerce_package_rates', 'disco_add_free_shipping_rate', 100, 1 );
}

if ( ! function_exists( 'disco_refresh_shipping_cache_on_cart_checkout' ) ) {

	/**
	 * Force WooCommerce to recalculate shipping rates on the cart and checkout pages.
	 *
	 * Disco adds/removes the disco_free_shipping rate through the
	 * woocommerce_package_rates filter based on the current campaign state, but
	 * WooCommerce caches the calculated package rates in the customer session
	 * keyed by a hash of the cart contents only - campaign state is NOT part of
	 * that hash. So when a campaign is activated or deactivated, an existing
	 * session keeps serving the stale cached rates: a lingering disco_free_shipping
	 * rate after deactivation, or a chosen shipping method that no longer exists,
	 * which makes the shipping options appear hidden or broken until the cart
	 * contents change.
	 *
	 * Clearing this session's cached package rates whenever the cart or checkout
	 * page is viewed forces a fresh calculation that reflects the current campaign
	 * state, for this customer only (no global cache flush).
	 *
	 * @return void
	 */
	function disco_refresh_shipping_cache_on_cart_checkout() {
		if ( is_admin() || ! function_exists( 'is_cart' ) || ! function_exists( 'WC' ) ) {
			return;
		}

		if ( ! is_cart() && ! is_checkout() ) {
			return;
		}

		$session = WC()->session;
		$cart    = WC()->cart;

		if ( ! $session instanceof WC_Session || ! $cart instanceof WC_Cart ) {
			return;
		}

		// Invalidate the cached rates for every shipping package in this session.
		// The package keys match the keys WooCommerce uses when it stores rates
		// under 'shipping_for_package_{key}', so setting them to false makes
		// WC_Shipping::calculate_shipping_for_package() recalculate instead of
		// returning the stale cached rates.
		foreach ( array_keys( $cart->get_shipping_packages() ) as $package_key ) {
			$session->set( 'shipping_for_package_' . $package_key, false );
		}

		$cart->calculate_shipping();
	}

	add_action( 'template_redirect', 'disco_refresh_shipping_cache_on_cart_checkout' );
}
