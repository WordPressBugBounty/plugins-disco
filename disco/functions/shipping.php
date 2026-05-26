<?php

// Ensure the file is not accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Disco\App\Disco;

if ( ! function_exists( 'disco_add_free_shipping_rate' ) ) {

	/**
	 * Add free shipping rate to the package. If any campaign matches, then apply free shipping.
     *
	 * @param array $rates Array of rates found for the package.
	 * @return array
	 */
	function disco_add_free_shipping_rate( $rates ) {
		$is_free_shipping = ( new Disco )->apply_free_shipping( WC()->cart );

		if ( ! $is_free_shipping ) {
			return $rates;
		}

		foreach ( $rates as $rate_id => $rate ) {
			if ( 'free_shipping' === $rate->method_id ) {
				return $rates;
			}
		}

		// If free shipping is not available, override rates with free shipping
		// TODO: Add Label from campaign
		$free_shipping_rate           = new WC_Shipping_Rate( 'disco_free_shipping', __( 'Free Shipping', 'disco' ), 0, array(), 'disco_free_shipping' );
		$rates['disco_free_shipping'] = $free_shipping_rate;

		return $rates;
	}

	add_filter( 'woocommerce_package_rates', 'disco_add_free_shipping_rate', 100, 1 );
}
