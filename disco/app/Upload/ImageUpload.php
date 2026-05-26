<?php //phpcs:ignore

/**
 * Image Upload
 *
 * Business logic for uploading, retrieving, and deleting images
 * used by Product Badges and Text Highlights.
 *
 * @package    Disco
 * @subpackage Disco\App\Upload
 * @since      1.3.21
 * @category   App
 */

namespace Disco\App\Upload;

/**
 * Class ImageUpload
 *
 * Provides methods to upload images to the WordPress media library
 * under type-specific directories, retrieve uploaded images by type,
 * and delete images from the media library.
 *
 * Supported upload types:
 * - product-badge  → stored in wp-content/uploads/disco-product-badges/
 * - text-highlight → stored in wp-content/uploads/disco-text-highlight/
 *
 * @package    Disco
 * @subpackage Disco\App\Upload
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   App
 */
class ImageUpload {

	/**
	 * Mapping of upload types to their target directory names.
	 *
	 * Each type stores images in a dedicated subdirectory
	 * under the WordPress uploads folder.
	 *
	 * @since 1.0.0
	 */
	public const UPLOAD_DIRS = array( // phpcs:ignore SlevomatCodingStandard.Classes.DisallowMultiConstantDefinition.DisallowedMultiConstantDefinition
		'product-badge'  => 'disco-product-badges',
		'text-highlight' => 'disco-text-highlight',
	);

	/**
	 * Allowed MIME types for uploaded images.
	 *
	 * Only PNG, JPEG, and WebP formats are permitted.
	 *
	 * @since 1.0.0
	 */
	private const ALLOWED_MIME_TYPES = array( // phpcs:ignore SlevomatCodingStandard.Classes.DisallowMultiConstantDefinition.DisallowedMultiConstantDefinition
		'image/png',
		'image/jpeg',
		'image/jpg',
		'image/webp',
	);

	/**
	 * Maximum allowed file size in bytes.
	 *
	 * Set to 100 KB (102400 bytes).
	 *
	 * @since 1.0.0
	 */
	private const MAX_FILE_SIZE = 102400;

