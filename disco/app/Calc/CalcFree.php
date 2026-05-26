<?php

namespace Disco\App\Calc;

/**
 * Class CalcFree
 *
 * @package    Disco
 * @subpackage Disco\App\Calc
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Plugin
 */
class CalcFree extends CalcAbstract {

	/**
	 * @var array<string, float> $item
	 * @phpstan-ignore-next-line
	 */
	private $rule;

	/**
	 * @var array<string, float> $item
	 * @phpstan-ignore-next-line
	 */
	private $item;

	/**
	 * @var object $cart Cart.
	 * @phpstan-ignore-next-line
	 */
	private $cart;

	/**
	 * CalcFree constructor.
	 *
	 * @param  array  $rule Campaign Rule.
	 * @param  array  $item Cart Item.
	 * @param  object $cart Cart.
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
	 * @return array Discount Amount.
	 */
	public function calculate(): array {
		return array(
			'free' => 0,
		);
	}

	/**
	 * Calculate the discount.
	 *
	 * @return float Discount.
	 */
	public function calculate_discount(): float {
		return 0;
	}

	/**
	 * Calculate the line subtotal.
	 *
	 * @param  float $discount Discount.
	 */
	public function calculate_line_subtotal( float $discount ): float {
		return $discount;
	}

	/**
	 * Calculate the price.
	 *
	 * @param float $discount Discount.
	 */
	public function calculate_price( float $discount ): float {
		return $discount;
	}

}
