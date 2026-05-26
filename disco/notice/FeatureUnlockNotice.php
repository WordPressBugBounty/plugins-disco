<?php

namespace disco\notice;

use Disco\App\Disco;

class FeatureUnlockNotice {
	public function __construct() {
//		add_action( 'admin_notices', [ $this, 'display_feature_unlock_notice' ] );
	}

	/**
	 * Display the feature unlock plugin notice.
	 *
	 * @return void
	 */
	public function display_feature_unlock_notice() {
		$admin_page = get_current_screen();

		if( Disco::is_pro() ) {
			return;
		}

		$promotion_list = [
			'Increase conversions',
			'Boost visibility',
			'Drive more sales',
			'Promote Smarter',
			'Grow Faster',
		];

		$user_id = get_current_user_id();
		$dismiss = get_user_meta( $user_id, 'disco_feature_unlock_notice_dismissed', true );

		if ( $dismiss === 'never' ) {
			return;
		}

		?>

		<div class="disco-feature-unlock-notice-wrapper">
			<div class="notice notice-info is-dismissible disco-feature-unlock-notice">
				<img class="disco-notice-icon" src="<?php echo esc_url( plugins_url( 'assets/img/disco-notice-icon.svg', DISCO_PLUGIN_ABSOLUTE ) ); ?>" alt="Disco Logo">
				<div class="disco-feature-unlock-wrapper">
					<h1 class="disco-feature-unlock-notice-title">
						Turn More <span class="disco-plugin-special-text">Visitors into Buyers!</span>
					</h1>
					<div class="disco-feature-unlock-message">Don’t let your discounts hidden - Turn visitors into customers by showcasing your best offers with  <span class="disco-plugin-special-text">Campaign Display</span></div>
					<div class="disco-feature-unlock-items-wrapper">
						<?php
						foreach ( $promotion_list as $item ) {
							?>
							<span class="disco-feature-unlock-name-item">
										<img class="disco-compatible-check-icon" src="<?php echo esc_url( plugins_url( 'assets/img/compatible-notice-icon.svg', DISCO_PLUGIN_ABSOLUTE ) ); ?>" alt="Check Icon">
										<?php echo esc_html( $item ); ?>
									</span>
							<?php
						}
						?>
					</div>
					<div class="disco-feature-unlock-buttons">
						<a href="https://discoplugin.com/pricing/?utm_source=wp-notify-display&utm_medium=free-to-pro&utm_campaign=from-display-notification&utm_id=1" target="_blank" class="disco-compatible-button disco-notice-primary-button">
							<img class="disco-feature-unlock-icon" src="<?php echo esc_url( plugins_url( 'assets/img/disco-pro-crown-icon.svg', DISCO_PLUGIN_ABSOLUTE ) ); ?>" alt="Disco Logo">
							Get Disco Pro
						</a>
						<a href="https://discoplugin.com/docs-category/display/" target="_blank" class="disco-notice-secondary-button disco-compatible-button">
							Learn More
							<img class="disco-feature-unlock-icon" src="<?php echo esc_url( plugins_url( 'assets/img/disco-learn-more-icon.svg', DISCO_PLUGIN_ABSOLUTE ) ); ?>" alt="Disco learn More Icon">
						</a>
					</div>
				</div>
			</div>
		</div>

		<?php
	}
}
