<?php
/**
 * DB Model Utility
 *
 * @package    Disco
 * @subpackage App\Utility
 * @since      1.0.0
 * @category   Utility
 */

namespace Disco\App\Utility;

/**
 * Class Model
 *
 * @package    Disco
 * @subpackage App\Utility
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Utility
 */
class Model {

    /**
	 * Get all product attributes.
	 *
	 * @param string $like Search Term.
	 * @return array
	 */
	public function wc_global_attribute_query( $like = '' ) {
		global $wpdb;
		$query = $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}woocommerce_attribute_taxonomies WHERE attribute_name != '' AND attribute_name LIKE %s", $like . '%' );

		return $wpdb->get_results( $query ); //phpcs:ignore
	}

	/**
	 * Get all product custom attributes.
	 *
	 * @param string $like Search Term.
	 * @return array
	 */
	public function wc_custom_attribute_query( $like = '' ) {
		global $wpdb;
		$query = $wpdb->prepare( 'SELECT meta.meta_id, meta.meta_key as name, meta.meta_value as type FROM ' . $wpdb->postmeta . ' AS meta, ' . $wpdb->posts . " AS posts WHERE meta.post_id = posts.id AND posts.post_type LIKE %s AND meta.meta_key='_product_attributes'", $like . '%' );

		return $wpdb->get_results( $query ); //phpcs:ignore
	}

}
