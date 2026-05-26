<?php

/**
 * Search API
 *
 * @package    Disco
 * @subpackage \Rest
 * @since      1.0.0
 * @category   Rest
 */

namespace Disco\Rest;

use Disco\App\Utility\Search;
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
class SearchApi extends WP_REST_Controller {

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @return void
	 */
	public function register_routes() {
		$base      = Api::NAMESPACE_NAME . '/' . Api::VERSION . '/' . Api::SEARCH_ROUTE_NAME;
		$endpoints = array(
			'/product/'    => 'get_products',
			'/category/'   => 'get_categories',
			'/tag/'        => 'get_tags',
			'/attribute/'  => 'get_attributes',
			'/coupon/'     => 'get_coupons',
			'/customer/'   => 'get_customers',
			'/state/'      => 'get_states',
			'/country/'    => 'get_countries',
			'/user_name/'  => 'get_user_name',
			'/user_email/' => 'get_user_email',
			'/brand/'      => 'get_brands',
		);

		foreach ( $endpoints as $endpoint => $callback ) {
			register_rest_route(
				$base,
				$endpoint,
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, $callback ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_collection_params(),
					'schema'              => array( $this, 'get_item_schema' ),
				)
			);
		}
	}

	/**
	 * Search a list of items.
	 *
	 * @param \WP_REST_Request $request         Full data about the request.
	 * @param string           $search_function Search function name.
	 * @return \WP_REST_Response|\WP_Error
	 */
	private function search_helper( $request, $search_function ) {
		$search = '';

		if ( is_string( $request['search'] ) ) {
			$search = $request['search'];
		}

		$search  = $this->validate_search_term( $search );
		$data    = array();
		$results = Search::$search_function( $search );

		if ( empty( $results ) ) {
			return new \WP_Error( 'rest_search_invalid_search_term', __( 'Sorry, No items found with the search term.', 'disco' ), array( 'status' => 404 ) );
		}

		foreach ( $results as $result ) {
			$response = $this->prepare_item_for_response( $result, $request );
			$data[]   = $this->prepare_response_for_collection( $response );
		}

		$response = rest_ensure_response( $data );
		$total    = count( $results );
		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) $total );

		return $response;
	}

	/**
	 * Checks if a given request has access to read campaigns.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return bool
	 */
	public function permissions_check( $request ) {// phpcs:ignore
		return current_user_can( 'manage_options' ) || current_user_can( 'manage_woocommerce' ); // phpcs:ignore WordPress.WP.Capabilities.Unknown
	}

	/**
	 * Search a list of product items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 * @throws \Exception If invalid search term.
	 */
	public function get_products( $request ) {
		return $this->search_helper( $request, 'products' );
	}

	/**
	 * Search a list of category items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_categories( $request ) {
		return $this->search_helper( $request, 'categories' );
	}

	/**
	 * Search a list of tag items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_tags( $request ) {
		return $this->search_helper( $request, 'tags' );
	}

	/**
	 * Search a list of attribute items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_attributes( $request ) {
		return $this->search_helper( $request, 'attributes' );
	}

	/**
	 * Search a list of coupon items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_coupons( $request ) {
		return $this->search_helper( $request, 'coupons' );
	}

	/**
	 * Search a list of customer items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_customers( $request ) {
		return $this->search_helper( $request, 'customers' );
	}

	/**
	 * Search a list of customer items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_states( $request ) {
		return $this->search_helper( $request, 'states' );
	}

	/**
	 * Search a list of customer items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_countries( $request ) {
		return $this->search_helper( $request, 'countries' );
	}

	/**
	 * Search a list of user items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_user_name( $request ) {
		return $this->search_helper( $request, 'user_name' );
	}

	/**
	 * Search a list of user items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_user_email( $request ) {
		return $this->search_helper( $request, 'user_email' );
	}

	/**
	 * Search a list of brand items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function get_brands( $request ) {
		return $this->search_helper( $request, 'brands' );
	}

	/**
	 * Prepares the item for the REST response.
	 *
	 * @param mixed            $item    WordPress's representation of the item.
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function prepare_item_for_response( $item, $request ) {// phpcs:ignore
		$data = array();

		foreach ( array( 'id', 'name', 'sku', 'image' ) as $field ) {
			if ( is_array( $item ) && array_key_exists( $field, $item ) ) {
				$data[ $field ] = $item[ $field ];
			} else {
				$data[ $field ] = null;
			}
		}

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
			'title'      => 'search',
			'type'       => 'object',
			'properties' => array(
				'id'    => array(
					'description' => __( 'Unique identifier for the object.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'name'  => array(
					'description' => __( 'Name of the object.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'sku'   => array(
					'description' => __( 'SKU of the object.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'image' => array(
					'description' => __( 'Image url of the object.', 'disco' ),
					'type'        => 'string',
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

	/**
	 * Validate empty search term.
	 *
	 * @param string $search Search Term.
	 * @return string
	 */
	private function validate_search_term( $search ) {
		if ( empty( $search ) ) {
			return '';
		}

		return sanitize_text_field( $search );
	}

}
