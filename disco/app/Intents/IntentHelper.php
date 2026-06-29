<?php //phpcs:ignore

/**
 * Intent Helper Trait.
 *
 * @package    Disco
 * @subpackage \App\Intents\IntentHelper.php
 * @since      1.0.0
 */

namespace Disco\App\Intents;

use Disco\App\Calc\CalcFactory;
use Disco\App\Campaign;
use Disco\App\Features\UserLimit;
use Disco\App\Utility\Config;
use Disco\App\Utility\Helper;
use Disco\App\Utility\Settings;

/**
 * This Class contains all the common function for cart related intents,
 * and the intents are Cart, Bulk, Bundle and BOGO
 *
 * @package    Disco
 * @subpackage Disco\App\Intents
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   IntentHelper
 */
trait IntentHelper {//phpcs:ignore

	/**
	 * Disco Prepare Intents.
	 *
	 * @param array $intents          Skip Intents.
	 *                                Either a single intent or an array of intents.
     * @return array
	 */
	public function prepare_intents( $intents = [] ) {//phpcs:ignore
		$campaigns = ( new Campaign )->get_campaigns( '1' );


		$new_intents = array();

		$settings = Settings::get();

		if ( empty( $campaigns ) ) {
			return $new_intents;
		}

		foreach ( $campaigns as $campaign ) {
			// Check discount expiration date.
			if ( ! Helper::is_in_valid_date( $campaign ) ) {
				continue;
			}

			// Skip the intent if it is in the skip list.
			if (
				! empty( $intents )
				&& is_array( $intents )
				&& ! in_array( $campaign->discount_intent, $intents, true )
			) {
				continue;
			}

			if ( $campaign->discount_intent === 'BOGO' ) {
				$campaign->discount_intent = 'BuyXGetX';

				if ( in_array( $campaign->bogo_type, array( 'products', 'categories' ), true ) ) {
					$campaign->discount_intent = 'BuyXGetY';
				}
			}

			$new_intents[] = IntentFactory::get_intent( $campaign, $settings );
		}//end foreach

		return $new_intents;
	}

	/**
	 * Get discount applicable items from the cart.
	 *
	 * @param \WC_Cart                  $cart     Cart Object.
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
     * @return array
	 */
	public function get_items_for_discount( $cart, $campaign ) { //phpcs:ignore
		$items              = array();
		$discount_type      = $campaign->get_discount_intent();
		$cart_items         = $cart->get_cart();
		$bogo_type          = $campaign->get_bogo_type();
		$y_products         = array();
		$verified_yproducts = false;

		/**
		 * Check if the discount type is BuyXGetY and the Y product is in the cart.
		 * If so, add the Y product to the items array.
		 */
	    if ( $discount_type === 'BuyXGetY' ) {
			$rule_ids           = $campaign->get_rule_product_ids();
			$y_products         = $this->get_y_product( $rule_ids, $cart_items, $bogo_type );
			$verified_yproducts = $this->verify_yproduct_in_cart( $rule_ids, $cart_items, $bogo_type );
	 	}

		foreach ( $cart_items as $item ) {
			// Skip free products - they should not count towards BOGO buy quantity
			if ( ! empty( $item['is_free_product'] ) ) {
				continue;
			}

			$id = $item['product_id'];

			if ( $item['variation_id'] ) {
				$id = $item['variation_id'];
			}

			// Continue if the product is not applicable for the campaign.
			if ( ! $campaign->product_is_applicable( $id ) ) {
				continue;
			}

			// Continue if the item is not passed the filter.
			$product = wc_get_product( $id );

			$info = array( 'product' => $product );

			if ( ! Helper::is_filter_passed( $campaign, $info ) ) {
				continue;
			}

			/**
			 * Check if the discount type is BuyXGetY and the Y product is in the cart.
			 * If so, add the Y product to the items array.
			 * These products not need to be passed the filter.
			 */
			if ( $discount_type === 'BuyXGetY' && $verified_yproducts ) {
			 	$items = array_merge( $items, $y_products );
			}

			$items[] = $item;
		}//end foreach

		return $items;
	}

