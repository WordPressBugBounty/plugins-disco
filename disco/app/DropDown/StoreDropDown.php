<?php

namespace Disco\App\DropDown;

use WC_Countries;
use WC_Payment_Gateways;

/**
 * Class DropDown
 *
 * @package Disco
 * @subpackage app\DropDown
 * @author   Ohidul Islam <wahid0003@gmail.com>
 * @link     https://webappick.com
 * @license  https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category Disco
 */
class StoreDropDown {

	/**
	 * Order Statuses List
	 *
	 * @return array
	 */
	public static function order_status() {
		return wc_get_order_statuses();
	}

	/**
	 * Payment Methods List
	 *
	 * @return array
	 */
	public static function payment_methods() {
		$wc_gateways      = new WC_Payment_Gateways;
		$payment_gateways = $wc_gateways->get_available_payment_gateways();
		$payment_methods  = array();

		// Loop through Woocommerce available payment gateways
		if ( !empty( $payment_gateways ) ) {
			foreach ( $payment_gateways as $gateway_id => $gateway ) {
				$payment_methods[$gateway_id] = $gateway->get_title();
			}
		}

		return $payment_methods;
	}

	/**
	 * User Roles List
	 *
	 * @return array
	 */
	public static function user_roles() {
		global $wp_roles;

		return $wp_roles->get_names();
	}

	/**
	 * Countries List
	 *
	 * @param bool $with_states Whether to include states or not.
	 * @return array
	 */
	public static function countries( $with_states = false ) {
		global $woocommerce;

		$counties = ( new WC_Countries )->get_countries();

		if ( $with_states ) {
			foreach ( $counties as $key => $country ) {
				$counties[$key] = $country;
				$states         = ( new WC_Countries )->get_states( $key );

				if ( empty( $states ) ) {
					continue;
				}

				foreach ( $states as $state_key => $state ) {
					$counties[$key . ':' . $state_key] = $country . ' : ' . $state;
				}
			}
		}

		return $counties;
	}

}
