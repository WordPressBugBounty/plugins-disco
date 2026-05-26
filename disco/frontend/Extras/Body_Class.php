<?php
/**
 * Disco
 *
 * @package   Disco
 * @author    Ohidul Islam <wahid0003@gmail.com>
 * @copyright 2022 WebAppick
 * @license   GPL 2.0+
 * @link      http://domain.tld
 */

namespace Disco\Frontend\Extras;

use Disco\Engine\Base;

/**
 * Add custom css class to <body>
 */
class Body_Class extends Base {

    /**
	 * Initialize the class.
	 *
	 * @return void|bool
	 */
	public function initialize() {
		parent::initialize();

		\add_filter( 'disco_body_class', array( self::class, 'add_d_class' ), 10, 1 );
	}

	/**
	 * Add class in the body on the frontend
	 *
	 * @param array $classes The array with all the classes of the page.
	 * @since 1.0.0
	 * @return array
	 */
	public static function add_d_class( array $classes ) {
		$classes[] = DISCO_TEXTDOMAIN;

		return $classes;
	}

}
