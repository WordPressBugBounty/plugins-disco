<?php

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
class AttributeDropDown {

	/**
	 * Get WooCommerce Attributes.
	 *
	 * @return array
	 * @throws \Exception Exception.
	 */
	public static function get_global_attributes() {
		$taxonomies        = array();
		$global_attributes = wc_get_attribute_taxonomy_labels();

		if ( count( $global_attributes ) ) {
			foreach ( $global_attributes as $key => $value ) {
				$taxonomies[sprintf( 'global_attribute_pa_%s', $key )] = DropDown::prepare_filters(
					$value,
					'select',
					array(
						'type'        => 'select',
						'option_type' => 'manual',
						'multiple'    => true,
						'options'     => get_terms(
							array(
								'taxonomy' => 'pa_' . $key,
								'fields'   => 'id=>name',
							)
						),
					)
				);
			}
		}

		return array(
			'optionGroup' => esc_html__( 'Product Attributes', 'disco' ),
			'options'     => $taxonomies,
		);
	}

	/**
	 * Get Advance Custom Field (ACF) field list
	 *
	 * @return array ACF Fields
	 * @throws \Exception If setting is not found.
	 */
	public static function get_acf_attributes(): array {// phpcs:ignore
		$options = array();

		if ( class_exists( 'ACF' ) && function_exists( 'acf_get_field_groups' ) ) {
			// DO NOT USE here: $fields = acf_get_fields($group['key']);
			// because it causes repeater field bugs and returns "trashed" fields
			$field_groups = acf_get_field_groups();

			foreach ( $field_groups as $group ) {
				$fields = get_posts(
					array(
						'posts_per_page'         => -1,
						'post_type'              => 'acf-field',
						'orderby'                => 'menu_order',
						'order'                  => 'ASC',
						'suppress_filters'       => false, // DO NOT allow WPML to modify the query
						'post_parent'            => $group['ID'],
						'post_status'            => 'any',
						'update_post_meta_cache' => false,
					)
				);

				foreach ( $fields as $field ) {
					// The field name, not the field key: that is what the value is
					// stored under, and so what Product::get_product_meta() reads.
					$key     = 'acf_fields_' . $field->post_excerpt;
					$choices = self::get_acf_field_choices( $field );

					/**
					 * A field with a fixed set of choices (checkbox, select, radio)
					 * is matched against that set, so it gets the list conditions
					 * and a dropdown of its own options. Free text fields have no
					 * options to offer and keep the string conditions.
					 */
					if ( empty( $choices ) ) {
						$options[ $key ] = DropDown::prepare_filters( $field->post_title );

						continue;
					}

					$options[ $key ] = DropDown::prepare_filters(
						$field->post_title,
						'select',
						array(
							'type'        => 'select',
							'option_type' => 'manual',
							'multiple'    => true,
							'options'     => $choices,
						)
					);
				}
			}
		}

		if ( empty( $options ) ) {
			return array(
				'optionGroup' => '',
				'options'     => array(),
			);
		}

		return array(
			'optionGroup' => esc_html__( 'Advance Custom Fields (ACF)', 'disco' ),
			'options'     => $options,
			'disabled'    => !Disco::is_pro(), // Disable if not pro.
		);
	}

	/**
	 * The choices an ACF field offers, keyed by the value that gets stored.
	 *
	 * Read from the field post's own settings rather than through the ACF API:
	 * acf_get_fields() is avoided here because it misbehaves with repeaters and
	 * returns trashed fields, and the settings blob carries everything needed.
	 *
	 * @param \WP_Post $field ACF field post.
	 * @return array<string, string> Stored value => label, empty when the field has no fixed choices.
	 */
	private static function get_acf_field_choices( $field ): array {
		$settings = maybe_unserialize( $field->post_content );

		if ( ! is_array( $settings ) || empty( $settings['choices'] ) || ! is_array( $settings['choices'] ) ) {
			return array();
		}

		$choices = array();

		foreach ( $settings['choices'] as $value => $label ) {
			if ( ! is_scalar( $label ) ) {
				continue;
			}

			$choices[ (string) $value ] = (string) $label;
		}

		return $choices;
	}

}
