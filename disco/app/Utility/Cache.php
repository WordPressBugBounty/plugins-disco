<?php
/**
 * Cache Utility
 *
 * @package    Disco
 * @subpackage App\Utility
 * @since      1.0.0
 * @category   Utility
 */

namespace Disco\App\Utility;

/**
 * Class Cache
 *
 * @package    Disco
 * @subpackage App\Utility
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Utility
 */
class Cache {

	const DISCO_CACHE_PREFIX = 'disco_';// phpcs:ignore

	/**
	 * Get Cached Data
	 * If cache not found then call callback function or method, cache the data and return data.
	 * If callback is not callable then return false.
	 *
	 * @param string     $key      Cache Name.
	 * @param array|null $callback Callback function or method.
	 * @param array      $args     Callback arguments.
	 * @return mixed|false  false if cache not found.
	 * @since 1.0.0
	 */
	public static function remember( $key, $callback = null, $args = array() ) {
		$key = self::sanitize_key( $key );

		$data = wp_cache_get( $key, DISCO_TEXTDOMAIN );

		if ( false === $data && $callback && is_callable( $callback ) ) {
			$data = call_user_func( $callback, ...$args );

			if ( ! is_wp_error( $data ) ) {
				wp_cache_set( $key, $data, DISCO_TEXTDOMAIN );
			}
		}

		return $data;
	}

	/**
	 * Set Cached Data
	 *
	 * @param string   $key        Cache name. Expected to not be SQL-escaped. Must be
	 *                             172 characters or fewer.
	 * @param mixed    $data       Data to cache.
	 * @param int|bool $expiration Optional. Time until expiration in seconds. Default 0 (no expiration).
	 * @return bool
	 */
	public static function set( $key, $data, $expiration = false ) {
		$key = self::sanitize_key( $key );

		self::forget( $key );

		if ( $expiration && ! is_numeric( $expiration ) ) {
			$expiration = PHP_INT_MAX;
		} elseif ( is_numeric( $expiration ) ) {
			$expiration = time() + $expiration;
		} else {
			$expiration = 0;
		}

		return wp_cache_set( $key, $data, DISCO_TEXTDOMAIN, $expiration );
	}

	/**
	 * Retrieve and subsequently delete a value from the object cache.
	 *
	 * @param string $key           The cache key.
	 * @param string $group         Optional. The cache group. Default is empty.
	 * @param mixed  $default_value Optional. The default value to return if the given key doesn't
	 *                              exist in the object cache. Default is null.
	 * @return mixed The cached value, when available, or $default.
	 */
	public static function forget( $key, $group = '', $default_value = null ) {
		$found  = false;
		$cached = wp_cache_get( $key, $group, false, $found );

		if ( false !== $found ) {
			wp_cache_delete( $key, $group );

			return $cached;
		}

		return $default_value;
	}

	/**
	 * Delete All Cached Data
	 *
	 * @return bool
	 */
	public static function flush() {
		$disco_keys = wp_cache_get( 'disco_cache_keys', DISCO_TEXTDOMAIN );

		if ( ! is_array( $disco_keys ) ) {
			return false;
		}

		foreach ( $disco_keys as $key ) {
			wp_cache_delete( $key, DISCO_TEXTDOMAIN );
		}

		return true;
	}

	/**
	 * Sanitize Cache Key
	 * Remove all non-alphanumeric characters.
	 *
	 * @param string $key Cache Name.
	 * @return string
	 */
	public static function sanitize_key( $key ) {
		if ( empty( $key ) ) {
			return self::DISCO_CACHE_PREFIX;
		}

		// Remove repeated cache prefix.
		$key = str_replace( self::DISCO_CACHE_PREFIX, '', $key );
		// Set cache prefix
		$key = self::DISCO_CACHE_PREFIX . $key;
		// Remove all non-alphanumeric characters.
		$key = sanitize_key( $key );

		// Cache disco keys to flush later.
		$disco_keys = wp_cache_get( 'disco_cache_keys', DISCO_TEXTDOMAIN );

		if ( false === $disco_keys ) {
			$disco_keys = array( $key );
		} elseif ( is_array( $disco_keys ) && ! in_array( $key, $disco_keys, true ) ) {
			$disco_keys[] = $key;
		}

		wp_cache_set( 'disco_cache_keys', $disco_keys, DISCO_TEXTDOMAIN );

		return $key;
	}

}
