<?php
/**
 * Scalar value casting.
 *
 * @package    Disco
 * @subpackage \App\Utility
 */

namespace Disco\App\Utility;

/**
 * Casts untyped campaign / cart values to scalars.
 *
 * Campaign rules come out of a JSON column and cart items out of WooCommerce
 * session data, so quantities and ids arrive as strings, nulls or occasionally
 * arrays. These casts keep calling code free of defensive `is_numeric()` noise
 * and return a harmless zero for anything unusable.
 *
 * @package    Disco
 * @subpackage Disco\App\Utility
 * @category   Utility
 */
class Value {

	/**
	 * Cast a raw value to int, or 0 when it is not numeric.
	 *
	 * @param mixed $value Raw value.
	 */
	public static function to_int( $value ): int {
		if ( ! is_numeric( $value ) ) {
			return 0;
		}

		return (int) $value;
	}

	/**
	 * Cast a raw value to float, or 0.0 when it is not numeric.
	 *
	 * @param mixed $value Raw value.
	 */
	public static function to_float( $value ): float {
		if ( ! is_numeric( $value ) ) {
			return 0.0;
		}

		return (float) $value;
	}

	/**
	 * Cast a raw value to string, or '' when it is not scalar.
	 *
	 * @param mixed $value Raw value.
	 */
	public static function to_string( $value ): string {
		if ( ! is_scalar( $value ) ) {
			return '';
		}

		return (string) $value;
	}

}