	/**
	 * Verify the rules.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param array                     $item     Cart Item.
	 * @param array                     $rule     Cart Item.
	 * @return bool
	 */
	public function verify_rules( $campaign, $item, $rule ) {
		if ( is_object( $rule ) ) {
			$rule = (array) $rule;
		}

		$basis = $this->get_basis_for_item( $item );

		if ( empty( $rule ) ) {
			return false;
		}

		switch ( $campaign->get_discount_intent() ) {
			case 'Product':
			case 'Cart':
				return isset( $rule['discount_value'], $rule['discount_type'] );

			case 'Bulk':
				return $this->verify_bulk_rule( $basis, $rule );

			case 'Bundle':
				return $this->verify_bundle_rule( $basis, $rule );

			case 'BuyXGetX':
				return $this->verify_buyxgetx_rule( $basis, $item, $rule );

			case 'BuyXGetY':
				return $this->verify_buyxgety_rule( $campaign, $basis, $item, $rule );

			default:
				return false;
		}
	}

	/**
	 * Get cart item id.
	 *
	 * @param array $item Cart Item.
	 * @return int
	 */
	public function get_cart_item_id( $item ) {
		$id = $item['product_id'];

		if ( $item['variation_id'] > 0 ) {
			$id = $item['variation_id'];
		}

		return $id;
	}

	/**
	 * Get the basis for cart.
	 * Returns the quantity or price of the cart.
	 * If the cart is not valid, then return 0.
	 *
	 * @param \Disco\App\Utility\Config $campaign Discount Rules.
	 * @param \WC_Cart                  $cart     Cart .
	 * @return float|int
	 */
	public function get_basis_for_cart( $campaign, $cart ) {
		if ( ! $cart instanceof \WC_Cart || $cart->is_empty() ) {
			return 0;
		}

		if ( 'cart_quantity' === $campaign->get_discount_based_on() ) {
			return absint( $cart->get_cart_contents_count() );
		}

		return abs( $cart->get_subtotal() );
	}

	/**
	 * Get the basis for item.
	 * Returns the quantity or price of the item.
	 * If the item is not valid, then return 0.
	 *
	 * @param array $item Cart Item.
	 * @return int
	 */
	public function get_basis_for_item( $item ) {
		if ( empty( $item['quantity'] ) ) {
			return 0;
		}

		return absint( $item['quantity'] );
	}

	/**
	 * Calculate discount.
	 * Returns the discount amount.
	 *
	 * @param float  $cost           Item Price or Cart Subtotal.
	 * @param string $discount_type  Discount Type.
	 * @param float  $discount_value Discount Value.
	 * @return float
	 */
	public function calculate_discount( $cost, $discount_type, $discount_value ) {
		$cost           = (float) $cost;
		$discount_value = (float) $discount_value;

		if ( 'percent' === $discount_type ) {
			$cost = $cost * $discount_value / 100;
		}

		if ( 'fixed' === $discount_type || 'fixed_per_product' === $discount_type ) {
			$cost = $discount_value;
		}

		return $cost;
	}

	/**
	 * Get the discounted price.
	 *
	 * @param float $cost              Item Price or Cart Subtotal.
	 * @param float $discounted_amount Discounted Amount.
	 * @return float Discounted Price.
	 */
	public function discounted_price( $cost, $discounted_amount ) {
		$discounted_price = $cost - $discounted_amount;

		if ( $discounted_price < 0 ) {
			$discounted_price = $cost;
		}

		return $discounted_price;
	}

	/**
	 * Get the discounted amount.
	 *
	 * @param float $cost              Item Price or Cart Subtotal.
	 * @param float $discounted_amount Discounted Amount.
	 */
	public function get_amount_after_discount( float $cost, float $discounted_amount ): float {
		$discounted_amount = $cost - $discounted_amount;

		if ( $discounted_amount < 0 ) {
			$discounted_amount = $cost;
		}

		return $discounted_amount;
	}

