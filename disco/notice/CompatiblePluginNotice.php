<?php

namespace Disco\Notice;

use Disco\App\Disco;

class CompatiblePluginNotice {

	public function __construct() {
		add_action( 'admin_notices', [ $this, 'display_compatible_plugin_notice' ] );
	}

	/**
	 * Display the compatible plugin notice.
	 *
	 * @return void
	 */
	public function display_compatible_plugin_notice() {
		$admin_page = get_current_screen();

		if ( Disco::is_pro() ||
			( 'toplevel_page_disco-create-discount' !== $admin_page->id ) ) {
			return;
		}

		// List of plugins: 'plugin-folder/plugin-file.php' => 'Display Name'
		$plugin_list = [
			'woo-multi-currency/woo-multi-currency.php' 									              => 'CURCY - Multi Currency Plugin',
			'woocommerce-aelia-currencyswitcher/woocommerce-aelia-currencyswitcher.php'	=> 'Aelia - Currency Switcher plugin',
			'woocommerce-currency-switcher/index.php'   									              => 'FOX - Currency Switcher Plugin',
			'woocommerce-multilingual/wpml-woocommerce.php'									            => 'WPML plugin',
			'advanced-custom-fields/acf.php'												                     => 'ACF - Advanced Custom Fields',
		];

		$user_id = get_current_user_id();
		$dismiss = get_user_meta( $user_id, 'disco_compatible_plugin_notice_dismissed', true );

		if ( $dismiss === 'never' ) {
			return;
		}

		// Require plugin functions if not loaded yet
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		// Find active plugins from the list
		$active_plugins = [];
		foreach ( $plugin_list as $plugin_file => $plugin_name ) {
			if ( is_plugin_active( $plugin_file ) ) {
				$active_plugins[] = $plugin_name;
			}
		}

		// If none are active, don't show notice
		if ( empty( $active_plugins ) ) {
			return;
		}

		?>

		<div class="disco-compatible-plugin-notice-wrapper">
			<div class="notice notice-info is-dismissible disco-compatible-plugin-notice">
				<img class="disco-notice-icon" src="<?php echo esc_url( plugins_url( 'assets/img/disco-notice-icon.svg', DISCO_PLUGIN_ABSOLUTE ) ); ?>" alt="Disco Logo">
				<div class="disco-compatible-plugin-wrapper">
					<h1 class="disco-compatible-plugin-notice-title">
						Disco Pro is <span class="disco-plugin-special-text">compatible</span> with your installed plugin
					</h1>
					<div class="disco-compatible-plugin-items-wrapper">
						<?php
							foreach ( $active_plugins as $plugin_name ) {
								?>
									<span class="disco-compatible-plugin-name-item">
										<img class="disco-compatible-check-icon" src="<?php echo esc_url( plugins_url( 'assets/img/compatible-notice-icon.svg', DISCO_PLUGIN_ABSOLUTE ) ); ?>" alt="Compatible check Icon">
										<?php echo esc_html( $plugin_name ); ?>
									</span>
								<?php
							}
						?>
					</div>
					<div class="disco-compatible-plugin-message">Boost your store’s power with advanced features, enjoy smooth plugin compatibility, and unlock the full potential of Disco Pro.</div>
					<div class="disco-compatible-plugin-buttons">
						<a href="https://discoplugin.com/?utm_source=Side_Banner&utm_medium=Banner&utm_campaign=Free-to-Pro&utm_id=1" target="_blank" class="disco-compatible-button disco-notice-primary-button">
							<img class="disco-compatible-plugin-icon" src="<?php echo esc_url( plugins_url( 'assets/img/disco-pro-crown-icon.svg', DISCO_PLUGIN_ABSOLUTE ) ); ?>" alt="Disco Logo">
							Get Disco Pro
						</a>
						<a href="https://discoplugin.com/docs/" target="_blank" class="disco-notice-secondary-button disco-compatible-button">
							Learn More
							<img class="disco-compatible-plugin-icon" src="<?php echo esc_url( plugins_url( 'assets/img/disco-learn-more-icon.svg', DISCO_PLUGIN_ABSOLUTE ) ); ?>" alt="Disco learn More Icon">
						</a>
					</div>
				</div>
			</div>
		</div>

		<?php
	}

}
