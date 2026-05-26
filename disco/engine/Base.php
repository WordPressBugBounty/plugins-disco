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

namespace Disco\Engine;

/**
 * Base skeleton of the plugin
 */
class Base {

    /**
     * @var array The settings of the plugin.
     */
    public $settings = array();

    /**
	 * Initialize the class and get the plugin settings
	 *
	 * @return bool
	 */
	public function initialize() {
		return true;
	}

	/**
	 * Discard any output buffered above DISCO_OB_LEVEL so that debug notices
	 * from other plugins do not prefix the JSON body sent by wp_send_json_*.
	 */
	protected function clean_buffer(): void {
		OutputBuffer::clean();
	}

}
