<?php
/**
 * @package    Disco
 * @subpackage \App\Intents
 */

namespace Disco\App\Intents;

use Disco\App\Utility\Conditions;
use Disco\App\Utility\Helper;

/**
 * Class Cart
 *
 * @package    Disco
 * @subpackage \App\Intents
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Intention
 */
class ProductIntent extends Intent {

	/**
	 * Intent constructor.
	 *
	 * @param \Disco\App\Utility\Config         $campaign Campaign Config.
	 * @param \Disco\App\Utility\Settings|array $settings Global Settings.
	 */
	public function __construct( $campaign, $settings ) {
		parent::__construct( $campaign, $settings );

		$this->campaign = $campaign;
		$this->settings = $settings;
	}

	/**
	 * Apply Product intention.
	 * Product Discount Configuration.
	 *
	 * @param array|string $items Product Price.
	 * @param \WC_Product  $product Product info.
	 * @return float|bool $discounted_price Discounted Price.
	 */
	public function get_discounts( $items, $product ) {//phpcs:ignore
		$price             = (float) $items;
		$discounted_amount = 0;

		// Filter the product.
		$info = array( 'product' => $product );

		if ( ! ( new Conditions( $this->campaign, $info ) )->is_passed() ) {
			return false;
		}

		if ( ! Helper::is_in_valid_date( $this->campaign ) ) {
			return false;
		}

		if ( $this->campaign->product_is_applicable( $product->get_id() ) ) {
			$rules = $this->campaign->get_discount_rules();

			if ( ! empty( $rules ) && isset( $rules[0] ) ) {
				$rule              = $rules[0];
				$discounted_amount = $this->calculate_discount( $price, $rule->discount_type, ( $rule->discount_value ? abs( $rule->discount_value ) : 0 ) );
// $discounted_price  = $this->discounted_price( $price, $discounted_amount );
			}
		}

		return $discounted_amount;
	}

	/**
	 * Get Product offers.
	 *
	 * @param array    $items Cart Items.
	 * @param \WC_Cart $cart Cart Object.
	 * @return array $cart Cart Object.
	 */
	public function get_offers( $items, $cart ) {//phpcs:ignore
		return $cart->get_cart_contents();
	}

}
