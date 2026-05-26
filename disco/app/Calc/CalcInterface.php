<?php

namespace Disco\App\Calc;

/**
 * Class CalcInterface
 *
 * @package    Disco\App\Calc
 * @subpackage Disco\App\Calc
 */
interface CalcInterface { // phpcs:ignore

	public function calculate(): array;

	public function calculate_discount(): float;

	public function calculate_price( float $discount ): float;

	public function calculate_line_subtotal( float $discount ): float;

}
