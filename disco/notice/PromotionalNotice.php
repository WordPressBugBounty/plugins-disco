<?php

namespace Disco\Notice;

use Disco\App\Disco;

class PromotionalNotice {
	public function __construct() {
//		add_action( 'admin_notices', [ $this, 'display_promotional_notice' ] );
	}

	/**
	 * Display the promotional notice.
	 *
	 * @return void
	 */
	public function display_promotional_notice() {

		if( Disco::is_pro() ) {
		    return;
		}

		global $pagenow;

		$allowed_pages = [
				'index.php', // Dashboard
		];

		$plugin_page_slug = 'disco-create-discount';

		// If NOT dashboard AND NOT your plugin page → return
		if (
				! in_array( $pagenow, $allowed_pages, true ) &&
				( ! isset( $_GET['page'] ) || $_GET['page'] !== $plugin_page_slug )
		) {
				return;
		}

		// Stop if user is not logged in
		if ( ! is_user_logged_in() ) {
				return;
		}


		$current_time = time();

		$promo_start  = strtotime('2025-12-01 00:00:00');
		$promo_end    = strtotime('2026-01-05 11:59:00');

		// If not in promotion window, don't show
		if ( $current_time < $promo_start || $current_time > $promo_end ) {
			return;
		}

		$user_id = get_current_user_id();
		$dismiss = get_user_meta( $user_id, 'disco_promotional_holiday_banner_2025', true );

		if ( $dismiss === 'never' ) {
			return; // User dismissed permanently
		}

		?>
		<div class="disco-promotional-notice-wrapper">
			<div class="notice notice-success is-dismissible disco-promotional-notice">
                <a href="https://discoplugin.com/pricing/?utm_source=Floating-Holiday&utm_medium=free-to-pro&utm_campaign=H-Holiday&utm_id=1" target="_blank">
                    <img src="<?php echo esc_url( plugins_url( 'assets/img/promotional/holiday_promotional_banner_2025.png', DISCO_PLUGIN_ABSOLUTE ) ); ?>" alt="Promotional Banner" style="max-width: 100%; height: auto;">
                </a>
			</div>
		</div>
		<?php
	}
}
