<?php

/**
 * Settings API
 *
 * @package    Disco
 * @subpackage \Rest
 * @since      1.0.0
 * @category   Rest
 */

namespace Disco\Rest;

use Disco\App\Utility\Settings;
use WP_REST_Controller;
use WP_REST_Server;

/**
 * Class SettingsApi
 *
 * @package    Disco
 * @subpackage \Rest
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class SettingsApi extends WP_REST_Controller {

	/**
	 * Registers the routes for the objects of the controller.
	 *
     * @return void
     */
    public function register_routes() {
        register_rest_route(
            Api::NAMESPACE_NAME . '/' . Api::VERSION,
            '/' . Api::SETTINGS_ROUTE_NAME . '/',
            array(
                array(
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => array(
						$this,
						'get_item',
					),
                    'permission_callback' => array(
						$this,
						'permissions_check',
                    ),
                    'args'                => $this->get_collection_params(),
                ),
                array(
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => array(
						$this,
						'update_item',
					),
                    'permission_callback' => array(
						$this,
						'permissions_check',
					),
					'args'                => $this->get_collection_params(),
				),
				'schema' => array(
					$this,
					'get_item_schema',
				),
			)
		);
	}

	/**
	 * Checks if a given request has access to read contacts.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return bool
	 */
	public function permissions_check( $request ) {// phpcs:ignore
		return current_user_can( 'manage_options' ) || current_user_can( 'manage_woocommerce' ); // phpcs:ignore WordPress.WP.Capabilities.Unknown
	}

	/**
	 * Retrieves a list of address items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_REST_Response|\WP_Error
	 * @throws \Exception If the settings is invalid.
	 */
	public function get_item( $request ) {
		$settings = Settings::get();

		if ( is_wp_error( $settings ) ) {
			return $settings;
		}

		$response = $this->prepare_item_for_response( $settings, $request );
		$data     = $this->prepare_response_for_collection( $response );

		$total = 0;

		if ( is_array( $settings ) ) {
			$total = count( $settings );
		}

		$response = rest_ensure_response( $data );

		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) $total );

		return $response;
	}

	/**
	 * Updates one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function update_item( $request ) {
		$prepared_settings = (array) $this->prepare_item_for_database( $request );

		$updated = Settings::save( $prepared_settings );

		if ( ! $updated ) {
			return new \WP_Error(
				'rest_not_updated',
				__( 'Sorry, settings could not be updated.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		$settings = Settings::get();

		if ( is_wp_error( $settings ) ) {
			return $settings;
		}

		$response = $this->prepare_item_for_response( $settings, $request );

		return rest_ensure_response( $response );
	}

	/**
	 * Prepares the item for the REST response.
	 *
	 * @param array|string     $item    WordPress' representation of the item.
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function prepare_item_for_response( $item, $request ) { // phpcs:ignore
		$data = array();

		$fields = $this->get_fields_for_response( $request );

		if ( is_array( $fields ) && is_array( $item ) && in_array( 'show_strike_through', $fields, true ) ) {
			$data['show_strike_through'] = $item['show_strike_through'] ?? array();
		}

		if ( is_array( $fields ) && is_array( $item ) && in_array( 'on_sale_badge', $fields, true ) ) {
			$data['on_sale_badge'] = $item['on_sale_badge'] ?? '';
		}

		if ( is_array( $fields ) && is_array( $item ) && in_array( 'product_price_type', $fields, true ) ) {
			$data['product_price_type'] = $item['product_price_type'];
		}

		if ( is_array( $fields ) && is_array( $item ) && in_array( 'min_max_discount_amount', $fields, true ) ) {
			$data['min_max_discount_amount'] = $item['min_max_discount_amount'];
		}

		if ( is_array( $fields ) && is_array( $item ) && in_array( 'discount_priority_type', $fields, true ) ) {
			$data['discount_priority_type'] = $item['discount_priority_type'] ?? '';
		}

		if ( is_array( $fields ) && is_array( $item ) && in_array( 'live_chat_support', $fields, true ) ) {
			$data['live_chat_support'] = (bool) ( $item['live_chat_support'] ?? false );
		}

		$context = 'view';

		if ( is_string( $request['context'] ) ) {
			$context = $request['context'];
		}

		$data = $this->filter_response_by_context( $data, $context );

		return rest_ensure_response( $data );
	}

	/**
	 * Retrieves the contact schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_item_schema() { // phpcs:ignore
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'contact',
			'type'       => 'object',
			'properties' => array(
				'product_price_type'      => array(
					'description' => __( 'Product Price Type.', 'disco' ),
					'type'        => 'string',
					'context'     => array(
						'view',
						'edit',
					),
				),
				'min_max_discount_amount' => array(
					'description' => __( 'Minimum, Maximum or Average Discount Amount.', 'disco' ),
					'type'        => 'string',
					'context'     => array(
						'view',
						'edit',
					),
				),
				'discount_priority_type'  => array(
					'description' => __( 'Discount Priority Type.', 'disco' ),
					'type'        => 'string',
					'enum'        => array( 'both', 'disco_campaign' ),
					'default'     => 'both',
					'context'     => array(
						'view',
						'edit',
					),
				),
				'on_sale_badge'           => array(
					'description' => __( 'On Sale Badge Text.', 'disco' ),
					'type'        => 'string',
					'context'     => array(
						'view',
						'edit',
					),
				),
				'show_strike_through'     => array(
					'description' => __( 'Show Strike Through Price.', 'disco' ),
					'type'        => 'array',
					'context'     => array(
						'view',
						'edit',
					),
				),
				'live_chat_support'       => array(
					'description' => __( 'Enable Live Chat Support.', 'disco' ),
					'type'        => 'boolean',
					'default'     => false,
					'context'     => array(
						'view',
						'edit',
					),
				),
			),
		);

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Retrieves the query params for collections.
	 *
	 * @return array
	 */
	public function get_collection_params() {
		$params = parent::get_collection_params();

		unset( $params['search'], $params['per_page'], $params['page'] );

		return $params;
	}

	/**
	 * Get the setting, if the key is valid.
	 *
	 * @param string $key Supplied ID.
	 * @return array|string|\WP_Error
	 */
	protected function get_settings( $key ) {
		$setting = Settings::get( $key );

		if ( ! $setting ) {
			return new \WP_Error(
				'rest_setting_invalid_key',
				__( 'Invalid Setting Key.', 'disco' ),// phpcs:ignore
				array( 'status' => 404 )
			);
		}

		return $setting;
	}

	/**
	 * Prepares one item for create or update operation.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return object
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared = array();

		if ( isset( $request['show_strike_through'] ) ) {
			$prepared['show_strike_through'] = $request['show_strike_through'];
		}

		if ( isset( $request['on_sale_badge'] ) ) {
			$prepared['on_sale_badge'] = $request['on_sale_badge'];
		}

		if ( isset( $request['discount_priority_type'] ) ) {
			$prepared['discount_priority_type'] = $request['discount_priority_type'];
		}

		if ( isset( $request['product_price_type'] ) ) {
			$prepared['product_price_type'] = $request['product_price_type'];
		}

		if ( isset( $request['min_max_discount_amount'] ) ) {
			$prepared['min_max_discount_amount'] = $request['min_max_discount_amount'];
		}

		if ( isset( $request['live_chat_support'] ) ) {
			$prepared['live_chat_support'] = (bool) $request['live_chat_support'];
		}

		return (object) $prepared;
	}

}
