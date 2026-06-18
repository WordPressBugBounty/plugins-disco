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

use Disco\App\Disco;
use Disco\App\Utility\Helper;

if ( ! function_exists( 'disco_cart_apply_free_items' ) ) {
	/**
	 * Apply free items to the cart based on BOGO rules.
	 *
	 * @param \WC_Cart $cart Cart Object.
	 */
	function disco_cart_apply_free_items( $cart ) {
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
			return;
		}

		// Prevent multiple executions during the same request
		static $is_processing = false;
		if ( $is_processing ) {
			return;
		}

		if ( $cart->is_empty() ) {
			return;
		}

		$is_processing = true;

		try {
			// Calculate discounts - free products are automatically excluded in IntentHelper
			$disco     = new Disco();
			$discounts = $disco->get_cart_items_discount_for_bogo( $cart );
			$discounts = is_array( $discounts ) ? $discounts : array();

			$free_ids  = $discounts['get_ids'] ?? array();
			$free_qty  = $discounts['get_qty'] ?? 0;
			$bogo_type = $discounts['bogo_type'] ?? 'products';

			// Only process if we have valid discount data
			if ( ! empty( $free_qty ) && ! empty( $free_ids ) ) {
				// Remove invalid free items from cart
				disco_remove_invalid_free_items( $cart, $free_ids, $bogo_type );

				// Add or update free items
				if ( $bogo_type === 'categories' ) {
					disco_apply_category_based_free_items( $cart, $free_ids, $free_qty );
				} else {
					disco_apply_product_based_free_items( $cart, $free_ids, $free_qty );
				}
			} else {
				// No valid BOGO, remove all free items
				disco_remove_all_free_items( $cart );
			}
		} finally {
			$is_processing = false;
		}
	}

	add_action( 'woocommerce_before_calculate_totals', 'disco_cart_apply_free_items', 5 );
}

if ( ! function_exists( 'disco_remove_all_free_items' ) ) {
	/**
	 * Remove all free items from cart when BOGO criteria are no longer met.
	 *
	 * @param \WC_Cart $cart Cart Object.
	 */
	function disco_remove_all_free_items( $cart ) {
		$items_to_remove = array();

		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( ! empty( $cart_item['is_free_product'] ) ) {
				$items_to_remove[] = $cart_item_key;
			}
		}

		foreach ( $items_to_remove as $cart_item_key ) {
			$cart->remove_cart_item( $cart_item_key );
		}
	}
}

if ( ! function_exists( 'disco_remove_invalid_free_items' ) ) {
	/**
	 * Remove free items that are no longer valid.
	 *
	 * @param \WC_Cart $cart      Cart Object.
	 * @param array    $free_ids  Valid free product/category IDs.
	 * @param string   $bogo_type Type of BOGO (products/categories).
	 */
	function disco_remove_invalid_free_items( $cart, $free_ids, $bogo_type ) {
		$items_to_remove = array();

		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( empty( $cart_item['is_free_product'] ) ) {
				continue;
			}

			$product_id = $cart_item['product_id'];
			$should_remove = false;

			if ( empty( $free_ids ) ) {
				// No valid free items, remove all free products
				$should_remove = true;
			} elseif ( $bogo_type === 'categories' ) {
				// Check if product is in valid categories
				$should_remove = ! Helper::is_in_category( $product_id, $free_ids );
			} else {
				// Check if product ID is in valid list
				$should_remove = ! in_array( $product_id, $free_ids, true );
			}

			if ( $should_remove ) {
				$items_to_remove[] = $cart_item_key;
			}
		}

		// Remove items after iteration to avoid modifying array during loop
		foreach ( $items_to_remove as $cart_item_key ) {
			$cart->remove_cart_item( $cart_item_key );
		}
	}
}