	/**
	 * Check if a number is a multiple of another number for recursive discount.
	 *
	 * @param float|int $number Number to check.
	 * @param float|int $of     Number to check against.
	 * @return bool Returns true if the number is a multiple of the given number, false otherwise.
	 */
	public function is_multiple( $number, $of ) {
		if ( $of >= $number ) {
			return (float) $of % (float) $number === 0;
		}

		return false;
	}

	/**
	 * Check if a product is in a category.
	 *
	 * @param int   $product_id Product ID.
	 * @param array $categories Categories.
	 * @return bool
	 */
	public function is_in_category( $product_id, $categories ) {
		// Ensure $categories is an array
		if ( ! is_array( $categories ) ) {
			$categories = array( $categories );
		}

		$get_product = wc_get_product( $product_id );

		if ( ! $get_product ) {
			return false;
		}

		if ( $get_product->get_type() === 'variation' ) {
			$product_id = $get_product->get_parent_id();
		}

		$terms = get_the_terms( $product_id, 'product_cat' );

		if ( ! $terms || is_wp_error( $terms ) ) {
			return false;
		}

		$term_ids = array();

		foreach ( $terms as $term ) {
			$term_ids[] = $term->term_id;

			// Include all parent category IDs
			$parent_ids = get_ancestors( $term->term_id, 'product_cat' );

			if ( empty( $parent_ids ) ) {
				continue;
			}

			$term_ids = array_merge( $term_ids, $parent_ids );
		}

		// Remove duplicates just in case
		$term_ids      = array_unique( $term_ids );
		$common_values = array_intersect( $term_ids, $categories );

		return ! empty( $common_values );
	}

	/**
	 * Prepare a discount array for cart.
	 * Returns the discount array.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param array                     $items    Cart Item Object.
	 * @param \WC_Cart                  $cart     Cart Object.
	 */
	public function get_item_discounts( Config $campaign, array $items, \WC_Cart $cart ): array {//phpcs:ignore
		$discounts = array();
// $cart      = WC()->cart;
		// Get the discount rules.
		$rules = $campaign->get_discount_rules();

		// Check if the cart is not empty.
		if ( empty( $items ) ) {
			return $discounts;
		}

		/**
		 * Combined qualifying quantity for recursive BOGO, filtered by the
		 * conditions and few-products filters and excluding Disco free items.
		 */
		$total_applicable_qty = $this->get_total_applicable_quantity( $cart, $campaign );

		// Loop through the cart items.
		foreach ( $items as $item ) {
			// Get the item object.
			$item_objet = $item['data'];

			// Check if the campaign has rules.
			if ( ! is_array( $rules ) || empty( $rules ) ) {
				continue;
			}

			// Loop through the discount rules.
			foreach ( $rules as $rule ) {
				if ( is_object( $rule ) ) {
					$rule = (array) $rule;
				}

				// Verify the rule by campaign settings.
				if ( ! $this->verify_rules( $campaign, $item, $rule ) ) {
					continue;
				}

				$r  = md5( microtime() . wp_rand() );
				$id = $this->get_cart_item_id( $item );

				// Set the discount array.
				$discounts[ $id ]['original_price'] = $item_objet->get_price();
				$discounts[ $id ]['cart_item_key']  = $item['key'];

				// Set discount applies to
				$discounts[ $id ]['discount_applies_to'][ $r ] = CalcFactory::discount_applies_to( $rule, $campaign );

				// Set Discounts.
				if ( $rule['discount_type'] === 'free' ) {
					$discounted_amount           = array(
						'price'                 => $item_objet->get_price(),
						'discount'              => 0,
						'line_subtotal'         => $item_objet->get_price() * $item['quantity'],
						'discounted_quantities' => 0,
					);
					$discounts[ $id ]['free']    = true;
					$discounts[ $id ]['get_ids'] = $rule['get_ids'];
					$discounts[ $id ]['get_qty'] = CalcFactory::get_free_quantity( $rule, $item );

					/**
					 * Recursive BOGO (any bogo type): base the free quantity on the
					 * combined qualifying quantity instead of this single line, so a
					 * cart whose qualifying quantity totals 4 grants 4 free items.
					 */
					if ( 'yes' === $rule['recursive'] && (int) $rule['min'] > 0 ) {
						$discounts[ $id ]['get_qty'] = (int) floor( $total_applicable_qty / (int) $rule['min'] ) * (int) $rule['get_quantity'];
					}
				} else {
					$discounted_amount           = CalcFactory::get_discount( $rule, $item, $cart, $campaign );
					$discounts[ $id ]['free']    = false;
					$discounts[ $id ]['get_ids'] = array();
					$discounts[ $id ]['get_qty'] = 0;
				}

				// $discounts[ $id ]['get_ids']              = array_values( $rule['get_ids'] );

				$discounts[ $id ]['discount_types'][ $r ]        = $rule['discount_type'];
				$discounts[ $id ]['intent'][ $r ]                = $campaign->get_discount_intent();
				$discounts[ $id ]['prices'][ $r ]                = $discounted_amount['price'];
				$discounts[ $id ]['discounts'][ $r ]             = $discounted_amount['discount'];
				$discounts[ $id ]['subtotals'][ $r ]             = $discounted_amount['line_subtotal'];
				$discounts[ $id ]['discounted_quantities'][ $r ] = $discounted_amount['discounted_quantities'];
				$discounts[ $id ]['quantities'][ $r ]            = $item['quantity'];
				$offers = $this->get_item_offers( $rule );

				$discounts[ $id ]['offers'][ $r ] = $offers;
			}//end foreach
		}//end foreach

		return $discounts;
	}

