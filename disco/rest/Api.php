<?php
/**
 * Api.php
 *
 * @package    Disco/Rest
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   API
 */

namespace Disco\Rest;

/**
 * Class Api
 *
 * This class is responsible for initializing and registering all the REST API routes for the Disco plugin.
 */
class Api {

	/**
	 * The namespace for the REST API routes.
	 */
	public const NAMESPACE_NAME = 'disco';

	/**
	 * The version of the REST API.
	 */
	public const VERSION = 'v1';

	/**
	 * The name of the route for dropdown related requests.
	 */
	public const DROPDOWN_ROUTE_NAME = 'dropdown';

	/**
	 * The name of the route for search related requests.
	 */
	public const SEARCH_ROUTE_NAME = 'search';

	/**
	 * The name of the route for campaign related requests.
	 */
	public const CAMPAIGN_ROUTE_NAME = 'campaigns';

	/**
	 * The name of the route for settings related requests.
	 */
	public const SETTINGS_ROUTE_NAME = 'settings';

	/**
	 * Constructor for the Api class.
	 *
	 * Adds the 'rest_api_init' action hook which calls the 'register_rest_api' method when the REST API is initialized.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_rest_api' ) );
	}

	/**
	 * Method to register all the REST API routes for the Disco plugin.
	 *
	 * This method creates instances of the CampaignApi, SearchApi, DropDownApi, and SettingsApi classes, and calls
	 * their respective 'register_routes' methods.
	 *
	 * @return void
	 */
	public function register_rest_api() {
		$campaign = new CampaignApi;
		$campaign->register_routes();

		$search = new SearchApi;
		$search->register_routes();

		$dropdown = new DropDownApi;
		$dropdown->register_routes();

		$settings = new SettingsApi;
		$settings->register_routes();

		$image_upload = new ImageUploadApi;
		$image_upload->register_routes();
	}

}
