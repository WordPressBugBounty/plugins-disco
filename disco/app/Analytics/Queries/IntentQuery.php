<?php

/**
 * IntentQuery — intent-wise sales aggregation for the /analytics/intents endpoint.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Queries
 * @since      1.3.23
 */

namespace Disco\App\Analytics\Queries;

/**
 * Groups completed disco orders by campaign intent and returns sales + order counts.
 *
 * Campaigns with no matching record in disco_campaigns (deleted) are folded
 * into the "Others" bucket.  Multiple campaigns sharing the same intent are
 * combined automatically by the GROUP BY.
 */
class IntentQuery extends BaseQuery {

	/**
	 * WooCommerce status value for completed orders.
	 */
	private const STATUS_COMPLETED = 'wc-completed';

	/**
	 * Returns per-intent sales and order counts for completed disco orders in a period.
	 *
	 * Rows are ordered by sales DESC so the controller can assign percentages
	 * without re-sorting.
	 *
	 * @param array $period { from: string Y-m-d, to: string Y-m-d }.
	 * @return array Array of { intent: string, orders: int, sales: float }
	 */
	public function get_intent_sales( array $period ): array {
		$rows = $this->fetch_intent_rows( $period );

		return array_map(
			function ( $row ) {
				return array(
					'intent'  => $row->intent,
					'orders'  => (int) $row->orders,
					'revenue' => round( (float) $row->revenue, 2 ),
				);
			},
			$rows
		);
	}

	/**
	 * Fetches per-intent aggregate rows, deleted campaigns folded into 'Others'.
	 *
	 * @param array $period { from: string Y-m-d, to: string Y-m-d } — empty values skip date filter.
	 * @return array Row objects: intent, orders, revenue.
	 */
	private function fetch_intent_rows( array $period ): array {
		global $wpdb;

		$tables       = $this->get_tables();
		$clauses      = $this->get_order_clauses( $tables );
		$order_id_col = $tables['order_id_col'];
		$date_filter  = $this->build_date_filter( $period, $clauses );
		$dedup        = $this->get_campaign_dedup_condition( $tables );

		$rows_sql = "SELECT
				CASE
					WHEN campaign.id IS NULL THEN 'Others'
					ELSE COALESCE(campaign.intent, 'Others')
				END                                                                    AS intent,
				COUNT(DISTINCT order_meta.{$order_id_col})                             AS orders,
				SUM({$clauses['total_expr']} - COALESCE(order_stats.shipping_total, 0)) AS revenue
			FROM      {$tables['order_meta']}         order_meta
			JOIN      {$tables['orders']}             o           ON o.ID              = order_meta.{$order_id_col} AND {$clauses['status_where']}
			{$clauses['total_join']}
			LEFT JOIN {$wpdb->prefix}wc_order_stats   order_stats ON order_stats.order_id = order_meta.{$order_id_col}
			LEFT JOIN {$tables['campaigns']}          campaign    ON campaign.id          = CAST(order_meta.meta_value AS UNSIGNED)
			WHERE order_meta.meta_key = 'disco_campaign'
			  AND o.status = %s
			  AND {$dedup}
			  {$date_filter['clause']}
			GROUP BY intent
			ORDER BY revenue DESC";

		return $this->run_rows( $rows_sql, array_merge( array( self::STATUS_COMPLETED ), $date_filter['params'] ) );
	}

	/**
	 * Builds the optional BETWEEN date clause and its params.
	 *
	 * Both period bounds must be present; otherwise the filter is skipped.
	 *
	 * @param array $period  { from: string Y-m-d, to: string Y-m-d }.
	 * @param array $clauses From get_order_clauses().
	 * @return array { clause: string, params: array }
	 */
	private function build_date_filter( array $period, array $clauses ): array {
		if ( empty( $period['from'] ) || empty( $period['to'] ) ) {
			return array(
				'clause' => '',
				'params' => array(),
			);
		}

		return array(
			'clause' => "AND {$clauses['date_col']} BETWEEN %s AND %s",
			'params' => array( $period['from'] . ' 00:00:00', $period['to'] . ' 23:59:59' ),
		);
	}

}
