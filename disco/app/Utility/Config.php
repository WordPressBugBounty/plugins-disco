<?php
/**
 * Campaign Config Utility
 *
 * @package    Disco
 * @subpackage App\Utility
 * @since      1.0.0
 * @category   Utility
 */

namespace Disco\App\Utility;

/**
 * Class Config
 *
 * @package    Disco
 * @subpackage App\Utility
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @property   false|mixed|string $filter
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Utility
 */
class Config {

	/**
     * Config
     *
     * @var array
     */
    private $config;

    /**
     * Config constructor.
     *
     * @param array|mixed $discount_info Discount info.
     */
    public function __construct( $discount_info = array() ) {
        $this->set_config( (array) $discount_info );
    }

    /**
     * Check if the product id is applicable for this campaign.
     *
     * @param int $id Product id.
     * @return bool
     */
	public function product_is_applicable( $id ) { // phpcs:ignore
		if ( empty( $this->config['products'] ) ) {
			return false;
		}

		if ( $this->config['products'][0] === 'all' ) {
			return true;
		}

		if ( ! empty( $this->config['products'] ) ) {
			$parent_id = null;
			$variation = wc_get_product( $id );

			if ( $variation && $variation->is_type( 'variation' ) ) {
				$parent_id = $variation->get_parent_id();
			}

			foreach ( $this->config['products'] as $product ) {
				if ( is_object( $product ) ) {
					$product = (array) $product;
				}

				if ( ! isset( $product['id'] ) ) {
					continue;
				}

				if ( (int) $product['id'] === (int) $id || ( $parent_id && (int) $product['id'] === (int) $parent_id ) ) {
					return true;
				}
			}
		}

		return false;
	}

    /**
     * Config
     *
     * @param array $discount_info Discount info.
     * @return array
     */
    public function set_config( $discount_info ) {
        $defaults = array(
            'id'                   => '',
            'name'                 => '',
            'discount_intent'      => '', /* Product, Cart, Shipping, Bulk, Bundle, BuyXGetX, BuyXGetY */
            'priority'             => '',
            'status'               => '',
            'created_by'           => '',
            'created_date'         => '',
            'modified_by'          => '',
            'modified_date'        => '',
            'products'             => array( 'all' ),
            'conditions'           => array(),
            'discount_rules'       => array(),
            'discount_based_on'    => '',
            'discount_label'       => '',
            'discount_max_user'    => '',
            'bogo_type'            => '',
            'discount_valid_from'  => '',
            'discount_valid_to'    => '',
            'discount_method'      => 'automated',
            'discount_coupon'      => '',
            'total_discount_limit' => '',
            'total_sales_limit'    => '',
            'output'               => array(),
            'ui'                   => array(
				'product_sale_badge' => '',
				'product_page'       => '',
				'shop_page'          => '',
            ),
        );

        $this->config = wp_parse_args( $discount_info, $defaults );

        return $this->config;
    }

    /**
     * GET Config
     *
     * @return array
     */
    public function get_config() {
        return $this->config;
    }

    /**
     * GET FILTERS
     * Return false if no filter is a set
     * Return array if filter is set and not empty.
     *
     * @return array
     */
    public function get_conditions() {
        if ( empty( $this->config['conditions'] ) ) {
            return array();
        }

        $filters = $this->config['conditions'];

        if ( is_string( $this->config['conditions'] ) ) {
            $filters = json_decode( $this->config['conditions'], false );
        }

        if ( is_array( $filters ) && ! empty( $filters ) ) {
            return $filters;
        }

        return array();
    }

    /**
     * Get Discount Intent
     *
     * @return string
     */
    public function get_discount_intent() {
        return $this->config['discount_intent'];
    }

    /**
     * Get Bogo Type
     *
     * @return string
     */
    public function get_bogo_type() {
        return $this->config['bogo_type'];
    }

    /**
     * Get Discount Rules
     * Return false if no discount rule is not set
     *
     * @return bool|array  Return array if discount rule is set and not empty. Structure of the array as below:
     */
    public function get_discount_rules() {
        $default_rule = array(
            'id'             => '',
            'min'            => '',
            'max'            => '',
            'get_quantity'   => '',
			// Get quantity.
            'get_ids'        => array(),
			// Get discount.
            'discount_type'  => 'percent',
            'discount_value' => 0,
            'discount_label' => 'Discount',
            'recursive'      => 'no',
        );

        $discount_rules = $this->config['discount_rules'];

        if ( is_string( $this->config['discount_rules'] ) ) {
            $discount_rules = json_decode( $this->config['discount_rules'], false );
        }

        if ( is_array( $discount_rules ) && ! empty( $discount_rules ) ) {
            foreach ( $discount_rules as $key => $rule ) {
                $discount_rules[ $key ] = (object) wp_parse_args( (array) $rule, $default_rule );
            }

            return $discount_rules;
        }

        return false;
    }

