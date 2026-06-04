<?php // phpcs:ignore
namespace Disco\App\DropDown;

use Disco\App\Disco;

/**
 * Class DropDown
 *
 * @package CTXFeed
 * @subpackage app\DropDown
 * @author   Ohidul Islam <wahid0003@gmail.com>
 * @link     https://webappick.com
 * @license  https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category MyCategory
 */
class DropDown { // phpcs:ignore

	/**
	 * Conditions.
	 *
	 * @param string       $type Condition Type to compare. Acceptable values:
	 *                           'string' string type conditions
	 *                           'number' number type conditions
	 *                           'date' date type conditions
	 *                           'select' list type conditions.
	 * @param string|array $key Condition Key to get specific condition.
	 * @return array
	 */
	public static function conditions( $type = null, $key = null ) { // phpcs:ignore
		$condition = array(
			'equal'               => 'Equal',
			'not_equal'           => 'Not Equal',
			'contain'             => 'Contain',
			'not_contain'         => 'Does Not Contain',
			'start_with'          => 'Start With',
			'end_with'            => 'End With',
			'greater'             => 'Greater Than',
			'greater_equal'       => 'Greater Than or Equal',
			'lesser'              => 'Less Than',
			'lesser_equal'        => 'Less Than or Equal',
			'between'             => 'Between',
			'date_between'        => 'Date Between',
			// 'within_past'   => 'Within Past',
			// 'earlier_than'  => 'Earlier Than',
						'in_list' => 'In List',
			'not_in_list'         => 'Not In List',
		);

		if ( 'string' === $type ) {
			unset(
				$condition['in_list'],
				$condition['not_in_list'],
				$condition['greater'],
				$condition['greater_equal'],
				$condition['lesser'],
				$condition['lesser_equal'],
				$condition['between'],
				$condition['date_between']
			);
		}

		if ( 'number' === $type ) {
			unset(
				$condition['in_list'],
				$condition['not_in_list'],
				$condition['date_between'],
				$condition['start_with'],
				$condition['end_with'],
				$condition['contain'],
				$condition['not_contain']
			);
		}

		if ( 'select' === $type ) {
			if ( isset( $key['multiple'] ) && $key['multiple'] === false ) {
				unset(
					$condition['contain'],
					$condition['not_contain'],
					$condition['in_list'],
					$condition['not_in_list'],
					$condition['greater'],
					$condition['greater_equal'],
					$condition['lesser'],
					$condition['lesser_equal'],
					$condition['between'],
					$condition['date_between'],
					$condition['start_with'],
					$condition['end_with']
				);
			} else {
				unset(
					$condition['contain'],
					$condition['not_contain'],
					$condition['equal'],
					$condition['not_equal'],
					$condition['greater'],
					$condition['greater_equal'],
					$condition['lesser'],
					$condition['lesser_equal'],
					$condition['between'],
					$condition['date_between'],
					$condition['start_with'],
					$condition['end_with']
				);
			}
		}

		if ( 'date' === $type ) {
			unset(
				$condition['in_list'],
				$condition['not_in_list'],
				$condition['contain'],
				$condition['not_contain'],
				$condition['start_with'],
				$condition['end_with'],
				$condition['between']
			);
		}

		if ( is_array( $condition ) ) {
			return $condition;
		}

		return array();
	}