if ( ! function_exists( 'disco_apply_category_based_free_items' ) ) {
	/**
	 * Apply free items based on category rules.
	 *
	 * @param \WC_Cart $cart     Cart Object.
	 * @param array    $free_ids Category IDs for free products.
	 * @param int      $free_qty Quantity of free items allowed.
	 */
	function disco_apply_category_based_free_items( $cart, $free_ids, $free_qty ) {
		// First, enforce quantity limits on existing free items and count them
		$existing_free_count = 0;

		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( ! empty( $cart_item['is_free_product'] ) ) {
				$product_id = $cart_item['product_id'];

				if ( Helper::is_in_category( $product_id, $free_ids ) ) {
					$item_qty = $cart_item['quantity'];

					// Check if this item's quantity exceeds remaining allowed free qty
					$remaining_allowed = $free_qty - $existing_free_count;

					if ( $item_qty > $remaining_allowed && $remaining_allowed > 0 ) {
						// Reduce quantity to allowed amount
						$cart->set_quantity( $cart_item_key, $remaining_allowed );
						$existing_free_count += $remaining_allowed;
					} elseif ( $remaining_allowed <= 0 ) {
						// No more free items allowed, remove free flag or remove item
						$cart->remove_cart_item( $cart_item_key );
					} else {
						$existing_free_count += $item_qty;
					}
				}
			}
		}

		// Calculate how many more items we can mark as free
		$remaining_free_qty = $free_qty - $existing_free_count;

		if ( $remaining_free_qty <= 0 ) {
			return; // Already have enough free items
		}

		$free_count = 0;

		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( $free_count >= $remaining_free_qty ) {
				break;
			}

			// Skip items already marked as free
			if ( ! empty( $cart_item['is_free_product'] ) ) {
				continue;
			}

			$product_id = $cart_item['product_id'];

			if ( Helper::is_in_category( $product_id, $free_ids ) ) {
				$qty_to_mark = $remaining_free_qty - $free_count;

				// Only mark item free if the full quantity fits
				if ( $cart_item['quantity'] <= $qty_to_mark ) {
					$cart->cart_contents[ $cart_item_key ]['is_free_product'] = true;
					$free_count += $cart_item['quantity'];
				}
			}
		}
	}
}

if ( ! function_exists( 'disco_apply_product_based_free_items' ) ) {
	/**
	 * Apply free items based on product rules.
	 *
	 * @param \WC_Cart $cart     Cart Object.
	 * @param array    $free_ids Product IDs for free products.
	 * @param int      $free_qty Quantity of free items.
	 */
	function disco_apply_product_based_free_items( $cart, $free_ids, $free_qty ) {
		foreach ( $free_ids as $product_id ) {
			$found = false;

			foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
				if (
					intval( $cart_item['product_id'] ) === intval( $product_id )
					&& ! empty( $cart_item['is_free_product'] )
				) {
					$current_qty = $cart_item['quantity'];
					if ( $current_qty !== $free_qty ) {
						$cart->set_quantity( $cart_item_key, $free_qty );
					}
					$found = true;
					break;
				}
			}

			if ( ! $found ) {
				$cart->add_to_cart( $product_id, $free_qty, 0, array(), array( 'is_free_product' => true ) );
			}
		}
	}
}

if ( ! function_exists( 'disco_set_free_product_price' ) ) {
	/**
	 * Set the price of free products to zero.
	 *
	 * @param \WC_Cart $cart Cart Object.
	 */
	function disco_set_free_product_price( $cart ) {
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
			return;
		}

		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( empty( $cart_item['is_free_product'] ) ) {
				continue;
			}

			$cart_item['data']->set_price( 0 );
			$cart_item['data']->set_regular_price( 0 );
			$cart->cart_contents[ $cart_item_key ]['free_product_note'] = __( 'This item is added as free!', 'disco' );
		}
	}
	add_action( 'woocommerce_before_calculate_totals', 'disco_set_free_product_price', 10 );
}

if ( ! function_exists( 'disco_free_product_label' ) ) {
	/**
	 * Display free product label in cart.
	 *
	 * @param array $item_data Item data.
	 * @param array $cart_item Cart item.
	 * @return array
	 */
	function disco_free_product_label( $item_data, $cart_item ) {
		if ( ! empty( $cart_item['free_product_note'] ) ) {
			$item_data[] = array(
				'key'   => __( 'Note', 'disco' ),
				'value' => $cart_item['free_product_note'],
			);
		}
		return $item_data;
	}

	add_filter( 'woocommerce_get_item_data', 'disco_free_product_label', 10, 2 );
}
