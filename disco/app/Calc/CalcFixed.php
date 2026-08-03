<?php

namespace Disco\App\Calc;

/**
 * Class CalcPercent
 *
 * @package    Disco
 * @subpackage Disco\App\Calc
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Plugin
 */
class CalcFixed extends CalcAbstract {

	use \Disco\App\Intents\IntentHelper;

	/**
	 * @var object $cart Cart.
	 * @phpstan-ignore-next-line
	 */
	private $cart;

	/**
	 * @var float
	 */
	private $discounted_quantities;

	/**
	 * @var string $discount_intent
	 */
	private $discount_intent;

	/**
	 * @var array $rule Campaign Rule.
	 */
	private $rule;

	/**
	 * @var array $item Cart Item.
	 */
	private $item;

	/**
	 * CalcFixed constructor.
	 *
	 * @param array    $rule Campaign Rule.
	 * @param array    $item Cart Item.
	 * @param \WC_Cart $cart Cart.
	 * @param object   $campaign Campaign.
	 */
	public function __construct( $rule, $item, $cart, $campaign ) {
		$this->item = $item;
		$this->rule = $rule;
		$this->cart = $cart;
		// @phpstan-ignore-next-line
		$this->discount_intent = $campaign->get_discount_intent();
	}

	public function calculate(): array {
		$discount = $this->calculate_discount();

		return array(
			'price'                 => $this->calculate_price( $discount ),
			'discount'              => $discount,
			'line_subtotal'         => $this->calculate_line_subtotal( $discount ),
			'discounted_quantities' => $this->discounted_quantities,
		);
	}

	/**
	 * Calculate Discount.
	 *
	 * @return float Discount Amount.
	 */
	public function calculate_discount(): float { // phpcs:ignore
		$discount_amount = 0;
		$fixed_discount  = $this->rule['discount_value'];
		$quantity        = (int) $this->item['quantity'];

		/**
		 * "Count Quantity As" combined / variations: a fixed amount is a flat
		 * line discount, so eligibility (any eligible unit) gates it once rather
		 * than scaling with the eligible unit count.
		 */
		if ( isset( $this->item['disco_forced_qty'] ) ) {
			$forced                      = max( 0, (int) $this->item['disco_forced_qty'] );
			$this->discounted_quantities = $forced;

			return apply_filters( 'disco_final_discounted_amount', $forced > 0 ? (float) $fixed_discount : 0, 'fixed' );
		}

		$min             = $this->rule['min'] ? (int) $this->rule['min'] : 0; // phpcs:ignore
		$max             = $this->rule['max'] ? (int) $this->rule['max'] : 0; // phpcs:ignore
		$recursive       = isset( $this->rule['recursive'] ) && 'yes' === $this->rule['recursive']; // phpcs:ignore
		$item_id      = $this->item['product_id'];
		$rule_ids     = array_column( $this->rule['get_ids'], 'id' );
		$discount_qty    = $this->rule['get_quantity'] ? (int) $this->rule['get_quantity'] : 0; // phpcs:ignore

		// Default discount for quantities.
		$discount_for_quantities = $min;

		/**
		 * Bulk / range capping — only when NOT recursive. Recursive rules ignore
		 * max: the bundle size is always min, so the qualifying quantity must not
		 * be capped to max here, otherwise floor( qty / base ) would divide by
		 * max instead of min and undercount the bundles.
		 */
		if ( ! $recursive && $max && $quantity >= $max ) {
			$discount_for_quantities = $max;
		}

		// If quantity between min and max then apply discount.
		if ( ! $recursive && $quantity >= $min && $quantity <= $max ) {
			$discount_for_quantities = $quantity;
		}

		// Apply for the Bundle & BOGO Discount when recursive is set.
		$multiplier = 1;

		/**
		 * If discount intent is BuyXGetY then set the discount for quantities to 1.
		 * This is to ensure that the discount for selected item for BOGO discount.
		 * Here no need to check for min and max quantity.
		 */
		if (
            $this->discount_intent === 'BuyXGetY'
            && ! empty( $rule_ids )
            && (
                in_array( $item_id, $rule_ids, true )
                || $this->is_in_category( $item_id, $rule_ids )
            )
        ) {
			$discount_for_quantities = $discount_qty;
			$multiplier              = $discount_qty;
		}

		if ( $recursive && $min > 0 && $quantity >= $min ) {
			/**
			 * Recursive: the number of bundles is floor( qty / min ). Divide by
			 * min, never by $discount_for_quantities — for BuyXGetY the latter
			 * holds the reward quantity (get_quantity) and would inflate the
			 * multiplier (e.g. buy 2 get 1 with 2 in cart → 1 bundle, not 2).
			 */
			$multiplier               = (int) floor( $quantity / $min );
			$discount_for_quantities *= $multiplier;
		}

		// Limit discount to Min or Max quantity.
		if ( $quantity >= $discount_for_quantities ) {
			$discount_amount = $fixed_discount * $multiplier;
		}

		$this->discounted_quantities = $discount_for_quantities;

		return apply_filters( 'disco_final_discounted_amount', $discount_amount, 'fixed' );
	}

	/**
	 * Calculate Price.
	 *
	 * @param float $discount Discount Amount.
	 * @return float Price.
	 */
	public function calculate_price( $discount ): float {
		$discounted_subtotal = $this->calculate_line_subtotal( $discount );

		return $discounted_subtotal / $this->item['quantity'];
	}

	/**
	 * Calculate Line Subtotal.
	 *
	 * @param float $discount Discount Amount.
	 * @return float Line Subtotal.
	 */
	public function calculate_line_subtotal( $discount ): float {
		if ( isset( $this->item['line_subtotal'] ) ) {
			return $this->item['line_subtotal'] - $discount;
		}

		return 0.0;
	}

}
