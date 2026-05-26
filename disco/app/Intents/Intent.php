<?php
/**
 * Intent Class File.
 *
 * @package    Disco
 * @subpackage \App\Intents\Intent.php
 * @since      1.0.0
 */

namespace Disco\App\Intents;

/**
 * Class Intent
 *
 * @package    Disco
 * @subpackage \App\Intent
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Intention
 */
abstract class Intent {

	use \Disco\App\Intents\IntentHelper;

	/**
	 * @var \Disco\App\Utility\Config $campaign Campaign Config.
	 */
	public $campaign;

	/**
	 * @var \Disco\App\Utility\Settings|array $settings Global Settings.
	 */
	protected $settings;

	/**
	 * Apply intention.
	 *
	 * @param array                $items Discount Applicable Cart Items.
	 * @param \WC_Cart|\WC_Product $cart  Cart or Product Object.
	 * @return mixed
	 */
	abstract public function get_discounts( $items, $cart );

	/**
	 * Apply intention.
	 *
	 * @param array                $items Discount Applicable Cart Items.
	 * @param \WC_Cart|\WC_Product $cart  Cart or Product Object.
	 * @return mixed
	 */
	abstract public function get_offers( $items, $cart );

	/**
	 * Intent constructor.
	 *
	 * @param \Disco\App\Utility\Config         $campaign Campaign Config.
	 * @param \Disco\App\Utility\Settings|array $settings Global Settings.
	 */
	public function __construct( $campaign, $settings ) {
		$this->campaign = $campaign;
		$this->settings = $settings;
	}

}
