<?php
/**
 * @package    Disco
 * @subpackage \App\Intents
 */

namespace Disco\App\Intents;

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
class BuyXGetXIntent extends Intent {

    /**
	 * Intent constructor.
	 *
	 * @param \Disco\App\Utility\Config   $campaign Campaign Config.
	 * @param \Disco\App\Utility\Settings $settings Global Settings.
	 */
	public function __construct( $campaign, $settings ) {
		parent::__construct( $campaign, $settings );

		$this->campaign = $campaign;
		$this->settings = $settings;
	}

	/**
	 * Apply BuyXGetX intention.
	 *
	 * @param array    $items Discount Applicable Cart Items.
	 * @param \WC_Cart $cart  Cart.
	 * @return array
	 */
	public function get_discounts( $items, $cart ) {//phpcs:ignore
		return $this->get_item_discounts( $this->campaign, $items, $cart );
	}


	/**
	 * Get offers for Cart intention.
	 *
	 * @param array    $items Discount Applicable Cart Items.
	 * @param \WC_Cart $cart  Cart.
	 * @return array|bool
	 */
	public function get_offers( $items, $cart ) { //phpcs:ignore
		if ( empty( $items ) ) {
			return false;
		}

		$offers = array();
		$rules  = $this->campaign->get_discount_rules();

		if ( is_array( $rules ) && ! empty( $rules ) ) {
			foreach ( $rules as $rule ) {
				$rule = (array) $rule;

				if ( 'free' === $rule['discount_type'] ) {
					$discount = $rule['get_quantity'] . ' for free';
				} elseif ( 'percent' === $rule['discount_type'] ) {
					$discount = $rule['get_quantity'] . ' with ' . $rule['discount_value'] . '% off';
				} else {
					$discount = $rule['get_quantity'] . ' with ' . wc_price( $rule['discount_value'] ) . ' off';
				}

				$offers[] = array(
					'condition' => $rule['min'] . ' - ' . $rule['max'],
					'discount'  => $discount,
				);
			}
		}

		return $offers;
	}

}
