<?php // phpcs:disable
/**
 * Disco
 *
 * @package   Disco
 */

namespace Disco\Engine;

/**
 * Prevents PHP debug notices/warnings from corrupting REST and AJAX JSON responses.
 *
 * When WP_DEBUG and WP_DEBUG_DISPLAY are both true, notices from plugins (e.g.
 * early textdomain loading) are printed before the JSON body, breaking JSON
 * parsing in the browser.  We start an output buffer before plugins_loaded fires
 * so all stray output is captured, then discard it cleanly before the response
 * is sent.  AJAX handlers call clean() manually before wp_send_json_*.
 */
class OutputBuffer {

	/**
	 * Start output buffering for REST/AJAX requests.
	 * Call this immediately after the Composer autoload is required in disco.php.
	 */
	public static function start(): void {
		define( 'DISCO_OB_LEVEL', ob_get_level() ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound

		if ( ! self::is_api_request() ) {
			return;
		}

		ob_start();

		// Suppress error display for API requests so notices do not corrupt JSON.
		// Errors continue to be written to debug.log when WP_DEBUG_LOG is enabled.
		@ini_set( 'display_errors', '0' ); // phpcs:ignore WordPress.PHP.IniSet.display_errors_Disallowed

		if ( self::is_rest_request() ) {
			add_filter( 'rest_pre_serve_request', array( __CLASS__, 'handle_rest' ), 1, 4 );
		}
	}

	/**
	 * Hooked on rest_pre_serve_request at priority 1.
	 *
	 * Strategy:
	 *   Level N   = whatever PHP had before disco.php loaded (DISCO_OB_LEVEL)
	 *   Level N+1 = our buffer, containing stray debug notices
	 *   Level N+2 = WordPress's dispatch buffer (if WP uses ob_start in serve_request)
	 *
	 * We pop WP's dispatch buffer, discard our stray-output buffer, open a fresh
	 * buffer, and return false so WP echoes the JSON body into the clean buffer.
	 * WP's ob_get_clean() then collects only the actual JSON response.
	 *
	 * @param  bool             $served  Whether the request has already been served.
	 * @param  \WP_REST_Response $result  The response object.
	 * @param  \WP_REST_Request  $request The current REST request.
	 * @param  \WP_REST_Server   $server  The REST server instance.
	 * @return bool
	 */
	public static function handle_rest( $served, $result, $request, $server ): bool {
		if ( $served ) {
			return $served;
		}

		$initial_level = DISCO_OB_LEVEL;

		// Pop WP's dispatch buffer (level N+2) if it exists, preserving its content.
		$wp_dispatch = ob_get_level() > ( $initial_level + 1 ) ? (string) ob_get_clean() : '';

		// Discard our stray-notices buffer (level N+1).
		if ( ob_get_level() > $initial_level ) {
			ob_end_clean();
		}

		// Open a fresh, clean buffer at the level WP expects for its ob_get_clean().
		ob_start();

		// Restore any output WP produced during dispatch (almost always empty).
		if ( '' !== $wp_dispatch ) {
			echo $wp_dispatch; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		return false; // Let WP echo the JSON body and collect it via ob_get_clean().
	}

	/**
	 * Discard all output buffered above DISCO_OB_LEVEL.
	 * Call this in AJAX handlers before wp_send_json_* to strip stray debug output.
	 */
	public static function clean(): void {
		if ( ! defined( 'DISCO_OB_LEVEL' ) ) {
			return;
		}
		while ( ob_get_level() > DISCO_OB_LEVEL ) {
			ob_end_clean();
		}
	}

	private static function is_api_request(): bool {
		return self::is_ajax_request() || self::is_rest_request();
	}

	private static function is_ajax_request(): bool {
		return defined( 'DOING_AJAX' ) && DOING_AJAX;
	}

	private static function is_rest_request(): bool {
		if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return true;
		}

		if ( empty( $_SERVER['REQUEST_URI'] ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
			return false;
		}

		// REST_REQUEST is not defined yet at plugin-file load time, so we inspect
		// the URI directly.  rest_get_url_prefix() respects custom REST base slugs.
		$request_uri = wp_unslash( $_SERVER['REQUEST_URI'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$rest_prefix = function_exists( 'rest_get_url_prefix' ) ? rest_get_url_prefix() : 'wp-json';

		return false !== strpos( $request_uri, '/' . $rest_prefix . '/' );
	}
}
