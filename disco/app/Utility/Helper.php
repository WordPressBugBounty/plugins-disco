<?php
/**
 * Search Utility
 *
 * @package    Disco
 * @subpackage App\Utility
 * @since      1.0.0
 * @category   Utility
 */

namespace Disco\App\Utility;

use WC_Cart;

/**
 * Class Helper
 *
 * @package    Disco
 * @subpackage App\Utility
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Utility
 */
class Helper {

	/**
	 * Get Cart Info.
     *
     * @param \WC_Cart $cart    Cart Object.
     * @param string   $item_id Item ID.
     * @return array
     */
    public static function cart_info( $cart, $item_id = '' ) {
        $cart_info = array();

        if ( $cart instanceof WC_Cart ) {
            $cart_info['total']['line_items_count']    = $cart->get_cart_contents_count();
            $cart_info['total']['cart_items_quantity'] = array_sum( $cart->get_cart_item_quantities() );
            $cart_info['total']['cart_total_weight']   = $cart->get_cart_contents_weight();
            $cart_info['total']['cart_subtotal']       = $cart->get_subtotal();

            foreach ( $cart->get_cart() as $item ) {
                $id = $item['product_id'];

                if ( $item['variation_id'] ) {
                    $id = $item['variation_id'];
                }

                $item_info = array(
                    'product_id'                 => $item['product_id'],
                    'variation_id'               => $item['variation_id'],
                    'cart_line_item_quantity'    => $item['quantity'],
                    'cart_line_item_subtotal'    => $item['line_subtotal'],
                    'cart_line_item_id'          => $item['data']->get_id(),
                    'cart_line_item_sku'         => $item['data']->get_sku(),
                    'cart_line_item_title'       => $item['data']->get_name(),
                    'cart_line_item_attributes'  => $item['data']->get_attributes(),
                    'cart_line_item_category'    => wp_strip_all_tags( $item['data']->get_categories() ),
                    'cart_line_item_tags'        => $item['data']->get_tags(),
                    'cart_line_item_weight_unit' => $item['data']->get_meta( '_unit' ),
                    'cart_line_item_weight'      => $item['data']->get_weight(),
                    'cart_line_item_width'       => $item['data']->get_width(),
                    'cart_line_item_height'      => $item['data']->get_height(),
                    'cart_line_item_length'      => $item['data']->get_length(),
                    'cart_line_item_type'        => $item['data']->get_type(),
                    'product'                    => $item['data'],
                );

                if ( $item_id && $item_id === $id ) {
                    return $item_info;
                }

                $cart_info['items'][ $id ] = $item_info;
            }//end foreach
        }//end if

        return $cart_info;
    }

	/**
	 * Get Matched Conditions Cart Products.
	 *
	 * Checks all products in the WooCommerce cart against the provided conditions and returns those that match.
	 * Iterates through each cart item and applies all base filters from the conditions, using AttributeFactory to
	 * retrieve attribute values for comparison. Skips filters that compare with 'item_quantity' or 'item_count'.
	 *
	 * @param array $all_conditions    Array of condition groups, each containing base filters.
	 * @param array $reference_product Reference product data used for attribute comparison.
	 * @return array                   Array of cart items that match all base filters.
	 */
	public static function get_matched_conditions_cart_products( array $all_conditions, array $reference_product ): array { // phpcs:ignore

		$matched_products = array();

		$current_base_filters = array();

		foreach ( $all_conditions as $group ) {
			if ( is_array( $group ) ) {
				$group = (object) $group;
			}

			if ( ! isset( $group->base_filters ) || ! is_array( $group->base_filters ) ) {
				continue;
			}

			$current_base_filters = array_merge( $current_base_filters, $group->base_filters );
		}

		$current_base_filters = array_map(
			static function( $f ) {
				if ( is_array( $f ) ) {
					return (object) $f;
				}

				return $f;
			},
			$current_base_filters
		);

		foreach ( WC()->cart->get_cart() as $cart_item ) {
			$product = $cart_item['data'];

			if ( ! $product instanceof \WC_Product ) {
				continue;
			}

			$is_matched = true;

			foreach ( $current_base_filters as $inner_filter ) {
				if ( in_array( $inner_filter->compare_with, array( 'item_quantity', 'item_count' ), true ) ) {
					continue;
				}

				$temp_product = array(
					'product'   => $product,
					'cart_item' => $cart_item,
				);

// $inner_filter->compare = AttributeFactory::get_value( $inner_filter->compare_with, $reference_product );


				$checker = new Conditions(
					new Config(
						array(
							'conditions' => array(
								array(
									'base_operator' => 'and',
									'base_filters'  => array( $inner_filter ),
								),
							),
						)
					),
					$temp_product
				);

				if ( ! $checker->is_passed() ) {
					$is_matched = false;

					break;
				}
			}

			if ( ! $is_matched ) {
				continue;
			}

			$matched_products[] = $cart_item;
		}

		return $matched_products;
	}


