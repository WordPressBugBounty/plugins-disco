<?php
/**
 * Category BOGO campaign / rule reader.
 *
 * @package    Disco
 * @subpackage \App\Intents\CategoryBogo
 */

namespace Disco\App\Intents\CategoryBogo;

use Disco\App\Campaign;
use Disco\App\Features\UserLimit;
use Disco\App\Utility\Config;
use Disco\App\Utility\Helper;
use Disco\App\Utility\Value;

/**
 * Selects the campaigns, rules and buy pools the Category BOGO engine acts on.
 *
 * A campaign qualifies when it is an active, in-date BOGO campaign of type
 * `categories` that still has usage left for the customer and holds at least
 * one free-item tier. Percent / fixed category BOGO keeps using the regular
 * discount path, so those rules are filtered out here.
 *
 * Buy (X) pooling also lives here because it is driven purely by campaign
 * configuration: product applicability, the condition filters and the
 * "Count Quantity As" mode.
 *
 * @package    Disco
 * @subpackage Disco\App\Intents\CategoryBogo
 * @category   Intention
 */
class CategoryBogoRules {

	/**
	 * Qualifying category BOGO campaigns, lazily resolved.
	 *
	 * @var array<int, \Disco\App\Utility\Config>|null
	 */
	private $category_bogo_campaigns = null;

	/**
	 * Every active campaign, fetched once per request.
	 *
	 * @var array<int|string, \Disco\App\Utility\Config>|null
	 */
	private $all_active_campaigns = null;

	/**
	 * Active category BOGO campaigns that grant free items.
	 *
	 * @return array<int, \Disco\App\Utility\Config>
	 */
	public function get_active_category_bogo_campaigns(): array {
		if ( null !== $this->category_bogo_campaigns ) {
			return $this->category_bogo_campaigns;
		}

		$this->category_bogo_campaigns = array();

		foreach ( $this->get_all_active_campaigns() as $campaign ) {
			if ( ! $this->is_active_category_free_bogo_campaign( $campaign ) ) {
				continue;
			}

			$this->category_bogo_campaigns[] = $campaign;
		}

		return $this->category_bogo_campaigns;
	}

	/**
	 * Whether a BOGO campaign that hands out free items outside a reward
	 * category is also active.
	 *
	 * Those campaigns (BuyXGetX and products BuyXGetY) are still applied by the
	 * legacy hook path, so it can only be skipped when none of them exist.
	 */
	public function has_non_category_free_bogo_campaigns(): bool {
		foreach ( $this->get_all_active_campaigns() as $campaign ) {
			if ( 'BOGO' !== $campaign->get_discount_intent() ) {
				continue;
			}

			if ( 'categories' === $campaign->get_bogo_type() ) {
				continue;
			}

			if ( ! Helper::is_in_valid_date( $campaign ) ) {
				continue;
			}

			return true;
		}

		return false;
	}

	/**
	 * Free-item tiers of a campaign, normalised to arrays.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign config.
	 * @return array<int, array<string, mixed>>
	 */
	public function get_free_item_rules( Config $campaign ): array {
		$discount_rules = $campaign->get_discount_rules();

		if ( ! is_array( $discount_rules ) ) {
			return array();
		}

		$free_item_rules = array();

		foreach ( $discount_rules as $rule ) {
			$rule = (array) $rule;

			if ( ! $this->rule_grants_free_item( $rule ) ) {
				continue;
			}

			$rule['recursive'] = Value::to_string( $rule['recursive'] ?? 'no' );

			$free_item_rules[] = $rule;
		}

		return $free_item_rules;
	}

	/**
	 * Reward (get Y) category ids of a single rule.
	 *
	 * @param array<string, mixed> $rule Discount rule.
	 * @return array<int, int>
	 */
	public function get_reward_category_ids( array $rule ): array {
		if ( empty( $rule['get_ids'] ) || ! is_array( $rule['get_ids'] ) ) {
			return array();
		}

		$reward_category_ids = array();

		foreach ( $rule['get_ids'] as $rule_entry ) {
			$reward_category_ids[] = $this->get_category_id_from_rule_entry( $rule_entry );
		}

		return array_values( array_filter( $reward_category_ids ) );
	}

