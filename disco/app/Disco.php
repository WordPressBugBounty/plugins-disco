<?php
/**
 * Disco Class File.
 *
 * @package    Disco
 * @subpackage \App\Disco.php
 * @since      1.0.0
 */

namespace Disco\App;

use Disco\App\Calc\CalcFactory;
use Disco\App\Features\UserLimit;
use Disco\App\Utility\Settings;

/**
 * Class Disco
 *
 * @package    Disco
 * @subpackage \App
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Discount
 */
class Disco {

	use \Disco\App\Intents\IntentHelper;

	/**
	 * @var array $intents Intents.
	 */
	private $intents;

	/**
	 * @var int $applied_campaign_id Applied Campaign.
	 */
	private $applied_campaign_id;


	/**
	 * Apply discount to product.
	 *
	 * @param float       $price   Product Price.
	 * @param \WC_Product $product Product Object.
     * @return float Product Price.
	 * @throws \Exception If setting is not found.
	 */
	public function get_product_discounted_price( $price, $product ) {//phpcs:ignore
		if ( Settings::get( 'discount_priority_type' ) === 'woocommerce_coupon' ) {
			return $price; // Return original price if WooCommerce coupon is used.
		}

		if ( $product instanceof \WC_Product ) {
			// Init product base intents and exclude cart-based intents.
			$this->intents = $this->prepare_intents( array( 'Product' ) );

			if ( ! $product->is_type( 'variable' ) ) {
				$price = CalcFactory::get_product_price( $product );
			}

			// If the product is not on sale, update the meta to indicate it's not on sale.
// update_post_meta( $product->get_id(), '_disco_on_sale', 'no' );

			// If no intent is available, return the original price.
			if ( empty( $this->intents ) ) {
				return $price;
			}

			$discounts = array();

			$prev_discount = PHP_INT_MAX;

			// Foreach intent, apply the discount.
			foreach ( $this->intents as $intent ) {
				/**
				 * Get a discount limit form campaign.
				 *
				 * Compare with total product meta and apply discount
				 */
				$discount_limit         = $intent->campaign->discount_max_user;
				$total_applied_campaign = ( new UserLimit )->disco_get_total_applied_campaign( $intent->campaign->id );

				if (
					! empty( $discount_limit )
					&& (
						$discount_limit >= 0
						&& $total_applied_campaign >= $discount_limit
					)
				) {
					continue;
				}

				$discount = $intent->get_discounts( (float) $price, $product );

				if ( empty( $discount ) ) {
					continue;
				}

				// Get applied discount campaign.
				if ( $discount > 0 && $prev_discount > $discount ) {
					$this->applied_campaign_id = $intent->campaign->id;
					$prev_discount             = $discount;
				}

				$discounts[] = $discount;
			}

			// If no discount is applied, return the original price.
			if ( empty( $discounts ) ) {
				return $price;
			}

			$discount_type = $intent->campaign->discount_rules[0]['discount_type'];

			/**
			 * Get the min or max discount amount according to plugin settings.
			 * Apply the filter to modify final discounted amount based on discount types.
			 */
			$discounted_amount = apply_filters( 'disco_final_discounted_amount', $this->min_max_average( $discounts ), $discount_type );

			if ( $discounted_amount <= $price ) {
				// Get an applied campaign from DiscountLimit class.
				( new UserLimit )->disco_start_session_on_checkout( $this->applied_campaign_id );

				// Mark as disco custom on sale
// update_post_meta( $product->get_id(), '_disco_on_sale', 'yes' );

				return $this->discounted_price( $price, $discounted_amount );
			}
		}

		return $price;
	}

