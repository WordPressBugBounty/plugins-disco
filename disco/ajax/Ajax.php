<?php
/**
 * Disco
 *
 * @package   Disco
 * @author    Ohidul Islam <wahid0003@gmail.com>
 * @copyright 2022 WebAppick
 * @license   GPL 2.0+
 * @link      http://domain.tld
 */

namespace Disco\Ajax;

use Disco\Engine\Base;

/**
 * AJAX in the public
 */
class Ajax extends Base {

    /**
     * Initialize the class.
     *
     * @return void
     */
    public function initialize() {
        if ( ! \apply_filters( 'disco_d_ajax_initialize', true ) ) {
            return;
        }

		// For not logged user.
		\add_action( 'wp_ajax_nopriv_your_method', array( $this, 'your_method' ) );

		\add_action( 'wp_ajax_disco_dismiss_review_notice', [ $this, 'dismiss_review_notice' ] );

		\add_action( 'wp_ajax_disco_dismiss_promotional_notice', [ $this, 'dismiss_promotional_notice' ] );

		\add_action( 'wp_ajax_disco_dismiss_compatible_plugin_notice', [ $this, 'dismiss_compatible_plugin_notice' ] );

		\add_action( 'wp_ajax_disco_dismiss_feature_unlock_notice', [ $this, 'disco_dismiss_feature_unlock_notice' ] );

	}

	/**
	 * The method to run on ajax
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function your_method() {
		$return = array(
			'message' => 'Saved',
			'ID'      => 1,
		);

		$this->clean_buffer();
		\wp_send_json_success( $return );
	}

	/**
	 * Handle the AJAX request to dismiss the review notice.
	 */
	public function dismiss_review_notice() {
		$this->clean_buffer();
		check_ajax_referer( 'disco_dismiss_notice', 'nonce' );

		if ( ! is_user_logged_in() ) {
			wp_send_json_error( [ 'message' => 'Unauthorized request' ], 403 );
		}

		$current_user_id = get_current_user_id();
		$dismiss_value   = isset( $_POST['dismiss'] ) ? sanitize_text_field( $_POST['dismiss'] ) : 'later';

		if ( $dismiss_value === 'never' ) {
			update_user_meta( $current_user_id, 'disco_review_dismissed', 'never' );
		} else {
			update_user_meta( $current_user_id, 'disco_review_dismissed', time() + ( 7 * DAY_IN_SECONDS ) );
		}

		wp_send_json_success( [ 'message' => 'Notice dismissed' ] );
	}

	/**
	 * Handle the AJAX request to dismiss the promotional notice.
	 */
	public function dismiss_promotional_notice() {
		$this->clean_buffer();
		check_ajax_referer( 'disco_dismiss_notice', 'nonce' );

		if ( ! is_user_logged_in() ) {
			wp_send_json_error( [ 'message' => 'Unauthorized request' ], 403 );
		}

		update_user_meta( get_current_user_id(), 'disco_promotional_holiday_banner_2025', 'never' );

		wp_send_json_success( [ 'message' => 'Notice dismissed' ] );
	}

	/**
	 * Handle the AJAX request to dismiss the compatible plugin notice.
	 */
	public function dismiss_compatible_plugin_notice() {
		$this->clean_buffer();
		check_ajax_referer( 'disco_dismiss_notice', 'nonce' );

		if ( ! is_user_logged_in() ) {
			wp_send_json_error( [ 'message' => 'Unauthorized request' ], 403 );
		}

		$dismiss_value = isset( $_POST['dismiss'] ) ? sanitize_text_field( $_POST['dismiss'] ) : 'later';

		update_user_meta( get_current_user_id(), 'disco_compatible_plugin_notice_dismissed', $dismiss_value );

		wp_send_json_success( [ 'message' => 'Notice dismissed' ] );
	}

	/**
	 * Handle the AJAX request to dismiss the compatible plugin notice.
	 */
	public function disco_dismiss_feature_unlock_notice() {
		$this->clean_buffer();
		check_ajax_referer( 'disco_dismiss_notice', 'nonce' );

		if ( ! is_user_logged_in() ) {
			wp_send_json_error( [ 'message' => 'Unauthorized request' ], 403 );
		}

		$dismiss_value = isset( $_POST['dismiss'] ) ? sanitize_text_field( $_POST['dismiss'] ) : 'later';

		update_user_meta( get_current_user_id(), 'disco_feature_unlock_notice_dismissed', $dismiss_value );

		wp_send_json_success( [ 'message' => 'Notice dismissed' ] );
	}
}
