<?php
/**
 * @package    Disco
 * @subpackage \App\Utility
 */

namespace Disco\App\Utility;

/**
 * Quantity Counter.
 *
 * Shared "Count Quantity As" eligibility engine used by both the Bundle
 * discount rule and the BOGO rule. Given the cart, a campaign and a single
 * discount rule, it decides which cart units qualify for that rule and how
 * many units within each line item are eligible.
 *
 * The three counting modes (campaign level, {@see Config::get_count_quantity_as()}):
 *
 *  - `separate`   Each cart line item is evaluated on its own quantity.
 *  - `combined`   All applicable line items are pooled into one total.
 *  - `variations` Line items are pooled per parent product (all variations of
 *                 the same variable product count together); different parent
 *                 products are never pooled with each other.
 *
 * Eligible unit count once the pool reaches `min` (see {@see self::eligible_total()}):
 *  - pool below `min`                    → not eligible, 0 units.
 *  - explicit `min`..`max` range         → eligible pool capped at `max`; the
 *                                          excess gets no discount and is NOT
 *                                          re-evaluated as a second bundle.
 *  - recursive rule                      → whole bundles of `min` units.
 *  - Bundle / BOGO, no `max`             → a single bundle of `min` units
 *                                          (Bundle has no "max product": min 2
 *                                          with 3 in cart discounts 2, 1 left).
 *  - Bulk, no `max`                      → every qualifying unit above `min`.
 *
 * When a pool is capped, units are handed out in cart line-item order (the
 * order WooCommerce returns from {@see \WC_Cart::get_cart()}), filling each
 * line up to its own quantity until the cap is consumed. This mirrors how the
 * rest of Disco iterates the cart.
 *
 * @package    Disco
 * @subpackage Disco\App\Utility
 * @category   Intention
 */
class QuantityCounter {

	/**
	 * Resolve which cart units qualify for a single discount rule.
	 *
	 * @param \WC_Cart                  $cart     Cart object.
	 * @param \Disco\App\Utility\Config $campaign Campaign config (mode + applicability).
	 * @param array                     $rule     Single discount rule; reads `min` and optional `max`.
	 * @return array<int|string, array{item: array, eligible_qty: int, line_qty: int, group: string}>
	 *         Keyed by cart item key. Only line items with at least one eligible unit are returned.
	 */
	public function get_eligible_units( \WC_Cart $cart, Config $campaign, array $rule ): array {//phpcs:ignore
		$count_quantity_as = $campaign->get_count_quantity_as();
		$discount_intent   = $campaign->get_discount_intent();
		$minimum_quantity       = isset( $rule['min'] ) ? absint( $rule['min'] ) : 0; // phpcs:ignore
		$maximum_quantity       = ! empty( $rule['max'] ) ? absint( $rule['max'] ) : 0; // phpcs:ignore -- 0 == unbounded
		$is_recursive = ! empty( $rule['recursive'] ) && 'yes' === $rule['recursive']; // phpcs:ignore

		$applicable_lines = $this->collect_applicable_lines( $cart, $campaign );

		if ( empty( $applicable_lines ) ) {
			return array();
		}

		$line_groups    = $this->group_lines( $applicable_lines, $count_quantity_as );
		$eligible_units = array();

		foreach ( $line_groups as $group_key => $group_lines ) {
			$pool_quantity = 0;

			foreach ( $group_lines as $line ) {
				$pool_quantity += $line['quantity'];
			}

			// Below the minimum threshold: nothing in this pool qualifies.
			if ( $minimum_quantity > 0 && $pool_quantity < $minimum_quantity ) {
				continue;
			}

			$eligible_quantity = $this->eligible_total( $pool_quantity, $minimum_quantity, $maximum_quantity, $is_recursive, $discount_intent );

			if ( $eligible_quantity <= 0 ) {
				continue;
			}

			// Hand out eligible units in cart line-item order up to the cap.
			$remaining_quantity = $eligible_quantity;

			foreach ( $group_lines as $line ) {
				if ( $remaining_quantity <= 0 ) {
					break;
				}

				$line_eligible_quantity = (int) min( $line['quantity'], $remaining_quantity );
				$remaining_quantity    -= $line_eligible_quantity;

				$eligible_units[ $line['key'] ] = array(
					'item'         => $line['item'],
					'eligible_qty' => $line_eligible_quantity,
					'line_qty'     => (int) $line['quantity'],
					'group'        => (string) $group_key,
				);
			}
		}

		return $eligible_units;
	}