	/**
	 * Reward category ids of every active category BOGO campaign, deduplicated.
	 *
	 * @return array<int, int>
	 */
	public function get_all_reward_category_ids(): array {
		$reward_category_ids = array();

		foreach ( $this->get_active_category_bogo_campaigns() as $campaign ) {
			foreach ( $this->get_free_item_rules( $campaign ) as $rule ) {
				$reward_category_ids = array_merge( $reward_category_ids, $this->get_reward_category_ids( $rule ) );
			}
		}

		return array_values( array_unique( $reward_category_ids ) );
	}

	/**
	 * Buy (X) product keys of a campaign, pooled per "Count Quantity As".
	 *
	 * @param \Disco\App\Utility\Config           $campaign      Campaign config.
	 * @param array<string, array<string, mixed>> $cart_products Cart products by product key.
	 * @return array<int, array<int, string>> Each entry is one pool of product keys.
	 */
	public function get_buy_quantity_pools( Config $campaign, array $cart_products ): array {
		$pools             = array();
		$count_quantity_as = $campaign->get_count_quantity_as();

		foreach ( $this->get_buy_applicable_product_keys( $campaign, $cart_products ) as $product_key ) {
			$pool_key = $this->get_buy_pool_key( $count_quantity_as, $product_key, $cart_products );

			$pools[ $pool_key ][] = $product_key;
		}

		return array_values( $pools );
	}

	/**
	 * Tiers a pooled buy quantity qualifies for, highest `min` first.
	 *
	 * A tier qualifies on `min` alone: the upper `max` caps how much of the pool
	 * is eligible, it never disqualifies the tier, so a quantity that falls in
	 * the gap between two tiers still earns the lower one. The caller walks the
	 * list in order and takes the first tier that can actually hand out a reward.
	 *
	 * @param array<int, array<string, mixed>> $free_item_rules Free-item tiers.
	 * @param int                              $pool_quantity   Pooled buy quantity.
	 * @return array<int, array<string, mixed>>
	 */
	public function get_qualifying_tiers_for_buy_quantity( array $free_item_rules, int $pool_quantity ): array {
		$qualifying_tiers = array();

		foreach ( $free_item_rules as $rule ) {
			$minimum_quantity = Value::to_int( $rule['min'] );

			if ( $minimum_quantity <= 0 || $pool_quantity < $minimum_quantity ) {
				continue;
			}

			$qualifying_tiers[] = $rule;
		}

		usort(
			$qualifying_tiers,
			static function ( array $first, array $second ): int {
				return Value::to_int( $second['min'] ) <=> Value::to_int( $first['min'] );
			}
		);

		return $qualifying_tiers;
	}

	/**
	 * Campaign id as an integer.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign config.
	 */
	public function get_campaign_id( Config $campaign ): int {
		$config = $campaign->get_config();

		return Value::to_int( $config['id'] ?? 0 );
	}

	/**
	 * Every active campaign, as Config objects.
	 *
	 * @return array<int|string, \Disco\App\Utility\Config>
	 */
	private function get_all_active_campaigns(): array {
		if ( null !== $this->all_active_campaigns ) {
			return $this->all_active_campaigns;
		}

		$campaigns                  = ( new Campaign )->get_campaigns( '1' );
		$this->all_active_campaigns = array();

		if ( ! is_array( $campaigns ) ) {
			return $this->all_active_campaigns;
		}

		foreach ( $campaigns as $campaign_id => $campaign ) {
			if ( ! $campaign instanceof Config ) {
				continue;
			}

			$this->all_active_campaigns[ $campaign_id ] = $campaign;
		}

		return $this->all_active_campaigns;
	}

