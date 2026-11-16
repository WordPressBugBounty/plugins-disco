<?php
// phpcs:disable
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
if (!defined('ABSPATH')) {
	exit;
}

use Disco\App\Utility\Settings;

if( ! function_exists( 'disco_get_coupon_discount' ) ) {

	/**
	 * Get the discount amount for a coupon.
	 *
	 * @param string $coupon_code Coupon code.
	 * @return float
	 */
	function disco_disable_coupon_application( $valid, $coupon, $discount ) {
		// Only "Disco only" blocks coupons. Any other value allows them, including
		// "woocommerce_coupon" ("Coupon wins"), which 1.3.50 removed from the settings
		// but is still saved on older stores; it used to block every coupon.
		if ( Settings::get( 'discount_priority_type' ) !== 'disco_campaign' ) {
			return $valid;
		}
		return false; // "Disco only": coupons are not allowed.
	}

	add_filter( 'woocommerce_coupon_is_valid', 'disco_disable_coupon_application', 10, 3 );
}


