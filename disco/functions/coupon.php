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
		if ( Settings::get( 'discount_priority_type' ) === 'both' ) {
			return $valid; // Allow coupon validation if the setting is enabled.
		}
		return false; // This will prevent all coupons from being valid
	}

	add_filter( 'woocommerce_coupon_is_valid', 'disco_disable_coupon_application', 10, 3 );
}


