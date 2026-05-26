<?php // phpcs:ignore

/**
 * Condition Utility
 *
 * @package    Disco
 * @subpackage App\Utility
 * @since      1.0.0
 * @category   Utility
 */

namespace Disco\App\Utility;

use Disco\App\Attributes\AttributeFactory;

/**
 * Class Filter
 *
 * @package    Disco
 * @subpackage App\Utility
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Utility
 */
class Conditions { // phpcs:ignore

    /**
     * @var array $product Product Info.
     */
    private $product;

    /**
     * Contains the conditions array.
     *
     * @var array $conditions Filter object.
     */
    private $conditions;

    /**
     * Conditions constructor.
     *
     * @param \Disco\App\Utility\Config $config  Campaign configuration.
     * @param array                     $product Product Object.
     */
    public function __construct( $config, $product ) {
        $this->conditions = $config->get_conditions();
        $this->product    = $product;
    }

    /**
     * Check if the product is passed the filter
     *
     * @return bool
     */
    public function is_passed() {
        if ( ! empty( $this->conditions ) ) {
            return $this->check_all_conditions( $this->conditions );
        }

        return true;
    }

    /**
     * Check if the product is passed the filter
     *
     * @param array $filters Filter array.
     *                       array(
     *                       array(
     *                       'base_operator' => 'and',
     *                       'base_filters'  => array(
     *                       0 => array(
     *                       'filter'    => 'id',
     *                       'operator'  => 'and',
     *                       'condition' => 'between',
     *                       'compare'   => array( 1, 100 ),
     *                       ),
     *                       1 => array(
     *                       'filter'    => 'Hat Wizard',
     *                       'operator'  => 'and',
     *                       'condition' => 'contain',
     *                       'compare'   => 'Hat',
     *                       ),
     *                       ),
     *                       ),
     *                       array(
     *                       'base_operator' => 'or',
     *                       'base_filters'  => array(
     *                       0 => array(
     *                       'filter'    => 'total_sold',
     *                       'operator'  => 'and',
     *                       'condition' => 'greater_tan',
     *                       'compare'   => 2000,
     *                       ),
     *                       1 => array(
     *                       'filter'    => 'total_order_name',
     *                       'operator'  => 'or',
     *                       'condition' => 'equal',
     *                       'compare'   => '100',
     *                       ),
     *                       ),
     *                       array(
     *                       'base_operator' => 'and',
     *                       'base_filters'  => array(
     *                       0 => array(
     *                       'filter'    => 'total_sold',
     *                       'operator'  => 'and',
     *                       'condition' => 'greater_tan',
     *                       'compare'   => 2000,
     *                       ),
     *                       2 => array(
     *                       'filter'    => 'title',
     *                       'operator'  => 'and',
     *                       'condition' => 'not_equal',
     *                       'compare'   => '',
     *                       ),
     *                       ),
     *                       ),
     *                       ),.
     * @return bool
     */
	public function check_group_conditions( $filters ) {// phpcs:ignore

        $result = true;
        // Start with true, will be updated based on conditions
		$first = true;

		foreach ( $filters as $filter ) {
			if ( is_array( $filter ) ) {
				$filter = (object) $filter;
			}

			if ( strtolower( $filter->operator ) ) {
				$operator = strtolower( $filter->operator );
			} else {
				$operator = 'and';
			}

			$condition = $this->compare_value( $filter );

			// Apply the operator
			if ( $first ) {
				$result = $condition;
				$first  = false;
			} elseif ( $operator === 'and' ) {
				$result = $result && $condition;// phpcs:ignore
			} elseif ( $operator === 'or' ) {
				$result = $result || $condition;// phpcs:ignore
			}
		}//end foreach

		return $result;
	}