	/**
	 * Set Discount Rules
	 *
	 * @param array $rules Discount rules.
	 *          Structure of the array as below:
	 *                     array(
	 *                      array(
	 *                      'id' => '',
	 *                      'min' => '',
	 *                      'max' => '',
	 *                      'get_quantity' => '',
	 *                      'get_ids' => array(),
	 *                      'discount_type' => 'percent',
	 *                      'discount_value' => 0,
	 *                      'discount_label' => 'Discount',
	 *                      'recursive' => 'no',
	 *                     )
	 *                 );.
	 * @return void
	 */
	public function set_discount_rules( $rules ) {
		$this->config['discount_rules'] = $rules;
	}

    /**
     * @return mixed|string
     */
    public function get_discount_based_on() {
        if ( empty( $this->config['discount_based_on'] ) ) {
            return 'cart_subtotal';
        }

        return $this->config['discount_based_on'];
    }

    /**
     * Get Discount Type
     *
     * @return float
     */
    public function get_discount_value() {
        if ( empty( $this->config['discount_value'] ) || ! is_numeric( $this->config['discount_value'] ) ) {
            return 0;
        }

        return (float) $this->config['discount_value'];
    }

	/**
	 * Get Discount Label
	 *
	 * @return string
	 * @throws \Exception If discount label is not set.
	 */
    public function get_discount_label() {
        if ( empty( $this->config['discount_label'] ) ) {
            return esc_html__( 'Discount', 'disco' );
        }

        return $this->config['discount_label'];
    }

    /**
     * Get campaign user id.
     *
     * @return array|string
     */
    public function get_product_ids() {
        $ids = array();

        if ( ! isset( $this->config['products'] ) || empty( $this->config['products'] ) ) {
            return 'all';
        }

        if ( 'all' === $this->config['products'][0] ) {
            return 'all';
        }

        if ( ! empty( $this->config['products'] ) ) {
	        $products = $this->config['products'];

// if(!is_array($this->config['products'][0])) {
// $products = json_decode( $this->config['products'], true );
// $products = (array) $products;
// }

            foreach ( $products as $product ) {
                $product = (array) $product;

                if ( isset( $product['id'] ) ) {
                    $ids[] = $product['id'];
                } else {
                    $ids[] = $product;
                }
            }
        }

        return $ids;
    }

	/**
	 * Get rule product ids.
	 *
	 * @return array products ids.
	 */
	public function get_rule_product_ids() {
		if ( empty( $this->config['discount_rules'] ) ) {
			return array();
		}

		$ids = array();

		foreach ( $this->config['discount_rules'] as $rule ) {
			if ( empty( $rule['get_ids'] ) ) {
				continue;
			}

			$ids = array_merge( $ids, $rule['get_ids'] );
		}

		return array_column( $ids, 'id' );
	}

	/**
	 * Get Design Block
	 *
	 * @return mixed
	 */
	public function get_design_block() {
		return $this->config['design_blocks'];
	}

	/**
     * Get Discount Rules
     *
     * @return array
     */
    public function get_discounts() {
        return (array) $this->config['discount_rules'];
    }

    /**
     * Magic methods
     *
     * @param string $name Configurations name.
     * @return bool
     */
    public function __isset( $name ) {
        return isset( $this->config[ $name ] );
    }

    /**
     * Magic methods
     *
     * @param string $name Configurations name.
     * @return mixed
     */
    public function __get( $name ) {
        return $this->config[ $name ];
    }

    /**
     * Magic methods
     * Set config
     *
     * @param string $name  Configurations name.
     * @param string $value Configurations value.
     * @return void
     */
    public function __set( $name, $value ) {
        $this->config[ $name ] = $value;
    }

    /**
     * Magic methods
     * Unset config
     *
     * @param string $name Configurations name.
     * @return void
     * @since 1.0.0
     */
    public function __unset( $name ) {
        unset( $this->config[ $name ] );
    }

}
