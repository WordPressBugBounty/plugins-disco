<?php
/**
 * Category BOGO engine.
 *
 * @package    Disco
 * @subpackage \App\Intents\CategoryBogo
 */

namespace Disco\App\Intents\CategoryBogo;

use Disco\App\Features\UserLimit;
use Disco\App\Utility\Config;
use Disco\App\Utility\Value;

/**
 * Category BOGO (Buy X Get Y with a reward category) engine.
 *
 * Owns the whole free-item lifecycle for `bogo_type = categories` campaigns
 * whose rules are `discount_type = free`:
 *
 * 1. Buy (X) quantities are collected from the cart per "Count Quantity As"
 * (`separate` / `combined` / `variations`), always excluding units that are
 * currently assigned free or already reserved by an earlier campaign.
 * 2. The qualifying tier is the rule with the highest `min` the pool reaches.
 * Non-recursive rules cap the eligible buy quantity at `max`; recursive rules
 * ignore `max` and repeat per complete buy set.
 * 3. Buy units are RESERVED before any reward is selected, so they always stay
 * paid and can never be reused by another campaign. Reservation consumes units
 * outside the reward category first, which is what makes "buy X get Y from the
 * same category" terminate instead of self-qualifying.
 * 4. Reward units are taken from the reward category per "Select Item Discount"
 * (`cart_order` / `lowest` / `highest`).
 * 5. CategoryBogoCart reconciles the cart: each product keeps exactly the
 * entitled free quantity and the excess is converted back to paid.
 *
 * Every campaign is processed independently against the shared reservation and
 * free ledgers, so one campaign never overwrites another's assignment.
 *
 * @package    Disco
 * @subpackage Disco\App\Intents\CategoryBogo
 * @category   Intention
 */
class CategoryBogo {

	/**
	 * Cart products merged per product key, in cart order.
	 *
	 * @var array<string, array<string, mixed>>
	 */
	private $cart_products = array();

	/**
	 * Quantities locked as a buy (X) purchase, per cart product key.
	 *
	 * @var array<string, int>
	 */
	private $reserved_buy_quantities = array();

	/**
	 * Quantities handed out as free (Y), per cart product key.
	 *
	 * @var array<string, int>
	 */
	private $assigned_free_quantities = array();

	/**
	 * Campaign ids that granted a free item on the last calculation.
	 *
	 * @var array<int, int>
	 */
	private $applied_campaign_ids = array();

	/**
	 * Cart reader / writer.
	 *
	 * @var \Disco\App\Intents\CategoryBogo\CategoryBogoCart
	 */
	private $cart_manager;

	/**
	 * Campaign / rule reader.
	 *
	 * @var \Disco\App\Intents\CategoryBogo\CategoryBogoRules
	 */
	private $campaign_rules;

	/**
	 * Engine constructor.
	 */
	public function __construct() {
		$this->cart_manager   = new CategoryBogoCart;
		$this->campaign_rules = new CategoryBogoRules;
	}

	/**
	 * Whether any category BOGO campaign is active for this request.
	 */
	public function has_active_category_bogo_campaigns(): bool {
		return ! empty( $this->campaign_rules->get_active_category_bogo_campaigns() );
	}

	/**
	 * Whether a non-category BOGO campaign still needs the legacy free-item pass.
	 */
	public function has_non_category_free_bogo_campaigns(): bool {
		return $this->campaign_rules->has_non_category_free_bogo_campaigns();
	}

	/**
	 * Calculate the free quantity every cart product is entitled to.
	 *
	 * @param \WC_Cart $cart Cart object.
	 * @return array<string, int> Map of cart product key (`productId:variationId`) => free quantity.
	 */
	public function calculate_free_item_entitlements( \WC_Cart $cart ): array {
		$this->applied_campaign_ids     = array();
		$this->reserved_buy_quantities  = array();
		$this->assigned_free_quantities = array();
		$this->cart_products            = array();

		$campaigns = $this->campaign_rules->get_active_category_bogo_campaigns();

		if ( empty( $campaigns ) ) {
			return array();
		}

		$this->cart_products = $this->cart_manager->get_merged_cart_products( $cart );

		if ( empty( $this->cart_products ) ) {
			return array();
		}

		foreach ( $campaigns as $campaign ) {
			$this->calculate_entitlements_for_campaign( $campaign );
		}

		return array_filter(
			$this->assigned_free_quantities,
			static function ( int $free_quantity ): bool {
				return $free_quantity > 0;
			}
		);
	}

