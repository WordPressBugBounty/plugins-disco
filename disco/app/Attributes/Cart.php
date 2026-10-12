<?php
/**
 * Product Attributes
 *
 * @package    Disco
 * @subpackage \App\Attributes
 */

namespace Disco\App\Attributes;

use Disco\App\Utility\Settings;

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
		return apply_filters( 'disco_convert_price', $this->resolve_subtotal( false ) );
	}

	/**
	 * Cart subtotal with tax.
	 *
	 * @return float
	 */
	public function cart_subtotal_with_tax() {
		return apply_filters( 'disco_convert_price', $this->resolve_subtotal( true ) );
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

	/**
	 * Cart subtotal, whether or not WooCommerce has totalled the cart yet.
	 *
	 * WC_Cart::calculate_totals() calls reset_totals() before it fires
	 * woocommerce_before_calculate_totals, so every total reads 0 for the whole
	 * of that hook. The discount engine runs there, which meant a condition on
	 * the cart subtotal was always compared against 0: a BOGO campaign gated on
	 * "subtotal is at least 100" never qualified and its free item was never
	 * added, on a cart of any size.
	 *
	 * When the totals are not available the subtotal is summed from the cart
	 * contents instead.
	 *
	 * @param bool $with_tax Whether to include tax.
	 */
	private function resolve_subtotal( bool $with_tax ): float {
		$cart = WC()->cart;

		if ( ! $cart instanceof \WC_Cart ) {
			return 0.0;
		}

		if ( $with_tax ) {
			// @phpstan-ignore-next-line
			$subtotal = (float) $cart->subtotal;
		} else {
			$subtotal = (float) $cart->get_subtotal();
		}

		if ( $subtotal > 0.0 || $cart->is_empty() ) {
			return $subtotal;
		}

		return $this->subtotal_from_contents( $cart, $with_tax );
	}

	/**
	 * Sum the cart lines without relying on WooCommerce's totals.
	 *
	 * @param \WC_Cart $cart     Cart to sum.
	 * @param bool     $with_tax Whether to include tax.
	 */
	private function subtotal_from_contents( \WC_Cart $cart, bool $with_tax ): float {
		$subtotal = 0.0;

		foreach ( $cart->get_cart() as $item ) {
			$subtotal += $this->line_subtotal( $item, $with_tax );
		}

		return $subtotal;
	}

	/**
	 * What one cart line contributes to the subtotal.
	 *
	 * The price comes from the product's own meta rather than get_price(), for
	 * the same reason CalcFactory::get_cart_subtotal() does it: get_price() runs
	 * through the discount filter, so a condition would end up gated on the
	 * discount it is deciding.
	 *
	 * Free BOGO lines contribute nothing. They are priced at zero once the
	 * engine has finished, but at this point in the pass they may still carry
	 * their original price and would inflate the figure a condition is tested
	 * against.
	 *
	 * @param array $item     Cart item.
	 * @param bool  $with_tax Whether to include tax.
	 */
	private function line_subtotal( array $item, bool $with_tax ): float {
		if ( ! empty( $item['is_free_product'] ) ) {
			return 0.0;
		}

		if ( empty( $item['data'] ) || ! $item['data'] instanceof \WC_Product ) {
			return 0.0;
		}

		$quantity = (int) ( $item['quantity'] ?? 0 );

		if ( $quantity < 1 ) {
			return 0.0;
		}

		$product_id = (int) $item['product_id'];

		if ( ! empty( $item['variation_id'] ) ) {
			$product_id = (int) $item['variation_id'];
		}

		$price = Settings::get_price_from_meta( $product_id );

		if ( ! $with_tax ) {
			return $price * $quantity;
		}

		$args = array(
			'qty'   => $quantity,
			'price' => $price,
		);

		return (float) wc_get_price_including_tax( $item['data'], $args );
	}

}
