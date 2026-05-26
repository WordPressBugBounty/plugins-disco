<?php

// Ensure the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Set Cart Items discounts.
use Disco\App\Disco;

if ( ! function_exists( 'disco_set_cart_item_price_test' ) ) {

	/**
	 * Set Cart Items discounts.
	 *
	 * @param object $cart Cart object.
	 * @return object
	 * @throws \Exception Error message.
	 */
	function disco_set_cart_item_price_test( $cart ) {
		return ( new Disco )->get_cart_items_discount( $cart );
	}

	add_action( 'woocommerce_before_calculate_totals', 'disco_set_cart_item_price_test', 1, 1 );
}

if ( ! function_exists( 'disco_cart_item_price_html' ) ) {

	/**
	 * Display Cart Item Sale Price & Regular Price html
	 *
	 * @param \WC_Cart $cart Cart Object.
	 */
	function disco_cart_item_price_html( $cart ) {
		$page_name = Disco::get_page_name();

		// Check ONCE outside loop - if strike-through is applicable, skip entire function
		if ( Disco::is_strike_through_applicable( $page_name ) ) {
			return;
		}

		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( ! isset( $cart_item['data'] ) || ! is_a( $cart_item['data'], 'WC_Product' ) ) {
				continue;
			}

			$cart_item['data']->set_regular_price( '' );
		}
	}

	add_action( 'woocommerce_before_calculate_totals', 'disco_cart_item_price_html', 999, 1 );
}
