<?php

namespace Disco\App\Calc;

/**
 * Class Calc
 *
 * @package    Disco
 * @subpackage Disco\App\Calc
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Plugin
 */
class Calc {

	public function get_discount( CalcInterface $discountType ): array { // phpcs:ignore
		return $discountType->calculate(); // phpcs:ignore
	}

}
