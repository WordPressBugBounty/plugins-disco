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

namespace Disco\Ajax;

use Disco\Engine\Base;

/**
 * AJAX as logged user
 */
class Ajax_Admin extends Base {

    /**
     * Initialize the class.
     *
     * @return void
     */
    public function initialize() {
        if ( ! \apply_filters( 'disco_d_ajax_admin_initialize', true ) ) {
            return;
        }

		// For logged user
		\add_action( 'wp_ajax_your_admin_method', array( $this, 'your_admin_method' ) );
	}

	/**
	 * The method to run on ajax
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function your_admin_method() {
		$return = array(
			'message' => 'Saved',
			'ID'      => 2,
		);

		$this->clean_buffer();
		\wp_send_json_success( $return );
	}

}
