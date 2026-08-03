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
use Disco\App\Intents\CategoryBogo\CategoryBogo;
use Disco\App\Intents\CategoryBogo\CategoryBogoCart;
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
			/**
			 * Category BOGO owns its own free-item lifecycle: buy reservation,
			 * entitlement, reward selection and paid/free reconciliation all live
			 * in CategoryBogo. When such a campaign is active it fully manages
			 * every cart line of its reward categories.
			 */
			$category_bogo   = new CategoryBogo();
			$category_active = $category_bogo->apply_free_items_to_cart( $cart );

			/**
			 * Nothing but category campaigns are active, so every free item in the
			 * cart is already reconciled. Skipping the pass below avoids recomputing
			 * a discount set that would only be discarded.
			 */
			if ( $category_active && ! $category_bogo->has_non_category_free_bogo_campaigns() ) {
				return;
			}

			// Calculate discounts - free products are automatically excluded in IntentHelper
			$disco     = new Disco();
			$discounts = $disco->get_cart_items_discount_for_bogo( $cart );
			$discounts = is_array( $discounts ) ? $discounts : array();

			$free_ids       = $discounts['get_ids'] ?? array();
			$free_qty       = $discounts['get_qty'] ?? 0;
			$free_qty_map   = $discounts['get_qty_map'] ?? array();
			$bogo_type      = $discounts['bogo_type'] ?? 'products';
			$free_selection = $discounts['free_item_selection'] ?? 'cart_order';

			// The category engine already applied the category rules.
			if ( $category_active && 'categories' === $bogo_type ) {
				return;
			}

			// Only process if we have valid discount data
			if ( ! empty( $free_qty ) && ! empty( $free_ids ) ) {
				// Remove invalid free items from cart
				disco_remove_invalid_free_items( $cart, $free_ids, $bogo_type );

				// Add or update free items
				if ( $bogo_type === 'categories' ) {
					disco_apply_category_based_free_items( $cart, $free_ids, $free_qty, $free_selection );
				} else {
					disco_apply_product_based_free_items( $cart, $free_ids, $free_qty_map, $free_qty );
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
			// Lines owned by the category engine are managed there.
			if ( ! empty( $cart_item[ CategoryBogoCart::FREE_ITEM_FLAG ] ) ) {
				continue;
			}

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
			if ( empty( $cart_item['is_free_product'] ) || ! empty( $cart_item[ CategoryBogoCart::FREE_ITEM_FLAG ] ) ) {
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
	 * @param \WC_Cart $cart           Cart Object.
	 * @param array    $free_ids       Category IDs for free products.
	 * @param int      $free_qty       Quantity of free items allowed.
	 * @param string   $free_selection Which category item to reward: cart_order | lowest | highest.
	 */
	function disco_apply_category_based_free_items( $cart, $free_ids, $free_qty, $free_selection = 'cart_order' ) {
		$free_qty = max( 0, (int) $free_qty );

		// Rank category members by the selection strategy, then flag whole lines
		// free IN PLACE (the bought units become free) up to $free_qty. Only the
		// is_free_product flag is toggled — cart quantities are never mutated here
		// (that fires nested recalculations during calculate_totals and corrupts
		// the cart). The reward count treats a product's paid + free quantity as
		// its buy quantity, so flagging a line free never drops it from the count.
		$ordered = disco_order_free_candidates( $cart, $free_ids, $free_selection );

		// Choose whole lines that fit within the free quantity.
		$target = array();
		$count  = 0;

		foreach ( $ordered as $cart_item_key ) {
			if ( $count >= $free_qty ) {
				break;
			}

			$qty = (int) $cart->cart_contents[ $cart_item_key ]['quantity'];

			if ( $qty <= ( $free_qty - $count ) ) {
				$target[ $cart_item_key ] = true;
				$count                   += $qty;
			}
		}

		// Reconcile: flag targets free, clear the flag on any other category line.
		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( ! Helper::is_in_category( $cart_item['product_id'], $free_ids ) ) {
				continue;
			}

			$should_be_free = isset( $target[ $cart_item_key ] );
			$currently_free = ! empty( $cart_item['is_free_product'] );

			if ( $should_be_free && ! $currently_free ) {
				$cart->cart_contents[ $cart_item_key ]['is_free_product'] = true;
			} elseif ( ! $should_be_free && $currently_free ) {
				unset( $cart->cart_contents[ $cart_item_key ]['is_free_product'] );
			}
		}
	}
}

if ( ! function_exists( 'disco_order_free_candidates' ) ) {
	/**
	 * Return the reward-category cart keys ordered by the selection strategy.
	 *
	 * Includes every in-category cart item (even ones currently flagged free, so
	 * the reward can be re-picked). `cart_order` keeps cart order; `lowest` /
	 * `highest` sort by price (via CalcFactory::get_price, so a previously-freed
	 * item still ranks by its real price). Ties keep cart order (stable on PHP 8+).
	 *
	 * @param \WC_Cart $cart           Cart Object.
	 * @param array    $free_ids       Category IDs for free products.
	 * @param string   $free_selection cart_order | lowest | highest.
	 * @return array List of cart item keys.
	 */
	function disco_order_free_candidates( $cart, $free_ids, $free_selection ) {
		$candidates = array();

		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( ! Helper::is_in_category( $cart_item['product_id'], $free_ids ) ) {
				continue;
			}

			$candidates[ $cart_item_key ] = (float) \Disco\App\Calc\CalcFactory::get_price( $cart_item );
		}

		if ( 'lowest' === $free_selection ) {
			asort( $candidates );
		} elseif ( 'highest' === $free_selection ) {
			arsort( $candidates );
		}

		return array_keys( $candidates );
	}
}