	/**
     * Check product discount has any date limit.
     *
     * @param \Disco\App\Utility\Config $config Campaign Configuration.
     * @return bool
     */
    public static function is_in_valid_date( $config ) { // phpcs:ignore
        if ( empty( $config->discount_valid_from ) && empty( $config->discount_valid_to ) ) {
            return true;
        }

		if (
            isset( $config->discount_valid_from )
            && strtotime( $config->discount_valid_from )
            && empty( $config->discount_valid_to )
        ) {
			$today      = gmdate( 'Y-m-d H:i:s' );
			$start_date = gmdate( 'Y-m-d H:i:s', strtotime( $config->discount_valid_from ) );

			return $today >= $start_date;
		}

		if (
			isset( $config->discount_valid_to )
			&& strtotime( $config->discount_valid_to )
			&& empty( $config->discount_valid_from )
		) {
			$today    = gmdate( 'Y-m-d H:i:s' );
			$end_date = gmdate( 'Y-m-d H:i:s', strtotime( $config->discount_valid_to ) );

			return $today <= $end_date;
		}

        if ( isset( $config->discount_valid_from, $config->discount_valid_to )
            && strtotime( $config->discount_valid_from )
            && strtotime( $config->discount_valid_to )
        ) {
            $today      = gmdate( 'Y-m-d H:i:s' );
            $start_date = gmdate( 'Y-m-d H:i:s', strtotime( $config->discount_valid_from ) );
            $end_date   = gmdate( 'Y-m-d H:i:s', strtotime( $config->discount_valid_to ) );

            return ( $today >= $start_date ) && ( $today <= $end_date );
        }

        return false;
    }

	/**
	 * Check if a product is in a category.
	 *
	 * @param int   $product_id Product ID.
	 * @param array $categories Categories.
	 * @return bool
	 */
	public static function is_in_category( $product_id, $categories ) {
		// Ensure $categories is an array
		if ( ! is_array( $categories ) ) {
			$categories = array( $categories );
		}

		$get_product = wc_get_product( $product_id );

		if ( ! $get_product ) {
			return false;
		}

		if ( $get_product->get_type() === 'variation' ) {
			$product_id = $get_product->get_parent_id();
		}

		$terms = get_the_terms( $product_id, 'product_cat' );

		if ( ! $terms || is_wp_error( $terms ) ) {
			return false;
		}

		$term_ids = array();

		foreach ( $terms as $term ) {
			$term_ids[] = $term->term_id;

			// Include all parent category IDs
			$parent_ids = get_ancestors( $term->term_id, 'product_cat' );

			if ( empty( $parent_ids ) ) {
                continue;
            }

            $term_ids = array_merge( $term_ids, $parent_ids );
		}

		// Remove duplicates just in case
		$term_ids      = array_unique( $term_ids );
		$common_values = array_intersect( $term_ids, $categories );

		return ! empty( $common_values );
	}

    /**
     * Check if the product is passed the filter
     *
     * @param \Disco\App\Utility\Config $config  Campaign Configuration.
     * @param array                     $product Product Info.
     * @return bool
     */
    public static function is_filter_passed( $config, $product ) {
        return ( new Conditions( $config, $product ) )->is_passed();
    }

}