	/**
	 * Prepare discounts for cart items.
	 *
	 * @param array    $intents Intents.
	 * @param \WC_Cart $cart    Cart.
	 * @return array|false
	 */
	public function prepare_item_discounts( array $intents, \WC_Cart $cart ) { //phpcs:ignore
		if ( empty( $intents ) ) {
			return false;
		}

		$discounts = array();

		// Loop through the intents.
		foreach ( $intents as $intent ) {
			/**
			 * Get a discount limit form campaign.
			 *
			 * Compare with total product meta and apply discount
			 */
			$discount_limit         = $intent->campaign->discount_max_user;
			$total_applied_campaign = ( new UserLimit )->disco_get_total_applied_campaign( $intent->campaign->id );

			if ( ! empty( $discount_limit ) && ( $discount_limit >= 0 && $total_applied_campaign >= $discount_limit ) ) {
				continue;
			}

			$items         = $this->get_items_for_discount( $cart, $intent->campaign );
			$get_discounts = $intent->get_discounts( $items, $cart );

			if ( empty( $get_discounts ) ) {
				continue;
			}

			// Only stage campaigns whose discount actually applied to the cart.
			( new UserLimit )->disco_start_session_on_checkout( $intent->campaign->id );

			foreach ( $get_discounts as $item_id => $discount ) {
				$discounts[ $item_id ]['discounts'][] = max( $discount['discounts'] );
			}
		}

		// Check if the discounts are empty.
		if ( empty( $discounts ) ) {
			return false;
		}

		// Get the min or max discount amount for each item.
		foreach ( $discounts as $item_id => $discount ) {
			$discounts[ $item_id ] = $this->min_max_average( $discount['discounts'] );
		}

		return $discounts;
	}

	/**
	 * Get valid BOGO category item ID.
	 *
	 * @param array    $intents Intents.
	 * @param \WC_Cart $cart Cart.
	 * @param array    $discounts Discounts.
	 * @return int|null
	 */
	public function get_valid_bogo_category_item_id( array $intents, \WC_Cart $cart, array $discounts ) {
		foreach ( $intents as $intent ) {
			if (
				$intent->campaign->get_discount_intent() !== 'BuyXGetY' ||
				$intent->campaign->get_bogo_type() !== 'categories'
			) {
				continue;
			}

			foreach ( $cart->get_cart() as $item ) {
				$item_id = $this->get_cart_item_id( $item );

				if ( isset( $discounts[ $item_id ] ) && $discounts[ $item_id ] > 0 ) {
					return $item_id;
				}
			}
		}

		return null;
	}