	/** Get Cart Discount.
	 *
	 * @param \WC_Cart $cart Cart Object.
     * @return \WC_Cart Cart Object.
	 * @throws \Exception If the cart is empty.
	 */
	public function get_cart_discount( $cart ) { //phpcs:ignore
		if ( $cart->is_empty() ) {
			return $cart;
		}

		if ( Settings::get( 'discount_priority_type' ) === 'woocommerce_coupon' ) {
			return $cart;
		}

		// Init Cart - Based Intents except Product & Shipping Intent.
		$this->intents = $this->prepare_intents( array( 'Cart' ) );

		if ( ! empty( $this->intents ) && $cart->get_cart_contents_count() > 0 ) {
			$discounts = array();

			foreach ( $this->intents as $intent ) { // Foreach intent, apply the discount.

				/**
				 * Get a discount limit form campaign.
				 *
				 * Compare with total product meta and apply discount
				 */
				$discount_limit         = $intent->campaign->discount_max_user;
				$total_applied_campaign = ( new UserLimit )->disco_get_total_applied_campaign( $intent->campaign->id );

				if (
					! empty( $discount_limit )
					&& (
						$discount_limit >= 0
						&& $total_applied_campaign >= $discount_limit
					)
				) {
					continue;
				}

				$items = $this->get_items_for_discount( $cart, $intent->campaign );

				$discount = $intent->get_discounts( $items, $cart );

				// Get intent id for discount limit.
				$intent_id = $intent->campaign->id;

				if ( empty( $discount ) ) {
					continue;
				}

				// Store discount with intent id key value.
				$discounts[ $intent_id ] = $discount;
			}

			// Apply discount to cart subtotal .
			if ( ! empty( $discounts ) ) {
				/**
				 * New code.
				 * Get the min or max discount amount according to plugin settings.
				 */
				$cart_fee = $this->min_max_average( array_values( $discounts ) );

				// Get applied campaign from discount array.
				$applied_campaign_id = array_search( $cart_fee, $discounts, true );
				$applied_campaign    = ( new Campaign )->get_campaign( $applied_campaign_id );
				$discount_label      = $applied_campaign->discount_rules[0]['discount_label'] ?? '';

				// Get an applied campaign from DiscountLimit class.
				( new UserLimit )->disco_start_session_on_checkout( (int) $applied_campaign_id );

				// TODO: The Discount must be less than cart subtotal.
				$label = __( 'Discount', 'disco' );

				if ( ! empty( $discount_label ) ) {
					$label = $discount_label;
				}

				$cart->add_fee( $label, -$cart_fee );
				$cart->set_session();
			}
		}

		return $cart;
	}

	/**
	 * Apply Bulk & Bundle discount to cart items.
	 *
	 * @param \WC_Cart $cart Cart Object.
	 * @return \WC_Cart|void Cart Object.
	 * @throws \Exception If translation not found.
	 */
	public function get_cart_items_discount( $cart ) { // phpcs:ignore
		if ( ! $this->cart_is_valid() ) {
			return $cart;
		}

		if ( ! defined( 'DOING_AJAX' ) && is_admin() ) {
			return $cart;
		}

		if ( Settings::get( 'discount_priority_type' ) === 'woocommerce_coupon' ) {
			return $cart;
		}

		// Init Cart - Based Intents except Product & Shipping Intent.
		$this->intents = $this->prepare_intents( array( 'Bulk', 'Bundle', 'BOGO' ) );

		$discounts = $this->prepare_item_discounts( $this->intents, $cart );

		if ( empty( $discounts ) ) {
			return $cart;
		}

		$total_discount = 0;
		// Identify valid BOGO + category item ID (if any)
		$found_bogo_category_item_id = $this->get_valid_bogo_category_item_id( $this->intents, $cart, $discounts );

		// Apply only the valid BOGO category discount, or all if none matched
		foreach ( $cart->get_cart() as $item ) {
			$id = $this->get_cart_item_id( $item );

			// Skip all others if BOGO + category item is found
			if ( $found_bogo_category_item_id !== null && $id !== $found_bogo_category_item_id ) {
				continue;
			}

			if ( empty( $discounts[ $id ] ) ) {
				continue;
			}

			$total_discount += $discounts[ $id ];
		}

		if ( $total_discount > 0 ) {
			$cart->add_fee( __( 'Discount', 'disco' ), -$total_discount );
		}

		$cart->set_session();

		return $cart;
	}

	/**
	 * Get cart items discount for BOGO free.
	 *
	 * Calculates which items in the cart are eligible for a free product under the BOGO offer.
	 *
	 * @param \WC_Cart $cart WooCommerce cart object to calculate discounts for.
	 * @return array|false|\WC_Cart Cart object with applied discounts or false if no discounts are applicable.
	 */
	public function get_cart_items_discount_for_bogo( $cart ) {//phpcs:ignore
        if ( ! $this->cart_is_valid() ) {
            return $cart;
        }

        if ( ! defined( 'DOING_AJAX' ) && is_admin() ) {
            return $cart;
        }

		if ( Settings::get( 'discount_priority_type' ) === 'woocommerce_coupon' ) {
			return $cart;
		}

        // Init Cart - Based Intents except Product & Shipping Intent.
        $this->intents = $this->prepare_intents( array( 'BOGO' ) );

		return $this->prepare_item_discounts_bogo_free( $this->intents, $cart );
    }

