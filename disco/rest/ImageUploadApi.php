<?php //phpcs:ignore

/**
 * Image Upload API
 *
 * Provides REST API endpoints to upload, retrieve, and delete
 * images used for Product Badges and Text Highlights.
 *
 * @package    Disco
 * @subpackage Disco\Rest
 * @since      1.3.21
 * @category   Rest
 */

namespace Disco\Rest;

use Disco\App\Upload\ImageUpload;
use WP_REST_Controller;
use WP_REST_Server;

/**
 * Class ImageUploadApi
 *
 * Registers and handles the following REST API routes:
 *
 * - POST   /disco/v1/image-upload        — Upload an image.
 * - GET    /disco/v1/image-upload/{type}  — Retrieve images by upload type.
 * - DELETE /disco/v1/image-upload/{id}    — Delete an image by attachment ID.
 *
 * @package    Disco
 * @subpackage Disco\Rest
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class ImageUploadApi extends WP_REST_Controller {//phpcs:ignore

	/**
	 * The route base name for image upload endpoints.
	 *
	 * @since 1.0.0
	 */
	public const ROUTE_NAME = 'image-upload';

	/**
	 * ImageUploadApi constructor.
	 *
	 * Sets the namespace and rest base for all image upload routes.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->namespace = Api::NAMESPACE_NAME . '/' . Api::VERSION;
		$this->rest_base = self::ROUTE_NAME;
	}

	/**
	 * Registers the REST API routes for image upload operations.
	 *
	 * Registers three routes:
	 * 1. POST   /image-upload        — Upload an image file.
	 * 2. GET    /image-upload/{type}  — Get all images for a given upload type.
	 * 3. DELETE /image-upload/{id}    — Delete an image by its attachment ID.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	public function register_routes() { //phpcs:ignore
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'upload_image' ),
					'permission_callback' => array( $this, 'permissions_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<type>[a-z-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_images' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'type' => array(
							'description' => __( 'Upload type: product-badge or text-highlight.', 'disco' ),
							'type'        => 'string',
							'enum'        => array_keys( ImageUpload::UPLOAD_DIRS ),
						),
					),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			array(
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_image' ),
					'permission_callback' => array( $this, 'permissions_check' ),
					'args'                => array(
						'id' => array(
							'description' => __( 'Attachment ID.', 'disco' ),
							'type'        => 'integer',
						),
					),
				),
			)
		);
	}

	/**
	 * Checks if the current user has permission to access image upload endpoints.
	 *
	 * Requires either 'manage_options' or 'manage_woocommerce' capability.
	 *
	 * @since  1.0.0
	 * @param  \WP_REST_Request $request Full data about the request.
	 * @return bool|\WP_Error True if the user has permission, WP_Error otherwise.
	 */
	public function permissions_check( $request ) {//phpcs:ignore
		$permission = current_user_can( 'manage_options' ) || current_user_can( 'manage_woocommerce' ); // phpcs:ignore WordPress.WP.Capabilities.Unknown

		if ( ! $permission ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'Sorry, Permission Denied.', 'disco' ),
				array( 'status' => 403 )
			);
		}

		return true;
	}

	/**
	 * Handles image upload via POST request.
	 *
	 * Accepts a multipart form-data request with an 'image' file field
	 * and a 'type' parameter. Validates and stores the image in the
	 * WordPress media library under a type-specific directory.
	 *
	 * @since  1.0.0
	 * @param  \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error Response with attachment id, url, and type on success.
	 */
	public function upload_image( $request ) {
		$files  = $request->get_file_params();
		$type   = $request->get_param( 'type' );
		$result = ( new ImageUpload )->upload( $files['image'] ?? array(), is_string( $type ) ? $type : '' );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( $result );
	}

	/**
	 * Retrieves all uploaded images for a given upload type.
	 *
	 * Queries the WordPress media library for attachments stored
	 * in the type-specific upload directory (e.g., disco-product-badges).
	 *
	 * @since  1.0.0
	 * @param  \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error Response with array of images (id, name, url) on success.
	 */
	public function get_images( $request ) {
		$type   = $request->get_param( 'type' );
		$result = ( new ImageUpload )->get_images( is_string( $type ) ? $type : '' );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( $result );
	}

	/**
	 * Deletes an uploaded image by its attachment ID.
	 *
	 * Permanently removes the attachment and its associated file
	 * from the WordPress media library.
	 *
	 * @since  1.0.0
	 * @param  \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error Response with id and deleted status on success.
	 */
	public function delete_image( $request ) {
		$id     = absint( $request->get_param( 'id' ) );
		$result = ( new ImageUpload )->delete( $id );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( $result );
	}

}