	/**
	 * Compare value based on a type
	 *
	 * @param object $filter Filter object.
	 * @return bool
	 */
	public function compare_value( $filter ) {
		if ( ! is_object( $filter ) || ! isset( $filter->condition, $filter->compare, $filter->compare_with ) ) {
			return false;
		}

		/**
		 * Special case for item_quantity and item_count
		 * If the compare_with is item_quantity or item_count,
		 * we need to get the matched products from the cart
		 * and then compare the quantity or count of those products.
		 * This is because item_quantity and item_count are not product attributes,
		 */
		if ( in_array( $filter->compare_with, array( 'item_quantity', 'item_count' ), true ) ) {
			$matched_products = Helper::get_matched_conditions_cart_products( $this->conditions, $this->product );

			$info = array(
				'matched_products' => $matched_products,
			);

			return $this->compare_special_case( $filter, $info );
		}

		$type = $this->get_type( $filter->compare, $filter->condition );

		switch ( $type ) {
			case 'date':
				return $this->date_compare( $filter );

			case 'array':
				return $this->array_compare( $filter );

			case 'integer':
			case 'double':
				return $this->number_compare( $filter );

			default:
				return $this->string_compare( $filter );
		}
	}

	/**
	 * Get the type of the compare value
	 *
	 * @param mixed  $compare   Compare value.
	 * @param string $condition Condition.
	 * @return string
	 */
	public function get_type( $compare, $condition ) { // phpcs:ignore
		// Get $compare variable value  type
		$type = 'string';

		// If $compare is a number, check if it is an integer or double
		if ( is_numeric( $compare ) ) {
			$type = 'integer';
		}

		// If $compare is a date, check if it is a valid date
		if ( !is_numeric( $compare ) && is_string( $compare ) && strtotime( $compare ) ) {
			$type = 'date';
		}

		// If $condition is an array, check if it is an array of strings
		if ( in_array( $condition, array( 'in_list', 'not_in_list' ), true ) ) {
			$type = 'array';
		}

		// If $compare is an array, check if it is a number range. Only for between condition.
		if ( $condition === 'between' && is_array( $compare ) && count( $compare ) === 2 ) {
			$type = 'integer';
		}

		// If $compare is an array, check if it is a date range. Only for date between condition.
		if ( $condition === 'date_between'
            && is_array( $compare )
            && count( $compare ) === 2
            && strtotime( $compare[0] )
            && strtotime( $compare[1] )
        ) {
			$type = 'date';
		}

		if ( is_bool( $compare ) ) {
			$type = 'boolean';
		}

		return $type;
	}

	/**
	 * Compare value for a date type.
	 *
	 * @param object $filter Filter object.
	 * @return bool
	 */
	public function date_compare( $filter ) {
		if ( ! is_object( $filter ) || ! isset( $filter->condition, $filter->compare, $filter->compare_with ) ) {
			return false;
		}

		$condition    = $filter->condition;
		$compare      = $filter->compare;
		$compare_with = AttributeFactory::get_value( $filter->compare_with, $this->product );

		switch ( $condition ) {
			case 'equal':
				return $compare === $compare_with;

			case 'not_equal':
				return $compare !== $compare_with;

			case 'greater':
				return $compare_with > $compare;

			case 'greater_equal':
				return $compare_with >= $compare;

			case 'lesser':
				return $compare_with < $compare;

			case 'lesser_equal':
				return $compare_with <= $compare;

			case 'date_between':
				return $compare_with >= $compare[0] && $compare_with <= $compare[1];

			default:
				return false;
		}//end switch
	}

