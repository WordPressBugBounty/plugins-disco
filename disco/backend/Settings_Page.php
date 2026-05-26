<?php

/**
 * Disco
 *
 * @package   Disco
 * @author    Ohidul Islam <wahid0003@gmail.com>
 * @link      http://domain.tld
 * @license   GPL 2.0+
 * @copyright 2022 WebAppick
 */

namespace Disco\Backend;

use Disco\App\Disco;
use Disco\Engine\Base;

/**
 * Create the settings page in the backend
 */
class Settings_Page extends Base {

	/**
	 * Initialize the class.
	 *
	 * @return void|bool
	 */
	public function initialize() {
		if ( ! parent::initialize() ) {
			return;
		}

		// Add the options page and menu item.
		\add_action( 'admin_menu', array( $this, 'add_plugin_admin_menu' ) );

		$realpath        = (string) \realpath( __DIR__ );
		$plugin_basename = \plugin_basename( \plugin_dir_path( $realpath ) . DISCO_TEXTDOMAIN . '.php' );

		add_filter( "plugin_action_links_{$plugin_basename}", array( $this, 'disco_add_action_plugin_links' ) );
	}

	/**
	 * Add settings link on plugin page
	 *
	 * @param array $links links.
	 * @return array
	 */
	public function disco_add_action_plugin_links( $links ) {

		$is_pro_active = class_exists( '\Disco_Pro' );

		$custom_links = [
			[
				'label' => __( 'Settings', 'disco' ),
				'url'   => admin_url( 'admin.php?page=disco-create-discount' ),
				'class' => 'disco-settings-link',
			],
			[
				'label' => __( 'Get Pro', 'disco' ),
				'url'   => 'https://discoplugin.com/pricing/?utm_source=plugin_dashboard&utm_medium=free-to-pro&utm_campaign=free-to-pro&utm_id=1',
				'class' => 'disco-custom-pro-link',
			],
			[
				'label' => __( 'Docs', 'disco' ),
				'url'   => 'https://discoplugin.com/docs/',
				'class' => 'disco-custom-docs-link',
			],
		];

		if ( $is_pro_active ) {
			array_splice( $custom_links, 1, 1 );
		}

		$built_links = array();

		foreach ( $custom_links as $item ) {
			$built_links[] = sprintf(
				'<a href="%s" class="%s" target="_blank" rel="noopener">%s</a>',
				esc_url( $item['url'] ),
				esc_attr( $item['class'] ),
				esc_html( $item['label'] )
			);
		}

		$new_links = array();

		foreach ( $links as $link ) {
			$new_links[] = $link;

			// Insert after Deactivate
			if ( strpos( $link, 'deactivate' ) !== false ) {
				foreach ( $built_links as $custom_link ) {
					$new_links[] = $custom_link;
				}
			}
		}

		return $new_links;
	}

	/**
	 * Register the administration menu for this plugin into the WordPress Dashboard menu.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function add_plugin_admin_menu() {
		/*
		 * Add a settings page for this plugin to the Settings menu
		 *
		 *
		 *
		 * - Change 'manage_options' to the capability you see fit
		 *   For reference: http://codex.wordpress.org/Roles_and_Capabilities

		add_options_page( __( 'Page Title', DISCO_TEXTDOMAIN ), DISCO_NAME, 'manage_options', DISCO_TEXTDOMAIN, array( $this, 'display_plugin_admin_page' ) );
		 *
		 */
		/*
		 * Add a settings page for this plugin to the main menu
		 *
		 */
		add_menu_page(
			'Disco',
			DISCO_NAME,
			'manage_woocommerce',
			'disco-create-discount',
			array(
				$this,
				'display_plugin_admin_page_create_discount',
			),
			plugins_url( 'disco/assets/img/disco-menu-icon.png' ),
			10
		);
		add_submenu_page(
			'disco-create-discount',
			__( 'Campaigns', 'disco' ),
			__( 'Campaigns', 'disco' ),
			'manage_woocommerce',
			'disco-create-discount',
			array(
				$this,
				'display_plugin_admin_page_create_discount',
			)
		);
		add_submenu_page(
			'disco-create-discount',
			__( 'Create Campaign', 'disco' ),
			__( 'Create Campaign', 'disco' ),
			'manage_woocommerce',
			'disco-create-campaign',
			array(
				$this,
				'disco_display_plugin_admin_page_create_campaign',
			)
		);
		add_submenu_page(
			'disco-create-discount',
			__( 'Settings', 'disco' ),
			__( 'Settings', 'disco' ),
			'manage_woocommerce',
			'disco-settings',
			array(
				$this,
				'disco_display_plugin_admin_page_settings',
			)
		);
		add_submenu_page(
			'disco-create-discount',
			__( 'Compatibles', 'disco' ),
			__( 'Compatibles', 'disco' ),
			'manage_woocommerce',
			'compatible-plugin-list',
			array(
				$this,
				'disco_display_plugin_admin_page_compatible_plugin_list',
			)
		);
		add_submenu_page(
			'disco-create-discount',
			__( 'Help & Docs', 'disco' ),
			__( 'Help & Docs', 'disco' ),
			'manage_woocommerce',
			'help-and-docs',
			array(
				$this,
				'disco_display_plugin_admin_page_help_and_docs',
			)
		);
		if ( ! Disco::is_pro() ) {
			add_submenu_page(
				'disco-create-discount',
				__( 'Pro Plan', 'disco' ),
				__( 'Pro Plan', 'disco' ),
				'manage_woocommerce',
				'pro-plan',
				array(
					$this,
					'disco_display_plugin_admin_page_pro_plan',
				)
			);
		}

