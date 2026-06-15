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
use Inpsyde\Assets\Asset;
use Inpsyde\Assets\AssetManager;
use Inpsyde\Assets\Script;
use Inpsyde\Assets\Style;

/**
 * This class contain the Enqueue stuff for the backend
 */
class Enqueue extends Base {

	/**
	 * Initialize the class.
	 *
	 * @return void|bool
	 */
	public function initialize() {
		if ( ! parent::initialize() ) {
			return;
		}

		\add_action( AssetManager::ACTION_SETUP, array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Enqueue assets with Inpyside library https://inpsyde.github.io/assets
	 *
	 * @param \Inpsyde\Assets\AssetManager $asset_manager The class.
	 * @return void
	 */
	public function enqueue_assets( AssetManager $asset_manager ) {
		// Load admin style sheet and JavaScript.
		$assets = $this->enqueue_admin_styles();

		if ( ! empty( $assets ) ) {
			foreach ( $assets as $asset ) {
				$asset_manager->register( $asset );
			}
		}

		$assets = $this->enqueue_admin_scripts();

		if ( empty( $assets ) ) {
			return;
		}

		foreach ( $assets as $asset ) {
			$asset_manager->register( $asset );
		}
	}

	/**
	 * Register and enqueue admin-specific style sheet.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public function enqueue_admin_styles() {
		$admin_page = \get_current_screen();
		$styles     = array();

		$styles[0] = new Style( DISCO_TEXTDOMAIN . '-admin-style', \plugins_url( 'assets/build/plugin-admin.css', DISCO_PLUGIN_ABSOLUTE ) );
		$styles[0]->forLocation( Asset::BACKEND )->withVersion( DISCO_VERSION );
		$styles[0]->withDependencies( 'dashicons' );

		if ( ! \is_null( $admin_page ) && in_array( $admin_page->id, array( 'toplevel_page_disco-create-discount', 'disco_page_disco-create-campaign', 'disco_page_disco-settings' ), true ) ) {
			$styles[1] = new Style( DISCO_TEXTDOMAIN . '-admin-tailwind-style', \plugins_url( 'backend/views/asset/tailwind.css', DISCO_PLUGIN_ABSOLUTE ) );
			$styles[1]->forLocation( Asset::BACKEND )->withVersion( DISCO_VERSION );
			$styles[1]->withDependencies( 'dashicons' );
		}

		if ( ! \is_null( $admin_page ) && in_array( $admin_page->id, array( 'disco_page_help-and-docs', 'disco_page_pro-plan', 'disco_page_compatible-plugin-list' ), true ) ) {
			$styles[2] = new Style( DISCO_TEXTDOMAIN . '-admin-common-style', \plugins_url( 'backend/views/asset/common-tailwind.css', DISCO_PLUGIN_ABSOLUTE ) );
			$styles[2]->forLocation( Asset::BACKEND )->withVersion( DISCO_VERSION );
		}

		return $styles;
	}

	/**
	 * Register and enqueue admin-specific JavaScript.
	 *
	 * @return array
	 * @since 1.0.0
	 */
	public function enqueue_admin_scripts() {
		$admin_page = \get_current_screen();
		$scripts    = array();

		if ( ! \is_null( $admin_page ) && in_array( $admin_page->id, array( 'toplevel_page_disco-create-discount', 'disco_page_disco-create-campaign', 'disco_page_disco-settings' ), true ) ) {
			$scripts[0] = new Script( DISCO_TEXTDOMAIN . '-settings-admin', \plugins_url( 'assets/build/plugin-admin.js', DISCO_PLUGIN_ABSOLUTE ) );
			$scripts[0]->forLocation( Asset::BACKEND )->withVersion( DISCO_VERSION );
			$scripts[0]->dependencies();
			$scripts[0]->withLocalize(
				'DISCO',
				array(
					'ajax_url'               => admin_url( 'admin-ajax.php' ),
					'json_url'               => esc_url_raw( rest_url( 'disco/v1' ) ),
					'is_pretty_url'          => (bool) get_option('permalink_structure'),
					'rest_nonce'             => wp_create_nonce( 'wp_rest' ),
					'admin_url'              => admin_url( 'admin.php' ),
					'site_url'               => site_url(),
					'TEXTDOMAIN'             => DISCO_TEXTDOMAIN,
					'is_pro_active' 	       => Disco::is_pro(),
					'disco_free_version'     => DISCO_VERSION,
					'DISCO_BADGE_IMAGES_DIR' => DISCO_BADGE_IMAGES_DIR,
					'active_campaign'        => disco_activecampaign_get_localize_data(),
				)
			);
		}

		$scripts[1] = new Script( DISCO_TEXTDOMAIN . '-admin-tailwind-script', \plugins_url( 'assets/build/plugin-notice.js', DISCO_PLUGIN_ABSOLUTE ) );
		$scripts[1]->forLocation( Asset::BACKEND )->withVersion( DISCO_VERSION );
		$scripts[1]->dependencies();
		$scripts[1]->withLocalize(
			'DISCO_NOTICE',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( 'disco_dismiss_notice' ),
			)
		);

		if ( ! \is_null( $admin_page ) && 'disco_page_help-and-docs' === $admin_page->id ) {
			$scripts[2] = new Script( DISCO_TEXTDOMAIN . '-admin-help-docs-script', \plugins_url( 'assets/build/plugin-docs.js', DISCO_PLUGIN_ABSOLUTE ) );
			$scripts[2]->forLocation( Asset::BACKEND )->withVersion( DISCO_VERSION );
			$scripts[2]->dependencies();
			$scripts[2]->withLocalize(
				'DISCO',
				array(
					'is_pro_active' => Disco::is_pro(),
					'json_url'      => esc_url_raw( rest_url( 'disco/v1/' ) ),
					'rest_nonce'    => wp_create_nonce( 'wp_rest' ),
				)
			);
		}

		if ( ! \is_null( $admin_page ) && 'disco_page_pro-plan' === $admin_page->id ) {
			$scripts[3] = new Script( DISCO_TEXTDOMAIN . '-admin-pro-plan-script', \plugins_url( 'assets/build/plugin-pro-plan.js', DISCO_PLUGIN_ABSOLUTE ) );
			$scripts[3]->forLocation( Asset::BACKEND )->withVersion( DISCO_VERSION );
			$scripts[3]->dependencies();
		}

		if ( ! \is_null( $admin_page ) && 'disco_page_compatible-plugin-list' === $admin_page->id ) {
			$scripts[4] = new Script( DISCO_TEXTDOMAIN . '-admin-compatible-plugin-list-script', \plugins_url( 'assets/build/plugin-compatible-plugin-list.js', DISCO_PLUGIN_ABSOLUTE ) );
			$scripts[4]->forLocation( Asset::BACKEND )->withVersion( DISCO_VERSION );
			$scripts[4]->dependencies();
			$scripts[4]->withLocalize(
				'DISCO_COMPATIBLE_PLUGINS',
				array(
					'active_plugins' => get_option( 'active_plugins', array() ),
					'is_pro_active'  => Disco::is_pro()
				)
			);
		}

		return $scripts;
	}

}