	/**
	 * Compare value for an array type.
	 *
	 * @param object $filter Filter object.
	 * @return bool
	 */
	public function array_compare( $filter ) {// phpcs:ignore
		if ( ! is_object( $filter ) || ! isset( $filter->condition, $filter->compare, $filter->compare_with ) ) {
			return false;
		}

		$condition = $filter->condition;
		$compare   = $filter->compare;

		// Is compare_with needs to be compared with id or name
		$column = $this->get_array_compare_column( $filter->compare_with );

		if ( isset( $compare[0] ) && is_object( $compare[0] ) ) {
			$compare = array_column( (array) $compare, $column );
		} elseif ( isset( $compare[0] ) && is_array( $compare[0] ) ) {
			$compare = array_column( $compare, $column );
		}

		$compare_with = AttributeFactory::get_value( $filter->compare_with, $this->product );

		if ( is_array( $compare ) ) {
			$compare = array_map( 'trim', $compare ); // Trim all values in the array
		}

		if ( is_array( $compare_with ) ) {
			$compare_with = array_map( 'trim', $compare_with ); // Trim all values in the array
		}

		switch ( $condition ) {
			case 'not_in_list':
				if ( is_array( $compare ) && is_array( $compare_with ) ) {
					// Check if there are no common elements between the two arrays
					return !count( array_intersect( $compare, $compare_with ) );
				}

				if ( is_array( $compare_with ) ) {
					// Check if a scalar $compare is not in the array $compare_with
					return !in_array( $compare, $compare_with, true );
				}

				if ( is_array( $compare ) && is_string( $compare_with ) ) {
					// Check if a string $compare_with is not in the array $compare
					return !in_array( $compare_with, $compare, true );
				}

				return false;

			case 'in_list':
// return $compare;
				// Ensure $compare[0] is an array before calling array_intersect
				if ( is_array( $compare ) && is_array( $compare_with ) ) {
					// Extract IDs from $compare if $compare_with is an array of IDs
					return (bool) count( array_intersect( $compare, $compare_with ) );
				}

				if ( is_array( $compare_with ) && is_string( $compare ) ) {
					// Check if a scalar $compare is in the array $compare_with
					return in_array( $compare, $compare_with, true );
				}

				if ( is_array( $compare ) && is_string( $compare_with ) ) {
					// Check if a string $compare_with is in the array $compare
					return in_array( $compare_with, $compare, true );
				}

				return false;

			default:
				return false;
		}
	}

	/**
	 * Compare value for a number type.
	 *
	 * @param object $filter Filter object.
	 * @return bool
	 */
	public function number_compare( $filter ) {// phpcs:ignore
		if ( ! is_object( $filter ) || ! isset( $filter->condition, $filter->compare, $filter->compare_with ) ) {
			return false;
		}

		$condition    = $filter->condition;
		$compare      = is_array( $filter->compare ) ? array_map(
                static function( $val ) {
					return (float) $val;
				},
                $filter->compare
                ) : (float) $filter->compare;
		$compare_with = (float) AttributeFactory::get_value( $filter->compare_with, $this->product );

		switch ( $condition ) {
			case 'equal':
				return $compare === $compare_with;

			case 'not_equal':
				return $compare !== $compare_with;

			case 'greater':
				return $compare_with > $compare;

			case 'greater_equal':
				return $compare_with >= $compare;

			case 'lesser':
				return $compare_with < $compare;

			case 'lesser_equal':
				return $compare_with <= $compare;

			case 'between':
				// @phpstan-ignore-next-line
			    return $compare_with >= $compare[0] && $compare_with <= $compare[1];

			default:
				return false;
		}//end switch
	}

	/**
	 * Compare value for a string type.
	 *
	 * @param object $filter Filter object.
	 * @return bool
	 */
	public function string_compare( $filter ) {
		if ( ! is_object( $filter ) || ! isset( $filter->condition, $filter->compare, $filter->compare_with ) ) {
			return false;
		}

		$condition    = $filter->condition;
		$compare      = $filter->compare;
		$compare_with = AttributeFactory::get_value( $filter->compare_with, $this->product );

		if ( is_array( $compare ) ) {
			$compare = wp_json_encode( $compare );
		}

		if ( !is_string( $compare ) ) {
			$compare = (string) $compare;
		}

		switch ( $condition ) {
			case 'equal':
				return strtolower( $compare ) === strtolower( $compare_with );

			case 'not_equal':
				return strtolower( $compare ) !== strtolower( $compare_with );

			case 'contain':
				return stripos( $compare_with, $compare ) !== false;

			case 'not_contain':
				return stripos( $compare_with, $compare ) === false;

			case 'start_with':
				return stripos( $compare_with, $compare ) === 0;

			case 'end_with':
				return substr( $compare_with, -strlen( $compare ) ) === $compare;

			default:
				return false;
		}//end switch
	}

