<?php
/**
 * Disco Plugin - LiveChat Widget Integration
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Allowed admin pages for LiveChat widget.
 */
function disco_livechat_allowed_pages() {
	return array( 'disco-create-discount', 'help-and-docs' );
}

/**
 * The LiveChat widget script.
 * - No consent: shows fake bubble → consent modal → saves setting → loads LiveChat.
 * - Consent given: loads LiveChat with custom bubble directly.
 */
function disco_livechat_script() {
	$current_page  = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : '';
	$consent_given = (bool) \Disco\App\Utility\Settings::get( 'live_chat_support' );
	$settings_url  = esc_url( rest_url( 'disco/v1/settings/' ) );
	$rest_nonce    = wp_create_nonce( 'wp_rest' );
	?>
	<!-- Disco Plugin: LiveChat Widget -->
	<style>
		#disco-chat-bubble {
			display: none;
			position: fixed;
			bottom: 8px;
			right: 8px;
			width: 45px;
			height: 45px;
			border-radius: 50%;
			background: #0bc88a;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
			cursor: pointer;
			z-index: 999997;
			align-items: center;
			justify-content: center;
			border: none;
			outline: none;
			padding: 0;
			transition: transform 0.15s ease, box-shadow 0.15s ease;
		}
		#disco-chat-bubble:hover {
			transform: scale(1.08);
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.32);
		}
		#disco-chat-bubble::before {
			content: 'Need help? Let\'s chat';
			position: absolute;
			right: calc(100% + 10px);
			top: 50%;
			transform: translateY(-50%);
			background: #48cd89;
			color: #ffffff;
			font-size: 14px;
			font-weight: 600;
			white-space: nowrap;
			padding: 8px 14px;
			border-radius: 8px;
			opacity: 0;
			pointer-events: none;
			transition: opacity 0.15s ease;
		}
		#disco-chat-bubble::after {
			content: '';
			position: absolute;
			right: calc(100% + 2px);
			top: 50%;
			transform: translateY(-50%);
			border: 5px solid transparent;
			border-left-color: #48cd89;
			opacity: 0;
			pointer-events: none;
			transition: opacity 0.15s ease;
		}
		#disco-chat-bubble:hover::before,
		#disco-chat-bubble:hover::after {
			opacity: 1;
		}
		#disco-chat-bubble svg {
			width: 26px;
			height: 26px;
			fill: #ffffff;
			pointer-events: none;
		}
		#disco-chat-modal-overlay {
			display: none;
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.55);
			z-index: 999998;
			align-items: center;
			justify-content: center;
		}
		#disco-chat-modal-overlay.disco-modal-open {
			display: flex;
		}
		#disco-chat-modal-box {
			background: #ffffff;
			border: 1px solid #e2e8f0;
			border-radius: 20px;
			max-width: 480px;
			width: 90%;
			box-shadow: 0 24px 64px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06);
			overflow: hidden;
			position: relative;
		}
		#disco-chat-modal-header {
			background: #d7f5e2;
			background-image: radial-gradient(ellipse at 80% 0%, rgba(34, 197, 94, 0.22) 0%, rgba(34, 197, 94, 0) 70%);
			height: 155px;
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			padding-bottom: 20px;
		}
		#disco-chat-modal-icon {
			position: absolute;
			top: 23px;
			left: 50%;
			transform: translateX(-50%);
			background: #0bc88a;
			width: 56px;
			height: 56px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		#disco-chat-modal-icon svg {
			width: 28px;
			height: 28px;
			fill: #ffffff;
		}
		#disco-chat-modal-title {
			margin: 0 0 4px;
			font-size: 20px;
			font-weight: 600;
			color: #000000;
			text-align: center;
			line-height: 1.3;
		}
		#disco-chat-modal-subtitle {
			margin: 0;
			font-size: 14px;
			color: rgba(37, 37, 37, 0.8);
			text-align: center;
			line-height: 1.4;
		}
		#disco-chat-modal-body {
			padding: 24px 36px 0;
		}
		#disco-chat-modal-desc {
			margin: 0 0 20px;
			font-size: 14px;
			color: #000000;
			text-align: center;
			line-height: 1.6;
		}
		#disco-chat-modal-actions {
			display: flex;
			flex-direction: column;
			gap: 12px;
			margin-bottom: 20px;
		}
		#disco-chat-btn-enable {
			background: #0bc88a;
			box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35), 0 1px 3px rgba(0, 0, 0, 0.1);
			border: none;
			border-radius: 12px;
			height: 48px;
			width: 100%;
			color: #ffffff;
			font-size: 14.5px;
			font-weight: 600;
			text-align: center;
			cursor: pointer;
			letter-spacing: 0.145px;
			transition: background 0.15s ease;
		}
		#disco-chat-btn-enable:hover {
			background: #0ab57d;
		}
		#disco-chat-btn-enable:disabled {
			opacity: 0.65;
			cursor: not-allowed;
		}
		#disco-chat-btn-cancel {
			background: #f1f5f9;
			border: 1px solid #e2e8f0;
			border-radius: 12px;
			height: 45px;
			width: 100%;
			color: #475569;
			font-size: 13.5px;
			text-align: center;
			cursor: pointer;
			transition: background 0.15s ease;
		}
		#disco-chat-btn-cancel:hover {
			background: #e8edf2;
		}
		#disco-chat-error {
			display: none;
			color: #d63638;
			font-size: 13px;
			margin: 0;
			text-align: center;
		}
		#disco-chat-trust {
			border-top: 1px dashed #e2e8f0;
			padding: 12px 0 16px;
			text-align: center;
		}
		#disco-chat-trust p {
			margin: 0;
			font-size: 11.5px;
			color: #475569;
		}
		#disco-chat-trust a {
			color: #16a34a;
			text-decoration: none;
		}
		#disco-chat-trust a:hover {
			text-decoration: underline;
		}
	</style>

	<button id="disco-chat-bubble" aria-label="<?php echo esc_attr__( 'Open live chat', 'disco' ); ?>" type="button">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6V10h12v2zm0-3H6V7h12v2z"/>
		</svg>
	</button>

	<div id="disco-chat-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="disco-chat-modal-title">
		<div id="disco-chat-modal-box">
			<div id="disco-chat-modal-header">
				<div id="disco-chat-modal-icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6V10h12v2zm0-3H6V7h12v2z"/>
					</svg>
				</div>
				<h3 id="disco-chat-modal-title"><?php echo esc_html__( "Need help? Let's chat", 'disco' ); ?></h3>
				<p id="disco-chat-modal-subtitle"><?php echo esc_html__( 'Get instant support from the Disco team', 'disco' ); ?></p>
			</div>
			<div id="disco-chat-modal-body">
				<p id="disco-chat-modal-desc"><?php echo esc_html__( 'Enable our live support chat and get answers in real time — no tickets, no waiting. Our team is ready to help you get the most out of Disco.', 'disco' ); ?></p>
				<div id="disco-chat-modal-actions">
					<p id="disco-chat-error" role="alert"></p>
					<button id="disco-chat-btn-enable" type="button"><?php echo esc_html__( 'Yes, enable live chat', 'disco' ); ?></button>
					<button id="disco-chat-btn-cancel" type="button"><?php echo esc_html__( "No thanks, I'll manage on my own", 'disco' ); ?></button>
				</div>
				<div id="disco-chat-trust">
					<p>
						<?php
						$allowed_tags = array(
							'a' => array(
								'href'   => array(),
								'target' => array(),
								'rel'    => array(),
							),
						);
						echo wp_kses(
							sprintf(
								/* translators: 1: livechat.com link, 2: Terms of Use link, 3: Privacy Policy link */
								__( 'Powered by %1$s · %2$s · %3$s', 'disco' ),
								'<p>Live Chat</p>',
								'<a href="https://www.livechat.com/legal/terms-of-use/" target="_blank" rel="noopener noreferrer nofollow">' . esc_html__( 'Terms', 'disco' ) . '</a>',
								'<a href="https://www.livechat.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer nofollow">' . esc_html__( 'Policy', 'disco' ) . '</a>'
							),
							$allowed_tags
						);
						?>
					</p>
				</div>
			</div>
		</div>
	</div>

	<script>

		(function() {
			const currentPage  = '<?php echo esc_js( $current_page ); ?>';
			let   consentGiven = <?php echo $consent_given ? 'true' : 'false'; ?>;
			const settingsUrl  = '<?php echo esc_js( $settings_url ); ?>';
			const restNonce    = '<?php echo esc_js( $rest_nonce ); ?>';
			const i18n         = {
				enabling:     '<?php echo esc_js( __( 'Enabling...', 'disco' ) ); ?>',
				enableBtn:    '<?php echo esc_js( __( 'Yes, enable live chat', 'disco' ) ); ?>',
				errorSave:    '<?php echo esc_js( __( 'Could not save preference. Please try again.', 'disco' ) ); ?>',
				errorNetwork: '<?php echo esc_js( __( 'Network error. Please try again.', 'disco' ) ); ?>'
			};

			const bubble       = document.getElementById('disco-chat-bubble');
			const modalOverlay = document.getElementById('disco-chat-modal-overlay');
			const btnEnable    = document.getElementById('disco-chat-btn-enable');
			const btnCancel    = document.getElementById('disco-chat-btn-cancel');
			const errorEl      = document.getElementById('disco-chat-error');

			function showError( msg ) {
				errorEl.textContent = msg;
				errorEl.style.display = 'block';
			}

			function hideError() {
				errorEl.style.display = 'none';
				errorEl.textContent   = '';
			}

			function hasHashRoute() {
				const hash = window.location.hash;
				return hash && hash !== '#' && hash !== '#/' && hash.length > 2;
			}

			function showBubble() {
				if ( currentPage === 'disco-create-discount' && hasHashRoute() ) {
					return;
				}
				bubble.style.display = 'flex';
			}

			function hideBubble() {
				bubble.style.display = 'none';
			}

			function openModal() {
				modalOverlay.classList.add('disco-modal-open');
			}

			function closeModal() {
				modalOverlay.classList.remove('disco-modal-open');
				hideError();
			}

			// Hash change: hide/show bubble on campaign list page
			function onHashChange() {
				if ( currentPage !== 'disco-create-discount' ) {
					return;
				}
				if ( hasHashRoute() ) {
					hideBubble();
					if ( consentGiven ) {
						LiveChatWidget.call('hide');
					}
				} else {
					if ( consentGiven ) {
						LiveChatWidget.call('hide');
					}
					showBubble();
				}
			}

			// Initialize LiveChat after consent (or on page load if already consented).
			// Bootstrap runs here — never in page source — so tracking.js only loads post-consent.
			function initLiveChat() {
				window.__lc                    = window.__lc || {};
				window.__lc.license            = 7156251;
				window.__lc.integration_name   = "manual_channels";
				window.__lc.product_name       = "livechat";
				window.__lc.asyncInit          = false;

				/* jshint ignore:start */
				(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice));
				/* jshint ignore:end */

				LiveChatWidget.on('ready', function() {
					LiveChatWidget.call('hide');
					showBubble();
				});

				LiveChatWidget.on('visibility_changed', function(data) {
					if ( data.visibility !== 'maximized' ) {
						LiveChatWidget.call('hide');
						showBubble();
					}
				});
			}

			// Bubble click
			bubble.addEventListener('click', function() {
				if ( ! consentGiven ) {
					hideBubble();
					openModal();
					return;
				}
				hideBubble();
				LiveChatWidget.call('maximize');
			});

			// Modal: Cancel
			btnCancel.addEventListener('click', function() {
				closeModal();
				showBubble();
			});

			// Modal: backdrop click
			modalOverlay.addEventListener('click', function(e) {
				if ( e.target === modalOverlay ) {
					closeModal();
					showBubble();
				}
			});

			// Modal: Enable — save consent via settings API then load LiveChat
			btnEnable.addEventListener('click', function() {
				hideError();
				btnEnable.disabled = true;
				btnEnable.textContent = i18n.enabling;

				const xhr = new XMLHttpRequest();
				xhr.open('PUT', settingsUrl, true);
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.setRequestHeader('X-WP-Nonce', restNonce);

				xhr.onload = function() {
					if ( xhr.status >= 200 && xhr.status < 300 ) {
						consentGiven = true;
						btnEnable.disabled = false;
						btnEnable.textContent = i18n.enableBtn;
						closeModal();
						initLiveChat();
						window.dispatchEvent( new CustomEvent( 'disco:livechat:changed', { detail: { enabled: true } } ) );
					} else {
						btnEnable.disabled = false;
						btnEnable.textContent = i18n.enableBtn;
						showError( i18n.errorSave );
					}
				};

				xhr.onerror = function() {
					btnEnable.disabled = false;
					btnEnable.textContent = i18n.enableBtn;
					showError( i18n.errorNetwork );
				};

				xhr.send(JSON.stringify({ live_chat_support: true }));
			});

			document.addEventListener('DOMContentLoaded', function() {
				setTimeout(function() {
					if ( currentPage === 'disco-create-discount' && hasHashRoute() ) {
						return;
					}

					if ( consentGiven ) {
						initLiveChat();
					} else {
						showBubble();
					}

					if ( currentPage === 'disco-create-discount' ) {
						window.addEventListener('hashchange', onHashChange);
						window.addEventListener('popstate', onHashChange);

						const _origPush    = history.pushState.bind( history );
						const _origReplace = history.replaceState.bind( history );
						history.pushState = function() {
							_origPush.apply( history, arguments );
							onHashChange();
						};
						history.replaceState = function() {
							_origReplace.apply( history, arguments );
							onHashChange();
						};
					}
				}, 1000);
			});

			// Sync with React toggle on the same page.
			window.addEventListener( 'disco:livechat:changed', function( e ) {
				const isEnabled = !! e.detail.enabled;

				if ( isEnabled && ! consentGiven ) {
					consentGiven = true;
					initLiveChat();
				} else if ( ! isEnabled && consentGiven ) {
					consentGiven = false;
					if ( typeof LiveChatWidget !== 'undefined' ) {
						LiveChatWidget.call('hide');
					}
					showBubble();
				}
			} );
		})();
	</script>
	<!-- /Disco Plugin: LiveChat Widget -->
	<?php
}

/**
 * Inject LiveChat only on allowed Disco plugin admin pages.
 */
function disco_livechat_admin() {
	if ( ! current_user_can( 'manage_options' ) && ! current_user_can( 'manage_woocommerce' ) ) {
		return;
	}

	$current_page = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : '';

	if ( ! in_array( $current_page, disco_livechat_allowed_pages(), true ) ) {
		return;
	}

	disco_livechat_script();
}

add_action( 'admin_footer', 'disco_livechat_admin' );