	/**
	 * Prepare Filters for frontend appearance.
	 *
	 * @param string       $title Filter Title.
	 *
	 * @param string       $condition_type Condition Type to compare. Acceptable values:
	 *                                                        'string' string type conditions
	 *                                                        'number' number type conditions
	 *                                                        'date' date type conditions
	 *                                                        'date' date type conditions
	 *                                                        'select' list type conditions.
	 *
	 * @param string|array $input_type Input Filed for compare value. Acceptable values:
	 *                                            'text' for input[type=text]
	 *                                            'number' for input[type=number]
	 *                                            'date' for input[type=datetime-local]
	 *
	 *                                      For 'select' dropdown, there are two options available:
	 *
	 *                                      For manual options:
	 *                                      [
	 *                                      'type' => 'select',
	 *                                      'option_type' => 'manual',
	 *                                      'multiple' => true,
	 *                                      'options' => ['key' => 'value']
	 *                                      ]
	 *                                      OR For api options:
	 *                                      [
	 *                                      'type' => 'select',
	 *                                      'option_type' => 'api',
	 *                                      'multiple' => true,
	 *                                      'endpoint' => 'https://example.com/api/endpoint'
	 *                                      ].
	 *
	 * @param string       $component Component to load into frontend. Acceptable values:
	 *                                                        'string' for string type conditions
	 *                                                        'number' for number type conditions
	 *                                                        'date' for date type conditions
	 *                                                        'select' for list type conditions.
	 *
	 * @param bool         $disable Disable filter. Default is false.
     * @return array                    Filter Array
	 *                                  [0]=>[
	 *                                      [optionGroup] => Filter Group Title,
	 *                                      [options] => [
	 *                                          'attribute' => [ // Attribute key to compare with. Example: 'id',
	 *                                          'title', 'sku'.
	 *                                                  'title' => 'Filter Title',
	 *                                                  'component' => 'string',
	 *                                                  'condition' => [available conditions from self::Conditions()]
	 *                                                  'input_type' => 'text',
	 *                                                  'fields' => [
	 *                                                      'compare' => '',
	 *                                                      'condition' => '',
	 *                                                      'compare_with' => '',
	 *                                                      'operator' => '',
	 *                                                   ]
	 *                                              ]
	 *                                  ]
	 *                                  ].
	 */
	public static function prepare_filters(
		$title,
		$condition_type = 'string',
		$input_type = 'text',
		$component = 'string',
		$disable = false
	) {
		$fields = array(
			'compare'      => '',
			'condition'    => '',
			'compare_with' => '',
			'operator'     => '',
		);

		return array(
			'title' => $title,// phpcs:ignore
			'component'  => $component,
			'condition'  => self::Conditions( $condition_type, $input_type ),
			'input_type' => $input_type, // Input Filed Type. Example values -> HTML Input Type
			'fields'     => $fields,
			'disable'    => $disable,
		);
	}