	/**
	 * @param array $filters Filter array.
	 * @return bool
	 */
	public function check_all_conditions( $filters ) {
		$final_result = true;
		$first_group  = true;

		if ( empty( $filters ) ) {
			return true;
		}

		foreach ( $filters as $group ) {
			if ( is_array( $group ) ) {
				$group = (object) $group;
			}

			$group_result = $this->check_group_conditions( $group->base_filters );

			if ( $first_group ) {
				$final_result = $group_result;
				$first_group  = false;
			} elseif ( $group->base_operator === 'and' ) {
				$final_result = $final_result && $group_result; // phpcs:ignore
			} elseif ( $group->base_operator === 'or' ) {
				$final_result = $final_result || $group_result; // phpcs:ignore
			}
		}

		return $final_result;
	}

	/**
	 * Get the column for array compare
	 * Sometime we need to get the column id for array compare.
	 * For example, we need to compare the product id with the array of product ids
     *
	 * @param string $compare_with Compare with value.
	 * @return string
	 */
	public function get_array_compare_column( $compare_with ) {
		$attributes_by_ids = array(
			'attributes', // Product Attributes
			'customer_country', // Customer Country
			'customer_state', // Customer State
			'products_in_cart', // Products in Cart
			'customer_history_total_order_made_by_ids', // Number of Orders Made with the Following Products
			'customer_history_total_amount_sold_by_ids', // Total Amount Sold with the Following Products
			'customer_history_total_quantity_sold_by_ids', // Number of Orders Made with the Following Products
		);

		if ( in_array( $compare_with, $attributes_by_ids, true ) ) {
			return 'id';
		}

		return 'name';
	}

	/**
	 * Compare special cases for product filters, such as item quantity or item count.
	 *
	 * This function evaluates a filter condition (e.g., equal, greater, between) against either the total quantity
	 * of matched products (when comparing with 'item_quantity') or the count of matched products (when comparing with 'item_count').
	 *
	 * @param object $filter Filter object containing 'compare_with', 'condition', and 'compare' properties.
	 * @param array  $info   Array containing 'matched_products' (list of product data arrays).
	 * @return bool          True if the condition is met, false otherwise.
	 */
	public static function compare_special_case( $filter, $info ) { // phpcs:ignore
		$matched_products = $info['matched_products'] ?? array();

		if (
			! is_object( $filter ) ||
			! property_exists( $filter, 'compare_with' ) ||
			! property_exists( $filter, 'compare' ) ||
			! property_exists( $filter, 'condition' )
		) {
			return false;
		}

		if ( $filter->compare_with === 'item_quantity' ) {
			$total_quantity = array_sum(
				array_map(
					function( $item ) {
						if ( isset( $item['quantity'] ) ) {
							return $item['quantity'];
						}

						return 0;
					},
					$matched_products
				)
			);

			$compare_value = $total_quantity;
		} elseif ( $filter->compare_with === 'item_count' ) {
			$compare_value = count( $matched_products );
		} else {
			return false;
		}

		$condition = $filter->condition;

		if ( is_array( $filter->compare ) ) {
			$target = (int) $filter->compare[0];
		} else {
			$target = (int) $filter->compare;
		}

		switch ( $condition ) {
			case 'equal':
				return $compare_value === $target;

			case 'not_equal':
				return $compare_value !== $target;

			case 'greater':
				return $compare_value > $target;

			case 'greater_equal':
				return $compare_value >= $target;

			case 'lesser':
				return $compare_value < $target;

			case 'lesser_equal':
				return $compare_value <= $target;

			case 'between':
				if ( is_array( $filter->compare ) && count( $filter->compare ) === 2 ) {
					return $compare_value >= $filter->compare[0] && $compare_value <= $filter->compare[1];
				}

				return false;

			default:
				return false;
		}
	}

}
