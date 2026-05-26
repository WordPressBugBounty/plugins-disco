<?php

/**
 * DropDown API
 *
 * @package    Disco
 * @subpackage \Rest
 * @since      1.0.0
 * @category   Rest
 */

namespace Disco\Rest;

use Disco\App\DropDown\DiscountDropDown;
use Disco\App\DropDown\DropDown;
use Disco\App\DropDown\StoreDropDown;
use WP_REST_Controller;
use WP_REST_Server;

/**
 * Class SearchApi
 *
 * @package    Disco
 * @subpackage \Rest
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class DropDownApi extends WP_REST_Controller {

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			Api::NAMESPACE_NAME . '/' . Api::VERSION,
			'/' . Api::DROPDOWN_ROUTE_NAME . '/',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'context' => $this->get_context_param( array( 'default' => 'view' ) ),
					),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	/**
	 * Checks if a given request has access to read campaigns.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return bool
	 */
	public function permissions_check( $request ) { // phpcs:ignore
		return current_user_can( 'manage_options' ) || current_user_can( 'manage_woocommerce' ); // phpcs:ignore WordPress.WP.Capabilities.Unknown
	}

	/**
	 * Search a list of product items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_REST_Response|\WP_Error
	 * @throws \Exception If the search term is not set.
	 */
	public function get_items( $request ) {
		$search = '';

		if ( is_string( $request['search'] ) ) {
			$search = sanitize_text_field( $request['search'] );
		}

		$dropdown_methods = array(
			'discount_intents'  => DiscountDropDown::discount_intents(),
			'discount_types'    => DiscountDropDown::discount_types(),
			'discount_based_on' => DiscountDropDown::discount_based_on(),
			'bogo_types'        => DiscountDropDown::bogo_types(),
			'discount_methods'  => DiscountDropDown::discount_methods(),
			'products'          => DiscountDropDown::products(),
			'conditions'        => DropDown::conditions(),
			'filters'           => DropDown::filters(),
			'order_status'      => StoreDropDown::order_status(),
			'user_roles'        => StoreDropDown::user_roles(),
			'payment_methods'   => StoreDropDown::payment_methods(),
			'countries'         => StoreDropDown::countries(),
		);

		// If the search term is not set, return an error.
		if ( empty( $request['search'] ) || !array_key_exists( $search, $dropdown_methods ) ) {
			return new \WP_Error(
				'rest_dropdown_invalid_search_term',
				/* translators: %s: List of valid dropdown values. */
				esc_html( sprintf( __( 'Sorry, Invalid dropdown list. Search term should be any one of these values [ %s ].', 'disco' ), implode( ', ', array_keys( $dropdown_methods ) ) ) ),
				array( 'status' => 404 )
			);
		}

		$result = array(
			'name'   => $search,
			'values' => $dropdown_methods[ $search ],
		);

		$response = $this->prepare_item_for_response( $result, $request );
		$data     = $this->prepare_response_for_collection( $response );

		$total    = count( $result['values'] );
		$response = rest_ensure_response( $data );

		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) $total );

		return $response;
	}

	/**
	 * Prepares the item for the REST response.
	 *
	 * @param array            $item WordPress's representation of the item.
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function prepare_item_for_response( $item, $request ) {
		$data   = array();
		$fields = $this->get_fields_for_response( $request );

		if ( in_array( 'name', $fields, true ) && isset( $item['name'] ) ) {
			$data['name'] = $item['name'];
		}

		if ( in_array( 'values', $fields, true ) && isset( $item['values'] ) ) {
			$data['values'] = $item['values'];
		}

		$data = $this->filter_response_by_context( $data, 'view' );

		return rest_ensure_response( $data );
	}

	/**
	 * Retrieves the campaign schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'dropdown',
			'type'       => 'object',
			'properties' => array(
				'name'   => array(
					'description' => __( 'Name for the object.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'values' => array(
					'description' => __( 'Values of the object.', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view' ),
					'readonly'    => true,
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
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

		unset( $params['page'], $params['per_page'] );

		return $params;
	}

}