	/**
	 * Get All Filters.
	 * Check the phpdoc comments of prepare_filters() method for details.
	 *
	 * @return array
	 * @throws \Exception If the search term is not set.
	 */
	public static function filters() { // phpcs:ignore
		$filter_attributes = array();

		$primary_attributes = array(
			'optionGroup' => __( 'Product/Cart Item', 'disco' ),
			'options'     => array(
				'id'                => self::prepare_filters( 'ID', 'number', 'number' ),
				'parent_id'         => self::prepare_filters( 'Parent ID', 'number', 'number', 'number', ! Disco::is_pro() ),
				'sku'               => self::prepare_filters( 'SKU' ),
				'title'             => self::prepare_filters( 'Title' ),
				'description'       => self::prepare_filters( 'Description' ),
				'short_description' => self::prepare_filters( 'Short Description' ),
				'attributes'        => self::prepare_filters(
					'Attributes',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/attribute/?search=' ),
					)
				),
				'categories'        => self::prepare_filters(
					'Categories',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/category/?search=' ),
					)
				),
				'tags'              => self::prepare_filters(
					'Tags',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/tag/?search=' ),
					)
				),
				'product_brand'     => self::prepare_filters(
					'WooCommerce Brands',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/brand/?search=' ),
					),
					'select',
					! Disco::is_pro()
				),
				'link'              => self::prepare_filters( 'URL' ),
				'availability'      => self::prepare_filters( 'Availability' ),
				'quantity'          => self::prepare_filters( 'Stock Quantity', 'number', 'number' ),
				'stock_status'      => self::prepare_filters(
					'Stock Status',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => true,
						'options'     => wc_get_product_stock_status_options(),
					)
				),
				'weight'            => self::prepare_filters( 'Weight', 'number', 'number' ),
				'weight_unit'       => self::prepare_filters(
					'Weight Unit',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => true,
						'options'     => array(
							'kg' => esc_html__( 'kg', 'disco' ),
							'g'  => esc_html__( 'g', 'disco' ),
							'lb' => esc_html__( 'lb', 'disco' ),
							'oz' => esc_html__( 'oz', 'disco' ),
						),
					)
				),
				'width'             => self::prepare_filters( 'Width', 'number', 'number' ),
				'height'            => self::prepare_filters( 'Height', 'number', 'number' ),
				'length'            => self::prepare_filters( 'Length', 'number', 'number' ),
				'type'              => self::prepare_filters(
					'Product Type',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => true,
						'options'     => wc_get_product_types(),
					)
				),
				'visibility'        => self::prepare_filters(
					'Visibility',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => true,
						'options'     => wc_get_product_visibility_options(),
					)
				),
				'rating_total'      => self::prepare_filters( 'Total Rating', 'number', 'number' ),
				'rating_average'    => self::prepare_filters( 'Average Rating', 'number', 'number' ),
				'author_name'       => self::prepare_filters(
					'Author Name',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/user_name/?search=' ),
					)
				),
				'author_email'      => self::prepare_filters(
					'Author Email',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/user_email/?search=' ),
					)
				),
				'date_created'      => self::prepare_filters( 'Date Created', 'date', 'date' ),
				'date_updated'      => self::prepare_filters( 'Date Updated', 'date', 'date' ),

				'product_status'    => self::prepare_filters(
					'Status',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => false,
						'options'     => array(
							'publish' => esc_html__( 'Publish', 'disco' ),
							'draft'   => esc_html__( 'Draft', 'disco' ),
							'pending' => esc_html__( 'Pending', 'disco' ),
							'private' => esc_html__( 'Private', 'disco' ),
						),
					)
				),
				'featured_status'   => self::prepare_filters(
					'Featured Status',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => false,
						'options'     => array(
							'yes' => esc_html__( 'Yes', 'disco' ),
							'no'  => esc_html__( 'No', 'disco' ),
						),
					)
				),
			),
		);
		$filter_attributes[] = $primary_attributes;

		$price_attributes = array(
			'optionGroup' => esc_html__( 'Price', 'disco' ),
			'options'     => array(
				'currency'               => self::prepare_filters( 'Currency' ),
				'regular_price'          => self::prepare_filters( 'Regular Price', 'number', 'number' ),
				'price'                  => self::prepare_filters( 'Price', 'number', 'number' ),
				'sale_price'             => self::prepare_filters( 'Sale Price', 'number', 'number' ),
				'regular_price_with_tax' => self::prepare_filters( 'Regular Price With Tax', 'number', 'number' ),
				'price_with_tax'         => self::prepare_filters( 'Price With Tax', 'number', 'number' ),
				'sale_price_with_tax'    => self::prepare_filters( 'Sale Price With Tax', 'number', 'number' ),
				'sale_price_sdate'       => self::prepare_filters( 'Sale Start Date', 'date', 'date' ),
				'sale_price_edate'       => self::prepare_filters( 'Sale End Date', 'date', 'date' ),
			),
		);

		$filter_attributes[] = $price_attributes;

		// Product Global Attributes
		$filter_attributes[] = AttributeDropDown::get_global_attributes();

		// Product ACF Attributes
		$filter_attributes[] = AttributeDropDown::get_acf_attributes();

		// Tax and Shipping Attributes
		$tax_shipping        = array(
			'optionGroup' => esc_html__( 'Tax and Shipping', 'disco' ),
			'options'     => array(
				'tax_class'      => self::prepare_filters( 'Tax Class' ),
				'tax_status'     => self::prepare_filters( 'Tax Status' ),
				'shipping_class' => self::prepare_filters( 'Shipping Class' ),
			),
		);
		$filter_attributes[] = $tax_shipping;

		/**
		 * Subscription Attributes
		 * Add subscription attributes if WooCommerce Subscription plugin installed.
		 *
		 * @link https://woocommerce.com/products/woocommerce-subscriptions/
		 */
		if ( class_exists( 'WC_Subscriptions' ) ) {
			$subscription_attributes = array(
				'optionGroup' => esc_html__( 'Subscription & Installment', 'disco' ),
				'options'     => array(
					'subscription_period'          => self::prepare_filters( 'Subscription Period' ),
					'subscription_period_interval' => self::prepare_filters( 'Subscription Period Length' ),
					'subscription_amount'          => self::prepare_filters( 'Subscription Amount', 'number', 'number' ),
					'installment_months'           => self::prepare_filters( 'Installment Months', 'number', 'number' ),
					'installment_amount'           => self::prepare_filters( 'Installment Amount', 'number', 'number' ),
				),
			);
			// TODO: Move to premium version
			// $filter_attributes[]     = $subscription_attributes;
		}

		/**
		 * Unit Price (WooCommerce Germanized)
		 * Get Germanized for WooCommerce plugins unit attributes.
		 *
		 * @link https://wordpress.org/plugins/woocommerce-germanized/
		 */
		if ( class_exists( 'WooCommerce_Germanized' ) ) {
			$wc_unit_price_attributes = array(
				'optionGroup' => esc_html__( 'Unit Price (WooCommerce Germanized)', 'disco' ),
				'options'     => array(
					'wc_germanized_unit_price_measure' => self::prepare_filters( 'Unit Price Measure' ),
					'wc_germanized_unit_price_base_measure' => self::prepare_filters( 'Unit Price Base Measure' ),
					'wc_germanized_gtin'               => self::prepare_filters( 'GTIN' ),
					'wc_germanized_mpn'                => self::prepare_filters( 'MPN' ),
				),
			);

			// TODO: Move to premium version
			// $filter_attributes[] = $wc_unit_price_attributes;
		}

		// Cart Attributes
		$cart_attributes = array(
			'optionGroup' => esc_html__( 'Cart', 'disco' ),
			'options'     => array(
				'cart_items_count'    => self::prepare_filters( 'Items Count (Entire Cart)', 'number', 'number' ),
				'cart_items_quantity' => self::prepare_filters( 'Items Quantity (Entire Cart)', 'number', 'number' ),
				'item_quantity'       => self::prepare_filters( 'Item Quantity', 'number', 'number', 'number', ! Disco::is_pro() ),
				'item_count'          => self::prepare_filters( 'Item Count', 'number', 'number', 'number', ! Disco::is_pro() ),
				'cart_total_weight'   => self::prepare_filters( 'Cart Items Total Weight', 'number', 'number' ),
				'cart_subtotal'       => self::prepare_filters( 'Cart Subtotal', 'number', 'number' ),
				'cart_payment_method' => self::prepare_filters(
					'Payment Method',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => true,
						'options'     => StoreDropDown::payment_methods(),
					)
				),
				'cart_coupons'        => self::prepare_filters(
					'Cart Coupons',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/coupon/?search=' ),
					)
				),
				'products_in_cart'    => self::prepare_filters(
					'Products in Cart',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/product/?search=' ),
					),
					'select',
					! Disco::is_pro()
				),
			),
		);

		$filter_attributes[] = $cart_attributes;

		$purchase_history_attributes = array(
			'optionGroup' => esc_html__( 'Product Purchase History', 'disco' ),
			'options'     => array(
				'product_history_last_order_date'     => self::prepare_filters( 'Last Order Date', 'date', 'date' ),
				'product_history_total_order_made'    => self::prepare_filters( 'Number of Order Made with a Product', 'number', 'number' ),
				'product_history_total_amount_sold'   => self::prepare_filters( 'Number of Amount Sold with a Product', 'number', 'number' ),
				'product_history_total_quantity_sold' => self::prepare_filters( 'Number of Quantities Sold with a Product', 'number', 'number' ),
// 'product_history_total_order_made_by_ids'    => self::prepare_filters(
// 'Number of Order Made with Following Products',
// 'select',
// array(
// 'type'        => 'select',
// 'option_type' => 'api',
// 'multiple'    => true,
// 'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/product/?search=' ),
// )
// ),
// 'product_history_total_amount_sold_by_ids'   => self::prepare_filters(
// 'Number of Amount Sold with Following Products',
// 'select',
// array(
// 'type'        => 'select',
// 'option_type' => 'api',
// 'multiple'    => true,
// 'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/product/?search=' ),
// )
// ),
// 'product_history_total_quantity_sold_by_ids' => self::prepare_filters(
// 'Number of Quantities Sold with Following Products',
// 'select',
// array(
// 'type'        => 'select',
// 'option_type' => 'api',
// 'multiple'    => true,
// 'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/product/?search=' ),
// )
// ),
			),
			'disabled'    => !Disco::is_pro(), // Disable if not pro.
		);

		// TODO: Move to premium version
		$filter_attributes[] = $purchase_history_attributes;

		$customer_attributes = array(
			'optionGroup' => esc_html__( 'Customer', 'disco' ),
			'options'     => array(
				// 'customer_email'        => self::prepare_filters(
				// 'Email',
				// 'select',
				// array(
				// 'type'        => 'select',
				// 'option_type' => 'api',
				// 'multiple'    => true,
				// 'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/customer/?search=' ),
				// )
				// ),
								'customer_name' => self::prepare_filters(
									'Customer',
									'select',
									array(
										'type'        => 'select',
										'option_type' => 'api',
										'multiple'    => true,
										'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/customer/?search=' ),
									)
								),
				'customer_is_logged_in'         => self::prepare_filters(
					'Is Logged In',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => false,
						'options'     => array(
							'yes' => esc_html__( 'Yes', 'disco' ),
							'no'  => esc_html__( 'No', 'disco' ),
						),
					)
				),
				'customer_user_role'            => self::prepare_filters(
					'User Role',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => true,
						'options'     => StoreDropDown::user_roles(),
					)
				),
				'customer_country'              => self::prepare_filters(
					'Country',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/country/?search=' ),
					)
				),
				'customer_state'                => self::prepare_filters(
					'State',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'api',
						'multiple'    => true,
						'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/state/?search=' ),
					)
				),
				'customer_zip'                  => self::prepare_filters( 'Zip' ),
						),
		);

		$filter_attributes[] = $customer_attributes;

		$customer_order_history_attributes = array(
			'optionGroup' => esc_html__( 'Customer Purchase History', 'disco' ),
			'options'     => array(
				'customer_history_is_first_order'      => self::prepare_filters(
					'Is First Order',
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => false,
						'options'     => array(
							'yes' => esc_html__( 'Yes', 'disco' ),
							'no'  => esc_html__( 'No', 'disco' ),
						),
					)
				),
				'customer_history_last_order_date'     => self::prepare_filters( 'Last Order Date', 'date', 'date' ),
				'customer_history_last_order_amount'   => self::prepare_filters( 'Last Order Amount', 'number', 'number' ),
				'customer_history_total_order_made'    => self::prepare_filters( 'Number of Order Made By Customer', 'number', 'number' ),
				'customer_history_total_amount_sold'   => self::prepare_filters( 'Total Amount Spent By Customer', 'number', 'number' ),
				'customer_history_total_quantity_sold' => self::prepare_filters( 'Total Quantities Bought By Customer', 'number', 'number' ),
// 'customer_history_total_order_made_by_ids' => self::prepare_filters(
// 'Number of Order Made with Following Products',
// 'select',
// array(
// 'type'        => 'select',
// 'option_type' => 'api',
// 'multiple'    => true,
// 'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/product/?search=' ),
// )
// ),
// 'customer_history_total_amount_sold_by_ids' => self::prepare_filters(
// 'Number of Amount Sold with Following Products',
// 'select',
// array(
// 'type'        => 'select',
// 'option_type' => 'api',
// 'multiple'    => true,
// 'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/product/?search=' ),
// )
// ),
// 'customer_history_total_quantity_sold_by_ids' => self::prepare_filters(
// 'Number of Quantities Sold with Following Products',
// 'select',
// array(
// 'type'        => 'select',
// 'option_type' => 'api',
// 'multiple'    => true,
// 'endpoint'    => get_site_url( null, '/wp-json/disco/v1/search/product/?search=' ),
// )
// ),
			),
			'disabled'    => !Disco::is_pro(), // Disable if not pro.
		);
		// TODO: Move to premium version
		$filter_attributes[] = $customer_order_history_attributes;

		// return apply_filters( 'disco_filter_drop_down', $filter_attributes );

		return $filter_attributes;
	}

}