	/**
	 * Calculate entitlements and reconcile the cart to match them.
	 *
	 * @param \WC_Cart $cart Cart object.
	 * @return bool True when a category BOGO campaign is active (the caller must
	 *              then leave category free items alone).
	 */
	public function apply_free_items_to_cart( \WC_Cart $cart ): bool {
		if ( ! $this->has_active_category_bogo_campaigns() ) {
			return false;
		}

		$entitlements       = $this->calculate_free_item_entitlements( $cart );
		$reward_product_map = $this->get_reward_category_product_keys();

		foreach ( $this->cart_products as $product_key => $cart_product ) {
			// Only products that belong to a reward category are ours to manage;
			// free items granted by other BOGO types must stay untouched.
			if ( ! isset( $reward_product_map[ $product_key ] ) ) {
				continue;
			}

			$cart_quantity = Value::to_int( $cart_product['quantity'] );
			$free_quantity = (int) min( $entitlements[ $product_key ] ?? 0, $cart_quantity );

			$this->cart_manager->sync_cart_product_free_quantity( $cart, $cart_product, $free_quantity );
		}

		foreach ( $this->applied_campaign_ids as $campaign_id ) {
			( new UserLimit )->disco_start_session_on_checkout( $campaign_id );
		}

		return true;
	}

	/**
	 * Calculate one campaign's entitlements and record it when it granted one.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign config.
	 */
	private function calculate_entitlements_for_campaign( Config $campaign ): void {
		$granted_before = array_sum( $this->assigned_free_quantities );

		$this->apply_campaign_rules_to_buy_pools( $campaign );

		if ( array_sum( $this->assigned_free_quantities ) <= $granted_before ) {
			return;
		}

		$this->applied_campaign_ids[] = $this->campaign_rules->get_campaign_id( $campaign );
	}

	/**
	 * Run a campaign's tiers against each of its buy pools.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign config.
	 */
	private function apply_campaign_rules_to_buy_pools( Config $campaign ): void {
		$free_item_rules = $this->campaign_rules->get_free_item_rules( $campaign );
		$buy_pools       = $this->campaign_rules->get_buy_quantity_pools( $campaign, $this->cart_products );

		if ( empty( $free_item_rules ) || empty( $buy_pools ) ) {
			return;
		}

		foreach ( $buy_pools as $pool_product_keys ) {
			$this->calculate_entitlement_for_buy_pool( $campaign, $free_item_rules, $pool_product_keys );
		}
	}

	/**
	 * Apply the best tier of one buy pool that can actually pay out.
	 *
	 * Tiers are tried highest `min` first. A tier is kept only when it grants a
	 * free unit: when the buy and reward categories overlap, a high tier can
	 * reserve every unit in the pool and leave nothing to give away, and the
	 * customer must then earn the lower tier instead of nothing at all.
	 *
	 * @param \Disco\App\Utility\Config        $campaign          Campaign config.
	 * @param array<int, array<string, mixed>> $free_item_rules   Free-item tiers.
	 * @param array<int, string>               $pool_product_keys Cart product keys pooled together.
	 */
	private function calculate_entitlement_for_buy_pool(
		Config $campaign,
		array $free_item_rules,
		array $pool_product_keys
	): void {
		$pool_quantity = 0;

		foreach ( $pool_product_keys as $product_key ) {
			$pool_quantity += $this->get_unclaimed_quantity( $product_key );
		}

		if ( $pool_quantity <= 0 ) {
			return;
		}

		foreach ( $this->campaign_rules->get_qualifying_tiers_for_buy_quantity( $free_item_rules, $pool_quantity ) as $rule ) {
			$reward_category_ids = $this->campaign_rules->get_reward_category_ids( $rule );
			$reward_queue        = $this->get_reward_products_in_selection_order( $campaign, $reward_category_ids );

			// Nothing from the reward category is in the cart: there is no reward
			// to hand out, so no buy units are consumed either.
			if ( empty( $reward_queue ) ) {
				continue;
			}

			if ( $this->apply_tier_when_it_grants_a_reward( $rule, $pool_product_keys, $reward_queue, $reward_category_ids ) ) {
				return;
			}
		}
	}

	/**
	 * Apply a tier, keeping the result only when it granted a free unit.
	 *
	 * The reservation and free ledgers are restored when the tier pays nothing,
	 * so a rejected tier leaves no buy units locked behind it.
	 *
	 * @param array<string, mixed> $rule                Tier to try.
	 * @param array<int, string>   $pool_product_keys   Cart product keys pooled together.
	 * @param array<int, string>   $reward_queue        Reward product keys, in selection order.
	 * @param array<int, int>      $reward_category_ids Reward category ids.
	 */
	private function apply_tier_when_it_grants_a_reward(
		array $rule,
		array $pool_product_keys,
		array $reward_queue,
		array $reward_category_ids
	): bool {
		$reserved_before = $this->reserved_buy_quantities;
		$assigned_before = $this->assigned_free_quantities;

		$this->apply_qualifying_tier( $rule, $pool_product_keys, $reward_queue, $reward_category_ids );

		if ( array_sum( $this->assigned_free_quantities ) > array_sum( $assigned_before ) ) {
			return true;
		}

		$this->reserved_buy_quantities  = $reserved_before;
		$this->assigned_free_quantities = $assigned_before;

		return false;
	}

