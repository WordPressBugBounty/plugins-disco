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
use Disco\App\Utility\QuantityCounter;
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

		if ( ! is_array( $rules ) || empty( $rules ) ) {
			return $discounts;
		}

		/**
		 * BuyXGetY tiers are mutually exclusive: only one rule applies per
		 * campaign, selected by the buy quantity. Without this, tiers rewarding
		 * different get-products (e.g. rule 1 → product A, rule 2 → product B)
		 * would all fire and stack. Every other intent already collapses
		 * overlapping rules per product via min_max_average.
		 *
		 * Exception: a free products BOGO in `separate` mode is evaluated
		 * per-product (each cart product uses the tier(s) its own quantity
		 * matches), so all rules are kept and the reward is summed downstream.
		 */
		if ( 'BuyXGetY' === $campaign->get_discount_intent() && ! $this->is_per_product_free_bogo( $campaign, $rules ) ) {
			$rules = $this->select_bogo_tier_rule( $campaign, $rules );

			if ( empty( $rules ) ) {
				return $discounts;
			}
		}

		/**
		 * Combined qualifying quantity for recursive BOGO, filtered by the
		 * conditions and few-products filters and excluding Disco free items.
		 */
		$total_applicable_qty = $this->get_total_applicable_quantity( $cart, $campaign );

		/**
		 * "Count Quantity As" combined / variations modes pool quantities across
		 * cart line items before deciding eligibility, so they take a dedicated
		 * path. The default `separate` mode keeps the original per-line behaviour.
		 *
		 * BOGO is excluded — count modes only apply to Bundle / Bulk:
		 *  - BuyXGetX matches purely on each line's own quantity, so it always
		 *    behaves as `separate` regardless of the count mode.
		 *  - BuyXGetY rewards the Y (get) product, not the counted X products, so
		 *    it stays on the per-item path and only its buy-X gate is pooled
		 *    (see {@see self::verify_xproduct_cart_rule()}).
		 */
		if (
			! in_array( $campaign->get_discount_intent(), array( 'BuyXGetX', 'BuyXGetY' ), true )
			&& in_array( $campaign->get_count_quantity_as(), array( 'combined', 'variations' ), true )
		) {
			return $this->get_grouped_item_discounts( $campaign, $cart, $rules, $total_applicable_qty );
		}

		// Loop through the cart items.
		foreach ( $items as $item ) {
			// Loop through the discount rules.
			foreach ( $rules as $rule ) {
				if ( is_object( $rule ) ) {
					$rule = (array) $rule;
				}

				// Verify the rule by campaign settings.
				if ( ! $this->verify_rules( $campaign, $item, $rule ) ) {
					continue;
				}

				$this->apply_rule_to_discount( $discounts, $campaign, $rule, $item, $cart, $total_applicable_qty );
			}//end foreach
		}//end foreach

		return $discounts;
	}

	/**
	 * Prepare discounts for the `combined` / `variations` counting modes.
	 *
	 * Eligibility is resolved by {@see QuantityCounter}: quantities are pooled
	 * per group (all applicable lines for `combined`, per parent product for
	 * `variations`), range-capped, and threaded into the Calc layer through the
	 * `disco_forced_qty` item key.
	 *
	 * How many units are actually discounted depends on the rule:
	 *  - Bundle / Bulk (no `get_quantity`) → every qualifying unit is discounted.
	 *  - BOGO (`get_quantity` set)          → only the reward units are discounted,
	 *    i.e. `get_quantity × bundles`, where `bundles = floor(pool / min)`
	 *    (1 for a non-recursive rule). Otherwise a "buy 2 get 1" in combined mode
	 *    would wrongly discount the 2 bought units instead of the 1 reward unit.
	 * Reward units are handed out across the eligible lines in cart order.
	 *
	 * @param \Disco\App\Utility\Config $campaign             Campaign Config.
	 * @param \WC_Cart                  $cart                 Cart Object.
	 * @param array                     $rules                Discount rules.
	 * @param int                       $total_applicable_qty Combined qualifying quantity.
	 */
	private function get_grouped_item_discounts( Config $campaign, \WC_Cart $cart, array $rules, int $total_applicable_qty ): array {//phpcs:ignore
		$discounts        = array();
		$quantity_counter = new QuantityCounter;

		foreach ( $rules as $rule ) {
			if ( is_object( $rule ) ) {
				$rule = (array) $rule;
			}

			$eligible_lines = $quantity_counter->get_eligible_units( $cart, $campaign, $rule );

			if ( empty( $eligible_lines ) ) {
				continue;
			}

			// Total qualifying units across the pooled lines.
			$total_qualifying_units = 0;

			foreach ( $eligible_lines as $eligible_line ) {
				$total_qualifying_units += $eligible_line['eligible_qty'];
			}

			$discountable_units = $this->grouped_discount_budget( $rule, $total_qualifying_units );

			// Hand out the discountable units across the eligible lines in cart order.
			foreach ( $eligible_lines as $eligible_line ) {
				if ( $discountable_units <= 0 ) {
					break;
				}

				$line_units = (int) min( $eligible_line['eligible_qty'], $discountable_units );

				if ( $line_units <= 0 ) {
					continue;
				}

				$discountable_units -= $line_units;

				$item                     = $eligible_line['item'];
				$item['disco_forced_qty'] = $line_units;

				$this->apply_rule_to_discount( $discounts, $campaign, $rule, $item, $cart, $total_applicable_qty );
			}
		}

		return $discounts;
	}

	/**
	 * Number of units a pooled rule should actually discount.
	 *
	 * BOGO rules (with `get_quantity`) reward `get_quantity × bundles`; every
	 * other rule discounts the whole qualifying pool.
	 *
	 * @param array $rule             Discount rule.
	 * @param int   $total_qualifying Pooled qualifying quantity.
	 */
	private function grouped_discount_budget( array $rule, int $total_qualifying ): int {
		$reward_quantity = ! empty( $rule['get_quantity'] ) ? (int) $rule['get_quantity'] : 0; // phpcs:ignore

		if ( $reward_quantity <= 0 ) {
			// Bundle / Bulk: discount every qualifying unit.
			return $total_qualifying;
		}

		$minimum_quantity     = isset( $rule['min'] ) ? absint( $rule['min'] ) : 0; // phpcs:ignore
		$bundle_count = $minimum_quantity > 0 ? (int) floor( $total_qualifying / $minimum_quantity ) : 1; // phpcs:ignore

		if ( $bundle_count < 1 ) {
			$bundle_count = 1;
		}

		// BOGO reward: get_quantity per qualifying bundle, never more than the pool.
		return (int) min( $reward_quantity * $bundle_count, $total_qualifying );
	}

	/**
	 * Populate the discount array for a single cart line + rule pair.
	 *
	 * Shared by both the per-line (`separate`) path and the grouped
	 * (`combined` / `variations`) path so the emitted discount structure is
	 * identical regardless of counting mode.
	 *
	 * @param array                     $discounts            Discount array, by reference.
	 * @param \Disco\App\Utility\Config $campaign             Campaign Config.
	 * @param array                     $rule                 Single discount rule.
	 * @param array                     $item                 Cart item (may carry `disco_forced_qty`).
	 * @param \WC_Cart                  $cart                 Cart Object.
	 * @param int                       $total_applicable_qty Combined qualifying quantity.
	 */
	private function apply_rule_to_discount( array &$discounts, Config $campaign, array $rule, array $item, \WC_Cart $cart, int $total_applicable_qty ): void {//phpcs:ignore
		$product              = $item['data'];
		$rule_key             = md5( microtime() . wp_rand() );
		$effective_product_id = $this->get_cart_item_id( $item );

		// Set the discount array.
		$discounts[ $effective_product_id ]['original_price'] = $product->get_price();
		$discounts[ $effective_product_id ]['cart_item_key']  = $item['key'];

		// Set discount applies to
		$discounts[ $effective_product_id ]['discount_applies_to'][ $rule_key ] = CalcFactory::discount_applies_to( $rule, $campaign );

		// Set Discounts.
		if ( $rule['discount_type'] === 'free' ) {
			$discounted_amount                             = array(
				'price'                 => $product->get_price(),
				'discount'              => 0,
				'line_subtotal'         => $product->get_price() * $item['quantity'],
				'discounted_quantities' => 0,
			);
			$discounts[ $effective_product_id ]['free']    = true;
			$discounts[ $effective_product_id ]['get_ids'] = $rule['get_ids'];

			if ( 'products' === $campaign->get_bogo_type() ) {
				if ( in_array( $campaign->get_count_quantity_as(), array( 'combined', 'variations' ), true ) ) {
					/**
					 * Combined / variations: the buy-X quantity is pooled across
					 * the cart, so the reward is one bundle (non-recursive) or one
					 * per bundle (recursive) of the pooled total — not per line.
					 */
					$minimum_quantity = isset( $rule['min'] ) ? absint( $rule['min'] ) : 0; // phpcs:ignore
					$reward_quantity  = ! empty( $rule['get_quantity'] ) ? (int) $rule['get_quantity'] : 0; // phpcs:ignore

					if ( 'yes' === $rule['recursive'] && $minimum_quantity > 0 ) {
						$discounts[ $effective_product_id ]['get_qty'] = (int) floor( $total_applicable_qty / $minimum_quantity ) * $reward_quantity;
					} else {
						$discounts[ $effective_product_id ]['get_qty'] = $reward_quantity;
					}
				} else {
					/**
					 * Separate: X = all products. Every cart product grants the
					 * reward of each tier its own quantity matches (summed), so
					 * two products matching different tiers each contribute.
					 */
					$discounts[ $effective_product_id ]['get_qty'] = $this->get_products_bogo_free_quantity( $campaign, $cart );
				}
			} else {
				/**
				 * BuyXGetX ('all'): per line, recursive → floor( line qty / min ) ×
				 * get_quantity. Category BOGO never reaches this — its free items are
				 * owned by {@see \Disco\App\Intents\CategoryBogo\CategoryBogo}.
				 */
				$discounts[ $effective_product_id ]['get_qty'] = CalcFactory::get_free_quantity( $rule, $item );
			}
		} else {
			$discounted_amount                             = CalcFactory::get_discount( $rule, $item, $cart, $campaign );
			$discounts[ $effective_product_id ]['free']    = false;
			$discounts[ $effective_product_id ]['get_ids'] = array();
			$discounts[ $effective_product_id ]['get_qty'] = 0;
		}

		$discounts[ $effective_product_id ]['discount_types'][ $rule_key ]        = $rule['discount_type'];
		$discounts[ $effective_product_id ]['intent'][ $rule_key ]                = $campaign->get_discount_intent();
		$discounts[ $effective_product_id ]['prices'][ $rule_key ]                = $discounted_amount['price'];
		$discounts[ $effective_product_id ]['discounts'][ $rule_key ]             = $discounted_amount['discount'];
		$discounts[ $effective_product_id ]['subtotals'][ $rule_key ]             = $discounted_amount['line_subtotal'];
		$discounts[ $effective_product_id ]['discounted_quantities'][ $rule_key ] = $discounted_amount['discounted_quantities'];
		$discounts[ $effective_product_id ]['quantities'][ $rule_key ]            = $item['quantity'];

		$discounts[ $effective_product_id ]['offers'][ $rule_key ] = $this->get_item_offers( $rule );
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
			$discount_limit = $intent->campaign->discount_max_user;

			// Only count applied orders when a limit is actually configured.
			if ( ! empty( $discount_limit ) && $discount_limit >= 0 ) {
				$total_applied_campaign = ( new UserLimit )->disco_get_total_applied_campaign( $intent->campaign->id );

				if ( $total_applied_campaign >= $discount_limit ) {
					continue;
				}
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
	 * @return int|string|null
	 */
	public function get_valid_bogo_category_item_id( array $intents, \WC_Cart $cart, array $discounts ) {//phpcs:ignore
		foreach ( $intents as $intent ) {
			if (
				$intent->campaign->get_discount_intent() !== 'BuyXGetY' ||
				$intent->campaign->get_bogo_type() !== 'categories'
			) {
				continue;
			}

			// Collect every eligible category item (in cart order) with its price,
			// then pick the reward item per the campaign's selection strategy.
			$candidates = array();

			foreach ( $cart->get_cart() as $item ) {
				$cart_item_id = $this->get_cart_item_id( $item );

				if ( isset( $discounts[ $cart_item_id ] ) && $discounts[ $cart_item_id ] > 0 ) { // phpcs:ignore
					$candidates[ $cart_item_id ] = CalcFactory::get_price( $item );
				}
			}

			if ( empty( $candidates ) ) {
				continue;
			}

			return $this->pick_reward_item( $candidates, $intent->campaign->get_free_item_selection() );
		}

		return null;
	}

	/**
	 * Pick the reward cart-item id from eligible candidates.
	 *
	 * Honours the "Free Item Selection" strategy when more than one product
	 * from the reward category is in the cart:
	 *  - `cart_order` (default) → the first eligible item in cart order.
	 *  - `lowest`               → the lowest-priced eligible item.
	 *  - `highest`              → the highest-priced eligible item.
	 * Ties keep cart order (first match wins).
	 *
	 * @param array<int|string, float> $candidates Map of item id => price, in cart order.
	 * @param string                   $selection  Selection strategy.
	 * @return int|string|null
	 */
	private function pick_reward_item( array $candidates, string $selection ) {
		if ( 'lowest' === $selection ) {
			return array_keys( $candidates, min( $candidates ), true )[0];
		}

		if ( 'highest' === $selection ) {
			return array_keys( $candidates, max( $candidates ), true )[0];
		}

		return array_key_first( $candidates );
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
			$discount_limit = $intent->campaign->discount_max_user;

			// Only count applied orders when a limit is actually configured.
			if ( ! empty( $discount_limit ) && $discount_limit >= 0 ) {
				$total_applied_campaign = ( new UserLimit )->disco_get_total_applied_campaign( $intent->campaign->id );

				if ( $total_applied_campaign >= $discount_limit ) {
					continue;
				}
			}

			$items         = $this->get_items_for_discount( $cart, $intent->campaign );
			$get_discounts = $intent->get_discounts( $items, $cart );

			if ( empty( $get_discounts ) ) {
				continue;
			}

			// Only stage campaigns whose discount actually applied to the cart.
			( new UserLimit )->disco_start_session_on_checkout( $intent->campaign->id );

			foreach ( $get_discounts as $item_id => $discount ) {
				$discounts[ $item_id ]['discounts'][]           = max( $discount['discounts'] ); // phpcs:ignore
				$discounts[ $item_id ]['free']                  = $discount['free']; // phpcs:ignore
				$discounts[ $item_id ]['get_ids']               = $discount['get_ids']; // phpcs:ignore
				$discounts[ $item_id ]['get_qty']               = $discount['get_qty']; // phpcs:ignore
				$discounts[ $item_id ]['bogo_type']             = $intent->campaign->get_bogo_type(); // phpcs:ignore
				$discounts[ $item_id ]['free_item_selection']   = $intent->campaign->get_free_item_selection(); // phpcs:ignore
			}
		}

		// Check if the discounts are empty.
		if ( empty( $discounts ) ) {
			return false;
		}

		/**
		 * Aggregate the per-item free rewards into the flat shape the cart hook
		 * consumes. Union every qualifying reward id (previously this overwrote
		 * on each pass, so only the last cart item was ever granted its free
		 * product) and keep a per-id quantity map for products whose free counts
		 * differ (e.g. recursive BuyXGetX).
		 */
		$reward_product_ids  = array();
		$reward_quantity_map = array();
		$has_free_items      = false;
		$bogo_type           = 'products';
		$free_item_selection = 'cart_order';

		foreach ( $discounts as $item_id => $discount ) {
			$has_free_items      = $discount['free'];
			$bogo_type           = $discount['bogo_type'] ?? 'products';
			$free_item_selection = $discount['free_item_selection'] ?? 'cart_order';

			$rule_reward_ids = ! empty( $discount['get_ids'] ) ? array_column( $discount['get_ids'], 'id' ) : array( $item_id ); // phpcs:ignore

			foreach ( $rule_reward_ids as $reward_product_id ) {
				$reward_product_id                = (int) $reward_product_id; // phpcs:ignore
				$reward_product_ids[]          = $reward_product_id; // phpcs:ignore
				$reward_quantity_map[ $reward_product_id ]    = (int) $discount['get_qty']; // phpcs:ignore
			}
		}

		$reward_product_ids = array_values( array_unique( $reward_product_ids ) );

		$discounts['discount']            = 0.0;
		$discounts['free']                = $has_free_items;
		$discounts['get_ids']             = $reward_product_ids;
		$discounts['get_qty']             = empty( $reward_quantity_map ) ? 0 : max( $reward_quantity_map ); // phpcs:ignore
		$discounts['get_qty_map']         = $reward_quantity_map;
		$discounts['bogo_type']           = $bogo_type;
		$discounts['free_item_selection'] = $free_item_selection;

		/**
		 * BuyXGetY (products): replace the flat aggregation with an authoritative
		 * reward map keyed by the tier's own get product, so each cart product
		 * that qualifies grants its tier's reward.
		 *
		 * Category BOGO is not handled here — {@see \Disco\App\Intents\CategoryBogo\CategoryBogo}
		 * owns its reward selection, buy reservation and cart reconciliation.
		 */
		foreach ( $intents as $intent ) {
			$bogo_type = $intent->campaign->get_bogo_type();

			if ( 'BuyXGetY' !== $intent->campaign->get_discount_intent() || 'products' !== $bogo_type ) {
				continue;
			}

			// Only free-type rules grant free items; a percent/fixed BOGO must not
			// fabricate free products here.
			$rules      = $intent->campaign->get_discount_rules();
			$first_rule = ( is_array( $rules ) && isset( $rules[0] ) ) ? ( is_object( $rules[0] ) ? (array) $rules[0] : $rules[0] ) : array(); // phpcs:ignore

			if ( ! isset( $first_rule['discount_type'] ) || 'free' !== $first_rule['discount_type'] ) {
				continue;
			}

			$reward_map = $this->compute_bogo_products_free_map( $intent->campaign, $cart );

			// Always authoritative: an empty map means no qualifying (non-reward)
			// purchase, so no free items — do not fall back to the flat count.
			$discounts['get_ids']             = array_keys( $reward_map ); // phpcs:ignore
			$discounts['get_qty_map']         = $reward_map; // phpcs:ignore
			// Each get-product is freed its own quantity.
			$discounts['get_qty']             = empty( $reward_map ) ? 0 : max( $reward_map ); // phpcs:ignore
			$discounts['free']                = ! empty( $reward_map ); // phpcs:ignore
			$discounts['bogo_type']           = $bogo_type;
			$discounts['free_item_selection'] = $intent->campaign->get_free_item_selection();
		}

		return $discounts;
	}

	/**
	 * Authoritative free Y map for a BuyXGetY (products) campaign.
	 *
	 * Returns get-product id => free quantity, attributing each tier's reward to
	 * that tier's own get-products:
	 *  - `separate`             → each cart line credits every tier whose range
	 *                             its own quantity matches ([min,max]); rewards
	 *                             sum, and each tier credits its own get-products.
	 *  - `combined`            → one pool over every applicable line; the highest
	 *                             tier it reaches credits its get-products once.
	 *  - `variations`          → one pool per parent product (all variations of
	 *                             the same variable count together, and a simple
	 *                             product is its own pool); every pool that
	 *                             reaches a tier credits that tier's get-products,
	 *                             so two qualifying parents grant two rewards.
	 * Recursive tiers multiply by floor(qty/min) (line qty for separate, pool qty
	 * for combined / variations).
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param \WC_Cart                  $cart     Cart Object.
	 * @return array<int, int>
	 */
	private function compute_bogo_products_free_map( Config $campaign, \WC_Cart $cart ): array {//phpcs:ignore
		$rules = $campaign->get_discount_rules();

		if ( ! is_array( $rules ) || empty( $rules ) ) {
			return array();
		}

		$reward_map = array();

		if ( in_array( $campaign->get_count_quantity_as(), array( 'combined', 'variations' ), true ) ) {
			foreach ( $this->get_bogo_buy_pool_quantities( $cart, $campaign ) as $pool_quantity ) {
				$this->credit_bogo_pool_reward( $reward_map, $rules, $pool_quantity );
			}

			return $reward_map;
		}

		/**
		 * Separate: build the buy quantity per product, then each product earns
		 * the highest tier its quantity qualifies for (min <= qty). The upper
		 * `max` marks where the next tier begins, not a cut-off, so a quantity
		 * above the top tier still earns it and a gap earns the tier below.
		 * Free lines never count.
		 */
		$buy_quantity_per_product = array();

		foreach ( $cart->get_cart() as $item ) {
			if ( ! empty( $item['is_free_product'] ) ) {
				continue;
			}

			$effective_product_id = $item['product_id'];

			if ( ! empty( $item['variation_id'] ) ) {
				$effective_product_id = $item['variation_id'];
			}

			if ( ! $campaign->product_is_applicable( $effective_product_id ) ) {
				continue;
			}

			$product = wc_get_product( $effective_product_id );

			if ( ! Helper::is_filter_passed( $campaign, array( 'product' => $product ) ) ) {
				continue;
			}

			$buy_quantity_per_product[ (int) $effective_product_id ] = ( $buy_quantity_per_product[ (int) $effective_product_id ] ?? 0 ) + (int) $item['quantity'];
		}

		foreach ( $buy_quantity_per_product as $quantity ) {
			$qualifying_rule    = null;
			$qualifying_minimum = -1;

			foreach ( $rules as $rule ) {
				$rule = is_object( $rule ) ? (array) $rule : $rule; // phpcs:ignore
				$minimum_quantity  = isset( $rule['min'] ) ? absint( $rule['min'] ) : 0; // phpcs:ignore
				$reward_quantity   = ! empty( $rule['get_quantity'] ) ? (int) $rule['get_quantity'] : 0; // phpcs:ignore

				if ( $minimum_quantity <= 0 || $reward_quantity <= 0 || empty( $rule['get_ids'] ) ) {
					continue;
				}

				if ( $quantity >= $minimum_quantity && $minimum_quantity > $qualifying_minimum ) { // phpcs:ignore
					$qualifying_rule    = $rule;
					$qualifying_minimum = $minimum_quantity;
				}
			}

			if ( null === $qualifying_rule ) {
				continue;
			}

			$minimum_quantity = absint( $qualifying_rule['min'] );
			$reward_quantity  = (int) $qualifying_rule['get_quantity'];
			$is_recursive    = ! empty( $qualifying_rule['recursive'] ) && 'yes' === $qualifying_rule['recursive']; // phpcs:ignore
			$reward_total = ( $is_recursive && $minimum_quantity > 0 ) ? ( (int) floor( $quantity / $minimum_quantity ) * $reward_quantity ) : $reward_quantity; // phpcs:ignore

			if ( $reward_total > 0 ) { // phpcs:ignore
				foreach ( array_column( $qualifying_rule['get_ids'], 'id' ) as $reward_product_id ) {
					$reward_map[ (int) $reward_product_id ] = ( $reward_map[ (int) $reward_product_id ] ?? 0 ) + $reward_total;
				}
			}
		}

		return $reward_map;
	}

	/**
	 * Pooled buy quantities for combined / variations, excluding free lines.
	 *
	 * `combined` returns a single pool over every applicable line. `variations`
	 * returns one pool per parent product, so variations of the same variable
	 * product count together while different parents stay apart — the same
	 * grouping {@see QuantityCounter} applies to the buy-X gate.
	 *
	 * @param \WC_Cart                  $cart     Cart Object.
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @return array<string, int> Pool key => pooled quantity.
	 */
	private function get_bogo_buy_pool_quantities( \WC_Cart $cart, Config $campaign ): array {//phpcs:ignore
		$pool_quantities = array();
		$pool_per_parent = 'variations' === $campaign->get_count_quantity_as();
		$cart_items      = $cart->get_cart();

		if ( ! is_array( $cart_items ) ) {
			return $pool_quantities;
		}

		foreach ( $cart_items as $item ) {
			if ( ! empty( $item['is_free_product'] ) ) {
				continue;
			}

			$effective_product_id = $item['product_id'];

			if ( ! empty( $item['variation_id'] ) ) {
				$effective_product_id = $item['variation_id'];
			}

			if ( ! $campaign->product_is_applicable( $effective_product_id ) ) {
				continue;
			}

			$product = wc_get_product( $effective_product_id );

			if ( ! Helper::is_filter_passed( $campaign, array( 'product' => $product ) ) ) {
				continue;
			}

			$pool_key = $pool_per_parent ? 'parent_' . (int) $item['product_id'] : 'all'; // phpcs:ignore

			$pool_quantities[ $pool_key ] = ( $pool_quantities[ $pool_key ] ?? 0 ) + (int) $item['quantity'];
		}

		return $pool_quantities;
	}

	/**
	 * Credit one pool's reward to the get-products of the tier it qualifies for.
	 *
	 * The winning tier is the one with the highest `min` the pool reaches; a
	 * recursive tier multiplies its reward by the number of complete sets.
	 *
	 * @param array $reward_map    Reward map (get-product id => quantity), by reference.
	 * @param array $rules         Discount rules.
	 * @param int   $pool_quantity Pooled buy quantity.
	 */
	private function credit_bogo_pool_reward( array &$reward_map, array $rules, int $pool_quantity ): void {//phpcs:ignore
		$qualifying_rule    = null;
		$qualifying_minimum = -1;

		foreach ( $rules as $rule ) {
			$rule = is_object( $rule ) ? (array) $rule : $rule; // phpcs:ignore
			$minimum_quantity  = isset( $rule['min'] ) ? absint( $rule['min'] ) : 0; // phpcs:ignore

			if ( $minimum_quantity > 0 && $pool_quantity >= $minimum_quantity && $minimum_quantity > $qualifying_minimum ) { // phpcs:ignore
				$qualifying_rule    = $rule;
				$qualifying_minimum = $minimum_quantity;
			}
		}

		if ( null === $qualifying_rule || empty( $qualifying_rule['get_ids'] ) ) {
			return;
		}

		$minimum_quantity = absint( $qualifying_rule['min'] );
		$reward_quantity  = ! empty( $qualifying_rule['get_quantity'] ) ? (int) $qualifying_rule['get_quantity'] : 0; // phpcs:ignore
		$is_recursive = ! empty( $qualifying_rule['recursive'] ) && 'yes' === $qualifying_rule['recursive']; // phpcs:ignore
		$quantity = ( $is_recursive && $minimum_quantity > 0 ) ? (int) floor( $pool_quantity / $minimum_quantity ) * $reward_quantity : $reward_quantity; // phpcs:ignore

		if ( $quantity <= 0 ) {
			return;
		}

		foreach ( array_column( $qualifying_rule['get_ids'], 'id' ) as $reward_product_id ) {
			$reward_map[ (int) $reward_product_id ] = ( $reward_map[ (int) $reward_product_id ] ?? 0 ) + $quantity;
		}
	}

	/**
	 * Is it a bogo campaign?
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 */
	public function is_bogo( Config $campaign ): bool { // phpcs:ignore
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
	 * Strip the embedded tax portion from a discount amount.
	 *
	 * When WooCommerce is set to enter prices inclusive of tax, the discount
	 * amount computed by the intents also carries that tax (e.g. a 50 discount
	 * becomes 55 at 10% tax). The cart fee is added as non-taxable, so the tax
	 * must be removed here to keep the net discount correct.
	 *
	 * When a cart is supplied, the embedded-tax portion is derived from the
	 * cart's own subtotal and subtotal tax rather than assuming the whole
	 * amount carries the standard rate. This keeps mixed carts correct where
	 * some products are taxable and others are not (or use different tax
	 * classes): non-taxable products add to the subtotal but contribute zero
	 * tax, so the effective inclusive-tax ratio drops accordingly.
	 *
	 * @since 1.3.54
	 * @param float         $amount Tax-inclusive discount amount.
	 * @param \WC_Cart|null $cart   Optional cart used to derive the effective tax ratio.
	 * @return float Tax-exclusive discount amount.
	 */
	public function get_discount_exclude_tax( float $amount, $cart = null ): float {
		if ( ! function_exists( 'wc_prices_include_tax' ) || ! wc_prices_include_tax() ) {
			return $amount;
		}

		if ( ! class_exists( 'WC_Tax' ) ) {
			return $amount;
		}

		// Prefer a product-derived inclusive-tax ratio so mixed carts strip
		// only the tax actually embedded. The discount base is built from each
		// product's tax-inclusive price (see CalcFactory::get_price), so we
		// rebuild the same base excluding tax per product. wc_get_price_excluding_tax
		// respects each product's own tax status and class: a non-taxable
		// product returns its price unchanged and contributes zero embedded tax.
		if ( $cart instanceof \WC_Cart && function_exists( 'wc_get_price_excluding_tax' ) ) {
			return $this->strip_tax_using_cart_ratio( $amount, $cart );
		}

		// Fallback: rates for the standard tax class at the customer location.
		$rates = \WC_Tax::get_rates( '' );

		if ( empty( $rates ) ) {
			return $amount;
		}

		// Tax embedded inside the inclusive amount, then remove it.
		$tax_total = array_sum( \WC_Tax::calc_inclusive_tax( $amount, $rates ) );

		return $amount - $tax_total;
	}

	/**
	 * Strip embedded tax from a discount using the cart's own inclusive-tax ratio.
	 *
	 * Rebuilds the discount base (sum of tax-inclusive prices) and its
	 * tax-exclusive counterpart per product, then scales the discount by the
	 * excl/incl ratio. Non-taxable products contribute equally to both sums,
	 * so their share keeps no tax stripped.
	 *
	 * @param float    $amount Tax-inclusive discount amount.
	 * @param \WC_Cart $cart   Cart used to derive the ratio.
	 * @return float Tax-exclusive discount amount.
	 */
	private function strip_tax_using_cart_ratio( float $amount, \WC_Cart $cart ): float {
		$incl_sum   = 0.0;
		$excl_sum   = 0.0;
		$cart_items = $cart->get_cart();

		if ( ! is_array( $cart_items ) ) {
			$cart_items = array();
		}

		foreach ( $cart_items as $cart_item ) {
			if ( empty( $cart_item['data'] ) || ! $cart_item['data'] instanceof \WC_Product ) {
				continue;
			}

			$product    = $cart_item['data'];
			$qty        = (float) ( $cart_item['quantity'] ?? 1 );
			$price_incl = (float) $product->get_price();
			$price_excl = (float) wc_get_price_excluding_tax( $product, array( 'price' => $price_incl ) );

			$incl_sum += $price_incl * $qty;
			$excl_sum += $price_excl * $qty;
		}

		// No priced items in the cart -> nothing to strip.
		if ( $incl_sum <= 0 ) {
			return $amount;
		}

		$net = $amount * $excl_sum / $incl_sum;

		$decimals = 2;

		if ( function_exists( 'wc_get_price_decimals' ) ) {
			$decimals = wc_get_price_decimals();
		}

		return round( $net, $decimals );
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
	 * Whether a campaign is a free products BOGO evaluated per product.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param array                     $rules    Discount rules.
	 */
	private function is_per_product_free_bogo( Config $campaign, array $rules ): bool {
		if ( 'products' !== $campaign->get_bogo_type() ) {
			return false;
		}

		if ( in_array( $campaign->get_count_quantity_as(), array( 'combined', 'variations' ), true ) ) {
			return false;
		}

		$first_rule = isset( $rules[0] ) ? ( is_object( $rules[0] ) ? (array) $rules[0] : $rules[0] ) : array(); // phpcs:ignore

		return isset( $first_rule['discount_type'] ) && 'free' === $first_rule['discount_type'];
	}

	/**
	 * Total free Y quantity for a products BuyXGetY campaign in `separate` mode.
	 *
	 * X is every applicable product. Each cart line grants the reward of every
	 * rule (tier) whose range its own quantity falls in — `qty` within
	 * `[min, max]` (no max = min-only) — summed across matching tiers, and ×
	 * floor(qty/min) when the tier is recursive. The Y product counts as an X
	 * line too. Summing across all qualifying lines gives the free Y count, so
	 * two products each matching a different tier grant each tier's reward.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param \WC_Cart                  $cart     Cart Object.
	 */
	private function get_products_bogo_free_quantity( Config $campaign, \WC_Cart $cart ): int {//phpcs:ignore
		$rules      = $campaign->get_discount_rules();
		$cart_items = $cart->get_cart();

		if ( ! is_array( $rules ) || ! is_array( $cart_items ) ) {
			return 0;
		}

		$free_quantity_total = 0;

		foreach ( $cart_items as $item ) {
			if ( ! empty( $item['is_free_product'] ) ) {
				continue;
			}

			$effective_product_id = $item['product_id'];

			if ( ! empty( $item['variation_id'] ) ) {
				$effective_product_id = $item['variation_id'];
			}

			if ( ! $campaign->product_is_applicable( $effective_product_id ) ) {
				continue;
			}

			$product = wc_get_product( $effective_product_id );

			if ( ! Helper::is_filter_passed( $campaign, array( 'product' => $product ) ) ) {
				continue;
			}

			$line_quantity = (int) $item['quantity'];

			foreach ( $rules as $rule ) {
				$rule         = is_object( $rule ) ? (array) $rule : $rule; // phpcs:ignore
				$minimum_quantity          = isset( $rule['min'] ) ? absint( $rule['min'] ) : 0; // phpcs:ignore
				$maximum_quantity          = ! empty( $rule['max'] ) ? absint( $rule['max'] ) : 0; // phpcs:ignore
				$get_quantity = ! empty( $rule['get_quantity'] ) ? (int) $rule['get_quantity'] : 0; // phpcs:ignore
				$recursive    = ! empty( $rule['recursive'] ) && 'yes' === $rule['recursive']; // phpcs:ignore

				if ( $minimum_quantity <= 0 || $get_quantity <= 0 || $line_quantity < $minimum_quantity ) {
					continue;
				}

				// Respect the tier's upper bound so each product matches its tier.
				if ( $maximum_quantity > 0 && $line_quantity > $maximum_quantity && 'yes' !== $rule['recursive'] ) {
					continue;
				}

				$free_quantity_total += $recursive ? ( (int) floor( $line_quantity / $minimum_quantity ) * $get_quantity ) : $get_quantity; // phpcs:ignore
			}
		}

		return $free_quantity_total;
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
	/**
	 * Pick the single BuyXGetY tier that applies for the current cart.
	 *
	 * Tiers are ranked by `min`: the winner is the qualifying rule with the
	 * highest `min` that the buy quantity still meets (the broken upper `max` is
	 * ignored — a rule qualifies on `qty >= min`, mirroring the gate). On a tie,
	 * the later rule wins. Returns a list with 0 or 1 rule.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param array                     $rules    All discount rules.
	 */
	private function select_bogo_tier_rule( Config $campaign, array $rules ): array {
		$qualifying_rule    = null;
		$qualifying_minimum = -1;

		foreach ( $rules as $rule ) {
			$rule_array = is_object( $rule ) ? (array) $rule : $rule; // phpcs:ignore

			// Rule only counts if the cart meets its buy-X threshold.
			if ( ! $this->verify_xproduct_cart_rule( $campaign, $rule_array ) ) {
				continue;
			}

			$minimum_quantity = isset( $rule_array['min'] ) ? absint( $rule_array['min'] ) : 0; // phpcs:ignore

			if ( $minimum_quantity >= $qualifying_minimum ) { // phpcs:ignore
				$qualifying_minimum = $minimum_quantity;
				$qualifying_rule    = $rule;
			}
		}

		return null === $qualifying_rule ? array() : array( $qualifying_rule ); // phpcs:ignore
	}

	private function verify_xproduct_cart_rule( Config $campaign, array $rule ): bool { //phpcs:ignore
		/**
		 * "Count Quantity As" combined / variations: pool the buy-X quantity
		 * across cart lines instead of requiring a single line to reach `min`,
		 * so a mixed cart (e.g. 1 + 1 of different products) can satisfy a
		 * "buy 2" threshold. QuantityCounter honours the same min / max /
		 * recursive semantics used elsewhere.
		 */
		if ( in_array( $campaign->get_count_quantity_as(), array( 'combined', 'variations' ), true ) ) { // phpcs:ignore
			$quantity_counter = new QuantityCounter;

			return ! empty( $quantity_counter->get_eligible_units( WC()->cart, $campaign, $rule ) );
		}

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
