<?php
/**
 * Log.php
 *
 * @package    CTXFeed
 * @subpackage Disco\App\Utility
 */

namespace Disco\App\Utility;

use WC_Logger;

/**
 * Class Log
 *
 * @package    CTXFeed
 * @subpackage Disco\App\Utility
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   MyCategory
 */
class Log {

	/**
	 * Write log to WooCommerce log file.
	 *
	 * @param string $message Message to write to log.
	 * @param string $type    Type of log.
	 * @return void
	 */
	public static function write( $message, $type = 'info' ) {
		if ( ! class_exists( 'WC_Logger' ) ) {
			return;
		}

		$handle = DISCO_TEXTDOMAIN;
		$log    = new WC_Logger( array( $handle ) );

		if ( $type === 'error' ) {
			$log->error( $message );
		} elseif ( $type === 'warning' ) {
			$log->warning( $message );
		} elseif ( $type === 'info' ) {
			$log->info( $message );
		} else {
			$log->add( $handle, $message );
		}
	}

}