	/**
	 * Reserve buy sets for a tier, assign the rewards and cap the eligible buys.
	 *
	 * @param array<string, mixed> $rule                Qualifying tier.
	 * @param array<int, string>   $pool_product_keys   Cart product keys pooled together.
	 * @param array<int, string>   $reward_queue        Reward product keys, in selection order.
	 * @param array<int, int>      $reward_category_ids Reward category ids.
	 */
	private function apply_qualifying_tier(
		array $rule,
		array $pool_product_keys,
		array $reward_queue,
		array $reward_category_ids
	): void {
		$minimum_quantity = Value::to_int( $rule['min'] );
		$maximum_quantity = Value::to_int( $rule['max'] ?? 0 );
		$is_recursive     = 'yes' === Value::to_string( $rule['recursive'] );
		$applied_sets     = $this->reserve_buy_sets_and_assign_free_items( $rule, $pool_product_keys, $reward_queue, $reward_category_ids );

		if ( $applied_sets <= 0 || $is_recursive || $maximum_quantity <= $minimum_quantity ) {
			return;
		}

		// Non-recursive: the eligible buy quantity is capped at `max`, and those
		// units stay paid and locked from other campaigns. Anything above `max`
		// is ignored and stays available.
		$this->reserve_buy_quantity( $pool_product_keys, $maximum_quantity - $minimum_quantity, $reward_category_ids, true );
	}

	/**
	 * Reserve buy sets and assign the free quantity each set earns.
	 *
	 * A recursive rule earns one entitlement per complete buy set; a
	 * non-recursive rule is applied exactly once.
	 *
	 * @param array<string, mixed> $rule                Qualifying tier.
	 * @param array<int, string>   $pool_product_keys   Cart product keys pooled together.
	 * @param array<int, string>   $reward_queue        Reward product keys, in selection order.
	 * @param array<int, int>      $reward_category_ids Reward category ids.
	 * @return int Number of buy sets applied.
	 */
	private function reserve_buy_sets_and_assign_free_items(
		array $rule,
		array $pool_product_keys,
		array $reward_queue,
		array $reward_category_ids
	): int {
		$minimum_quantity = Value::to_int( $rule['min'] );
		$reward_quantity  = Value::to_int( $rule['get_quantity'] );
		$is_recursive     = 'yes' === Value::to_string( $rule['recursive'] );
		$applied_sets     = 0;

		while ( true ) {
			// Buy units are reserved before any reward is selected.
			if ( ! $this->reserve_buy_quantity( $pool_product_keys, $minimum_quantity, $reward_category_ids ) ) {
				break;
			}

			++$applied_sets;

			$assigned_quantity = $this->assign_free_quantity( $reward_queue, $reward_quantity );

			// Stop when the rule is one-shot or the reward category is exhausted.
			if ( ! $is_recursive || $assigned_quantity <= 0 ) {
				break;
			}
		}

		return $applied_sets;
	}

	/**
	 * Reserve buy quantity from a pool.
	 *
	 * Units outside the reward category are consumed first, so a campaign whose
	 * buy and get categories overlap still leaves stock to hand out for free.
	 *
	 * @param array<int, string> $pool_product_keys   Cart product keys pooled together.
	 * @param int                $required_quantity   Quantity to reserve.
	 * @param array<int, int>    $reward_category_ids Reward category ids.
	 * @param bool               $allow_partial       Reserve what is available instead of all-or-nothing.
	 * @return bool True when the requested quantity was reserved.
	 */
	private function reserve_buy_quantity(
		array $pool_product_keys,
		int $required_quantity,
		array $reward_category_ids,
		bool $allow_partial = false
	): bool {
		if ( $required_quantity <= 0 ) {
			return false;
		}

		$reservation_queue  = $this->get_reservation_priority_order( $pool_product_keys, $reward_category_ids );
		$available_quantity = 0;

		foreach ( $reservation_queue as $product_key ) {
			$available_quantity += $this->get_unclaimed_quantity( $product_key );
		}

		if ( ! $allow_partial && $available_quantity < $required_quantity ) {
			return false;
		}

		$remaining_quantity = (int) min( $required_quantity, $available_quantity );

		foreach ( $reservation_queue as $product_key ) {
			if ( $remaining_quantity <= 0 ) {
				break;
			}

			$reserved_quantity = (int) min( $this->get_unclaimed_quantity( $product_key ), $remaining_quantity );

			if ( $reserved_quantity <= 0 ) {
				continue;
			}

			$already_reserved = $this->reserved_buy_quantities[ $product_key ] ?? 0;

			$this->reserved_buy_quantities[ $product_key ] = $already_reserved + $reserved_quantity;
			$remaining_quantity                           -= $reserved_quantity;
		}

		return true;
	}

