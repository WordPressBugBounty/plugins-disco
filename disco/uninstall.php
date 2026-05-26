<?php

/**
 * Disco
 *
 * Fired when the plugin is uninstalled.
 *
 * When populating this file, consider the following flow
 * of control:
 *
 * - This method should be static
 * - Check if the $_REQUEST content actually is the plugin name
 * - Run an admin referrer check to make sure it goes through authentication
 * - Verify the output of $_GET makes sense
 * - Repeat with other user roles. Best directly by using the links/query string parameters.
 * - Repeat things for multisite. Once for a single site in the network, once sitewide.
 *
 * @package   Disco
 * @author    Ohidul Islam <wahid0003@gmail.com>
 * @copyright 2022 WebAppick
 * @license   GPL 2.0+
 * @link      http://domain.tld
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Loop for uninstall
 *
 * @return void
 */
function disco_uninstall_multisite() {
	if ( is_multisite() ) {
		/** @var array<\WP_Site> $blogs */
		$blogs = get_sites();

		if ( ! empty( $blogs ) ) {
			foreach ( $blogs as $blog ) {
				switch_to_blog( (int) $blog->blog_id );
				disco_uninstall();
				restore_current_blog();
			}

			return;
		}
	}

	disco_uninstall();
}

/**
 * What happens on uninstalling?
 *
 * @return void
 * @global WP_Roles $wp_roles
 */
function disco_uninstall() { // phpcs:ignore
	global $wp_roles;

	// Ensure $wp_roles is properly initialized
	if ( ! isset( $wp_roles ) ) {
		if ( ! class_exists( 'WP_Roles' ) ) {
			return; // Exit if WP_Roles class does not exist
		}

		$wp_roles = new WP_Roles(); // phpcs:ignore
	}

	$caps = array(
		'create_plugins',
		'read_demo',
		'read_private_demoes',
		'edit_demo',
		'edit_demoes',
		'edit_private_demoes',
		'edit_published_demoes',
		'edit_others_demoes',
		'publish_demoes',
		'delete_demo',
		'delete_demoes',
		'delete_private_demoes',
		'delete_published_demoes',
		'delete_others_demoes',
		'manage_demoes',
	);

	foreach ( $wp_roles->roles as $role_key => $role_name ) { // phpcs:ignore
		$role_cap = get_role( $role_key );

		if ( ! $role_cap ) {
			continue; // Skip if a role does not exist
		}

		foreach ( $caps as $cap ) {
			$role_cap->remove_cap( $cap );
		}
	}
}


disco_uninstall_multisite();
