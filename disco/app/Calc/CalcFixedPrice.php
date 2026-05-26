<?php // phpcs:ignoreFile

namespace Disco\App\Calc;

/**
 * Class CalcFixedPrice
 *
 * @package    Disco
 * @subpackage Disco\App\Calc
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Plugin
 */
class CalcFixedPrice extends CalcAbstract {

	/**
	 * @var array
	 */
	private $rule;

	/**
	 * @var array
	 */
	private $item;

	/**
	 * @var object $cart Cart.
	 * @phpstan-ignore-next-line
	 */
	private $cart;

	private int $discounted_quantities; // phpcs:ignore

	/**
	 * CalcFixedPrice constructor.
	 *
	 * @param   array    $rule Campaign Rule.
	 * @param   array    $item Cart Item.
	 * @param  \WC_Cart $cart Cart.
	 */
	public function __construct( $rule, $item, $cart ) {
		// Constructor...
		$this->rule = $rule;
		$this->item = $item;
		$this->cart = $cart;
	}

	/**
	 * Calculate Discount.
	 *
	 * @return array $discount The discount amount.
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
		$fixed_discount  = $this->rule['discount_value'];
		$price           = $this->item['data']->get_price(); // phpcs:ignore
		$quantity        = (int) $this->item['quantity']; // phpcs:ignore
		$min             = $this->rule['min'] ? (int) $this->rule['min'] : 0; // phpcs:ignore
		$max             = $this->rule['max'] ? (int) $this->rule['max'] : 0; // phpcs:ignore
		$recursive       = isset( $this->rule['recursive'] ) && 'yes' === $this->rule['recursive']; // phpcs:ignore

		// Default discount for quantities.
		$discount_for_quantities = $min;

		// Apply for the Bulk Discount when max is set.
		if ( $max > 0 && ( $quantity >= $min && $quantity <= $max ) ) {
			$discount_for_quantities = $quantity;
		}

		// Apply for the Bundle Discount when recursive is set.
		if ( $recursive && $quantity % $min === 0 ) {
			$discount_for_quantities = $quantity;
		}

		// Limit discount to Min or Max quantity.
		if ( $quantity >= $discount_for_quantities ) {
			$discount_amount = $fixed_discount;
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
	 * @param float $discount Discount Amount.
	 * @return float $total_price Total Price.
	 */
	public function calculate_line_subtotal( $discount ): float {
		return $this->item['line_subtotal'] - $discount;
	}

// public function calculate_discount(): float {
// return $this->rule['discount_value'];
// }
//
// public function calculate_price( $discount ): float {
// $quantity                = $this->item['quantity'];
// $price                   = $this->item['data']->get_price();
// $discount_for_quantities = $this->rule['min'] ?? 0;
//
// if ( $quantity >= $discount_for_quantities ) {
// $discounted_quantity = min( $quantity, $discount_for_quantities );
// $remaining_quantity  = $quantity - $discounted_quantity;
//
// $discounted_price = $discount;
// $remaining_price  = $remaining_quantity * $price;
//
// $total_price = $discounted_price + $remaining_price;
// } else {
// $total_price = $this->item['line_subtotal'];
// }
//
// return $total_price;
// }
//
// public function calculate_line_subtotal( $discount ): float {
// $quantity                = $this->item['quantity'];
// $price                   = $this->item['data']->get_price();
// $discount_for_quantities = $this->rule['min'] ?? 0;
//
// if ( $quantity >= $discount_for_quantities ) {
// $discounted_quantity = min( $quantity, $discount_for_quantities );
// $remaining_quantity  = $quantity - $discounted_quantity;
//
// $discounted_price = $discount;
// $remaining_price  = $remaining_quantity * $price;
//
// $total_price = $discounted_price + $remaining_price;
// } else {
// $total_price = $this->item['line_subtotal'];
// }
//
// return $total_price;
// }

}
