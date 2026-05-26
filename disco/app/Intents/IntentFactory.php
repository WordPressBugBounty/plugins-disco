<?php
/**
 * Disco Class File.
 *
 * @package    Disco
 * @subpackage Disco\App\Attributes
 * @category   MyCategory
 */

namespace Disco\App\Intents;

/**
 * Class IntentFactory
 *
 * @package    Disco
 * @subpackage Disco\App\Intents
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   MyCategory
 */
class IntentFactory {

	/**
	 * This method will return the intent object
	 *
	 * @param \Disco\App\Utility\Config $campaign Campaign Config.
	 * @param array|string|\WP_Error    $settings Global Settings.
	 * @return bool|object
	 */
	public static function get_intent( $campaign, $settings ) {
		$class = '\Disco\App\Intents\\' . $campaign->get_discount_intent() . 'Intent';

		if ( ! class_exists( $class ) ) {
			return false;
		}

		return new $class( $campaign, $settings );
	}

}