	/**
	 * Prepare discounts for cart items.
	 *
	 * @param array    $intents Intents.
	 * @param \WC_Cart $cart    Cart.
	 * @return array|false
	 */
	public function prepare_item_discounts_bogo_free( array $intents, \WC_Cart $cart ) { //phpcs:ignore
		if ( empty( $intents ) ) {
			return false;
		}

		$discounts = array();

		// Loop through the intents.
		foreach ( $intents as $intent ) {
			/**
			 * Get a discount limit form campaign.
			 *
			 * Compare with total product meta and apply discount
			 */
			$discount_limit         = $intent->campaign->discount_max_user;
			$total_applied_campaign = ( new UserLimit )->disco_get_total_applied_campaign( $intent->campaign->id );

			if ( ! empty( $discount_limit ) && ( $discount_limit >= 0 && $total_applied_campaign >= $discount_limit ) ) {
				continue;
			}

			$items         = $this->get_items_for_discount( $cart, $intent->campaign );
			$get_discounts = $intent->get_discounts( $items, $cart );

			if ( empty( $get_discounts ) ) {
				continue;
			}

			// Only stage campaigns whose discount actually applied to the cart.
			( new UserLimit )->disco_start_session_on_checkout( $intent->campaign->id );

			foreach ( $get_discounts as $item_id => $discount ) {
				$discounts[ $item_id ]['discounts'][] = max( $discount['discounts'] );
				$discounts[ $item_id ]['free']        = $discount['free'];
				$discounts[ $item_id ]['get_ids']     = $discount['get_ids'];
				$discounts[ $item_id ]['get_qty']     = $discount['get_qty'];
				$discounts[ $item_id ]['bogo_type']   = $intent->campaign->get_bogo_type();
			}
		}

		// Check if the discounts are empty.
		if ( empty( $discounts ) ) {
			return false;
		}

		// Get the min or max discount amount for each item.
		foreach ( $discounts as $item_id => $discount ) {
			$discounts['discount']  = $this->min_max_average( $discount['discounts'] );
			$discounts['free']      = $discount['free'];
			$discounts['get_ids']   = $discount['get_ids'] ? array_column( $discount['get_ids'], 'id' ) : array( $item_id ); //@phpcs:ignore
			$discounts['get_qty']   = $discount['get_qty'];
			$discounts['bogo_type'] = $discount['bogo_type'] ?? 'products';
		}

		return $discounts;
	}

	/**
	 * Is it a bogo campaign?
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 */
	public function is_bogo( Config $campaign ): bool {
		return in_array( $campaign->get_discount_intent(), array( 'BuyXGetX', 'BuyXGetY' ), true );
	}

	/**
	 * Check cart is valid or not
	 */
	public function cart_is_valid(): bool {
		return WC()->cart instanceof \WC_Cart && ! WC()->cart->is_empty();
	}

	/**
	 * Get min or max price from an array discounted prices according to plugin settings.
	 *
	 * @param array $discounts Discounted Amounts.
	 */
	public function min_max_average( array $discounts ): float {
		$calculation_type = Settings::get( 'min_max_discount_amount' );

		if ( empty( $discounts ) ) {
			return 0.00;
		}

		if ( 'max' === $calculation_type ) {
			return max( $discounts );
		}

		return min( $discounts );
	}

	/**
	 * Total qualifying quantity for recursive BOGO.
	 *
	 * Sums the quantity of every cart item that passes the campaign's
	 * few-products / "all" filter (product_is_applicable) and its conditions
	 * filter (is_filter_passed), excluding products Disco added as free. This is
	 * the combined "buy" quantity a recursive rule scales the free / discount
	 * quantity against, so products excluded by either filter are not counted.
	 *
	 * @param \WC_Cart                  $cart     Cart object.
	 * @param \Disco\App\Utility\Config $campaign Campaign config.
	 */
	private function get_total_applicable_quantity( $cart, $campaign ): int {
		$total = 0;

		$cart_items = $cart->get_cart();

		if ( ! is_array( $cart_items ) ) {
			return $total;
		}

		foreach ( $cart_items as $item ) {
			if ( ! empty( $item['is_free_product'] ) ) {
				continue;
			}

			$id = $item['product_id'];

			if ( ! empty( $item['variation_id'] ) ) {
				$id = $item['variation_id'];
			}

			if ( ! $campaign->product_is_applicable( $id ) ) {
				continue;
			}

			$product = wc_get_product( $id );

			if ( ! Helper::is_filter_passed( $campaign, array( 'product' => $product ) ) ) {
				continue;
			}

			$total += (int) $item['quantity'];
		}

		return $total;
	}

