<?php
/**
 * Disco Review Notice
 * add review notice in admin dashboard
 * @package   Disco
 * @author    Ohidul Islam <wahid003@gmail.com>
 * @sicne     1.2.21
 */

namespace Disco\Notice;

class ReviewNotice {
	public function __construct() {
		add_action( 'admin_notices', [ $this, 'display_review_notice' ] );
	}

    /**
     * Display the review notice if it hasn't been dismissed.
     * @throws \Exception
     *
     * @return void
     */
	public function display_review_notice() {
		if ( ! is_user_logged_in() ) {
			return; // Do not show notice to non-logged-in users
		}

		$admin_page = get_current_screen();

		if (( 'toplevel_page_disco-create-discount' !== $admin_page->id ) ) {
			return;
		}

		$user_id       = get_current_user_id();
		$dismiss_value = get_user_meta( $user_id, 'disco_review_dismissed', true );

		// If 'never', don't show the notice
		if ( $dismiss_value === 'never' ) {
			return;
		}

		// If it's a timestamp, check if the snooze period has not yet expired
		if ( is_numeric( $dismiss_value ) && $dismiss_value > time() ) {
			return;
		}

		?>
		<div class="disco-review-notice-wrapper">
			<div class="notice notice-success is-dismissible disco-review-notice">
				<img class="disco-notice-icon" src="<?php echo esc_url( plugins_url( 'disco/assets/img/disco-notice-icon.svg' ) ); ?>" alt="Disco Logo">
				<div>
					<h3 class="disco-review-title">❤️ Loving Disco advanced features and functionality?</h3>
					<p class="disco-review-subtitle">We’d really appreciate your <span class="disco-review-star">⭑⭑⭑⭑⭑</span> review! Your quick feedback helps us add even more great features. Tell us what you think and keep the fun going! 🥳</p>
					<div class="disco-review-buttons">
						<div class="disco-review-buttons-left">
							<a href="#" class="later-btn disco-dismiss-review disco-notice-secondary-button" data-dismiss="later">Remind me later</a>
							<a href="#" class="later-btn disco-dismiss-review disco-notice-secondary-button" data-dismiss="never">I already did!</a>
							<a href="https://wordpress.org/support/plugin/disco/reviews/#new-post" target="_blank" class="review-btn">Review Here</a>
						</div>
						<div class="disco-review-buttons-right">
							<a href="#" id="disco-review-never" class="disco-dismiss-review" data-dismiss="never">I would not</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
}
