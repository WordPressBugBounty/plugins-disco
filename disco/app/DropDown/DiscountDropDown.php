<?php

namespace Disco\App\DropDown;

/**
 * Class DropDown
 *
 * @package    Disco
 * @subpackage app\DropDown
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Disco
 */
class DiscountDropDown {

	public function __construct() {
		// Constructor...
	}

	/**
	 * Available Discount Intents.
	 *
	 * @return array
	 * @throws \Exception If the file is not found.
	 */
	public static function discount_intents() {
		return array(
			'Product'  => esc_html__( 'Product', 'disco' ),
			'Cart'     => esc_html__( 'Cart', 'disco' ),
			'Shipping' => esc_html__( 'Free Shipping', 'disco' ),
			'Bulk'     => esc_html__( 'Bulk Discount', 'disco' ),
			'Bundle'   => esc_html__( 'Bundle Discount', 'disco' ),
			'BOGO'     => esc_html__( 'BOGO', 'disco' ),
		);
	}

	/**
	 * Available Discount Types.
	 *
	 * @return array
	 * @throws \Exception If the file is not found.
	 */
	public static function discount_types() {
		return array(
			'percent'                                   => esc_html__( '% - Percentage Discount', 'disco' ),
			'fixed'                                     => esc_html__( '$ - Fixed Discount', 'disco' ),
			// 'fixed_price'         => esc_html__( '$ - Fixed Price', 'disco' ),
									'fixed_per_product' => esc_html__( '$ - Fixed Discount Per Cart Item', 'disco' ),
			// 'percent_per_product' => esc_html__( '% - Percent Discount Per Cart Item', 'disco' ),
									'free'              => esc_html__( 'Free Items', 'disco' ),
		);
	}

	/**
	 * Available Discount Types.
	 *
	 * @return array
	 * @throws \Exception If the file is not found.
	 */
	public static function discount_based_on() {
		return array(
			'item_quantity' => esc_html__( 'Item Quantity', 'disco' ),
			'item_price'    => esc_html__( 'Item Price', 'disco' ),
			'cart_quantity' => esc_html__( 'Cart Quantity', 'disco' ),
			'cart_subtotal' => esc_html__( 'Cart Subtotal', 'disco' ),
		);
	}

	/**
	 * Available BOGO Types.
	 *
	 * @return array
	 * @throws \Exception If the file is not found.
	 */
	public static function bogo_types() {
		return array(
			'all'        => esc_html__( 'Buy X Get X', 'disco' ),
			'products'   => esc_html__( 'Buy X Get Y (Products)', 'disco' ),
 			'categories' => esc_html__( 'Buy X Get Y (Categories)', 'disco' ),
		);
	}

	/**
	 * Available Discount Types.
	 *
	 * @return array
	 * @throws \Exception If the file is not found.
	 */
	public static function discount_methods() {
		return array(
			'automated' => esc_html__( 'Automated Discount', 'disco' ),
			// 'coupon' => esc_html__('Coupon Discount', 'disco'),
		);
	}

	/**
	 * Select Products to add discount.
	 *
	 * @return array
	 * @throws \Exception If the file is not found.
	 */
	public static function products() {
		return array(
			'all_products' => esc_html__( 'All Products', 'disco' ),
			'products'     => esc_html__( 'Few Products', 'disco' ),
		);
	}

}