	/**
	 * Get Offer Label.
	 *
	 * @param array $rule Discount Rule.
     */
	private function get_item_offers( array $rule ): array {
		$label    = '';
		$quantity = $rule['min'];

		if ( ! empty( $rule['max'] ) ) {
			$quantity .= ' - ' . $rule['max'];
		}

		if ( 'free' === $rule['discount_type'] ) {
			$label = 'Free';
		}

		if ( 'percent' === $rule['discount_type'] ) {
			$label = $rule['discount_value'] . '% off';
		}

		if ( 'fixed' === $rule['discount_type'] ) {
			$label = wc_price( $rule['discount_value'] ) . ' off';
		}

		if ( ! empty( $rule['get_quantity'] ) ) {
			$quantity = $rule['get_quantity'];
		}

		return array(
			'quantity' => $quantity,
			'label'    => $label,
		);
	}

	/**
	 * Verify Bulk Intent Rules.
	 *
	 * @param int   $quantity Item Quantity.
	 * @param array $rule     Discount Rules.
     */
	private function verify_bulk_rule( int $quantity, array $rule ): bool {
		$min = abs( $rule['min'] );

		if ( empty( $rule['max'] ) ) {
			$max = PHP_INT_MAX;
		} else {
			$max = abs( $rule['max'] );
		}

		if ( $quantity >= $min && $quantity <= $max ) {
			return true;
		}

		return $quantity >= $max;
	}

	/**
	 * Verify Bundle Intent Rules.
	 *
	 * @param int   $quantity Item Quantity.
	 * @param array $rule     Discount Rules.
     */
	private function verify_bundle_rule( int $quantity, array $rule ): bool {
		$rule_basis = abs( $rule['min'] );

		if ( $rule['recursive'] === 'yes' ) {
			if ( $quantity >= $rule_basis && ( $quantity % $rule_basis === 0 || $quantity > $rule_basis ) ) {
				return true;
			}
		} elseif ( $quantity >= $rule_basis ) {
			return true;
		}

		return false;
	}

	/**
	 * Verify BuyXGetX Intent Rules.
	 *
	 * @param float $quantity Item Quantity.
	 * @param array $item     Cart Item.
	 * @param array $rule     Discount Rules.
     */
	private function verify_buyxgetx_rule( float $quantity, array $item, array $rule ): bool {//phpcs:ignore

		$verified = ( $quantity >= $rule['min'] && $quantity <= $rule['max'] );

		if ( $verified && $rule['recursive'] === 'no' ) {
			return true;
		}

		$base_quantity = abs( $rule['min'] );

		if ( $rule['recursive'] === 'yes' && ! isset( $rule['max'] ) ) {
			if ( $quantity >= $base_quantity && $quantity % $base_quantity === 0 ) {
				return true;
			}
		} elseif ( $quantity >= $base_quantity ) {
			return true;
		}

		return false;
	}

	/**
	 * Verify BuyXGetY Intent Rules.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param float                     $quantity Item Quantity.
	 * @param array                     $item     Cart Item.
	 * @param array                     $rule     Discount Rules.
     */
	private function verify_buyxgety_rule( Config $campaign, float $quantity, array $item, array $rule ): bool {
		if ( ! is_array( $rule['get_ids'] ) ) {
			return false;
		}

		$id       = $this->get_cart_item_id( $item );
		$rule_ids = array_column( $rule['get_ids'], 'id' );

		/**
		 * This code use for automatically apply free items rule for all product BOGO campaigns.
		 */
		if ( $rule['discount_type'] === 'free' && 'all' === $campaign->get_bogo_type() ) {
			return $this->verify_buyxgetx_rule( $quantity, $item, $rule );
		}

		/**
		 * This code use for automatically apply free items rule product based BOGO campaigns.
		 */
		if ( $rule['discount_type'] === 'free' && 'products' === $campaign->get_bogo_type() ) {
			return $this->verify_xproduct_cart_rule( $campaign, $rule );
		}

		if ( 'products' === $campaign->get_bogo_type() && in_array( $id, $rule_ids, true ) ) {
			return $this->verify_xproduct_cart_rule( $campaign, $rule );
		}

		if ( 'categories' === $campaign->get_bogo_type() && $this->is_in_category( $id, $rule_ids ) ) {
			return $this->verify_xproduct_cart_rule( $campaign, $rule );
		}

		return false;
	}

