<?php // phpcs:disable
/**
 * Disco
 *
 * @package   Disco
 */

namespace Disco\Engine;

/**
 * Prevents stray output from corrupting REST and AJAX JSON responses.
 *
 * Other plugins frequently emit output during an API request: PHP notices
 * (e.g. "Function _load_textdomain_just_in_time was called incorrectly"),
 * deprecation warnings, or plain `echo` calls inside `shutdown`/`rest_post_dispatch`.
 * Anything printed before the JSON body, and anything printed after it, makes the
 * response unparseable in the browser.
 *
 * Strategy:
 *  1. Open an output buffer before `plugins_loaded` so nothing reaches the client early.
 *  2. For our own REST routes, render and send the JSON body ourselves, discarding
 *     everything buffered up to that point.
 *  3. Immediately after the body is flushed, open a buffer that discards everything,
 *     so late output (shutdown hooks, destructors, deprecations) is never appended.
 *
 * AJAX handlers call clean() before wp_send_json_* for step 2, and the
 * `wp_die_ajax_handler` filter performs step 3.
 */
class OutputBuffer {

	/**
	 * REST route prefix owned by this plugin.
	 */
	private const ROUTE_PREFIX = '/disco/';

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

		if ( self::is_ajax_request() ) {
			// Runs after wp_send_json_* has echoed its body, before the script dies.
			add_filter( 'wp_die_ajax_handler', array( __CLASS__, 'handle_ajax_die' ), PHP_INT_MAX );
		}
	}

	/**
	 * Hooked on rest_pre_serve_request at priority 1.
	 *
	 * For Disco routes we take over serving: discard whatever stray output was
	 * buffered, echo the JSON body, flush it, and then swallow any later output.
	 * For third-party routes we only drop the stray output we captured and let
	 * WordPress serve the response as usual.
	 *
	 * @param  bool              $served  Whether the request has already been served.
	 * @param  \WP_HTTP_Response $result  The response object.
	 * @param  \WP_REST_Request  $request The current REST request.
	 * @param  \WP_REST_Server   $server  The REST server instance.
	 * @return bool
	 */
	public static function handle_rest( $served, $result, $request, $server ): bool {
		if ( $served ) {
			return true;
		}

		// Drop everything buffered so far (notices printed while WP booted/dispatched).
		self::clean();

		if ( ! $result instanceof \WP_HTTP_Response
			|| ! $request instanceof \WP_REST_Request
			|| ! $server instanceof \WP_REST_Server
			|| ! self::is_disco_route( $request )
			|| null !== $request->get_param( '_jsonp' ) ) {
			return false; // Let WordPress echo the body itself.
		}

		if ( 'HEAD' === $request->get_method() ) {
			self::seal();

			return true;
		}

		$embed = isset( $_GET['_embed'] ) ? rest_parse_embed_param( wp_unslash( $_GET['_embed'] ) ) : false; // phpcs:ignore WordPress.Security
		$data  = $server->response_to_data( $result, $embed );

		/** This filter is documented in wp-includes/rest-api/class-wp-rest-server.php */
		$data = apply_filters( 'rest_pre_echo_response', $data, $server, $request );

		// Filters above may have printed something; drop it before we emit the body.
		self::clean();

		if ( null === $data || 204 === $result->get_status() ) {
			self::seal();

			return true;
		}

		$options = ( defined( 'WP_DEBUG' ) && WP_DEBUG && $request->has_param( '_pretty' ) ) ? JSON_PRETTY_PRINT : 0;
		$json    = wp_json_encode( $data, $options );

		if ( false === $json ) {
			$json = (string) wp_json_encode(
				array(
					'code'    => 'rest_encode_error',
					'message' => json_last_error_msg(),
					'data'    => array( 'status' => 500 ),
				)
			);
		}

		echo $json; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		self::seal();

		return true;
	}

	/**
	 * Hooked on wp_die_ajax_handler, which fires after wp_send_json_* echoed its body.
	 * Seals the output so late plugin output cannot be appended to the JSON.
	 *
	 * @param  callable $handler The wp_die handler.
	 * @return callable
	 */
	public static function handle_ajax_die( $handler ) {
		self::seal();

		return $handler;
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

	/**
	 * Push the response we already echoed to the client, then open a buffer that
	 * throws away everything written afterwards (shutdown hooks, deprecations,
	 * destructors), so nothing can be appended to the JSON body.
	 */
	private static function seal(): void {
		while ( defined( 'DISCO_OB_LEVEL' ) && ob_get_level() > DISCO_OB_LEVEL ) {
			ob_end_flush();
		}

		flush();

		ob_start(
			static function () {
				return '';
			}
		);
	}

	private static function is_disco_route( \WP_REST_Request $request ): bool {
		return 0 === strpos( (string) $request->get_route(), self::ROUTE_PREFIX );
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