	/**
	 * Product keys a campaign accepts as a buy (X) purchase, in cart order.
	 *
	 * @param \Disco\App\Utility\Config           $campaign      Campaign config.
	 * @param array<string, array<string, mixed>> $cart_products Cart products by product key.
	 * @return array<int, string>
	 */
	private function get_buy_applicable_product_keys( Config $campaign, array $cart_products ): array {
		$buy_applicable_keys = array();

		foreach ( $cart_products as $product_key => $cart_product ) {
			$effective_product_id = Value::to_int( $cart_product['effective_product_id'] ?? 0 );

			if ( ! $campaign->product_is_applicable( $effective_product_id ) ) {
				continue;
			}

			if ( ! Helper::is_filter_passed( $campaign, array( 'product' => wc_get_product( $effective_product_id ) ) ) ) {
				continue;
			}

			$buy_applicable_keys[] = (string) $product_key;
		}

		return $buy_applicable_keys;
	}

	/**
	 * Pool key a product key belongs to for a counting mode.
	 *
	 * @param string                              $count_quantity_as Counting mode.
	 * @param string                              $product_key       Cart product key.
	 * @param array<string, array<string, mixed>> $cart_products     Cart products by product key.
	 */
	private function get_buy_pool_key( string $count_quantity_as, string $product_key, array $cart_products ): string {
		// Every applicable product shares one pool.
		if ( 'combined' === $count_quantity_as ) {
			return 'all';
		}

		// Variations of the same variable product share a pool.
		if ( 'variations' === $count_quantity_as ) {
			return 'parent_' . Value::to_int( $cart_products[ $product_key ]['product_id'] ?? 0 );
		}

		// `separate`: each product is its own pool.
		return 'product_' . $product_key;
	}

	/**
	 * Category id of a single `get_ids` rule entry.
	 *
	 * @param mixed $rule_entry Raw entry: an id, or an array / object with an `id` key.
	 */
	private function get_category_id_from_rule_entry( $rule_entry ): int {
		if ( is_object( $rule_entry ) ) {
			$rule_entry = (array) $rule_entry;
		}

		if ( ! is_array( $rule_entry ) ) {
			return Value::to_int( $rule_entry );
		}

		return Value::to_int( $rule_entry['id'] ?? 0 );
	}

	/**
	 * Whether a campaign is an active category BOGO that hands out free items.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign config.
	 */
	private function is_active_category_free_bogo_campaign( Config $campaign ): bool {
		if ( ! in_array( $campaign->get_discount_intent(), array( 'BOGO', 'BuyXGetY' ), true ) ) {
			return false;
		}

		if ( 'categories' !== $campaign->get_bogo_type() ) {
			return false;
		}

		if ( ! Helper::is_in_valid_date( $campaign ) ) {
			return false;
		}

		if ( empty( $this->get_free_item_rules( $campaign ) ) ) {
			return false;
		}

		return ! $this->is_user_limit_reached( $campaign );
	}

	/**
	 * Whether a rule can grant a free reward from a category.
	 *
	 * Only tiers that can actually hand out an item qualify: `discount_type`
	 * free, a reward quantity, a minimum and a reward category.
	 *
	 * @param array<string, mixed> $rule Discount rule.
	 */
	private function rule_grants_free_item( array $rule ): bool {
		if ( 'free' !== Value::to_string( $rule['discount_type'] ?? '' ) ) {
			return false;
		}

		if ( Value::to_int( $rule['get_quantity'] ?? 0 ) <= 0 ) {
			return false;
		}

		if ( Value::to_int( $rule['min'] ?? 0 ) <= 0 ) {
			return false;
		}

		return ! empty( $rule['get_ids'] );
	}

	/**
	 * Whether the per-user usage limit of a campaign is exhausted.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign config.
	 */
	private function is_user_limit_reached( Config $campaign ): bool {
		$config             = $campaign->get_config();
		$max_user_discounts = Value::to_int( $config['discount_max_user'] ?? 0 );

		if ( $max_user_discounts <= 0 ) {
			return false;
		}

		$applied = ( new UserLimit )->disco_get_total_applied_campaign( $this->get_campaign_id( $campaign ) );

		return $applied >= $max_user_discounts;
	}

}
