<?php // phpcs:ignoreFile

/**
 * Search Utility
 *
 * @package    Disco
 * @subpackage App\Utility
 * @since      1.0.0
 * @category   Utility
 */

namespace Disco\App\Utility;

use WC_Countries;
use WC_Coupon;
use WC_Data_Store;
use WP_Query;
use WP_Term_Query;
use WP_User_Query;

/**
 * Class Search
 *
 * @package    Disco
 * @subpackage App\Utility
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Utility
 */
class Search { //phpcs:ignore

	/**
	 * Search Products by Product Title or SKU.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	public static function products( $search_term = '' ) {
		try {
			$data_store = WC_Data_Store::load( 'product' );
			// @phpstan-ignore-next-line
			$get_products = $data_store->search_products( $search_term, 'product', true, false, 200, array(), array() );
		} catch ( \Throwable $e ) {
			$get_products = array();
		}

		$products = array();

		if ( ! empty( $get_products ) ) {
			foreach ( $get_products as $pid ) {
				if ( ! $pid ) {
					continue;
				}

				$product = wc_get_product( $pid );

				if ( ! ( $product instanceof \WC_Product ) ) {
					continue;
				}

				$products[] = array(
					'id'    => $product->get_id(),
					'sku'   => $product->get_sku(),
					'name'  => $product->get_name(),
					'image' => wp_get_attachment_url( (int) $product->get_image_id() ),
				);
			}
		}

		return $products;
	}

	/**
	 * Search Categories by Category Name.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	public static function categories( $search_term = '' ) {
		$args = array(
			'taxonomy'   => 'product_cat',
			'orderby'    => 'name',
			'order'      => 'ASC',
			'hide_empty' => false,
			'number'     => 20,
		);

		if ( ! empty( $search_term ) ) {
			$args['search'] = $search_term;
		}

		$args           = (array) $args;
		$get_categories = ( new WP_Term_Query( $args ) )->get_terms();

		$categories = array();

		if ( is_array( $get_categories ) && ! empty( $get_categories ) ) {
			foreach ( $get_categories as $category ) {
				if ( ! ( $category instanceof \WP_Term ) ) {
					continue;
				}

				$categories[] = array(
					'id'   => $category->term_id,
					'name' => $category->name,
				);
			}
		}

		return $categories;
	}

	/**
	 * Search Tags by Tag Name.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	public static function tags( $search_term = '' ) {
		$args = array(
			'taxonomy'   => 'product_tag',
			'orderby'    => 'name',
			'order'      => 'ASC',
			'hide_empty' => false,
			'number'     => 20,
		);

		if ( ! empty( $search_term ) ) {
			$args['search'] = $search_term;
		}

		$get_tags = ( new WP_Term_Query( $args ) )->get_terms();

		$tags = array();

		if ( is_array( $get_tags ) && ! empty( $get_tags ) ) {
			foreach ( $get_tags as $tag ) {
				if ( ! ( $tag instanceof \WP_Term ) ) {
					continue;
				}

				$tags[] = array(
					'id'   => $tag->term_id,
					'name' => $tag->name,
				);
			}
		}

		return $tags;
	}

	/**
	 * Search Brands by Brand Name.
	 *
	 * @param string $search_term Search Term.
     * @return array
	 */
	public static function brands( $search_term = '' ) {
		$args = array(
			'taxonomy'   => 'product_brand',
			'orderby'    => 'name',
			'order'      => 'ASC',
			'hide_empty' => false,
			'number'     => 20,
		);

		if ( ! empty( $search_term ) ) {
			$args['search'] = $search_term;
		}

		$get_brands = ( new WP_Term_Query( $args ) )->get_terms();

		$brands = array();

		if ( is_array( $get_brands ) && ! empty( $get_brands ) ) {
			foreach ( $get_brands as $brand ) {
				if ( ! ( $brand instanceof \WP_Term ) ) {
					continue;
				}

				$brands[] = array(
					'id'   => $brand->term_id,
					'name' => $brand->name,
				);
			}
		}

		return $brands;
	}

