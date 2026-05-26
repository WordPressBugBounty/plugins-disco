<?php //phpcs:ignore

/**
 * Campaign API
 *
 * @package    Disco
 * @subpackage \Rest
 * @since      1.0.0
 * @category   Rest
 */

namespace Disco\Rest;

use Disco\App\Campaign;
use Disco\App\DropDown\DiscountDropDown;
use Disco\App\Utility\Config;
use WP_REST_Controller;
use WP_REST_Server;

/**
 * Class Campaign API
 *
 * @package    Disco
 * @subpackage \Rest
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class CampaignApi extends WP_REST_Controller {//phpcs:ignore

	/**
	 * CampaignApi constructor.
	 */
	public function __construct() {
		$this->namespace = Api::NAMESPACE_NAME . '/' . Api::VERSION;
		$this->rest_base = Api::CAMPAIGN_ROUTE_NAME;
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @return void
	 * @throws \Exception If route is not available.
	 */
	public function register_routes() { //phpcs:ignore

		register_rest_route(
			Api::NAMESPACE_NAME . '/' . Api::VERSION,
			'/' . Api::CAMPAIGN_ROUTE_NAME . '/',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_collection_params(),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema(),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);

		register_rest_route(
			Api::NAMESPACE_NAME . '/' . Api::VERSION,
			'/' . Api::CAMPAIGN_ROUTE_NAME . '/(?P<id>[\d]+)',
			array(
				'args'   => array(
					'id' => array(
						'description' => __( 'Unique identifier for the object.', 'disco' ),
						'type'        => 'integer',
					),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'context' => $this->get_context_param( array( 'default' => 'view' ) ),
					),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				),
				'schema' => array( $this, 'get_item_schema' ),
			)
		);
	}

	/**
	 * Checks if a given request has access to read campaigns.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
     * @return bool|\WP_Error
	 * @throws \Exception If the campaign does not exist.
	 */
	public function permissions_check( $request ) {//phpcs:ignore
		$permission = current_user_can( 'manage_options' ) || current_user_can( 'manage_woocommerce' ); // phpcs:ignore WordPress.WP.Capabilities.Unknown

		if ( ! $permission ) {
			return new \WP_Error(
				'rest_not_found',
				__( 'Sorry, Permission Denied.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		if ( isset( $request['id'] ) ) {
			$campaign = $this->get_campaign( absint( $request['id'] ) );

			if ( is_wp_error( $campaign ) ) {
				return $campaign;
			}
		}

		return $permission;
	}

	/**
	 * Retrieves a list of campaign items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_REST_Response|\WP_Error
	 * @throws \Exception If the campaign does not exist.
	 */
	public function get_items( $request ) {
		$params = $this->get_collection_params();
		$args   = array_intersect_key( $request->get_params(), $params );

		// unset others.
		unset( $args['per_page'], $args['page'] );

		$data      = array();
		$campaigns = ( new Campaign )->get_campaigns();

		if ( empty( $campaigns ) ) {
			return new \WP_Error(
				'rest_campaign_not_available',
				__( 'No campaign available. Create a campaign first', 'disco' ),
				array( 'status' => 404 )
			);
		}

		foreach ( $campaigns as $campaign ) {
			$response = $this->prepare_item_for_response( $campaign, $request );
			$data[]   = $this->prepare_response_for_collection( $response );
		}

		$total    = count( $campaigns );
		$response = rest_ensure_response( $data );

		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) $total );

		return $response;
	}

	/**
	 * Retrieves one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function get_item( $request ) {
		$campaign = $this->get_campaign( absint( $request['id'] ) );

		if ( is_wp_error( $campaign ) ) {
			return $campaign;
		}

		$response = $this->prepare_item_for_response( $campaign, $request );

		return rest_ensure_response( $response );
	}

	/**
	 * Creates one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|\WP_REST_Response
	 * @throws \Exception If the campaign does not exist.
	 */
	public function create_item( $request ) {
		$config = (array) $this->prepare_item_for_database( $request );

		if ( empty( $config ) ) {
			return new \WP_Error(
				'rest_not_added',
				__( 'Sorry, the campaign could not be created with empty value.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		$campaign = ( new Campaign )->save_campaign( $config );

		if ( is_wp_error( $campaign ) ) {
			$campaign->add_data( array( 'status' => 400 ) );

			return $campaign;
		}

		$response = $this->prepare_item_for_response( $campaign, $request );

		$response->set_status( 201 );
		$campaign_id = 0;

		if ( isset( $campaign->id ) ) {
			$campaign_id = $campaign->id;
		}

		$response->header( 'Location', rest_url( sprintf( '%s/%s/%d', $this->namespace, $this->rest_base, $campaign_id ) ) );

		return rest_ensure_response( $response );
	}

	/**
	 * Updates one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_Error|\WP_REST_Response
	 * @throws \Exception If the campaign does not exist.
	 */
	public function update_item( $request ) {
		$campaign = $this->get_campaign( absint( $request['id'] ) );

		if ( is_wp_error( $campaign ) ) {
			return $campaign;
		}

		$prepared = (array) $this->prepare_item_for_database( $request );

		if ( $campaign instanceof Config && method_exists( $campaign, 'get_config' ) ) {
			$config   = $campaign->get_config();
			$prepared = array_merge( $config, $prepared );
		}

		$updated = ( new Campaign )->update_campaign( absint( $request['id'] ), $prepared );

		if ( ! $updated ) {
			return new \WP_Error(
				'rest_not_updated',
				__( 'Sorry, the campaign could not be updated.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		$campaign = $this->get_campaign( absint( $request['id'] ) );

		$response = $this->prepare_item_for_response( $campaign, $request );

		return rest_ensure_response( $response );
	}

	/**
	 * Deletes one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
     * @return \WP_REST_Response|\WP_Error
	 * @throws \Exception If the campaign does not exist.
	 */
	public function delete_item( $request ) {
		$campaign = $this->get_campaign( absint( $request['id'] ) );

		if ( is_wp_error( $campaign ) ) {
			return $campaign;
		}

		$previous = $this->prepare_item_for_response( $campaign, $request );

		$deleted = ( new Campaign )->delete_campaign( absint( $request['id'] ) );

		if ( ! $deleted ) {
			return new \WP_Error(
				'rest_not_deleted',
				__( 'Sorry, the campaign could not be deleted.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		$data = array(
			'deleted'  => true,
			'previous' => $previous->get_data(),
		);

		return rest_ensure_response( $data );
	}

	/**
	 * Prepares the item for the REST response.
	 *
	 * @param object           $item    WordPress's representation of the item.
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_Error|\WP_HTTP_Response|\WP_REST_Response
	 */
	public function prepare_item_for_response( $item, $request ) {//phpcs:ignore

		$data       = array();
		$fields     = $this->get_fields_for_response( $request );
		$data['id'] = 0;

		if ( ! empty( $item->id ) && in_array( 'id', $fields, true ) ) {
			$data['id'] = $item->id;
		}

		$data['name'] = '';

		if ( ! empty( $item->name ) && in_array( 'name', $fields, true ) ) {
			$data['name'] = $item->name;
		}

		$data['priority'] = '1';

		if ( ! empty( $item->priority ) && in_array( 'priority', $fields, true ) ) {
			$data['priority'] = $item->priority;
		}

		$data['status'] = '1';

		if ( isset( $item->status ) && in_array( 'status', $fields, true ) ) {
			$data['status'] = $item->status;
		}

		$data['discount_intent'] = '';

		if ( ! empty( $item->discount_intent ) && in_array( 'discount_intent', $fields, true ) ) {
			$data['discount_intent'] = $item->discount_intent;
		}

		$data['products'] = array();

		if ( ! empty( $item->products ) && in_array( 'products', $fields, true ) ) {
			$data['products'] = (array) $item->products;
		}

		$data['conditions'] = array();

		if ( ! empty( $item->conditions ) && in_array( 'conditions', $fields, true ) ) {
			$data['conditions'] = $item->conditions;
		}

		$data['discount_rules'] = array();

		if ( ! empty( $item->discount_rules ) && in_array( 'discount_rules', $fields, true ) ) {
			$data['discount_rules'] = $item->discount_rules;
		}

		$data['created_by'] = '';

		if ( ! empty( $item->created_by ) && in_array( 'created_by', $fields, true ) ) {
			$data['created_by'] = $item->created_by;
		}

		$data['created_date'] = '';

		if ( ! empty( $item->created_date ) && in_array( 'created_date', $fields, true ) ) {
			$created_date = gmdate( DATE_W3C, strtotime( $item->created_date ) );

			$data['created_date'] = $created_date;
		}

		$data['modified_by'] = '';

		if ( ! empty( $item->modified_by ) && in_array( 'modified_by', $fields, true ) ) {
			$data['modified_by'] = $item->modified_by;
		}

		$data['modified_date'] = '';

		if ( ! empty( $item->modified_date ) && in_array( 'modified_date', $fields, true ) ) {
			$modified_date = gmdate( DATE_W3C, strtotime( $item->modified_date ) );

			$data['modified_date'] = $modified_date;
		}

		$data['discount_valid_from'] = '';

		if ( ! empty( $item->discount_valid_from ) && in_array( 'discount_valid_from', $fields, true ) ) {
			$discount_valid_from = gmdate( DATE_W3C, strtotime( $item->discount_valid_from ) );

			$data['discount_valid_from'] = $discount_valid_from;
		}

		$data['discount_valid_to'] = '';

		if ( ! empty( $item->discount_valid_to ) && in_array( 'discount_valid_to', $fields, true ) ) {
			$discount_valid_to = gmdate( DATE_W3C, strtotime( $item->discount_valid_to ) );

			$data['discount_valid_to'] = $discount_valid_to;
		}

		$data['discount_method'] = '';

		if ( ! empty( $item->discount_method ) && in_array( 'discount_method', $fields, true ) ) {
			$data['discount_method'] = $item->discount_method;
		}

		$data['discount_coupon'] = '';

		if ( ! empty( $item->discount_coupon ) && in_array( 'discount_coupon', $fields, true ) ) {
			$data['discount_coupon'] = $item->discount_coupon;
		}

		$data['discount_label'] = '';

		if ( ! empty( $item->discount_label ) && in_array( 'discount_label', $fields, true ) ) {
			$data['discount_label'] = $item->discount_label;
		}

		$data['discount_max_user'] = '';

		if ( ! empty( $item->discount_max_user ) && in_array( 'discount_max_user', $fields, true ) ) {
			$data['discount_max_user'] = $item->discount_max_user;
		}

		$data['discount_based_on'] = '';

		if ( ! empty( $item->discount_based_on ) && in_array( 'discount_based_on', $fields, true ) ) {
			$data['discount_based_on'] = $item->discount_based_on;
		}

		$data['bogo_type'] = '';

		if ( ! empty( $item->bogo_type ) && in_array( 'bogo_type', $fields, true ) ) {
			$data['bogo_type'] = $item->bogo_type;
		}

		$data['ui'] = array();

		if ( ! empty( $item->ui ) && in_array( 'ui', $fields, true ) ) {
			$data['ui'] = $item->ui;
		}

// $data['design_blocks'] = array();

		if ( ! empty( $item->design_blocks ) && in_array( 'design_blocks', $fields, true ) ) {
			$data['design_blocks'] = $item->design_blocks;
		}

		$context = ! empty( $request['context'] ) && is_string( $request['context'] ) ? $request['context'] : 'view';//phpcs:ignore

		$data = $this->filter_response_by_context( $data, $context );

		$response = rest_ensure_response( $data );
		$response->add_links( $this->prepare_links( $item ) );

		return $response;
	}

	/**
	 * Retrieves the campaign schema, conforming to JSON Schema.
	 *
	 * @return array
	 * @throws \Exception If the campaign does not exist.
	 */
	public function get_item_schema() {//phpcs:ignore
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'campaign',
			'type'       => 'object',
			'properties' => array(
				'id'                  => array(
					'description' => __( 'Unique identifier for the campaign.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'name'                => array(
					'description' => __( 'Name of the campaign.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'required'    => true,
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'priority'            => array(
					'description' => __( 'Campaign Priority.', 'disco' ),
					'type'        => 'string',
					'required'    => true,
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'status'              => array(
					'description' => __( 'Campaign Status.', 'disco' ),
					'type'        => 'string',
					'required'    => true,
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'products'            => array(
					'description' => __( 'Discount applicable products.', 'disco' ),
					'type'        => 'array',
					'required'    => true,
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'rest_sanitize_array',
					),
				),
				'conditions'          => array(
					'description' => __( 'Conditions to match before get the discount.', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'rest_sanitize_array',
					),
				),
				'discount_intent'     => array(
					'description' => __( 'Discount Intention.', 'disco' ),
					'type'        => 'string',
					'required'    => true,
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'discount_rules'      => array(
					'description' => __( 'Discount Rules.', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'rest_sanitize_array',
					),
				),
				'discount_based_on'   => array(
					'description' => __( 'Discount based on', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'discount_max_user'   => array(
					'description' => __( 'Maximum Discount Users', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'bogo_type'           => array(
					'description' => __( 'BOGO Type', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'discount_valid_from' => array(
					'description' => __( 'Discount Start Date.', 'disco' ),
					'type'        => 'date-time',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'discount_valid_to'   => array(
					'description' => __( 'Discount End Date.', 'disco' ),
					'type'        => 'date-time',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'discount_method'     => array(
					'description' => __( 'Discount Method: automated or coupon.', 'disco' ),
					'type'        => 'string',
					'required'    => true,
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'discount_coupon'     => array(
					'description' => __( 'Discount coupon code.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'created_by'          => array(
					'description' => __( 'Created by User ID', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),

				'modified_by'         => array(
					'description' => __( 'Modified by User ID.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
				'created_date'        => array(
					'description' => __( "The date the object was published, in the site's timezone.", 'disco' ),
					'type'        => 'string',
					'format'      => 'date-time',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'modified_date'       => array(
					'description' => __( "The date the object was published, in the site's timezone.", 'disco' ),
					'type'        => 'string',
					'format'      => 'date-time',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'ui'                  => array(
					'description' => __( 'Interface Settings.', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'design_blocks'       => array(
					'description' => __( 'Design Blocks.', 'disco' ),
					'type'        => 'object',
					'context'     => array( 'view', 'edit' ),
				),

			),
		);

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Validation callback for `discount_intent` parameter.
	 *
	 * @param int|string       $value   Value of the my-arg parameter.
	 * @param \WP_REST_Request $request Current request object.
	 * @param string           $param   The name of the parameter in this case, 'my-arg'.
     * @return \WP_Error|true True, if the data is valid, WP_Error otherwise.
	 * @throws \Exception If the campaign does not exist.
	 */
	public function validate_schema_properties( $value, $request, $param ) {
		$attributes = $request->get_attributes();

		// This code won't execute because we have specified this argument as required.
		// If we reused this validation callback and did not have required args then this would fire.
		if ( ! isset( $attributes['args'][ $param ] ) ) {
			return new \WP_Error( 'rest_invalid_param', sprintf( '%s was not registered as a request argument.', $param ), array( 'status' => 400 ) );
		}

		// Check to make sure our argument in proper type.
		$argument = $attributes['args'][ $param ];

		if ( gettype( $value ) !== $argument['type'] ) {
			return new \WP_Error( 'rest_invalid_param', sprintf( '%1$s is not of type %2$s', $param, 'string' ), array( 'status' => 400 ) );
		}

		// Make sure required arguments are not empty.
		if ( isset( $argument['required'] ) && true === $argument['required'] && empty( $value ) ) {
			return new \WP_Error( 'rest_invalid_param_value', sprintf( 'Value for %1$s is required', $param ), array( 'status' => 400 ) );
		}

		$drop_down_checks = array(
			'discount_intent' => DiscountDropDown::discount_intents(),
			'discount_type'   => DiscountDropDown::discount_types(),
		);

		if ( isset( $drop_down_checks[ $param ] ) && ! array_key_exists( $value, $drop_down_checks[ $param ] ) ) {
			return new \WP_Error( 'rest_invalid_param_value', sprintf( 'Value for %1$s is not valid', $param ), array( 'status' => 400 ) );
		}

		return true;
	}

	/**
	 * Retrieves the query params for collections.
	 *
	 * @return array
	 */
	public function get_collection_params() {
		$params = parent::get_collection_params();
		unset( $params['search'] );

		return $params;
	}

	/**
	 * Get the campaign if the ID is valid.
	 *
	 * @param int $id Supplied ID.
	 * @return Object|\WP_Error
	 */
	protected function get_campaign( $id ) {
		return ( new Campaign )->get_campaign( $id );
	}

	/**
	 * Prepares one item for create or update operation.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return object
	 */
	protected function prepare_item_for_database( $request ) {
		$valid_keys = array(
			'name',
			'discount_intent',
			'priority',
			'ui',
			'status',
			'products',
			'conditions',
			'discount_rules',
			'discount_label',
			'discount_valid_from',
			'discount_max_user',
			'discount_based_on',
			'bogo_type',
			'discount_valid_to',
			'discount_method',
			'discount_coupon',
			'design_blocks',
		);

		$prepared = array();

		foreach ( $valid_keys as $key ) {
			if ( ! isset( $request[ $key ] ) ) {
				continue;
			}

			$prepared[ $key ] = $request[ $key ];
		}

		return (object) $prepared;
	}

	/**
	 * Prepares links for the request.
	 *
	 * @param object $item Item object.
	 * @return array Links for the given post.
	 */
	protected function prepare_links( $item ) {
		$id = 0;

		if ( isset( $item->id ) ) {
			$id = $item->id;
		}

		$base = sprintf( '%s/%s', $this->namespace, $this->rest_base );

		return array(
			'self'       => array(
				'href' => rest_url( trailingslashit( $base ) . $id ),
			),
			'collection' => array(
				'href' => rest_url( $base ),
			),
		);
	}

}
