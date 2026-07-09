<?php //phpcs:ignore

/**
 * Analytics API — Orchestrator
 *
 * @package    Disco
 * @subpackage \Rest
 * @since      1.1.13
 * @category   Rest
 */

namespace Disco\Rest;

use Disco\Rest\Analytics\CampaignsApi;
use Disco\Rest\Analytics\CustomersApi;
use Disco\Rest\Analytics\IntentApi;
use Disco\Rest\Analytics\OrdersApi;
use Disco\Rest\Analytics\ProductsApi;
use Disco\Rest\Analytics\RevenueChartApi;
use Disco\Rest\Analytics\SummaryApi;
use WP_REST_Controller;

/**
 * Class AnalyticsApi
 *
 * Thin orchestrator that delegates route registration to focused sub-controllers
 * under the Disco\Rest\Analytics namespace.
 *
 * Routes registered (via sub-controllers):
 *
 * - GET /disco/v1/analytics/intents-performance         — Intent-wise performance (no comparison).
 * - GET /disco/v1/analytics/revenue-chart                — Time-bucketed revenue data.
 * - GET /disco/v1/analytics/summary                     — Top-level KPI summary.
 * - GET /disco/v1/analytics/campaigns                   — Paginated campaign list.
 * - GET /disco/v1/analytics/campaigns/{id}              — Single campaign KPIs + chart.
 * - GET /disco/v1/analytics/products                    — Paginated products sold via campaigns.
 * - GET /disco/v1/analytics/products/{id}               — Single product detail.
 * - GET /disco/v1/analytics/orders                      — Paginated campaign-linked orders.
 * - GET /disco/v1/analytics/orders/{id}                 — Single order with full line items.
 * - GET /disco/v1/analytics/customers                   — Paginated customers who bought via campaigns.
 * - GET /disco/v1/analytics/customers/{id}              — Single customer detail.
 *
 * @package    Disco
 * @subpackage \Rest
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Rest
 */
class AnalyticsApi extends WP_REST_Controller { //phpcs:ignore

	/**
	 * The route base name for analytics endpoints.
	 *
	 * @since 1.1.13
	 */
	public const ROUTE_NAME = 'analytics';

	/**
	 * AnalyticsApi constructor.
	 *
	 * Sets the namespace and rest base for all analytics routes.
	 */
	public function __construct() {
		$this->namespace = Api::NAMESPACE_NAME . '/' . Api::VERSION;
		$this->rest_base = self::ROUTE_NAME;
	}

	/**
	 * Delegates route registration to each analytics sub-controller.
	 *
	 * @return void
	 */
	public function register_routes() { //phpcs:ignore
		( new IntentApi )->register_routes();
		( new RevenueChartApi )->register_routes();
		( new SummaryApi )->register_routes();
		( new CampaignsApi )->register_routes();
		( new ProductsApi )->register_routes();
		( new OrdersApi )->register_routes();
		( new CustomersApi )->register_routes();
	}

}
