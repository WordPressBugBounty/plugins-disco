<?php

namespace Disco\App\Calc;

use Disco\App\Disco;
use Disco\App\Utility\Config;
use Disco\App\Utility\Settings;
use WC_Cart;

/**
 * Class CalcFactory
 *
 * @package    Disco
 * @subpackage Disco\App\Calc
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Plugin
 */
class CalcFactory {

	/**
     * Get Discount.
     *
     * @param array                     $rule     Campaign Rule.
     * @param array                     $item     Cart Item.
     * @param \WC_Cart                  $cart     Cart.
     * @param \Disco\App\Utility\Config $campaign Campaign Config.
     */
	public static function get_discount( array $rule, array $item, WC_Cart $cart, Config $campaign ): array {
		$discount_type = $rule['discount_type'];
		$class_name    = 'Calc' . ucwords( str_replace( '_', ' ', $discount_type ) );
		$class_name    = 'Disco\App\Calc\\' . str_replace( ' ', '', $class_name );

		if ( class_exists( $class_name ) ) {
			$type = new $class_name( $rule, $item, $cart, $campaign );

			// @phpstan-ignore-next-line
			return ( new Calc )->get_discount( $type );
		}

		return array(
			'price'         => $item['data']->get_price(),
			'discount'      => 0,
			'line_subtotal' => $item['line_subtotal'],
		);
	}

	/**
     * Get Discount Applies To.
     *
     * @param array                     $rule     Campaign Rule.
     * @param \Disco\App\Utility\Config $campaign Campaign.
     */
	public static function discount_applies_to( array $rule, Config $campaign ): string {
		if (
            $rule['discount_type'] === 'percent'
            || $rule['discount_type'] === 'fixed'
            || $rule['discount_type'] === 'fixed_price'
        ) {
			$applies_to = 'line_item_subtotal';
		} elseif ( $rule['discount_type'] === 'percent_per_product' || $rule['discount_type'] === 'fixed_per_product' ) {
			$applies_to = 'line_item';
		} elseif ( 'Product' === $campaign->get_discount_intent() ) {
			$applies_to = 'product';
		} else {
			$applies_to = 'cart';
		}

		return $applies_to;
	}

	/**
	 * Get Price.
	 *
	 * @param array $item Cart Item.
     */
	public static function get_price( array $item ): float {
		$id = $item['product_id'];

		if ( $item['variation_id'] > 0 ) {
			$id = $item['variation_id'];
		}

		// Get price from product if disco pro is active.
		if ( Disco::is_pro() ) {
			$product = wc_get_product( $id );

			// @phpstan-ignore-next-line
			return Settings::get_price( $product );
		}

		// Get price from meta if disco pro is not active.
		return Settings::get_price_from_meta( $id );
	}

	/**
     * Get Cart Subtotal.
     *
     * @param \WC_Cart $cart Cart.
     * @return float Cart Subtotal.
     */
	public static function get_cart_subtotal( WC_Cart $cart ): float {
		// Get cart subtotal from cart if disco pro is active.
		if ( Disco::is_pro() ) {
			return $cart->get_subtotal();
		}

		// Get cart subtotal from meta if disco pro is not active.
		$subtotal = 0;

		foreach ( $cart->get_cart() as $item ) {
			$subtotal += Settings::get_price_from_meta( $item['product_id'] ) * $item['quantity'];
		}

		return $subtotal;
	}

	/**
	 * Get free quantity.
	 *
	 * @param array $rule Campaign Rule.
	 * @param array $item Cart Item.
	 * @return float
	 */
	public static function get_free_quantity( array $rule, array $item ) {
		$cart_qty = $item['quantity'];

		if ( $rule['recursive'] === 'no' && $rule['min'] > 0 ) {
			return $rule['get_quantity'];
		}

		return floor( $cart_qty / $rule['min'] ) * $rule['get_quantity'];
	}

	/**
	 * Get Product Price.
	 *
     * @param \WC_Product $product Product.
	 * @return float Product Price.
	 */
	public static function get_product_price( \WC_Product $product ): float {
		// Get price from product if disco pro is active.
		if ( Disco::is_pro() ) {
			$product = wc_get_product( $product->get_id() );

			// @phpstan-ignore-next-line
			return Settings::get_price( $product );
		}

		// Get price from meta if disco pro is not active.
		return Settings::get_price_from_meta( $product->get_id() );
	}

	/**
	 * Get cart items ids
	 *
	 * @return array Cart Items IDs.
	 */
	public static function get_cart_items_ids(): array {
		$cart           = WC()->cart;
		$cart_items_ids = array();

		foreach ( $cart->get_cart() as $item ) {
			$cart_items_ids[] = $item['product_id'];
		}

		return $cart_items_ids;
	}

}