	/**
	 * Search coupon by coupon name.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	public static function coupons( $search_term = '' ) {
		$args = array(
			'post_type'   => 'shop_coupon',
			'post_status' => 'publish',
			'fields'      => 'post_title',
			'number'      => 20,

		);

		if ( ! empty( $search_term ) ) {
			$args['s'] = $search_term;
		}

		$get_coupons = ( new WP_Query( $args ) )->get_posts();

		$coupons = array();

		if ( ! empty( $get_coupons ) ) {
			foreach ( $get_coupons as $coupon ) {
				if ( ! ( $coupon instanceof \WP_Post ) ) {
					continue;
				}

				$coupon = new WC_Coupon( $coupon->post_title );

				$coupons[] = array(
					'id'   => $coupon->get_id(),
					'name' => $coupon->get_code(),
				);
			}
		}

		return $coupons;
	}

	/**
	 * Search Customer by Name or Email.
	 *
	 * @param string $search_term Search Term.
     * @return array
	 * @throws \Exception If the search term is invalid.
	 */
	public static function customers( $search_term = '' ) {
		$args = array(
			'role'    => 'customer',
			'order'   => 'ASC',
			'orderby' => 'display_name',
			'number'  => 20,
		);

		if ( ! empty( $search_term ) ) {
			$args['search'] = '*' . esc_attr( $search_term ) . '*';
		}

		if ( filter_var( $search_term, FILTER_VALIDATE_EMAIL ) ) {
			// valid email address
			$args['search_columns'] = array( 'user_email' );
		} else {
			// invalid address
			$args['meta_query'] = array( //phpcs:ignore
				'relation' => 'OR',
				array(
					'key'     => 'first_name',
					'value'   => $search_term,
					'compare' => 'LIKE',
				),
				array(
					'key'     => 'last_name',
					'value'   => $search_term,
					'compare' => 'LIKE',
				),
				array(
					'key'     => 'user_email',
					'value'   => $search_term,
					'compare' => 'LIKE',
				),
			);
		}

		// Create the WP_User_Query object
		$get_customers = ( new WP_User_Query( $args ) )->get_results();

		$customers = array();

		if ( ! empty( $get_customers ) ) {
			foreach ( $get_customers as $customer ) {
				$customers[] = array(
					'id'   => $customer->ID,
					'name' => $customer->first_name . ' ' . $customer->last_name . ' (' . $customer->user_email . ')',
				);
			}
		}

		return $customers;
	}

	/**
	 * Get States by Country Code.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	public static function states( $search_term ) {
		// Initialize WooCommerce Countries object
		$countries = WC()->countries;

		// Get all states (indexed by country)
		$states_by_country = $countries->get_states();

		// Initialize an array to hold matching states
		$matching_states = array();

		// Check if the state array is empty
		if ( empty( $states_by_country ) ) {
			return $matching_states;
		}

		// Loop through each country and its states
		foreach ( $states_by_country as $country_code => $states ) {
			$country_names = $countries->get_countries();
			$country_name  = $country_names[$country_code];

			if ( !is_array( $states ) ) {
                continue;
            }

            foreach ( $states as $state_code => $state_name ) {
                // Check if the state name contains the search term (case-insensitive)
                if ( stripos( $state_name, $search_term ) === false ) {
                    continue;
                }

                $matching_states[] = array(
                    'id'   => $state_code,
                    'name' => $country_name . ' - ' . $state_name,
                );
            }
		}

		return $matching_states;
	}

	/**
	 * Get States by Country Code.
	 *
	 * @param string $search_term Country or state name.
	 * @return array
	 */
	public static function countries( $search_term ) {
		if ( empty( $search_term ) ) {
			return array();
		}

		$counties     = array();
		$get_counties = ( new WC_Countries )->get_countries();

		foreach ( $get_counties as $country_key => $country ) {
			$counties[ $country_key ] = array(
				'id'   => $country_key,
				'name' => $country,
			);
		}

		return array_filter(
			$counties,
			static function ( $item ) use ( $search_term ) {
				$value = $item['id'] . '-' . $item['name'];

				return stripos( $value, $search_term ) !== false;
			}
		);
	}