	/**
	 * Pool product keys ordered for reservation: outside the reward category first.
	 *
	 * @param array<int, string> $pool_product_keys   Cart product keys pooled together.
	 * @param array<int, int>    $reward_category_ids Reward category ids.
	 * @return array<int, string>
	 */
	private function get_reservation_priority_order( array $pool_product_keys, array $reward_category_ids ): array {
		$outside_reward_category = array();
		$inside_reward_category  = array();

		foreach ( $pool_product_keys as $product_key ) {
			if ( $this->is_product_in_reward_category( $product_key, $reward_category_ids ) ) {
				$inside_reward_category[] = $product_key;

				continue;
			}

			$outside_reward_category[] = $product_key;
		}

		return array_merge( $outside_reward_category, $inside_reward_category );
	}

	/**
	 * Assign free quantity to the reward products, in selection order.
	 *
	 * @param array<int, string> $reward_queue    Reward product keys, in selection order.
	 * @param int                $reward_quantity Quantity to give away.
	 * @return int Quantity actually assigned.
	 */
	private function assign_free_quantity( array $reward_queue, int $reward_quantity ): int {
		$remaining_quantity = $reward_quantity;
		$assigned_quantity  = 0;

		foreach ( $reward_queue as $product_key ) {
			if ( $remaining_quantity <= 0 ) {
				break;
			}

			$free_quantity = (int) min( $this->get_unclaimed_quantity( $product_key ), $remaining_quantity );

			if ( $free_quantity <= 0 ) {
				continue;
			}

			$already_assigned = $this->assigned_free_quantities[ $product_key ] ?? 0;

			$this->assigned_free_quantities[ $product_key ] = $already_assigned + $free_quantity;
			$remaining_quantity                            -= $free_quantity;
			$assigned_quantity                             += $free_quantity;
		}

		return $assigned_quantity;
	}

	/**
	 * Quantity of a cart product that is neither reserved as a buy nor free yet.
	 *
	 * @param string $product_key Cart product key.
	 */
	private function get_unclaimed_quantity( string $product_key ): int {
		if ( ! isset( $this->cart_products[ $product_key ] ) ) {
			return 0;
		}

		$claimed_quantity = ( $this->reserved_buy_quantities[ $product_key ] ?? 0 ) + ( $this->assigned_free_quantities[ $product_key ] ?? 0 );
		$cart_quantity    = Value::to_int( $this->cart_products[ $product_key ]['quantity'] );

		return (int) max( 0, $cart_quantity - $claimed_quantity );
	}

	/**
	 * Reward products ordered by the campaign's "Select Item Discount".
	 *
	 * @param \Disco\App\Utility\Config $campaign            Campaign config.
	 * @param array<int, int>           $reward_category_ids Reward category ids.
	 * @return array<int, string> Cart product keys, in selection order.
	 */
	private function get_reward_products_in_selection_order( Config $campaign, array $reward_category_ids ): array {
		$reward_prices = array();

		foreach ( $this->cart_products as $product_key => $cart_product ) {
			if ( ! $this->is_product_in_reward_category( (string) $product_key, $reward_category_ids ) ) {
				continue;
			}

			$reward_prices[ (string) $product_key ] = Value::to_float( $cart_product['price'] );
		}

		$free_item_selection = $campaign->get_free_item_selection();

		if ( 'lowest' === $free_item_selection ) {
			asort( $reward_prices );
		} elseif ( 'highest' === $free_item_selection ) {
			arsort( $reward_prices );
		}

		return array_map( 'strval', array_keys( $reward_prices ) );
	}

	/**
	 * Cart product keys sitting in a reward category of any active campaign.
	 *
	 * @return array<string, bool>
	 */
	private function get_reward_category_product_keys(): array {
		$reward_category_ids = $this->campaign_rules->get_all_reward_category_ids();

		return $this->cart_manager->get_product_keys_in_categories( $this->cart_products, $reward_category_ids );
	}

	/**
	 * Whether a cart product sits in one of the reward categories.
	 *
	 * @param string          $product_key         Cart product key.
	 * @param array<int, int> $reward_category_ids Reward category ids.
	 */
	private function is_product_in_reward_category( string $product_key, array $reward_category_ids ): bool {
		if ( ! isset( $this->cart_products[ $product_key ] ) ) {
			return false;
		}

		return $this->cart_manager->is_product_in_categories( $this->cart_products[ $product_key ], $reward_category_ids );
	}

}
