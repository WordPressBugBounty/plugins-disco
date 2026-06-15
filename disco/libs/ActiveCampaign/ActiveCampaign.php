<?php
/**
 * Disco Plugin - ActiveCampaign Email Collector
 *
 * The React app submits the email straight to the ActiveCampaign v1 API
 * from the browser (form-encoded POST, no preflight). This file only
 * handles the local side: an AJAX endpoint that stores a notice-style
 * flag in the options table once the email has been collected, and the
 * localized data that tells the frontend whether to show the opt-in field.
 * The email address itself is never stored locally.
 *
 * @since 1.3.49
 * @version 1.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Option flag set once the user has submitted their email.
 * Works like a notice-dismiss flag: only '1' is stored, never the email.
 */
define( 'DISCO_AC_OPTION_KEY', 'disco_activecampaign_email_collected' );

/**
 * AJAX action name.
 */
define( 'DISCO_AC_AJAX_ACTION', 'disco_activecampaign_subscribed' );

/**
 * Nonce action name.
 */
define( 'DISCO_AC_NONCE_ACTION', 'disco_activecampaign_nonce' );

/**
 * Whether an email has already been collected.
 *
 * @return bool
 */
function disco_activecampaign_has_subscriber() {
	return '1' === get_option( DISCO_AC_OPTION_KEY );
}

/**
 * Data localized for the React app.
 *
 * `show_email_field` is true until an email has been collected, so the
 * frontend can show the opt-in field once and hide it afterwards.
 *
 * @return array
 */
function disco_activecampaign_get_localize_data() {
	return array(
		'ajax_url'         => admin_url( 'admin-ajax.php' ),
		'action'           => DISCO_AC_AJAX_ACTION,
		'nonce'            => wp_create_nonce( DISCO_AC_NONCE_ACTION ),
		'show_email_field' => ! disco_activecampaign_has_subscriber(),
	);
}

/**
 * AJAX handler: mark the email as collected.
 *
 * Called by the React app after it has submitted the email to
 * ActiveCampaign. Stores the flag so the opt-in field stays hidden.
 *
 * @return void
 */
function disco_activecampaign_handle_subscribed() {
	check_ajax_referer( DISCO_AC_NONCE_ACTION, 'nonce' );

	if ( ! current_user_can( 'manage_options' ) && ! current_user_can( 'manage_woocommerce' ) ) {
		wp_send_json_error( array( 'message' => __( 'You are not allowed to do this.', 'disco' ) ), 403 );
	}

	update_option( DISCO_AC_OPTION_KEY, '1', false );

	wp_send_json_success(
		array(
			'message' => __( 'Thanks! You are subscribed.', 'disco' ),
		)
	);
}

add_action( 'wp_ajax_' . DISCO_AC_AJAX_ACTION, 'disco_activecampaign_handle_subscribed' );
