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

/**
 * Class Settings
 *
 * @package    Disco
 * @subpackage App\Utility
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Utility
 */
class Settings {

    /**
     * Get the product price from meta according to settings.
     *
     * @param int $product_id Product id.
     * @return float Product Price.
     */
    public static function get_price_from_meta( $product_id ): float {
		$price = self::get( 'product_price_type' );

		if ( 'price' === $price ) {
			$meta_value = get_post_meta( $product_id, '_price', true );

			return is_numeric( $meta_value ) ? (float) $meta_value : 0.0; //phpcs:ignore
		}

		if ( 'regular_price' === $price ) {
			$meta_value = get_post_meta( $product_id, '_regular_price', true );

			return is_numeric( $meta_value ) ? (float) $meta_value : 0.0; //phpcs:ignore
		}

		if ( 'sale_price' === $price ) {
			$meta_value = get_post_meta( $product_id, '_sale_price', true );

			return is_numeric( $meta_value ) ? (float) $meta_value : 0.0; //phpcs:ignore
		}

		// @phpstan-ignore-next-line
        return (float) get_post_meta( $product_id, '_price', true );
    }

	/**
	 * Get the product price according to settings.
	 *
	 * @param \WC_Product $product Product Object.
	 * @return float Product Price.
	 */
	public static function get_price( \WC_Product $product ): float {
		$price = self::get( 'product_price_type' );

		if ( 'price' === $price ) {
			return (float) $product->get_price();
		}

		if ( 'regular_price' === $price ) {
			return (float) $product->get_regular_price();
		}

		if ( 'sale_price' === $price ) {
			return (float) $product->get_sale_price();
		}

		return (float) $product->get_price();
	}

	/**
	 * Get settings.
	 * If the key is not found, return all settings.
	 * If the key is 'all', return all settings.
	 * If the key is 'default', return default settings.
	 * If the key is found, return the value.
	 * If the key is not found, return false.
	 *
	 * @param string $key Settings Key.
     * @return array|string|\WP_Error Settings.
	 */
	public static function get( $key = 'all' ) {
		$default = array(
			'product_price_type'      => 'price', // price, regular_price, sale_price.
			'min_max_discount_amount' => 'min', // min, max.
			'discount_priority_type'  => 'both', // both, disco_campaign
			'on_sale_badge'           => 'show_all', // show_all, show_sale.
			'show_strike_through'     => array(
				'shop_page'     => true,
				'product_pages' => true,
				'category_page' => true,
				'cart_page'     => true,
			),
			'live_chat_support'       => false,
		);

		/**
		 * Add defaults without changing the core values.
		 *
		 * @param array $defaults
		 * @since 3.3.11
		 */
		$default = wp_parse_args( apply_filters( 'disco_settings', $default ), $default );

		if ( 'default' === $key ) {
			return $default;
		}

		$get_settings = get_option( 'disco_settings', array() );

		$settings = wp_parse_args( $get_settings, $default );

		if ( 'all' === $key || empty( $key ) ) {
			return $settings;
		}

		if ( array_key_exists( $key, $settings ) ) {
			return $settings[ $key ];
		}

		return new \WP_Error(
			'rest_not_found',
			__( 'Sorry, Invalid Settings Key.', 'disco' ),
			array( 'status' => 400 )
		);
	}

	/**
	 * Set settings.
	 *
	 * @param string $key   Settings Key.
	 * @param string $value Settings Value.
     * @return bool|\WP_Error
	 * @throws \Exception Invalid Settings Key.
	 * @since 1.0.0
	 */
	public static function set( $key, $value ) {
		$setting = self::get( 'all' );

		if ( is_wp_error( $setting ) ) {
			return $setting;
		}

		if ( is_array( $setting ) && isset( $setting[ $key ] ) ) {
			$setting[ $key ] = $value;

			return self::save( $setting );
		}

		return new \WP_Error(
			'rest_not_found',
			__( 'Sorry, Invalid Settings Key.', 'disco' ),
			array( 'status' => 400 )
		);
	}

	/**
	 * Save settings.
	 *
	 * @param array $args Settings.
     * @return bool
	 * @throws \Exception Invalid Settings Key.
	 * @since 1.0.0
	 */
	public static function save( $args ) {
		$settings = get_option( 'disco_settings', self::Get() );

		$new_settings = wp_parse_args( $args, $settings );

		if ( $new_settings === $settings ) {
			return true;
		}

		return update_option( 'disco_settings', $new_settings );
	}

	/**
	 * Get cached WooCommerce tax display settings.
	 * Uses static caching to avoid repeated get_option() calls.
	 *
	 * @return array{enabled: bool, include_tax: bool} Tax settings.
	 * @since 1.0.0
	 */
	public static function get_tax_settings(): array {
		static $settings = null;

		if ( $settings === null ) {
			$settings = array(
				'enabled'     => wc_tax_enabled(),
				'include_tax' => get_option( 'woocommerce_tax_display_shop', 'excl' ) === 'incl',
			);
		}

		return $settings;
	}

}