	/**
	 * Decide how many units of a qualifying pool are eligible for discount.
	 *
	 * Mirrors the per-line semantics the Calc layer already applies in
	 * `separate` mode, so pooled counting behaves identically once the
	 * threshold is reached:
	 *
	 *  - Recursive rule       whole bundles of `min` (e.g. min 2, pool 6 → 6).
	 *  - Explicit `max` range eligible pool capped at `max` (spec range case).
	 *  - Bulk (no max)        every qualifying unit above the threshold.
	 *  - Bundle / BOGO (no max) a single bundle of `min` units; the rest of the
	 *                         pool gets no discount (Bundle has no "max product":
	 *                         min 2 with 3 in cart discounts 2, 1 excluded).
	 *
	 * @param int    $pool_quantity    Pooled quantity for the group.
	 * @param int    $minimum_quantity Rule minimum.
	 * @param int    $maximum_quantity Rule maximum (0 == unbounded).
	 * @param bool   $is_recursive     Whether the rule repeats per bundle.
	 * @param string $discount_intent  Campaign discount intent.
	 */
	private function eligible_total(
		int $pool_quantity,
		int $minimum_quantity,
		int $maximum_quantity,
		bool $is_recursive,
		string $discount_intent
	): int {
		if ( $is_recursive && $minimum_quantity > 0 ) {
			return (int) ( floor( $pool_quantity / $minimum_quantity ) * $minimum_quantity );
		}

		if ( $maximum_quantity > 0 ) {
			return (int) min( $pool_quantity, $maximum_quantity );
		}

		if ( 'Bulk' === $discount_intent ) {
			return $pool_quantity;
		}

		if ( $minimum_quantity > 0 ) {
			return (int) min( $pool_quantity, $minimum_quantity );
		}

		return $pool_quantity;
	}

	/**
	 * Collect the cart line items this campaign applies to, in cart order.
	 *
	 * Mirrors the applicability filtering used elsewhere in the engine: Disco
	 * free items are skipped, and each line must pass both the product
	 * applicability check and the campaign condition filters.
	 *
	 * @param \WC_Cart                  $cart     Cart object.
	 * @param \Disco\App\Utility\Config $campaign Campaign config.
	 * @return array<int, array{key: string, quantity: int, product_id: int, parent_id: int, item: array}>
	 */
	private function collect_applicable_lines( \WC_Cart $cart, Config $campaign ): array {
		$applicable_lines = array();
		$cart_items       = $cart->get_cart();

		if ( ! is_array( $cart_items ) ) {
			return $applicable_lines;
		}

		foreach ( $cart_items as $key => $item ) {
			if ( ! empty( $item['is_free_product'] ) ) {
				continue;
			}

			$effective_product_id = (int) $item['product_id'];

			if ( ! empty( $item['variation_id'] ) ) {
				$effective_product_id = (int) $item['variation_id'];
			}

			if ( ! $campaign->product_is_applicable( $effective_product_id ) ) {
				continue;
			}

			$product = wc_get_product( $effective_product_id );

			if ( ! Helper::is_filter_passed( $campaign, array( 'product' => $product ) ) ) {
				continue;
			}

			$applicable_lines[] = array(
				'key'        => (string) $key,
				'quantity'   => (int) $item['quantity'],
				'product_id' => (int) $item['product_id'],
				'parent_id'  => (int) $item['product_id'],
				'item'       => $item,
			);
		}

		return $applicable_lines;
	}

	/**
	 * Group applicable lines according to the counting mode.
	 *
	 * @param array  $applicable_lines  Applicable lines.
	 * @param string $count_quantity_as Counting mode.
	 */
	private function group_lines( array $applicable_lines, string $count_quantity_as ): array {
		$line_groups = array();

		foreach ( $applicable_lines as $applicable_line ) {
			switch ( $count_quantity_as ) {
				case 'combined':
					// Every applicable line shares one pool.
					$group_key = 'all';
					break; // phpcs:ignore

				case 'variations':
					// Pool per parent product; the cart item's product_id is the
					// parent for variations and the product itself for simple ones.
					$group_key = 'parent_' . $applicable_line['parent_id'];
					break; // phpcs:ignore

				case 'separate':
				default:
					// Each line is its own pool.
					$group_key = 'line_' . $applicable_line['key'];
					break; // phpcs:ignore
			}

			$line_groups[ $group_key ][] = $applicable_line;
		}

		return $line_groups;
	}

}
