<?php //phpcs:ignore

/**
 * Analytics REST API — Abstract Base Class
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @since      1.1.13
 * @category   Rest
 */

namespace Disco\Rest\Analytics;

use Disco\Rest\Api;
use WP_REST_Controller;

/**
 * Class Base
 *
 * Abstract base for all Analytics sub-controllers.
 * Provides shared helpers, parameter builders, and the shared order schema
 * that multiple sub-controllers reference.
 *
 * @package    Disco
 * @subpackage \Rest\Analytics
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
abstract class Base extends WP_REST_Controller { //phpcs:ignore

	/**
	 * Base constructor.
	 *
	 * Sets the REST namespace and base for all analytics routes.
	 */
	public function __construct() {
		$this->namespace = Api::NAMESPACE_NAME . '/' . Api::VERSION;
		$this->rest_base = 'analytics';
	}

	// =========================================================================
	// Permissions
	// =========================================================================

	/**
	 * Checks if the current user has permission to access analytics endpoints.
	 *
	 * @param  \WP_REST_Request $request Full data about the request.
	 * @return bool|\WP_Error
	 */
	public function permissions_check( $request ) { //phpcs:ignore
		$permission = current_user_can( 'manage_options' ) || current_user_can( 'manage_woocommerce' ); // phpcs:ignore WordPress.WP.Capabilities.Unknown

		if ( ! $permission ) {
			return new \WP_Error(
				'disco_forbidden',
				__( 'Sorry, Permission Denied.', 'disco' ),
				array( 'status' => 403 )
			);
		}

		return $permission;
	}

	// =========================================================================
	// Shared Helpers
	// =========================================================================

	/**
	 * Validates that date_from is not after date_to.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return true|\WP_Error
	 */
	// phpcs:ignore SlevomatCodingStandard.Complexity.Cognitive.ComplexityTooHigh
	protected function validate_date_params( $request ) {
		$from = '';
		$to   = '';

		if ( is_string( $request['date_from'] ) ) {
			$from = $request['date_from'];
		}

		if ( is_string( $request['date_to'] ) ) {
			$to = $request['date_to'];
		}

		if ( $from ) {
			$dt = \DateTime::createFromFormat( '!Y-m-d', $from );

			if ( ! $dt || $dt->format( 'Y-m-d' ) !== $from ) {
				return new \WP_Error( 'disco_invalid_date', __( 'date_from must be a valid Y-m-d date.', 'disco' ), array( 'status' => 400 ) );
			}
		}

		if ( $to ) {
			$dt = \DateTime::createFromFormat( '!Y-m-d', $to );

			if ( ! $dt || $dt->format( 'Y-m-d' ) !== $to ) {
				return new \WP_Error( 'disco_invalid_date', __( 'date_to must be a valid Y-m-d date.', 'disco' ), array( 'status' => 400 ) );
			}
		}

		if ( $from && $to && $from > $to ) {
			return new \WP_Error(
				'disco_invalid_date_range',
				__( 'date_from must be on or before date_to.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		return true;
	}

	// =========================================================================
	// Response Builders
	// =========================================================================

	/**
	 * Builds the collection metadata object for paginated list responses.
	 *
	 * @param int $total        Total number of records.
	 * @param int $per_page     Items per page.
	 * @param int $current_page Current page number.
	 */
	protected function build_collection_meta( int $total, int $per_page, int $current_page ): array {
		$total_pages = 0;

		if ( $per_page > 0 ) {
			$total_pages = (int) ceil( $total / $per_page );
		}

		$count = max( 0, min( $per_page, $total - ( $current_page - 1 ) * $per_page ) );

		return array(
			'total'        => $total,
			'count'        => $count,
			'per_page'     => $per_page,
			'current_page' => $current_page,
			'total_pages'  => $total_pages,
		);
	}

	/**
	 * Builds the _links object for a single item.
	 *
	 * @param string $resource_name Resource slug (e.g. 'campaigns', 'products').
	 * @param int    $id            Item ID.
	 */
	protected function build_item_links( string $resource_name, int $id ): array {
		$base = $this->namespace . '/' . $this->rest_base . '/' . $resource_name;

		return array(
			'self'       => array(
				array(
					'href'        => rest_url( $base . '/' . $id ),
					'targetHints' => array( 'allow' => array( 'GET' ) ),
				),
			),
			'collection' => array(
				array(
					'href' => rest_url( $base ),
				),
			),
		);
	}

	/**
	 * Builds the top-level links object for a paginated list response.
	 * All existing query params are preserved across pages.
	 *
	 * @param \WP_REST_Request $request       Incoming request (for query params).
	 * @param string           $resource_name Resource slug.
	 * @param int              $total_pages   Total number of pages.
	 * @param int              $current_page  Current page number.
	 */
	protected function build_top_links(
		\WP_REST_Request $request,
		string $resource_name,
		int $total_pages,
		int $current_page
	): array {
		$base   = rest_url( $this->namespace . '/' . $this->rest_base . '/' . $resource_name );
		$params = $request->get_query_params();
		unset( $params['page'] );

		$make = static function ( int $page ) use ( $params, $base ): string {
			return add_query_arg( array_merge( $params, array( 'page' => $page ) ), $base );
		};

		$links = array(
			'self'  => $make( $current_page ),
			'first' => $make( 1 ),
			'last'  => $make( max( 1, $total_pages ) ),
		);

		if ( $current_page > 1 ) {
			$links['prev'] = $make( $current_page - 1 );
		}

		if ( $current_page < $total_pages ) {
			$links['next'] = $make( $current_page + 1 );
		}

		return $links;
	}

	/**
	 * Appends _links to each item in a data array.
	 *
	 * @param array  $items         Array of items.
	 * @param string $resource_name Resource slug.
	 * @param string $id_key        Key name for the item ID (default 'id').
	 */
	protected function add_item_links( array $items, string $resource_name, string $id_key = 'id' ): array {
		return array_map(
			function ( array $item ) use ( $resource_name, $id_key ): array {
				$item['_links'] = $this->build_item_links( $resource_name, (int) ( $item[ $id_key ] ?? 0 ) );

				return $item;
			},
			$items
		);
	}

	// =========================================================================
	// Parameter Builders
	// =========================================================================

	/**
	 * Returns date-only params shared by detail endpoints.
	 */
	protected function get_date_params(): array {
		return array(
			'date_from' => array(
				'description'       => __( 'Filter start date (Y-m-d).', 'disco' ),
				'type'              => 'string',
				'format'            => 'date',
				'sanitize_callback' => 'sanitize_text_field',
			),
			'date_to'   => array(
				'description'       => __( 'Filter end date (Y-m-d).', 'disco' ),
				'type'              => 'string',
				'format'            => 'date',
				'sanitize_callback' => 'sanitize_text_field',
			),
		);
	}

	/**
	 * Returns params for the /summary endpoint.
	 */
	protected function get_summary_params(): array {
		return array_merge(
			$this->get_date_params(),
			array(
				'compare' => array(
					'description'       => __( 'Comparison mode. Only previous_period is supported.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'previous_period' ),
					'default'           => 'previous_period',
					'sanitize_callback' => 'sanitize_text_field',
				),
			)
		);
	}

	/**
	 * Returns params for the lightweight orders table endpoint.
	 */
	// phpcs:ignore SlevomatCodingStandard.Functions.FunctionLength.FunctionLength
	protected function get_orders_table_params(): array {
		return array_merge(
			$this->get_date_params(),
			array(
				'search'      => array(
					'description'       => __( 'Search term. Numeric = exact order ID; text = customer name/email LIKE search.', 'disco' ),
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'sort_by'     => array(
					'description'       => __( 'Sort field.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'revenue', 'date', 'quantity' ),
					'default'           => 'revenue',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'campaign_id' => array(
					'description'       => __( 'Filter by campaign ID.', 'disco' ),
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'customer_id' => array(
					'description'       => __( 'Filter by customer (WP user) ID.', 'disco' ),
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'orderby'     => array(
					'description'       => __( 'Sort field.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'revenue', 'date', 'quantity' ),
					'default'           => 'revenue',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'order'       => array(
					'description'       => __( 'Sort direction.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'asc', 'desc' ),
					'default'           => 'desc',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'page'        => array(
					'description'       => __( 'Page number.', 'disco' ),
					'type'              => 'integer',
					'default'           => 1,
					'minimum'           => 1,
					'sanitize_callback' => 'absint',
				),
				'limit'       => array(
					'description'       => __( 'Results per page (max 100).', 'disco' ),
					'type'              => 'integer',
					'default'           => 10,
					'minimum'           => 1,
					'maximum'           => 100,
					'sanitize_callback' => 'absint',
				),
			)
		);
	}

	/**
	 * Returns params for the products table endpoint.
	 */
	// phpcs:ignore SlevomatCodingStandard.Functions.FunctionLength.FunctionLength
	protected function get_products_table_params(): array {
		return array_merge(
			$this->get_date_params(),
			array(
				'search'      => array(
					'description'       => __( 'Search term. Numeric = exact product ID; text = name LIKE search.', 'disco' ),
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'sort_by'     => array(
					'description'       => __( 'Sort field.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'revenue', 'orders', 'customers', 'quantity' ),
					'default'           => 'revenue',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'campaign_id' => array(
					'description'       => __( 'Filter by campaign ID.', 'disco' ),
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'customer_id' => array(
					'description'       => __( 'Filter by customer (WP user) ID.', 'disco' ),
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'order_id'    => array(
					'description'       => __( 'Filter by WooCommerce order ID.', 'disco' ),
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'orderby'     => array(
					'description'       => __( 'Sort field.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'total_revenue', 'total_orders', 'total_customers', 'total_quantity' ),
					'default'           => 'total_revenue',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'order'       => array(
					'description'       => __( 'Sort direction.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'asc', 'desc' ),
					'default'           => 'desc',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'page'        => array(
					'description'       => __( 'Page number.', 'disco' ),
					'type'              => 'integer',
					'default'           => 1,
					'minimum'           => 1,
					'sanitize_callback' => 'absint',
				),
				'limit'       => array(
					'description'       => __( 'Results per page (max 100).', 'disco' ),
					'type'              => 'integer',
					'default'           => 10,
					'minimum'           => 1,
					'maximum'           => 100,
					'sanitize_callback' => 'absint',
				),
			)
		);
	}

	/**
	 * Returns params for the customers table endpoint.
	 */
	// phpcs:ignore SlevomatCodingStandard.Functions.FunctionLength.FunctionLength
	protected function get_customers_table_params(): array {
		return array_merge(
			$this->get_date_params(),
			array(
				'search'      => array(
					'description'       => __( 'Search term. Numeric = exact customer ID; text = name/email LIKE search.', 'disco' ),
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'sort_by'     => array(
					'description'       => __( 'Sort field.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'total_spent', 'orders' ),
					'default'           => 'total_spent',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'campaign_id' => array(
					'description'       => __( 'Filter by campaign ID.', 'disco' ),
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'order_id'    => array(
					'description'       => __( 'Filter by WooCommerce order ID.', 'disco' ),
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'orderby'     => array(
					'description'       => __( 'Sort field.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'total_spent', 'orders' ),
					'default'           => 'total_spent',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'order'       => array(
					'description'       => __( 'Sort direction.', 'disco' ),
					'type'              => 'string',
					'enum'              => array( 'asc', 'desc' ),
					'default'           => 'asc',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'page'        => array(
					'description'       => __( 'Page number.', 'disco' ),
					'type'              => 'integer',
					'default'           => 1,
					'minimum'           => 1,
					'sanitize_callback' => 'absint',
				),
				'limit'       => array(
					'description'       => __( 'Results per page (max 100).', 'disco' ),
					'type'              => 'integer',
					'default'           => 10,
					'minimum'           => 1,
					'maximum'           => 100,
					'sanitize_callback' => 'absint',
				),
			)
		);
	}

	// =========================================================================
	// Shared Schema
	// =========================================================================

	/**
	 * Retrieves the order analytics schema, conforming to JSON Schema.
	 * Shared by CampaignsApi, OrdersApi, and CustomersApi.
	 *
	 * @return array
	 */
	public function get_order_schema() { //phpcs:ignore
		return array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'analytics-order',
			'type'       => 'object',
			'properties' => array(
				'id'              => array(
					'description' => __( 'Order ID.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'order_date'      => array(
					'description' => __( 'Order date.', 'disco' ),
					'type'        => 'string',
					'format'      => 'date-time',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'order_status'    => array(
					'description' => __( 'Order status.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'customer_id'     => array(
					'description' => __( 'WP User ID.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'customer_name'   => array(
					'description' => __( 'Customer display name.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'customer_email'  => array(
					'description' => __( 'Customer email.', 'disco' ),
					'type'        => 'string',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'campaigns'       => array(
					'description' => __( 'Campaigns used in this order.', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'items_count'     => array(
					'description' => __( 'Number of line items.', 'disco' ),
					'type'        => 'integer',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'order_total'     => array(
					'description' => __( 'Order total.', 'disco' ),
					'type'        => 'number',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'total_spent'     => array(
					'description' => __( 'Order total (order-list endpoint).', 'disco' ),
					'type'        => 'number',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'discount_amount' => array(
					'description' => __( 'Discount amount.', 'disco' ),
					'type'        => 'number',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
				'products'        => array(
					'description' => __( 'Line items (single-order endpoint only).', 'disco' ),
					'type'        => 'array',
					'context'     => array( 'view' ),
					'readonly'    => true,
				),
			),
		);
	}

}
