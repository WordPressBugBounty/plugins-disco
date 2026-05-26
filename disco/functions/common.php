<?php // phpcs:disable
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

use Disco\App\Disco;

if ( ! function_exists( 'disco_update_cart_price_by_campaigns' ) ) {

	/**
     * Run the Cart Intent campaigns before cart.
     *
     * @param \WC_Cart $cart Cart Object.
     * @return \WC_Cart
     * @throws \Exception If the campaign is not found.
     */
	function disco_add_cart_discount( $cart ) {
		return ( new Disco )->get_cart_discount( $cart );
	}

	add_action( 'woocommerce_cart_calculate_fees', 'disco_add_cart_discount', 1, 1 );
}

// Set Cart Items discounts.
if ( ! function_exists( 'disco_set_cart_item_price' ) ) {

	/**
	 * Set Cart Items discounts.
	 *
	 * @param \WC_Cart $cart Cart Object.
	 */
	function disco_set_cart_item_price( $cart ) {
		// echo "<pre>";
		// print_r( ( new Disco )->get_cart_items_discount($cart) );
		// echo "</pre>";
		// die();

		// return ( new Disco )->get_cart_items_discount();
	}

// add_action( 'woocommerce_before_calculate_totals', 'disco_set_cart_item_price',1,1 );
}

if ( ! function_exists( 'disco_run_after_cart' ) ) {

	/**
	 * Display Cart Item Sale Price & Regular Price.
	 *
	 * @param string $price Cart Item Price.
	 * @param array  $cart_item Cart Item.
	 * @return string
	 */
	function disco_display_regular_and_sale_price_in_cart_item( $price, $cart_item ) {
		$product_id    = $cart_item['product_id'];
		$product       = wc_get_product( $product_id );
		$regular_price = $product->get_price();
		$sale_price    = $cart_item['data']->get_price();

		if ( isset( $cart_item['free'] ) && 'yes' === $cart_item['free'] ) {
			$cart_item['data']->set_price( 0 );

			return 0;
		}

		$offers = $cart_item['data']->get_meta( '_item_offers' );

		if ( $sale_price && $sale_price < $regular_price ) {
			$price = '<del>' . wc_price( $regular_price ) . '</del> <ins>' . wc_price( $sale_price ) . '</ins>';
		}

		if ( ! empty( $offers ) && isset( $offers['key'] ) ) {
			$key      = $offers['key'];
			$bogo_qty = $offers['bogo_qty'][ $key ];

			if ( ! empty( $bogo_qty ) ) {
				$price = $bogo_qty;
			}
		}

		return $price;
	}

// add_filter( 'woocommerce_cart_item_price', 'disco_display_regular_and_sale_price_in_cart_item', 10, 2 );
}

if ( ! function_exists( 'disco_display_subtotal_regular_and_sale_price_in_cart_item' ) ) {

	/**
	 * Display Cart Item Subtotal Sale Price & Regular Price.
	 *
	 * @param string $subtotal Cart Item Subtotal.
	 * @param array  $cart_item Cart Item.
	 * @return string
	 */
	function disco_display_subtotal_regular_and_sale_price_in_cart_item( $subtotal, $cart_item ) {
		$product_id    = $cart_item['product_id'];
		$quantity      = $cart_item['quantity'];
		$product       = wc_get_product( $product_id );
		$regular_price = $product->get_price() * $quantity;
		$sale_price    = $cart_item['data']->get_price() * $quantity;

		if ( $sale_price && $sale_price < $regular_price ) {
			$subtotal = '<del>' . wc_price( $regular_price ) . '</del> <ins>' . wc_price( $sale_price ) . '</ins>';
		}

		return $subtotal;
	}

// add_filter( 'woocommerce_cart_item_subtotal', 'disco_display_subtotal_regular_and_sale_price_in_cart_item', 10, 2 );
}

if ( ! function_exists( 'disco_cart_item_quantity_notice' ) ) {

	/**
	 * Display Cart Item Quantity Badge.
	 *
	 * @param string $quantity_html Cart Item Quantity HTML.
	 * @param array  $cart_item Cart Item.
	 * @return string
	 */
	function disco_cart_item_quantity_notice( $quantity_html, $cart_item ) {//phpcs:ignore
		// Wrap the quantity in a badge-images element
		$item   = WC()->cart->get_cart()[ $cart_item ];
		$offers = $item['data']->get_meta( '_item_offers' );

		if ( ! empty( $offers['price'] ) ) {
			$message        = sprintf( 'Add % s get % s off', $offers['quantity'], wc_price( $offers['price'] ) );
			$quantity_html .= sprintf( '<span title="Add 3 get 1 Free" class="quantity-badge-images">%s</span>', $message );
		}

		return $quantity_html;
	}

// add_filter( 'woocommerce_cart_item_quantity', 'disco_cart_item_quantity_notice', 10, 2 );
	// To apply this action, uncomment the above line.
}

if ( ! function_exists( 'disco_add_button_to_cart_item_name' ) ) {

	/**
	 * Add a button to the cart item name.
	 *
	 * @param string $product_name Product Name.
	 * @return string
	 */
	function disco_add_button_to_cart_item_name( $product_name ) {
		$button = ( new Disco )->get_offers(); // Replace '// ' with your desired link.

		return $product_name . '<br/>' . $button; // This will add the button after the product name.
	}

// add_filter( 'woocommerce_cart_item_name', 'disco_add_button_to_cart_item_name', 10, 1 );
	// To apply this filter, uncomment the above line.
}