		if ( ! Disco::is_pro() ) {
			// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			$GLOBALS['submenu']['disco-create-discount'][] = array(
				'<span class="disco-pro-submenu-badge">
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 15 15" fill="none">
  						<path fill-rule="evenodd" clip-rule="evenodd" d="M11.2814 5.98453H5.72436V4.1044C5.72436 3.12776 6.52343 2.32872 7.50004 2.32872C8.30225 2.32872 8.98463 2.86784 9.2028 3.60167C9.37029 4.16505 10.1124 4.2808 10.4549 3.82187C10.592 3.6382 10.6307 3.42103 10.5655 3.20133C10.1734 1.87951 8.94467 0.908203 7.50004 0.908203C5.74211 0.908203 4.30381 2.3465 4.30381 4.10443V5.98453H3.71872C3.0734 5.98453 2.54541 6.51252 2.54541 7.15784V12.9185C2.54541 13.5638 3.0734 14.0918 3.71872 14.0918H11.2814C11.9267 14.0918 12.4547 13.5638 12.4547 12.9185V7.15784C12.4547 6.51252 11.9267 5.98453 11.2814 5.98453ZM7.93952 10.0434V11.5296C7.93952 11.7723 7.74276 11.969 7.50007 11.969C7.25737 11.969 7.06062 11.7723 7.06062 11.5296V10.0434C6.71849 9.87938 6.48224 9.52983 6.48224 9.1251C6.48224 8.56298 6.93792 8.10727 7.50007 8.10727C8.06222 8.10727 8.5179 8.56298 8.5179 9.1251C8.5179 9.52986 8.28165 9.8794 7.93952 10.0434Z" fill="white"/>
					</svg> ' . esc_html__( 'Unlock Pro', 'disco' ) .
				'</span>',
				'manage_woocommerce',
				admin_url( 'admin.php?page=pro-plan' ),
				esc_html__( 'Unlock Pro', 'disco' ),
			);
		}
	}

	/**
	 * Render the create discount page for this plugin.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function display_plugin_admin_page_create_discount() {
		// Create a nonce
		wp_create_nonce( 'disco_create_discount' );

		include_once DISCO_PLUGIN_ROOT . 'backend/views/create_discount.php';
	}

	/**
	 * Render the create campaign page for this plugin.
	 *
	 * @return void
	 */
	public function disco_display_plugin_admin_page_create_campaign() {
		wp_create_nonce( 'disco_create_discount' );
		echo '<script>window.location.hash="#/disco";</script>';
		include_once DISCO_PLUGIN_ROOT . 'backend/views/create_discount.php';
	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @return void
	 */
	public function disco_display_plugin_admin_page_settings() {
		wp_create_nonce( 'disco_create_discount' );
		echo '<script>window.location.hash="#/settings";</script>';
		include_once DISCO_PLUGIN_ROOT . 'backend/views/create_discount.php';
	}

	/**
	 * Render the help and docs page for this plugin.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function disco_display_plugin_admin_page_help_and_docs() {
		include_once DISCO_PLUGIN_ROOT . 'backend/views/help_and_docs.php';
	}

	/**
	 * Render the pro plan page for this plugin.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function disco_display_plugin_admin_page_pro_plan() {
		include_once DISCO_PLUGIN_ROOT . 'backend/views/pro_plan.php';
	}

	/**
	 * Render the compatible plugin list page for this plugin.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function disco_display_plugin_admin_page_compatible_plugin_list() {
		include_once DISCO_PLUGIN_ROOT . 'backend/views/compatible_plugin_list.php';
	}

}
