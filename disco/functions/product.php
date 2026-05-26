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
use Disco\App\Utility\Settings;

if ( !function_exists( 'disco_get_discounted_price' ) ) {

	/**
	 * Get the discounted price of a product.
	 *
	 * @param float       $price Product Price.
	 * @param \WC_Product $product Product Object.
	 * @return float
	 */
	function disco_get_discounted_price( $price, $product ) {
		if ( is_admin() && ! defined( 'DOING_AJAX' ) ) {
			return $price; // Return original price in admin area.
		}

		return ( new Disco )->get_product_discounted_price( $price, $product );
	}

}

if ( ! function_exists( 'disco_init_price_cache' ) ) {

	/**
	 * Initialize the global price cache.
	 *
	 * @return void
	 */
	function disco_init_price_cache() {
		global $disco_price_cache;

		if ( ! isset( $disco_price_cache ) ) {
			$disco_price_cache = [];
		}
	}

	// Initialize cache on load
	disco_init_price_cache();
}

if ( ! function_exists( 'disco_should_cache_price' ) ) {

	/**
	 * Check if current page should use price cache.
	 * Don't cache on checkout/cart/thankyou where user limits may change.
	 *
	 * @return bool
	 */
	function disco_should_cache_price() {
		// Allow filter to force disable cache (useful for tests)
		if ( apply_filters( 'disco_disable_price_cache', false ) ) {
			return false;
		}

		// Don't cache during AJAX (cart updates, checkout, etc.)
		if ( wp_doing_ajax() ) {
			return false;
		}

		// Don't cache on checkout or cart pages
		if ( function_exists( 'is_checkout' ) && is_checkout() ) {
			return false;
		}

		if ( function_exists( 'is_cart' ) && is_cart() ) {
			return false;
		}

		// Cache on shop, category, product pages
		return true;
	}
}

if ( ! function_exists( 'disco_clear_price_cache' ) ) {

	/**
	 * Clear the discounted price cache.
	 *
	 * @return void
	 */
	function disco_clear_price_cache() {
		global $disco_price_cache;
		$disco_price_cache = [];
	}
}

if ( ! function_exists( 'disco_discounted_price' ) ) {

	/**
	 * Applies discounted price logic to product prices (simple + variation).
	 *
	 * @param float       $price Product Price.
	 * @param \WC_Product $product Product Object.
	 * @return float
	 */
	function disco_discounted_price( $price, $product ) {
		global $disco_price_cache;
		static $running = false;

		if ( $running || ! is_object( $product ) || ! $price ) {
			return $price;
		}

		$product_id = $product->get_id();

		// Allow external code to exclude a product from Disco discounts.
		if ( apply_filters( 'disco_exclude_product_from_discount', false, $product_id, $product ) ) {
			return $price;
		}

		$cache_key  = $product_id . '_' . $price;

		// Use cache only on safe pages (shop, category, product)
		if ( disco_should_cache_price() && isset( $disco_price_cache[ $cache_key ] ) ) {
			return $disco_price_cache[ $cache_key ];
		}

		$running = true;

		// Remove other filters that might interfere (safety for sale override).
		remove_filter( 'woocommerce_product_get_sale_price', '__return_false' );
		remove_filter( 'woocommerce_product_get_price', '__return_false' );

		$discounted_price = disco_get_discounted_price( $price, $product );

		// Respect WooCommerce native sale price if it's lower
		if ( $product->get_type() !== 'variable' ) {
			$sale_price = $product->get_sale_price();

			if ( $sale_price && $sale_price < $discounted_price ) {
				$discounted_price = $sale_price;
			}
		}

		$running = false;

		$result = round( $discounted_price, wc_get_price_decimals() );

		// Cache result on safe pages
		if ( disco_should_cache_price() ) {
			$disco_price_cache[ $cache_key ] = $result;
		}

		return $result;
	}

	// Apply to simple and variation product prices (priority 999 for better compatibility)
	add_filter( 'woocommerce_product_get_price', 'disco_discounted_price', 999, 2 );
	add_filter( 'woocommerce_product_get_sale_price', 'disco_discounted_price', 999, 2 );
	add_filter( 'woocommerce_product_variation_get_price', 'disco_discounted_price', 999, 2 );
	add_filter( 'woocommerce_product_variation_get_sale_price', 'disco_discounted_price', 999, 2 );
}

