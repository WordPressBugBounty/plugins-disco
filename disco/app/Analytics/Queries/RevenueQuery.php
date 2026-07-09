<?php

/**
 * RevenueQuery — time-series revenue query for the /analytics/revenue endpoint.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Queries
 * @since      1.3.23
 */

namespace Disco\App\Analytics\Queries;

/**
 * Single query that returns net_sales and discount_sales per time bucket.
 *
 * Supports three intervals: day, week, month.
 * All data is scoped to wc-completed orders only.
 */
class RevenueQuery extends BaseQuery {

	/**
	 * WooCommerce status value for completed orders.
	 */
	private const STATUS_COMPLETED = 'wc-completed';

	/**
	 * Returns time-bucketed revenue rows for the given period and interval.
	 *
	 * Every bucket in the range is always present; buckets with no orders get 0 values.
	 *
	 * net_sales      = SUM(order_stats.net_total) for ALL completed shop orders.
	 * discount_sales = SUM(total_amount - shipping_total) for completed orders that have a disco_campaign meta.
	 *
	 * Both bases mirror the summary KPI cards (SummaryQuery) so the graph totals
	 * reconcile to the headline net_sales / discount_sales figures.
	 *
	 * The date column always returns a Y-m-d value:
	 *   day   → the exact date
	 *   week  → Monday of the week
	 *   month → first day of the month (e.g. 2024-04-01)
	 *
	 * @param array  $period   { from: string Y-m-d, to: string Y-m-d }.
	 * @param string $interval 'day' | 'week' | 'month'.
	 * @return array Array of { date, net_sales, discount_sales, total_orders, discount_orders }
	 */
	public function get_revenue_series( array $period, string $interval ): array {
		$totals  = $this->fetch_total_rows( $period, $interval );
		$disco   = $this->fetch_disco_rows( $period, $interval );
		$indexed = $this->index_rows_by_date( $totals, $disco );

		return $this->fill_series( $indexed, $period, $interval );
	}

	/**
	 * Fetches per-bucket totals for ALL completed shop orders (no campaign filter).
	 *
	 * @param array  $period   { from: string Y-m-d, to: string Y-m-d }.
	 * @param string $interval 'day' | 'week' | 'month'.
	 * @return array Row objects: date, total_orders, net_sales.
	 */
	private function fetch_total_rows( array $period, string $interval ): array {
		global $wpdb;

		$tables    = $this->get_tables();
		$clauses   = $this->get_order_clauses( $tables );
		$date_col  = $clauses['date_col'];
		$date_expr = $this->get_date_group_expr( $interval, $date_col );

		$rows_sql = "SELECT
				{$date_expr}                            AS date,
				COUNT(o.ID)                             AS total_orders,
				COALESCE(SUM(order_stats.net_total), 0) AS net_sales
			FROM {$tables['orders']} o
			LEFT JOIN {$wpdb->prefix}wc_order_stats order_stats ON order_stats.order_id = o.ID
			WHERE {$clauses['status_where']}
			  AND o.status = %s
			  AND {$date_col} BETWEEN %s AND %s
			GROUP BY {$date_expr}
			ORDER BY date ASC";

		return $this->run_rows(
			$rows_sql,
			array( self::STATUS_COMPLETED, $period['from'] . ' 00:00:00', $period['to'] . ' 23:59:59' )
		);
	}

	/**
	 * Fetches per-bucket totals for completed disco-campaign orders only.
	 *
	 * The dedup condition guarantees one disco_campaign meta row per order, so
	 * the SUM cannot be inflated by duplicate meta rows — this replaces the
	 * DISTINCT derived-table JOIN the old single query needed.
	 *
	 * @param array  $period   { from: string Y-m-d, to: string Y-m-d }.
	 * @param string $interval 'day' | 'week' | 'month'.
	 * @return array Row objects: date, discount_orders, discount_sales.
	 */
	private function fetch_disco_rows( array $period, string $interval ): array {
		global $wpdb;

		$tables       = $this->get_tables();
		$clauses      = $this->get_order_clauses( $tables );
		$order_id_col = $tables['order_id_col'];
		$date_col     = $clauses['date_col'];
		$date_expr    = $this->get_date_group_expr( $interval, $date_col );
		$dedup        = $this->get_campaign_dedup_condition( $tables );

		$rows_sql = "SELECT
				{$date_expr}                               AS date,
				COUNT(DISTINCT order_meta.{$order_id_col}) AS discount_orders,
				SUM(o.total_amount - COALESCE(order_stats.shipping_total, 0)) AS discount_sales
			FROM {$tables['order_meta']} order_meta
			JOIN {$tables['orders']} o ON o.ID = order_meta.{$order_id_col} AND {$clauses['status_where']}
			LEFT JOIN {$wpdb->prefix}wc_order_stats order_stats ON order_stats.order_id = order_meta.{$order_id_col}
			WHERE order_meta.meta_key = %s
			  AND o.status = %s
			  AND {$date_col} BETWEEN %s AND %s
			  AND {$dedup}
			GROUP BY {$date_expr}
			ORDER BY date ASC";

		return $this->run_rows(
			$rows_sql,
			array( 'disco_campaign', self::STATUS_COMPLETED, $period['from'] . ' 00:00:00', $period['to'] . ' 23:59:59' )
		);
	}

