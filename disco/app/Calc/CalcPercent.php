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
class CalcPercent extends CalcAbstract {

	use \Disco\App\Intents\IntentHelper;

	/**
	 * @var object $cart Cart.
	 * @phpstan-ignore-next-line
	 */
	private $cart;

	/**
	 * @var mixed $discounted_quantities
	 */
	private $discounted_quantities;

	/**
	 * @var array $rule Campaign Rule.
	 */
	private $rule;

	/**
	 * @var array $item Cart Item.
	 */
	private $item;

	/**
	 * @var string $discount_intent
	 */
	private $discount_intent;

	/**
	 * CalcPercent constructor.
	 *
	 * @param array  $rule Campaign Rule.
	 * @param array  $item Cart Item.
	 * @param object $cart Cart.
	 * @param object $campaign Campaign.
	 */
	public function __construct( $rule, $item, $cart, $campaign ) {
		$this->item = $item;
		$this->rule = $rule;
		$this->cart = $cart;

		// @phpstan-ignore-next-line
		$this->discount_intent = $campaign->get_discount_intent(); // phpcs:ignore
	}

	/**
	 * Calculate Discount.
	 *
	 * @return array $discount
	 */
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
		$discount_value  = $this->rule['discount_value'];
		$price           = CalcFactory::get_price( $this->item );
		$quantity        = (int) $this->item['quantity'];

		/**
		 * "Count Quantity As" combined / variations mode: eligibility and the
		 * eligible unit count were already resolved by QuantityCounter, so
		 * discount only that many units and skip the per-line min/max/recursive
		 * derivation below.
		 */
		if ( isset( $this->item['disco_forced_qty'] ) ) {
			$forced                      = max( 0, (int) $this->item['disco_forced_qty'] );
			$product_discount            = $price ? $price * $discount_value / 100 : 0; // phpcs:ignore
			$this->discounted_quantities = $forced;

			return apply_filters( 'disco_final_discounted_amount', $forced * $product_discount, 'percent' );
		}

		$min             = $this->rule['min'] ? (int) $this->rule['min'] : 0; //phpcs:ignore
		$max             = ! empty( $this->rule['max'] ) ? (int) $this->rule['max'] : ( $this->discount_intent === 'Bulk' ? PHP_INT_MAX : 0 ); // phpcs:ignore
		$recursive       = ! empty( $this->rule['recursive'] ) && $this->rule['recursive'] === 'yes'; // phpcs:ignore
		$item_id         = $this->item['product_id']; // phpcs:ignore
		$rule_ids        = array_column( $this->rule['get_ids'], 'id' ); // phpcs:ignore
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
		}

		// Apply for the Bundle & BOGO Discount when recursive is set.
		$multiplier = 1;

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

		// Discount per product.
		$product_discount = 0;

		if ( $price ) {
			$product_discount = $price * $discount_value / 100;
		}

		// Limit discount to Min or Max quantity.
		if ( $quantity >= $discount_for_quantities ) {
			$discount_for_quantities = min( $quantity, $discount_for_quantities );

			// Set the discounted quantity for BOGO.
			if ( ! empty( $this->rule['get_quantity'] ) ) {
				$discount_for_quantities  = (int) $this->rule['get_quantity'];
				$discount_for_quantities *= $multiplier;
			}

			$discount_amount = $discount_for_quantities * $product_discount;
		}

		$this->discounted_quantities = $discount_for_quantities;

		return apply_filters( 'disco_final_discounted_amount', $discount_amount, 'percent' );
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