if ( ! function_exists( 'disco_variable_product_discounted_price_html' ) ) {

	/**
	 * Show variable price range with discount — includes tax if tax is enabled.
	 *
	 * @param string      $price_html Price HTML.
	 * @param \WC_Product $product Product Object.
	 * @return string
	 */
	function disco_variable_product_discounted_price_html( $price_html, $product ) {
		if ( ! $product instanceof WC_Product_Variable ) {
			return $price_html;
		}

		$variation_ids     = $product->get_children();
		$regular_prices    = array();
		$discounted_prices = array();

		// Use cached tax settings to avoid repeated get_option() calls
		$tax = Settings::get_tax_settings();

		foreach ( $variation_ids as $variation_id ) {
			$variation = wc_get_product( $variation_id );

			if ( ! $variation || ! $variation->is_purchasable() ) {
				continue;
			}

			if ( $tax['enabled'] && $tax['include_tax'] ) {
				$regular_price = wc_get_price_including_tax( $variation, [ 'price' => $variation->get_regular_price() ] );
				$sale_price    = wc_get_price_including_tax( $variation, [ 'price' => $variation->get_price() ] );
			} else {
				$regular_price = (float) $variation->get_regular_price();
				$sale_price    = (float) $variation->get_price();
			}

			if ( $regular_price <= 0 ) {
				continue;
			}

			$regular_prices[]     = $regular_price;
			$discounted_prices[]  = $sale_price;
		}

		if ( empty( $regular_prices ) || empty( $discounted_prices ) ) {
			return $price_html;
		}

		$regular_min    = min( $regular_prices );
		$regular_max    = max( $regular_prices );
		$discounted_min = min( $discounted_prices );
		$discounted_max = max( $discounted_prices );

		$is_discount_applied = (
			round( $regular_min, 2 ) > round( $discounted_min, 2 ) ||
			round( $regular_max, 2 ) > round( $discounted_max, 2 )
		);

		if ( ! $is_discount_applied ) {
			return $price_html;
		}

		/**
		 * If min and max prices are the same, show single price.
		 * Otherwise, show price range.
		 * Strike-through regular price based on Disco settings.
		 */
		if ( round( $discounted_min, 2 ) === round( $discounted_max, 2 ) ) {
			if ( ! Disco::is_strike_through_applicable( Disco::get_page_name() ) ) {
				return wc_price( $discounted_min );
			}
			return '<del>' . wc_price( $regular_min ) . '</del> <ins>' . wc_price( $discounted_min ) . '</ins>';
		}

		$discount_range = wc_price( $discounted_min ) . ' – ' . wc_price( $discounted_max );
		$regular_range  = wc_price( $regular_min ) . ' – ' . wc_price( $regular_max );

		if( ! Disco::is_strike_through_applicable( Disco::get_page_name() ) ) {
			return $discount_range;
		}

		return '<del>' . $regular_range . '</del><br><ins>' . $discount_range . '</ins>';
	}

	add_filter( 'woocommerce_variable_price_html', 'disco_variable_product_discounted_price_html', 999, 2 );
}

if ( ! function_exists( 'disco_discounted_price_html' ) ) {

	/**
	 * Display Product Sale Price & Regular Price with or without Tax.
	 *
	 * @param string      $price_html Product Price HTML.
	 * @param \WC_Product $product Product Object.
	 */
	function disco_discounted_price_html( string $price_html, WC_Product $product ): string {

		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
			return $price_html;
		}

		if( $product->get_type() === 'variable' ) {
			return $price_html;
		}

		// Use cached tax settings to avoid repeated get_option() calls
		$tax = Settings::get_tax_settings();

		if ( $tax['enabled'] && $tax['include_tax'] ) {
			$regular_price = wc_get_price_including_tax( $product, array( 'price' => $product->get_regular_price() ) );
			$sale_price    = wc_get_price_including_tax( $product, array( 'price' => $product->get_price() ) );
		} else {
			$regular_price = wc_get_price_excluding_tax( $product, array( 'price' => $product->get_regular_price() ) );
			$sale_price    = wc_get_price_excluding_tax( $product, array( 'price' => $product->get_price() ) );
		}

		$page_name            = Disco::get_page_name();

		if (
			! Disco::is_strike_through_applicable( $page_name ) &&
			in_array( Settings::get( 'on_sale_badge' ), [ 'show_all', 'do_not_show' ], true )
		) {
			return wc_price( $sale_price );
		}

		if ( $sale_price < $regular_price ) {
			$price_html = '<del>' . wc_price( $regular_price ) . '</del> <ins>' . wc_price( $sale_price ) . '</ins>';
		}

		return $price_html;
	}

	add_filter( 'woocommerce_get_price_html', 'disco_discounted_price_html', 999, 2 );
}

if ( ! function_exists( 'disco_show_product_as_on_sale' ) ) {

	/**
	 * Show variable product as on sale if any variation is on sale.
	 *
	 * @param bool        $is_on_sale Whether the product is on sale.
	 * @param \WC_Product $product Product Object.
	 * @return bool
	 */
	function disco_show_product_as_on_sale( $is_on_sale, $product ) {
		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
			return $is_on_sale;
		}

		$on_sale_status = Settings::get( 'on_sale_badge' );

		//Show on sale badge based on WooCommerce and Disco settings.
		if ( 'do_not_show' === $on_sale_status ) {
			return false;
		}

		if( 'show_all' === $on_sale_status ) {
			if ( $product->is_type( 'variable' ) ) {
				$children = $product->get_children();

				foreach ( $children as $variation_id ) {
					$variation = wc_get_product( $variation_id );

					if ( ! $variation || ! $variation->is_purchasable() ) {
						continue;
					}

					$regular_price = (float) $variation->get_regular_price();
					$current_price = (float) $variation->get_price(); // This includes filters (like discounts)

					// If the variation has a price reduction (dynamic or static)
					if ( $regular_price > 0 && $current_price < $regular_price ) {
						return true;
					}
				}
			}

			// For simple products, check if the price is discounted.
			$regular_price = (float) $product->get_regular_price();
			$current_price = (float) $product->get_price();
			// If the product has a price reduction (dynamic or static)
			if ( $regular_price > 0 && $current_price < $regular_price ) {
				return true;
			}
		}

		return $is_on_sale;
	}

	add_filter( 'woocommerce_product_is_on_sale', 'disco_show_product_as_on_sale', 20, 2 );
}