	/**
	 * Merges total and disco rows into one map keyed by bucket date.
	 *
	 * Also normalizes types: sales rounded to 2 decimals, counts cast to int.
	 *
	 * @param array $totals Site-wide rows from fetch_total_rows().
	 * @param array $disco  Disco-only rows from fetch_disco_rows().
	 * @return array Map of date => normalized row array.
	 */
	private function index_rows_by_date( array $totals, array $disco ): array {
		$indexed = array();

		foreach ( $totals as $row ) {
			$indexed[ $row->date ] = array(
				'date'            => $row->date,
				'net_sales'       => round( (float) ( $row->net_sales ?? 0 ), 2 ),
				'discount_sales'  => 0.0,
				'total_orders'    => (int) ( $row->total_orders ?? 0 ),
				'discount_orders' => 0,
			);
		}

		foreach ( $disco as $row ) {
			if ( ! isset( $indexed[ $row->date ] ) ) {
				continue;
			}

			$indexed[ $row->date ]['discount_sales']  = round( (float) ( $row->discount_sales ?? 0 ), 2 );
			$indexed[ $row->date ]['discount_orders'] = (int) ( $row->discount_orders ?? 0 );
		}

		return $indexed;
	}

	/**
	 * Generates every bucket in the period and fills any missing ones with zeros.
	 *
	 * @param array  $indexed  DB rows indexed by their date string.
	 * @param array  $period   { from: string Y-m-d, to: string Y-m-d }.
	 * @param string $interval 'day' | 'week' | 'month'.
	 */
	private function fill_series( array $indexed, array $period, string $interval ): array {
		$empty   = array( 'net_sales' => 0.0, 'discount_sales' => 0.0, 'total_orders' => 0, 'discount_orders' => 0 );
		$result  = array();
		$current = $this->bucket_start( $period['from'], $interval );
		$end     = strtotime( $period['to'] . ' 23:59:59' );

		while ( $current <= $end ) {
			$key      = gmdate( 'Y-m-d', $current );
			$result[] = $indexed[ $key ] ?? array_merge( array( 'date' => $key ), $empty );
			$current  = $this->next_bucket( $current, $interval );
		}

		return $result;
	}

	/**
	 * Returns the Unix timestamp for the start of the bucket that contains $date.
	 *
	 * @param string $date     Y-m-d.
	 * @param string $interval 'day' | 'week' | 'month'.
	 */
	private function bucket_start( string $date, string $interval ): int {
		$ts = strtotime( $date . ' 00:00:00' );

		if ( false === $ts ) {
			return 0;
		}

		if ( 'month' === $interval ) {
			return mktime( 0, 0, 0, (int) gmdate( 'n', $ts ), 1, (int) gmdate( 'Y', $ts ) );
		}

		if ( 'week' === $interval ) {
			// ISO weekday: 1 = Monday … 7 = Sunday. Rewind to Monday.
			$dow = (int) gmdate( 'N', $ts );

			return $ts - ( $dow - 1 ) * DAY_IN_SECONDS;
		}

		return $ts;
	}

	/**
	 * Advances a bucket timestamp by one interval unit.
	 *
	 * @param int    $ts       Current bucket start timestamp.
	 * @param string $interval 'day' | 'week' | 'month'.
	 */
	private function next_bucket( int $ts, string $interval ): int {
		if ( 'month' === $interval ) {
			return mktime( 0, 0, 0, (int) gmdate( 'n', $ts ) + 1, 1, (int) gmdate( 'Y', $ts ) );
		}

		if ( 'week' === $interval ) {
			return $ts + 7 * DAY_IN_SECONDS;
		}

		return $ts + DAY_IN_SECONDS;
	}

	/**
	 * Returns the SQL date-grouping expression for the given interval.
	 *
	 * All expressions return a Y-m-d string so the `date` column is uniform
	 * regardless of the chosen interval.
	 *
	 * @param string $interval 'day' | 'week' | 'month'.
	 * @param string $date_col Fully-qualified column reference.
	 */
	private function get_date_group_expr( string $interval, string $date_col ): string {
		switch ( $interval ) {
			case 'month':
				// %% so the literal % survives $wpdb->prepare() in run_rows().
				return "DATE_FORMAT({$date_col}, '%%Y-%%m-01')";

			case 'week':
				// Monday of the ISO week containing each order.
				return "DATE(DATE_SUB({$date_col}, INTERVAL WEEKDAY({$date_col}) DAY))";

			default: // day
				return "DATE({$date_col})";
		}
	}

}
