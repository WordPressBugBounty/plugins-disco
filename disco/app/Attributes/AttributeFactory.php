<?php
/**
 * Disco Attribute Factory
 *
 * @package    Disco
 * @subpackage Disco\App\Attributes
 * @category   MyCategory
 */

namespace Disco\App\Attributes;

/**
 * Class AttributeFactory
 *
 * @package    Disco
 * @subpackage Disco\App\Attributes
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   MyCategory
 */
class AttributeFactory {

	/**
     * AttributeFactory constructor.
     */
    public function __construct() {
        // class constructor
    }

    /**
     * Get Attribute Type, Initialize Class and Return Value.
     * If Method is Not Found, Return Empty String.
     *
     * @param string $method_name Method Name.
     * @param array  $info Class Object.
     * @return string
     */
    public static function get_value( $method_name, $info ) {
        $class_details = self::get_class_and_method( $method_name, $info );

        if ( ! $class_details ) {
            return '';
        }

        list( $class_instance, $method, $key ) = $class_details;

        if ( ! method_exists( $class_instance, $method ) ) {
            return '';
        }

        if ( $key ) {
            return $class_instance->$method( $key );
        }

        return $class_instance->$method();
    }

	/**
     * Get Attribute Type, Initialize Class and Return Value.
     *
     * @param string $method_name Method Name.
     * @param array  $info Class Object.
     * @return array
     */
	public static function get_class_and_method( $method_name, $info ) {// phpcs:ignore
        $prefix_mappings = array(
            'customer_history'  => array(
				CustomerHistory::class,
				null,
			),
            'product_history'   => array(
				ProductHistory::class,
				null,
            ),
            'customer'          => array(
				Customer::class,
				null,
            ),
            'cart'              => array(
				Cart::class,
				null,
            ),
			'products_in_cart'  => array(
				Cart::class,
				'products_in_cart',
			),
            'global_attribute_' => array(
				Product::class,
				'get_attribute',
            ),
			'product_brand'     => array(
				Product::class,
				'product_brand',
			),
            'custom_attribute_' => array(
				Product::class,
				'get_attribute',
            ),
            'product_meta_'     => array(
				Product::class,
				'get_product_meta',
            ),
			// Acf Fields.
			'acf_fields_'       => array(
				Product::class,
				'get_product_meta',
			),
        );

        foreach ( $prefix_mappings as $prefix => $class_and_method ) {
            if ( strpos( $method_name, $prefix ) !== 0 ) {
                continue;
            }

            $class_name = $class_and_method[0];

			if ( $class_and_method[1] ) {
                $method = $class_and_method[1];
            } else {
                $method = $method_name;
            }

			if ( $method === $method_name ) {
                $key = null;
            } else {
                $key = str_replace( $prefix, '', $method_name );
            }

            // If the class is Cart or Customer, we don't need to pass any info.
            if ( $class_name === Cart::class || $class_name === Customer::class ) {
                return array(
					new $class_name,
					$method,
					$key,
                );
            }

			if ( $class_name === CustomerHistory::class || $class_name === ProductHistory::class ) {
				// remove prefix from method name.
				$method = str_replace( $prefix . '_', '', $method_name );
			}

			if ( $class_name === ProductHistory::class ) {
				$product = $info['product'];
				\assert( $product instanceof \WC_Product );

				return array(
					new $class_name( $info, $product ),
					$method,
					$key,
				);
			}

            if ( $class_name === Product::class ) {
                $product = $info['product'];
                \assert( $product instanceof \WC_Product );

                return array(
					new $class_name( $product ),
					$method,
					$key,
                );
            }

            return array(
				new $class_name( $info ),
				$method,
				$key,
            );
        }//end foreach

        $product = $info['product'];
        \assert( $product instanceof \WC_Product );

        return array(
			new Product( $product ),
			$method_name,
			null,
        );
    }

}