	/**
	 * Upload an image to the WordPress media library.
	 *
	 * Validates the file MIME type and size, moves it to a type-specific
	 * upload directory, and creates a WordPress media library attachment.
	 *
	 * @since  1.0.0
	 * @param  array  $file Uploaded file data from $_FILES (name, type, tmp_name, error, size).
	 * @param  string $type Upload type key. Must be one of: 'product-badge', 'text-highlight'.
	 * @return array{id: int, url: string, type: string}|\WP_Error Attachment data on success, WP_Error on failure.
	 */
	public function upload( $file, $type ) {
		if ( empty( $file ) ) {
			return new \WP_Error(
				'no_image',
				__( 'No image file provided.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		if ( ! $type || ! isset( self::UPLOAD_DIRS[ $type ] ) ) {
			return new \WP_Error(
				'invalid_type',
				__( 'Invalid upload type. Use product-badge or text-highlight.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		$file = $this->validate_file( $file );

		if ( is_wp_error( $file ) ) {
			return $file;
		}

		return $this->process_upload( $file['file'], $file['mime_type'], $type );
	}

	/**
	 * Retrieve all uploaded images for a given upload type.
	 *
	 * Queries WordPress media library attachments and filters them
	 * by the type-specific upload directory path.
	 *
	 * @since  1.0.0
	 * @param  string $type Upload type key. Must be one of: 'product-badge', 'text-highlight'.
	 * @return array<int, array{id: int, name: string, url: string}>|\WP_Error Array of image data on success, WP_Error on failure.
	 */
	public function get_images( $type ) {
		if ( ! isset( self::UPLOAD_DIRS[ $type ] ) ) {
			return new \WP_Error(
				'invalid_type',
				__( 'Invalid type. Use product-badge or text-highlight.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		$dir_name    = self::UPLOAD_DIRS[ $type ];
		$attachments = get_posts(
			array(
				'post_type'      => 'attachment',
				'post_status'    => 'inherit',
				'posts_per_page' => -1,
				'orderby'        => 'date',
				'order'          => 'DESC',
				'meta_query'     => array(), // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			)
		);

		$images = array();

		foreach ( $attachments as $attachment ) {
			$file_path = get_attached_file( $attachment->ID );

			if ( ! $file_path || ! str_contains( $file_path, $dir_name . '/' ) ) {
				continue;
			}

			$url = wp_get_attachment_url( $attachment->ID );

			if ( ! $url ) {
				continue;
			}

			$images[] = array(
				'id'   => $attachment->ID,
				'name' => basename( $file_path ),
				'url'  => $url,
			);
		}

		return $images;
	}

	/**
	 * Delete an uploaded image from the WordPress media library.
	 *
	 * Permanently removes the attachment post and its associated
	 * file from disk using wp_delete_attachment with force delete.
	 *
	 * @since  1.0.0
	 * @param  int $id WordPress attachment post ID.
	 * @return array{id: int, deleted: bool}|\WP_Error Delete confirmation on success, WP_Error on failure.
	 */
	public function delete( $id ) {
		$attachment = get_post( $id );

		if ( ! $attachment || 'attachment' !== $attachment->post_type ) {
			return new \WP_Error(
				'not_found',
				__( 'Image not found.', 'disco' ),
				array( 'status' => 404 )
			);
		}

		$result = wp_delete_attachment( $id, true );

		if ( ! $result ) {
			return new \WP_Error(
				'delete_error',
				__( 'Failed to delete image.', 'disco' ),
				array( 'status' => 500 )
			);
		}

		return array(
			'id'      => $id,
			'deleted' => true,
		);
	}

	/**
	 * Validate the uploaded file's MIME type and size.
	 *
	 * Uses PHP's finfo extension for reliable MIME type detection
	 * rather than relying on the client-provided Content-Type.
	 *
	 * @since  1.0.0
	 * @param  array $file Uploaded file data from $_FILES.
	 * @return array{file: array, mime_type: string}|\WP_Error Validated file data or WP_Error.
	 */
	private function validate_file( $file ) {
		// Detect MIME type from file contents, not the client-provided header.
		$finfo = finfo_open( FILEINFO_MIME_TYPE );

		if ( false === $finfo ) {
			return new \WP_Error(
				'finfo_error',
				__( 'Unable to detect file type.', 'disco' ),
				array( 'status' => 500 )
			);
		}

		$mime_type = finfo_file( $finfo, $file['tmp_name'] );
		finfo_close( $finfo );

		if ( false === $mime_type || ! in_array( $mime_type, self::ALLOWED_MIME_TYPES, true ) ) {
			return new \WP_Error(
				'invalid_format',
				__( 'Only PNG, JPG, JPEG, and WebP formats are allowed.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		if ( $file['size'] > self::MAX_FILE_SIZE ) {
			return new \WP_Error(
				'file_too_large',
				__( 'File size must be under 100 KB.', 'disco' ),
				array( 'status' => 400 )
			);
		}

		return array(
			'file'      => $file,
			'mime_type' => $mime_type,
		);
	}

	/**
	 * Process the validated file upload.
	 *
	 * Moves the file to the type-specific directory and creates a
	 * WordPress media library attachment.
	 *
	 * @since  1.0.0
	 * @param  array  $file      Validated file data from $_FILES.
	 * @param  string $mime_type Detected MIME type of the file.
	 * @param  string $type      Upload type key (product-badge or text-highlight).
	 * @return array{id: int, url: string, type: string}|\WP_Error Attachment data on success, WP_Error on failure.
	 */
	private function process_upload( $file, $mime_type, $type ) {
		$dir_name      = self::UPLOAD_DIRS[ $type ];
		$upload_filter = function ( $uploads ) use ( $dir_name ) {
			$uploads['subdir'] = '/' . $dir_name;
			$uploads['path']   = $uploads['basedir'] . '/' . $dir_name;
			$uploads['url']    = $uploads['baseurl'] . '/' . $dir_name;

			return $uploads;
		};

		add_filter( 'upload_dir', $upload_filter ); // @phpstan-ignore arguments.count
		$this->ensure_upload_directory();

		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$file_array = array(
			'name'     => sanitize_file_name( $file['name'] ),
			'type'     => $mime_type,
			'tmp_name' => $file['tmp_name'],
			'error'    => $file['error'],
			'size'     => $file['size'],
		);

		$uploaded = wp_handle_upload(
			$file_array,
			array(
				'test_form' => false,
				'test_type' => true,
				'mimes'     => array(
					'jpg|jpeg' => 'image/jpeg',
					'png'      => 'image/png',
					'webp'     => 'image/webp',
				),
			)
		);

		remove_filter( 'upload_dir', $upload_filter );

		if ( isset( $uploaded['error'] ) ) {
			return new \WP_Error( 'upload_error', $uploaded['error'], array( 'status' => 500 ) );
		}

		return $this->create_attachment( $uploaded, $file, $type );
	}

	/**
	 * Ensure the upload target directory exists.
	 *
	 * @since  1.0.0
	 * @return void
	 */
	private function ensure_upload_directory() {
		$upload_dir = wp_upload_dir();

		if ( file_exists( $upload_dir['path'] ) ) {
			return;
		}

		wp_mkdir_p( $upload_dir['path'] );
	}

	/**
	 * Create a media library attachment for the uploaded file.
	 *
	 * @since  1.0.0
	 * @param  array  $uploaded Upload result from wp_handle_upload.
	 * @param  array  $file     Original file data.
	 * @param  string $type     Upload type key.
	 * @return array{id: int, url: string, type: string}|\WP_Error Attachment data on success, WP_Error on failure.
	 */
	private function create_attachment( $uploaded, $file, $type ) {
		$attachment_id = wp_insert_attachment(
			array(
				'post_mime_type' => $uploaded['type'],
				'post_title'     => preg_replace( '/\.[^.]+$/', '', sanitize_file_name( $file['name'] ) ),
				'post_content'   => '',
				'post_status'    => 'inherit',
			),
			$uploaded['file']
		);

		if ( 0 === $attachment_id ) {
			return new \WP_Error(
				'attachment_error',
				__( 'Failed to create media library entry.', 'disco' ),
				array( 'status' => 500 )
			);
		}

		$metadata = wp_generate_attachment_metadata( $attachment_id, $uploaded['file'] );
		wp_update_attachment_metadata( $attachment_id, $metadata );

		return array(
			'id'   => $attachment_id,
			'url'  => $uploaded['url'],
			'type' => $type,
		);
	}

}
