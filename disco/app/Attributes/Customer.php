<?php
/**
 * Product Attributes
 *
 * @package    Disco
 * @subpackage \App\Attributes
 */

namespace Disco\App\Attributes;

use WC_Customer;

/**
 * Class Product
 *
 * This class provides methods for retrieving various attributes of a WooCommerce product.
 *
 * @package    Disco
 * @subpackage \App\Attributes
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Attributes
 */
class Customer {

    /**
     * @var \WC_Customer|bool $customer Customer Object.
     */
    private $customer;

    /**
     * Customer constructor.
     *
     * @throws \Exception If the current user is not logged in.
     */
	public function __construct() {
		if ( ! is_user_logged_in() ) {
			$this->customer = false;
		} else {
			$this->customer = new WC_Customer( wp_get_current_user()->ID );
		}
	}

	/**
	 * Get Customer ID
	 *
	 * @return string
	 */
	public function customer_email() {
		// If customer is not logged in, return empty string.
		if ( ! $this->customer instanceof WC_Customer ) {
			return '';
		}

		return $this->customer->get_email();
	}

	/**
	 * Get Customer Name
	 *
	 * @return string
	 */
	public function customer_name() {
		if ( $this->customer instanceof WC_Customer ) {
			return $this->customer->get_first_name() . ' ' . $this->customer->get_last_name() . ' (' . $this->customer->get_email() . ')';
		}

		return '';
	}

	/**
	 * Get Customer is logged In
	 *
	 * @return string
	 */
	public function customer_is_logged_in() {
		if ( is_user_logged_in() ) {
			return 'yes';
		}

		return 'no';
	}

	/**
	 * Get Customer Role
	 *
	 * @return string
	 */
	public function customer_user_role() {
		// If customer is not logged in, return empty string.
		if ( ! $this->customer instanceof WC_Customer ) {
			return '';
		}

		return $this->customer->get_role();
	}

	/**
	 * Get Customer Country
	 *
	 * @return string
	 */
	public function customer_country() {
		// If customer is not logged in, return empty string.
		if ( ! $this->customer instanceof WC_Customer ) {
			return '';
		}

		// woocommerce get country full name
		return $this->customer->get_billing_country();
	}

	/**
	 * Get Customer City
	 *
	 * @return string
	 */
	public function customer_city() {
		// If customer is not logged in, return empty string.
		if ( ! $this->customer instanceof WC_Customer ) {
			return '';
		}

		return $this->customer->get_billing_city();
	}

	/**
	 * Get Customer State
	 *
	 * @return string
	 */
	public function customer_state() {
		// If customer is not logged in, return empty string.
		if ( ! $this->customer instanceof WC_Customer ) {
			return '';
		}

		return $this->customer->get_billing_state();
	}

	/**
	 * Get Customer Zip
	 *
	 * @return string
	 */
	public function customer_zip() {
		// If customer is not logged in, return empty string.
		if ( ! $this->customer instanceof WC_Customer ) {
			return '';
		}

		return $this->customer->get_billing_postcode();
	}

}