	/**
	 * Verify XProduct Cart Rule.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param array                     $rule Discount Rules.
	 */
	private function verify_xproduct_cart_rule( Config $campaign, array $rule ): bool { //phpcs:ignore
		$cart = WC()->cart->get_cart();

		foreach ( $cart as $item ) {
			// Skip free products - they must not count towards the BOGO buy quantity,
			// otherwise granted free items re-qualify as buy-X and escalate the tier.
			if ( ! empty( $item['is_free_product'] ) ) {
				continue;
			}

			$quantity = $item['quantity'];
			$id       = $item['product_id'];

			if ( ! empty( $item['variation_id'] ) ) {
				$id = $item['variation_id'];
			}

			if ( $campaign->product_is_applicable( $id ) && $this->verify_buyxgetx_rule( $quantity, $item, $rule ) ) {
				$product = wc_get_product( $id );
				$info    = array( 'product' => $product );

				if ( ! Helper::is_filter_passed( $campaign, $info ) ) {
					continue;
				}

				return true;
			}
		}

		return false;
	}

	/**
	 * Verify YProduct in Cart.
	 *
	 * @param array  $rule_ids Rule Product IDs.
	 * @param array  $cart            Cart.
	 * @param string $bogo_type       BOGO Type.
	 * @return bool Returns true if a valid Y product is found in the cart, false otherwise.
	 */
	private function verify_yproduct_in_cart( array $rule_ids, array $cart, string $bogo_type ): bool { //phpcs:ignore
		if ( 'categories' === $bogo_type && ! empty( $rule_ids ) ) {
			foreach ( $cart as $item ) {
				$id = $item['product_id'];

				if ( ! empty( $item['variation_id'] ) ) {
					$id = $item['variation_id'];
				}

				if ( ! $this->is_in_category( $id, $rule_ids ) ) {
					continue;
				}

				return true; // Found a valid Y product
			}
		}

		if ( 'products' === $bogo_type && ! empty( $rule_ids ) ) {
			foreach ( $cart as $item ) {
				$id = $item['product_id'];

				if ( ! empty( $item['variation_id'] ) ) {
					$id = $item['variation_id'];
				}

				if ( ! in_array( $id, $rule_ids, true ) ) {
					continue;
				}

				return true; // Found a valid Y product
			}
		}

		return false;
	}

	/**
	 * Get Y products from cart.
	 *
	 * @param array  $rule_ids Rule Product IDs.
	 * @param array  $cart     Cart.
	 * @param string $bogo_type BOGO Type.
     */
	private function get_y_product( array $rule_ids, array $cart, string $bogo_type ): array { //phpcs:ignore
		$y_products = array();

		if ( 'categories' === $bogo_type && ! empty( $rule_ids ) ) {
			foreach ( $cart as $item ) {
				$id = $item['product_id'];

				if ( ! empty( $item['variation_id'] ) ) {
					$id = $item['variation_id'];
				}

				if ( ! $this->is_in_category( $id, $rule_ids ) ) {
					continue;
				}

				$y_products[] = $item; // Push the full cart item
			}
		}

		if ( 'products' === $bogo_type && ! empty( $rule_ids ) ) {
			foreach ( $cart as $item ) {
				$id = $item['product_id'];

				if ( ! empty( $item['variation_id'] ) ) {
					$id = $item['variation_id'];
				}

				if ( ! in_array( $id, $rule_ids, true ) ) {
					continue;
				}

				$y_products[] = $item; // Push the full cart item
			}
		}

		return $y_products;
	}

}
