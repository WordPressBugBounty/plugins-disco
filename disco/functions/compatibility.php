<?php
// phpcs:disable

// Ensure the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Disco Compatibility
 *
 * Excludes products from Disco discounts when they are managed by other plugins.
 * To exclude a product, hook into `disco_exclude_product_from_discount` and return true.
 *
 * Example:
 *   add_filter( 'disco_exclude_product_from_discount', function( $exclude, $product_id, $product ) {
 *       return my_plugin_is_special_product( $product_id ) ? true : $exclude;
 *   }, 10, 3 );
 */

/**
 * Woo Donations Pro — exclude donation products from Disco discounts.
 *
 * The donation product has a base price of 0 in the database; its real price
 * is set dynamically at runtime via set_price(). Applying a Disco discount
 * would zero it out or produce an incorrect amount.
 */

/**
 * WooCommerce TM Extra Product Options — preserve add-on price through Disco's filter.
 *
 * Root cause: disco_discounted_price() (priority 999 on woocommerce_product_get_price)
 * calls CalcFactory::get_product_price() which always fetches the base price from post
 * meta (_price), ignoring the runtime price TM EPO set via set_price() to include extra
 * options. This strips the options cost from every get_price() call in the cart.
 *
 * Fix: after TM EPO populates cart items from session we record each product object's
 * extra options price keyed by object hash. A filter at priority 1000 then adds it back
 * after Disco has applied its discount to the base price.
 */
if ( defined( 'THEMECOMPLETE_EPO_PLUGIN_FILE' ) ) {

	add_filter( 'woocommerce_get_cart_item_from_session', 'disco_compat_tm_epo_track_options_price', 99999, 1 );

	/**
	 * Record the TM EPO extra options price for this cart item's product object.
	 *
	 * @param array $cart_item Cart item data (already processed by TM EPO at priority 9999).
	 * @return array Unchanged cart item.
	 */
	function disco_compat_tm_epo_track_options_price( array $cart_item ): array {
		global $disco_tm_epo_options_prices;

		if ( empty( $cart_item['tmcartepo'] ) || ! isset( $cart_item['data'] ) ) {
			return $cart_item;
		}

		$options_price = isset( $cart_item['tm_epo_options_prices'] )
			? (float) $cart_item['tm_epo_options_prices']
			: 0.0;

		if ( $options_price !== 0.0 ) {
			$disco_tm_epo_options_prices[ spl_object_hash( $cart_item['data'] ) ] = $options_price;
		}

		return $cart_item;
	}

	add_filter( 'woocommerce_product_get_price', 'disco_compat_tm_epo_restore_options_price', 1000, 2 );
	add_filter( 'woocommerce_product_variation_get_price', 'disco_compat_tm_epo_restore_options_price', 1000, 2 );

	/**
	 * Add TM EPO's extra options price back after Disco's filter (priority 999) has run.
	 *
	 * Disco returns the discounted base price; we add the options price on top so the
	 * cart total correctly reflects base-price discount + full options cost.
	 *
	 * @param float|string $price   Price value after all earlier filters.
	 * @param \WC_Product  $product Product object being priced.
	 * @return float|string
	 */
	function disco_compat_tm_epo_restore_options_price( $price, WC_Product $product ) {
		global $disco_tm_epo_options_prices;

		if ( empty( $disco_tm_epo_options_prices ) ) {
			return $price;
		}

		$hash = spl_object_hash( $product );

		if ( isset( $disco_tm_epo_options_prices[ $hash ] ) ) {
			$price = (float) $price + $disco_tm_epo_options_prices[ $hash ];
		}

		return $price;
	}
}

if ( function_exists( 'wdpgk_get_wc_donation_setting' ) ) {

	add_filter( 'disco_exclude_product_from_discount', 'disco_compat_exclude_woo_donations_product', 10, 3 );

	/**
	 * Exclude Woo Donations Pro products from Disco discounts.
	 *
	 * @param bool       $exclude     Whether the product is already excluded.
	 * @param int        $product_id  The product ID being evaluated
	 *
	 * @return bool True if the product should be excluded, false otherwise.
	 */
	function disco_compat_exclude_woo_donations_product( bool $exclude, int $product_id ): bool {

		if ( $exclude ) {
			return $exclude;
		}

		static $donation_product_id = null;

		if ( $donation_product_id === null ) {
			$options             = wdpgk_get_wc_donation_setting();
			$donation_product_id = isset( $options['Product'] ) ? (int) $options['Product'] : 0;
		}

		if ( $donation_product_id > 0 && $product_id === $donation_product_id ) {
			return true;
		}

		if ( get_post_meta( $product_id, '_donatable', true ) === 'yes' ) {
			return true;
		}

		return false;
	}

}
