<?php // phpcs:ignoreFile

namespace Disco\App\Calc;

/**
 * Class CalcPercentPerProduct
 *
 * @package    Disco
 * @subpackage Disco\App\Calc
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Plugin
 */
class CalcPercentPerProduct extends CalcAbstract {

	/**
	 * @var array<string, float> $item
	 */
	private $rule;

	/**
	 * @var array<string, float> $item
	 */
	private $item;

	/**
	 * @var object $cart Cart.
     * @phpstan-ignore-next-line
     */
	private $cart;

	/**
	 * @var string $discount_intent
	 */
	private $discount_intent;

	/**
	 * @var mixed $discounted_quantities
	 */
	private $discounted_quantities;

	/**
	 * CalcPercentPerProduct constructor.
	 *
	 * @param array  $rule Campaign Rule.
	 * @param array  $item Cart Item.
	 * @param object $cart Cart.
	 * @param object $campaign Campaign.
	 */
	public function __construct( $rule, $item, $cart, $campaign ) {
		$this->rule = $rule;
		$this->item = $item;
		$this->cart = $cart;

		// @phpstan-ignore-next-line
		$this->discount_intent = $campaign->get_discount_intent(); // phpcs:ignore
	}

	/**
	 * Calculate Discount.
	 * This function calculates the discount amount based on the discount type, value and item quantity.
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
	public function calculate_discount(): float { //phpcs:ignore
		$discount_amount = 0;
		$discount_value  = $this->rule['discount_value'];
		$price           = CalcFactory::get_price( $this->item );
		$quantity        = (int) $this->item['quantity'];
		$min             = $this->rule['min'] ? (int) $this->rule['min'] : 0; //phpcs:ignore
		$max             = ! empty( $this->rule['max'] ) ? (int) $this->rule['max'] : ( $this->discount_intent === 'Bulk' ? PHP_INT_MAX : 0 ); // phpcs:ignore
		$recursive       = ! empty( $this->rule['recursive'] ) && $this->rule['recursive'] === 'yes'; // phpcs:ignore

		// Default discount for quantities.
		$discount_for_quantities = $min;

		// Apply for the Bulk Discount when max is set.
		if ( $max && $quantity >= $max ) {
			$discount_for_quantities = $max;
		}

		// If quantity between min and max then apply discount.
		if ( $quantity >= $min && $quantity <= $max ) {
			$discount_for_quantities = $quantity;
		}

		// Apply for the Bundle & BOGO Discount when recursive is set.
		$multiplier = 1;

		if ( $recursive ) {
			if ( $quantity % $min === 0 || $quantity > $discount_for_quantities ) {
				$multiplier               = floor( $quantity / $discount_for_quantities );
				$discount_for_quantities *= $multiplier;
			}
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

		return $discount_amount;
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
	 * @param  float $discount discount amount.
	 */
	public function calculate_line_subtotal( $discount ): float {
		if ( isset( $this->item['line_subtotal'] ) ) {
			return $this->item['line_subtotal'] - $discount;
		}

		return 0.0;
	}

}