	/**
	 * Search Attributes by Attribute Name.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	public static function attributes( $search_term = ' ' ) {
		$attributes        = self::get_global_attributes( $search_term );
		$custom_attributes = self::get_custom_attributes( $search_term );

		return array_merge( $attributes, $custom_attributes );
	}

	/**
	 * Search Users by Name or Email.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	public static function user_name( $search_term = '' ) {
		$args = array(
			'role__in' => array( 'author', 'editor', 'administrator', 'shop_manager' ),
			'order'    => 'ASC',
			'orderby'  => 'display_name',
			'number'   => 20,
		);

		if ( ! empty( $search_term ) ) {
			$args['search'] = '*' . esc_attr( $search_term ) . '*';
		}

		if ( filter_var( $search_term, FILTER_VALIDATE_EMAIL ) ) {
			// valid email address
			$args['search_columns'] = array( 'user_email' );
		} else {
			// invalid address
			$args['meta_query'] = array( //phpcs:ignore
				'relation' => 'OR',
				array(
					'key'     => 'first_name',
					'value'   => $search_term,
					'compare' => 'LIKE',
				),
				array(
					'key'     => 'last_name',
					'value'   => $search_term,
					'compare' => 'LIKE',
				),
				array(
					'key'     => 'user_email',
					'value'   => $search_term,
					'compare' => 'LIKE',
				),
			);
		}

		// Create the WP_User_Query object
		$get_users = ( new WP_User_Query( $args ) )->get_results();

		$users = array();

		if ( ! empty( $get_users ) ) {
			foreach ( $get_users as $user ) {
				$users[] = array(
					'id'   => $user->ID,
					'name' => $user->first_name . ' ' . $user->last_name,
				);
			}
		}

		return $users;
	}

	/**
	 * Search Users by Email.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	public static function user_email( $search_term = '' ) {
		$args = array(
			'role__in' => array( 'author', 'editor', 'administrator', 'shop_manager' ),
			'order'    => 'ASC',
			'orderby'  => 'display_name',
			'number'   => 20,
		);

		if ( ! empty( $search_term ) ) {
			$args['search'] = '*' . esc_attr( $search_term ) . '*';
		}

		if ( filter_var( $search_term, FILTER_VALIDATE_EMAIL ) ) {
			// valid email address
			$args['search_columns'] = array( 'user_email' );
		} else {
			// invalid address
			$args['meta_query'] = array( //phpcs:ignore
				'relation' => 'OR',
				array(
					'key'     => 'first_name',
					'value'   => $search_term,
					'compare' => 'LIKE',
				),
				array(
					'key'     => 'last_name',
					'value'   => $search_term,
					'compare' => 'LIKE',
				),
				array(
					'key'     => 'user_email',
					'value'   => $search_term,
					'compare' => 'LIKE',
				),
			);
		}

		// Create the WP_User_Query object
		$get_users = ( new WP_User_Query( $args ) )->get_results();

		$users = array();

		if ( ! empty( $get_users ) ) {
			foreach ( $get_users as $user ) {
				$users[] = array(
					'id'   => $user->ID,
					'name' => $user->user_email,
				);
			}
		}

		return $users;
	}

	/**
	 * Search Attributes by Attribute Name.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	protected static function get_global_attributes( $search_term ) {
		$global_attributes = Cache::remember(
			'wc_global_attributes',
			array(
				new Model,
				'wc_global_attribute_query',
			),
			array( $search_term )
		);
		$result            = array();

		if ( is_array( $global_attributes ) && ! empty( $global_attributes ) ) {
			foreach ( $global_attributes as $attribute ) {
				if ( ! isset( $attribute->attribute_name, $attribute->attribute_label ) ) {
					continue;
				}

				$result[] = array(
					'id'   => $attribute->attribute_name,
					'name' => $attribute->attribute_label,
				);
			}
		}

		return $result;
	}

	/**
	 * Get all product custom attributes.
	 *
	 * @param string $search_term Search Term.
	 * @return array
	 */
	protected static function get_custom_attributes( $search_term ) {
		$custom_attributes = Cache::remember(
			'wc_custom_attributes',
			array(
				new \Disco\App\Utility\Model,
				'wc_custom_attribute_query',
			),
			array( $search_term )
		);
		$result            = array();

		if ( is_array( $custom_attributes ) && ! empty( $custom_attributes ) ) {
			foreach ( $custom_attributes as $value ) {
				$product_attr = maybe_unserialize( $value->type );

				if ( ! is_array( $product_attr ) ) {
					continue;
				}

				$result = array_merge( $result, self::filter_product_attributes( $product_attr, $search_term ) );
			}
		}

		return $result;
	}

	/**
	 * Filter Product Attributes.
	 *
	 * @param array  $product_attr Product Attributes.
	 * @param string $search_term         Search Term.
	 * @return array
	 */
	protected static function filter_product_attributes( $product_attr, $search_term ) {
		$filtered_attrs = array();

		foreach ( $product_attr as $key => $arr_value ) {
			if ( strpos( $key, 'pa_' ) !== false ) {
				continue;
			}

			if ( ! empty( $search_term ) && ( stripos( $arr_value['name'], $search_term ) === false ) ) {
				continue;
			}

			$filtered_attrs[] = array(
				'id'   => $key,
				'name' => ucwords( str_replace( '-', ' ', $arr_value['name'] ) ),
			);
		}

		return $filtered_attrs;
	}

}
