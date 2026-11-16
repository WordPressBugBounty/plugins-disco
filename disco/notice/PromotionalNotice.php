<?php

namespace Disco\Notice;

use Disco\App\Disco;

class PromotionalNotice {

	/**
	 * User meta recording that this banner was dismissed.
	 *
	 * Read here and written by Ajax::dismiss_promotional_notice(). Each campaign
	 * gets a fresh key so a new banner is not hidden by last season's dismissal;
	 * keeping the key in one place stops the two sides drifting apart, which is
	 * how dismissing the banner came to store a key this class never read, so
	 * it reappeared on the next page load.
	 */
	public const DISMISS_META_KEY = 'disco_black_friday_banner_2026';

	public function __construct() {
		add_action( 'admin_notices', [ $this, 'display_promotional_notice' ] );
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

		$promo_start  = strtotime('2026-11-12 00:00:00');
		$promo_end    = strtotime('2026-12-07 23:59:59');

		// If not in promotion window, don't show
		if ( $current_time < $promo_start || $current_time > $promo_end ) {
			return;
		}

		$user_id = get_current_user_id();
		$dismiss = get_user_meta( $user_id, self::DISMISS_META_KEY, true );

		if ( $dismiss === 'never' ) {
			return; // User dismissed permanently
		}

		?>
		<div class="disco-promotional-notice-wrapper">
			<div class="notice notice-success is-dismissible disco-promotional-notice">
                <?php include DISCO_PLUGIN_ROOT . 'notice/banners/black_friday_banner_2026.php'; ?>
			</div>
		</div>
		<?php
	}
}
