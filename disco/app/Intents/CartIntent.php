<?php
/**
 * @package    Disco
 * @subpackage \App\Intents
 */

namespace Disco\App\Intents;

use Disco\App\Calc\CalcFactory;
use Disco\App\DropDown\DropDown;

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
class CartIntent extends Intent {

	/**
	 * Intent constructor.
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param array                     $settings Global Settings.
	 */
	public function __construct( $campaign, $settings ) {
		parent::__construct( $campaign, $settings );

		$this->campaign = $campaign;
		$this->settings = $settings;
	}

	/**
	 * Apply Cart intention.
	 * Cart Discount Configuration.
	 *
	 * @param array    $items Discount Applicable Cart Items.
	 * @param \WC_Cart $cart  Cart.
     * @return float|int
	 * @throws \Exception If settings not found.
	 */
	public function get_discounts( $items, $cart ) { // phpcs:ignore

		$discount = 0;

		if ( empty( $items ) ) {
			return $discount;
		}

		$rules = $this->campaign->get_discount_rules();

		if ( ! empty( $rules ) && isset( $rules[0] ) ) {
			$rule = $rules[0];

			if ( is_object( $rule ) ) {
				$rule = (array) $rule;
			}

			$discount_value = ( $rule['discount_value'] ? abs( $rule['discount_value'] ) : 0 );
			$discount_type  = $rule['discount_type'];

			$campaign_products = $this->campaign->get_product_ids();

// $cost = CalcFactory::get_cart_subtotal( $cart );
//
// if ( $campaign_products !== 'all' ) {
// $cost = $this->get_items_subtotal( $items );
// }

// $cost = $this->get_items_subtotal( $items );
			$cost = $this->get_items_subtotal_based_on_settings( $items );

			// Discount should be less than item price
			if ( $discount_type === 'fixed_per_product' ) {
				// TODO: Check there is no free products in the cart before counting the discount
				$item_prices = array();

				foreach ( $items as $item ) {
					$price         = CalcFactory::get_price( $item );
					$qty           = $item['quantity'];
					$min_value     = min( $discount_value, $price );
					$item_prices[] = $min_value * $qty;
				}

				$discount = array_sum( $item_prices );
			} else {
				$discount = $this->calculate_discount( $cost, $discount_type, $discount_value );
			}
		}

		// @phpstan-ignore-next-line
		return apply_filters( 'disco_final_discounted_amount', $discount, $discount_type );
	}


	/**
	 * Get Cart Item Quantities.
	 *
	 * @param array $items Discount Applicable Cart Items.
	 * @return int Cart Item Quantities.
	 */
	public function get_cart_item_quantities( $items ) {
		$quantities = 0;

		foreach ( $items as $item ) {
			$quantities += $item['quantity'];
		}

		return $quantities;
	}

	/**
	 * Get Cart Items Subtotal.
	 *
	 * @param array $items Discount Applicable Cart Items.
	 * @return int Cart Item Quantities.
	 */
	public function get_items_subtotal( $items ) {
		$subtotal = 0;

		foreach ( $items as $item ) {
			$subtotal += $item['line_subtotal'];
		}

		return $subtotal;
	}

	/**
	 * Get items subtotal based on settings.
	 *
	 * @param array $items Discount Applicable Cart Items.
	 * @return float
	 */
	public function get_items_subtotal_based_on_settings( $items ) {
		$subtotal = 0;

		foreach ( $items as $item ) {
			$price     = CalcFactory::get_price( $item );
			$subtotal += $price * $item['quantity'];
		}

		return $subtotal;
	}

	/**
	 * Get offers for Cart intention.
	 *
	 * @param array    $items Discount Applicable Cart Items.
	 * @param \WC_Cart $cart  Cart.
	 * @return array|bool
	 */
	public function get_offers( $items, $cart ) { //phpcs:ignore
		if ( $cart->is_empty() ) {
			return false;
		}

		$offers = array();
		$rules  = $this->campaign->get_discount_rules();

		if ( ! empty( $rules ) && isset( $rules[0] ) ) {
			$rule              = $rules[0];
			$discount_value    = abs( $rule->discount_value );
			$discount_type     = $rule->discount_type;
			$conditions        = $this->campaign->get_conditions();
			$conditions_string = '';
			$double_space      = '  ';

			if ( is_array( $conditions ) && ! empty( $conditions ) ) {
				$conditions_string .= '<b>IF</b>' . "\n";

				foreach ( $conditions as $condition_key => $condition ) {
					if ( $condition_key > 0 ) {
						$conditions_string .= '<b>' . ucfirst( $condition['base_operator'] ) . "</b>\n";
					}

					if ( empty( $condition['base_filters'] ) ) {
						continue;
					}

					foreach ( $condition['base_filters'] as $filter_key => $filter ) {
						$filter = (object) $filter;

						if ( $filter_key > 0 ) {
							$conditions_string .= $double_space . ' <b>' . ucfirst( $filter->operator ) . "</b>\n";
						}

						$compare_with       = ucwords( str_replace( '_', ' ', $filter->compare_with ) );
						$condition          = DropDown::conditions( null, $filter->condition );
						$compare            = $filter->compare;
						$conditions_string .= "$double_space $compare_with $compare \n";
					}
				}

				$conditions_string .= '<b>END IF</b>' . "\n";
			}

			if ( 'percent' === $discount_type ) {
				$discount = $discount_value . '% off';
			} else {
				$discount = wc_price( $discount_value ) . ' off';
			}

			$offers[] = array(
				'condition' => $conditions_string,
				'discount'  => '<b>' . $discount . '</b>',
			);
		}

		return $offers;
	}

}
