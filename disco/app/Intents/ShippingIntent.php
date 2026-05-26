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
class ShippingIntent extends Intent {

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
	 * Apply Product intention.
	 * Product Discount Configuration.
	 *
	 * @param array    $items Product Price.
	 * @param \WC_Cart $cart  Product Object.
	 * @return string|null
	 */
	public function get_discounts( $items, $cart ) {//phpcs:ignore

		// Check if Filter is passed then return free_shipping else return empty array.
		if ( !empty( $items ) ) {
			return 'free_shipping';
		}

		return null;
	}


	/**
	 * Get Shipping offers.
	 *
	 * @param array    $items Cart Items.
	 * @param \WC_Cart $cart  Cart Object.
	 * @return array $cart Cart Object.
	 */
	public function get_offers( $items, $cart ) {//phpcs:ignore
		return $cart->get_cart_contents();
	}

}