if ( ! function_exists( 'disco_apply_product_based_free_items' ) ) {
	/**
	 * Apply free items based on product rules.
	 *
	 * Every product id in $free_ids gets its own free line, so multi-product
	 * BOGO (e.g. BuyXGetX across several cart products) rewards them all — not
	 * just the last one. The free quantity is per id via $qty_map, falling back
	 * to $fallback_qty.
	 *
	 * @param \WC_Cart      $cart         Cart Object.
	 * @param array         $free_ids     Product IDs for free products.
	 * @param array|int     $qty_map      Map of product id => free quantity (or a plain int for all).
	 * @param int           $fallback_qty Quantity to use when a id is absent from the map.
	 */
	function disco_apply_product_based_free_items( $cart, $free_ids, $qty_map, $fallback_qty = 1 ) {
		// Allow a plain integer for backward compatibility.
		if ( ! is_array( $qty_map ) ) {
			$fallback_qty = (int) $qty_map;
			$qty_map      = array();
		}

		foreach ( $free_ids as $product_id ) {
			$free_qty = isset( $qty_map[ (int) $product_id ] ) ? (int) $qty_map[ (int) $product_id ] : (int) $fallback_qty;

			if ( $free_qty <= 0 ) {
				continue;
			}

			$found = false;

			foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
				if (
					intval( $cart_item['product_id'] ) === intval( $product_id )
					&& ! empty( $cart_item['is_free_product'] )
				) {
					$current_qty = $cart_item['quantity'];
					if ( (int) $current_qty !== $free_qty ) {
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

		// Drop last pass's ratios: every partly-free line re-registers below.
		disco_category_bogo_paid_ratio_registry( false );

		foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
			if ( ! empty( $cart_item['is_free_product'] ) ) {
				$cart_item['data']->set_price( 0 );
				$cart_item['data']->set_regular_price( 0 );
				$cart->cart_contents[ $cart_item_key ]['free_product_note'] = __( 'This item is added as free!', 'disco' );

				continue;
			}

			disco_apply_category_bogo_partial_free_price( $cart, $cart_item_key, $cart_item );
		}
	}
	add_action( 'woocommerce_before_calculate_totals', 'disco_set_free_product_price', 10 );
}

if ( ! function_exists( 'disco_apply_category_bogo_partial_free_price' ) ) {
	/**
	 * Charge only the paid units of a line that is partly free.
	 *
	 * Category BOGO never adds or removes cart lines, so a line the customer
	 * added can hold both free and paid units. The line keeps its quantity and
	 * its per-unit price is scaled down so the line total covers the paid units
	 * only: qty 3 with 1 free at 20 is charged 40.
	 *
	 * The scale factor is registered against this line's own product object and
	 * applied by {@see disco_apply_category_bogo_paid_ratio} on top of whatever price
	 * Disco's product filters resolve, so it never fights those filters and never
	 * compounds across recalculations.
	 *
	 * @param \WC_Cart $cart          Cart Object.
	 * @param string   $cart_item_key Cart item key.
	 * @param array    $cart_item     Cart item.
	 */
	function disco_apply_category_bogo_partial_free_price( $cart, $cart_item_key, $cart_item ) {
		$free_qty = isset( $cart_item[ CategoryBogoCart::FREE_QUANTITY_META ] )
			? (int) $cart_item[ CategoryBogoCart::FREE_QUANTITY_META ]
			: 0;
		$line_qty = (int) $cart_item['quantity'];

		if ( $free_qty <= 0 || $line_qty <= 0 || $free_qty >= $line_qty ) {
			return;
		}

		if ( empty( $cart_item['data'] ) || ! $cart_item['data'] instanceof WC_Product ) {
			return;
		}

		$paid_qty = $line_qty - $free_qty;

		disco_category_bogo_paid_ratio_registry( $cart_item['data'], $paid_qty / $line_qty );

		$cart->cart_contents[ $cart_item_key ]['free_product_note'] = sprintf(
			/* translators: %d: number of units given for free. */
			_n( '%d item is added as free!', '%d items are added as free!', $free_qty, 'disco' ),
			$free_qty
		);
	}
}

if ( ! function_exists( 'disco_category_bogo_paid_ratio_registry' ) ) {
	/**
	 * Registry of paid-unit ratios, keyed by cart line product object.
	 *
	 * Each cart line owns its own product instance, so the object identity is
	 * what distinguishes "this line of 3 with 1 free" from another line of the
	 * same product. Called with a product to register a ratio, with no arguments
	 * to read the registry, and with null to reset it before a fresh pass.
	 *
	 * @param \WC_Product|null $product Line product object to register.
	 * @param float            $ratio   Paid units / line quantity.
	 * @return array Registered ratios keyed by object id.
	 */
	function disco_category_bogo_paid_ratio_registry( $product = null, $ratio = 1.0 ) {
		static $ratios = array();

		if ( $product instanceof WC_Product ) {
			$ratios[ spl_object_id( $product ) ] = (float) $ratio;
		} elseif ( false === $product ) {
			$ratios = array();
		}

		return $ratios;
	}
}

if ( ! function_exists( 'disco_apply_category_bogo_paid_ratio' ) ) {
	/**
	 * Scale a partly-free cart line's price down to its paid units.
	 *
	 * Runs after Disco's own product price filters (priority 999), so the free
	 * units are removed from whatever price the other campaigns resolved.
	 *
	 * @param float|string $price   Product price.
	 * @param \WC_Product  $product Product object.
	 * @return float|string
	 */
	function disco_apply_category_bogo_paid_ratio( $price, $product ) {
		if ( ! is_numeric( $price ) || ! is_object( $product ) ) {
			return $price;
		}

		$ratios    = disco_category_bogo_paid_ratio_registry();
		$object_id = spl_object_id( $product );

		if ( ! isset( $ratios[ $object_id ] ) ) {
			return $price;
		}

		return (float) $price * $ratios[ $object_id ];
	}

	add_filter( 'woocommerce_product_get_price', 'disco_apply_category_bogo_paid_ratio', 1000, 2 );
	add_filter( 'woocommerce_product_variation_get_price', 'disco_apply_category_bogo_paid_ratio', 1000, 2 );
}

if ( ! function_exists( 'disco_free_product_label' ) ) {
	/**
	 * Display free product label in cart.
	 *
	 * The note is wrapped in `.disco-free-item-note` so it stands out from the
	 * other item meta rows, which are plain grey text. WooCommerce renders item
	 * data through `wp_kses_post()`, so the span survives; the note itself is
	 * escaped here because it is interpolated into markup.
	 *
	 * @param array $item_data Item data.
	 * @param array $cart_item Cart item.
	 * @return array
	 */
	function disco_free_product_label( $item_data, $cart_item ) {
		if ( ! empty( $cart_item['free_product_note'] ) ) {
			$item_data[] = array(
				'key'   => __( 'Note', 'disco' ),
				'value' => sprintf(
					'<span class="disco-free-item-note">%s</span>',
					esc_html( $cart_item['free_product_note'] )
				),
			);
		}
		return $item_data;
	}

	add_filter( 'woocommerce_get_item_data', 'disco_free_product_label', 10, 2 );
}
