<?php
/**
 * Product Attributes
 *
 * @package    Disco
 * @subpackage \App\Attributes
 */

namespace Disco\App\Attributes;

/**
 * Class Product
 *
 * This class provides methods for retrieving various attributes of a WooCommerce product.
 *
 * @package    Disco
 * @subpackage \App\Attributes
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Attributes
 */
class Cart {

	/**
	 * Count Total Items in Cart.
	 *
	 * @return int
	 */
	public function cart_items_count() {
		// Get all items from the cart
		$cart_items = WC()->cart->get_cart();

		// Create an array to store unique product IDs or variation IDs
		$unique_ids = array();

		// Loop through each item in the cart
		if ( empty( $cart_items ) ) {
			return 0;
		}

		foreach ( $cart_items as $cart_item ) {
			// Use variation ID if available, otherwise use product ID
			$id = $cart_item['variation_id'] ?: $cart_item['product_id'];//phpcs:ignore

			// Add the ID to the array if it's not already there
			if ( in_array( $id, $unique_ids, true ) ) {
                continue;
            }

            $unique_ids[] = $id;
		}

		// Return the count of unique product or variation IDs
		return count( $unique_ids );
	}

	/**
	 * Total Items Quantity in Cart.
	 *
	 * @return int
	 */
	public function cart_items_quantity() {
		if ( is_array( WC()->cart->get_cart_item_quantities() ) ) {
			return array_sum( WC()->cart->get_cart_item_quantities() );
		}

		return 0;
	}

	/**
	 * Total Items Weight in Cart.
	 *
	 * @return float
	 */
	public function cart_total_weight() {
		return WC()->cart->get_cart_contents_weight();
	}

	/**
	 * Cart Subtotal.
	 *
	 * @return float
	 */
	public function cart_subtotal() {
		// @phpstan-ignore-next-line
		return apply_filters( 'disco_convert_price', (float) WC()->cart->get_subtotal() );
	}

	/**
	 * Cart subtotal with tax.
	 *
	 * @return float
	 */
	public function cart_subtotal_with_tax() {
		// @phpstan-ignore-next-line
		return apply_filters( 'disco_convert_price', (float) WC()->cart->subtotal );
	}

	/**
	 * Chosen Payment Method in Checkout.
	 */
	public function cart_payment_method(): string {
		$payment_method = WC()->session->get( 'chosen_payment_method' );

		if ( is_array( $payment_method ) ) {
			return implode( ',', $payment_method );
		}

		if ( is_string( $payment_method ) ) {
			return $payment_method;
		}

		// fallback when null or unexpected type
		return '';
	}

	/**
	 * Cart Coupons.
	 *
	 * @return array
	 */
	public function cart_coupons() {
		$coupons = WC()->cart->get_coupons();

		if ( !empty( $coupons ) ) {
			return array_keys( $coupons );
		}

		return array();
	}

	/**
	 * Products in Cart.
	 *
	 * @return array Product IDs.
	 */
	public function products_in_cart() {
		$cart_items = WC()->cart->get_cart();
		$products   = array();

		foreach ( $cart_items as $cart_item ) {
			if ( ! empty( $cart_item['variation_id'] ) ) {
				$product_id = $cart_item['variation_id'];
			} else {
				$product_id = $cart_item['product_id'];
			}

			$products[] = $product_id;
		}

		return $products;
	}

}
