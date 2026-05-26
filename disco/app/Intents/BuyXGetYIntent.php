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
class BuyXGetYIntent extends Intent {

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
	 * Apply BuyXGetY intention.
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

				$bogo_type = $this->campaign->get_bogo_type();
				$ul        = '<ul style="margin: 10px 1px 10px 10px;">';

				foreach ( $rule['get_ids'] as $product ) {
					$ul .= '<li>' . $product['name'] . '</li>';
				}

				$ul .= '</ul>';

				if ( 'free' === $rule['discount_type'] ) {
					$discount = 'Get ' . $rule['get_quantity'] . ' of bellow ' . $bogo_type . " \n" . $ul . 'For Free';
				} elseif ( 'percent' === $rule['discount_type'] ) {
					$discount = 'Get ' . $rule['get_quantity'] . ' of bellow ' . $bogo_type . " \n" . $ul . ' With ' . $rule['discount_value'] . '% off';
				} else {
					$discount = 'Get ' . $rule['get_quantity'] . ' of bellow ' . $bogo_type . " \n" . $ul . ' With ' . wc_price( $rule['discount_value'] ) . ' off';
				}

				$offers[] = array(
					'condition' => $rule['min'] . ' - ' . $rule['max'],
					'discount'  => '<b>' . $discount . '</b>',
				);
			}//end foreach
		}//end if

		return $offers;
	}

}