	/**
	 * Apply the discount to shipping.
	 *
	 * @return bool
	 */
	public function apply_free_shipping() { //phpcs:ignore
		if ( ! $this->cart_is_valid() ) {
			return false;
		}

		$cart = WC()->cart;

		if ( Settings::get( 'discount_priority_type' ) === 'woocommerce_coupon' ) {
			return false; // Return false if WooCommerce coupon is used.
		}

		$this->intents = $this->prepare_intents( array( 'Shipping' ) );
		$shippings     = array();

		if ( ! empty( $this->intents ) ) {
			foreach ( $this->intents as $intent ) {
				/**
				 * Get a discount limit form campaign.
				 *
				 * Compare with total product meta and apply discount
				 */
				$discount_limit         = $intent->campaign->discount_max_user;
				$applied_campaign_id    = $intent->campaign->id;
				$total_applied_campaign = ( new UserLimit )->disco_get_total_applied_campaign( $intent->campaign->id );

				if (
					! empty( $discount_limit )
					&& (
						$discount_limit >= 0
						&& $total_applied_campaign >= $discount_limit
					)
				) {
					continue;
				}

				$items       = $this->get_items_for_discount( $cart, $intent->campaign );
				$shippings[] = $intent->get_discounts( $items, $cart );

				if ( !in_array( 'free_shipping', $shippings, true ) ) {
                    continue;
                }

                // Get an applied campaign from DiscountLimit class.
                ( new UserLimit )->disco_start_session_on_checkout( $applied_campaign_id );
			}
		}

		return in_array( 'free_shipping', $shippings, true );
	}

	/**
	 * Get offers for a product.
	 *
	 * @param array|null $items item ids.
     * @return string
	 */
	public function get_offers( $items = null ) {
		// Init Cart-Based Intents except Product & Shipping Intent.
		$this->intents = $this->prepare_intents( array( 'Product', 'Shipping' ) );
		$table         = "<table style='border-collapse: collapse;' class=''>";
		$table        .= '<tr><th>Quantity</th><th>Discount</th></tr>';

		$cart = WC()->cart;

		foreach ( $this->intents as $intent ) {
			if ( is_null( $items ) || ! $cart->is_empty() ) {
				$items = $this->get_items_for_discount( $cart, $intent->campaign );
			} else {
				$items = array();
			}

			$discounts = $intent->get_offers( $items, $cart );

			if ( empty( $discounts ) ) {
				continue;
			}

			foreach ( $discounts as $discount ) {
				$table .= '<tr style="font-size: smaller;line-height:15px"><td>' . $discount['condition'] . '</td><td>' . $discount['discount'] . '</td></tr>';
			}
		}

		return $table . '</table>';
	}

	/**
	 * Get Premium Status.
	 */
	public static function is_pro(): bool {
		/**
		 * Here use class_exists to check whether Disco Pro is active or not.
		 * is_plugin_active() function may not work in some cases.
		 */
		return class_exists( 'Disco_Pro' );
	}

	/**
	 * Get shop, category, or checkout page name.
	 *
	 * @return string Page name: 'category', 'shop', 'checkout', or product page if none match.
	 */
	public static function get_page_name(): string {
		if ( is_product_category() || is_product_tag() ) {
			return 'category';
		}

		if ( is_shop() ) {
			return 'shop';
		}

		if ( is_page( 'cart' ) || is_page( 'checkout' ) ) {
			return 'cart';
		}

		return 'product';
	}

	/**
	 * Get pages name where strike through price should be shown.
	 *
	 * @return array Pages where strike through price should be shown.
	 */
	public static function get_strike_through_pages(): array {
		$settings = Settings::get( 'show_strike_through' );

		if ( ! is_array( $settings ) ) {
			return array();
		}

		$pages = array();

		if ( isset( $settings['shop_page'] ) && $settings['shop_page'] ) {
			$pages[] = 'shop';
		}

		if ( isset( $settings['product_pages'] ) && $settings['product_pages'] ) {
			$pages[] = 'product';
		}

		if ( isset( $settings['category_page'] ) && $settings['category_page'] ) {
			$pages[] = 'category';
		}

		if ( isset( $settings['cart_page'] ) && $settings['cart_page'] ) {
			$pages[] = 'cart';
		}

		return $pages;
	}

	/**
	 * Get is strike through applicable for current page.
	 *
	 * @param string $page_name Page name to check.
	 * @return bool True if strike through is applicable, false otherwise.
	 */
	public static function is_strike_through_applicable( $page_name ): bool {
		$pages = self::get_strike_through_pages();

		if ( empty( $pages ) || empty( $page_name ) ) {
			return false;
		}

		return in_array( $page_name, $pages, true );
	}

}
