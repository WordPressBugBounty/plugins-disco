<?php //phpcs:ignore

/**
 * OrderService — composes order queries into service-level results.
 *
 * @package    Disco
 * @subpackage Disco\App\Analytics\Services
 * @since      1.3.37
 */

namespace Disco\App\Analytics\Services;

use Disco\App\Analytics\Queries\OrderQuery;

/**
 * Provides order analytics at the service layer.
 *
 * Used by the REST controller for the orders and single-order endpoints.
 * No SQL lives here — all DB work is delegated to OrderQuery.
 */
class OrderService extends BaseService {

	/**
	 * Returns a paginated, lightweight order list for the admin table.
	 *
	 * Only completed orders with at least one disco_campaign meta are included.
	 * Fixed sort: revenue (order_total) ASC.
	 *
	 * @param array $args date_from, date_to, campaign_id, customer_id, page, limit.
	 * @return array { current_period: array, pagination: array, data: array }
	 */
	public static function get_orders_table( array $args ): array {
		$limit = min( absint( $args['limit'] ?? 10 ), 100 );
		$page  = max( 1, absint( $args['page'] ?? 1 ) );

		$date_to   = $args['date_to'] ?? '';
		$date_from = $args['date_from'] ?? '';

		$query  = new OrderQuery;
		$result = $query->get_order_list( self::build_table_query_args( $args, $limit, $page ) );

		$data = array();

		foreach ( $result['rows'] as $row ) {
			$data[] = self::format_order_row( $row, $query );
		}

		return array(
			'current_period' => array(
				'from' => $date_from,
				'to'   => $date_to,
			),
			'compare_period' => self::resolve_compare_period( $date_from, $date_to ),
			'pagination'     => self::build_pagination( $result, $page, $limit ),
			'data'           => $data,
		);
	}

	/**
	 * Returns a single order with full line items.
	 *
	 * @param int $order_id WooCommerce order ID.
	 * @return array|\WP_Error
	 */
	public static function get_order( int $order_id ) {
		$query = new OrderQuery;
		$row   = $query->get_order( $order_id );
		/** @var object{order_id: int, order_date: string, order_status: string, customer_id: int, customer_name: string, customer_email: string, order_total: string, discount_amount: string} $row */

		if ( ! $row ) {
			return new \WP_Error(
				'disco_not_found',
				__( 'Order not found.', 'disco' ),
				array( 'status' => 404 )
			);
		}

		return array(
			'id'              => (int) $row->order_id,
			'order_date'      => $row->order_date,
			'order_status'    => $row->order_status,
			'customer_id'     => (int) $row->customer_id,
			'customer_name'   => $row->customer_name ?? '',
			'customer_email'  => $row->customer_email ?? '',
			'campaigns'       => $query->get_campaigns_for_order( $order_id ),
			'order_total'     => round( (float) $row->order_total, 2 ),
			'discount_amount' => round( (float) $row->discount_amount, 2 ),
			'products'        => self::format_line_items( $query->get_line_items( $order_id ) ),
		);
	}

	/**
	 * Maps service-level $args onto the argument array OrderQuery expects.
	 *
	 * Whitelists orderby, normalizes sort direction, casts filter IDs.
	 *
	 * @param array $args  Raw service args.
	 * @param int   $limit Sanitized per-page limit.
	 * @param int   $page  Sanitized page number.
	 * @return array Query args for OrderQuery::get_order_list().
	 */
	private static function build_table_query_args( array $args, int $limit, int $page ): array {
		$orderby_map = array(
			'revenue'  => 'order_total',
			'date'     => 'order_date',
			'quantity' => 'quantity',
		);
		$orderby     = $orderby_map[ $args['orderby'] ?? 'revenue' ] ?? 'order_total';
		$order       = 'desc';

		if ( strtolower( $args['order'] ?? 'desc' ) === 'asc' ) {
			$order = 'asc';
		}

		return array(
			'date_from'   => $args['date_from'] ?? '',
			'date_to'     => $args['date_to'] ?? '',
			'search'      => $args['search'] ?? '',
			'campaign_id' => ! empty( $args['campaign_id'] ) ? (int) $args['campaign_id'] : 0,
			'customer_id' => ! empty( $args['customer_id'] ) ? (int) $args['customer_id'] : 0,
			'orderby'     => $orderby,
			'order'       => $order,
			'per_page'    => $limit,
			'page'        => $page,
			'status'      => 'wc-completed',
		);
	}

	/**
	 * Formats one raw order row into the API response shape.
	 *
	 * Resolves campaigns as { id, name, intent } ('Unknown' for deleted) and
	 * line items as { id, name, quantity }.
	 *
	 * @param object                                  $row   Raw row from OrderQuery::get_order_list().
	 * @param \Disco\App\Analytics\Queries\OrderQuery $query Query instance for campaign/line-item lookups.
	 * @return array Formatted order row.
	 * @phpstan-param object{order_id: int|string, order_date: string|null, customer_id: int|string, customer_name: string|null, customer_email: string|null, order_total: string|null} $row
	 */
	private static function format_order_row( object $row, OrderQuery $query ): array {
		$order_id = (int) $row->order_id;

		$campaigns = array_map(
			function ( $campaign ) {
				return array(
					'id'     => $campaign['campaign_id'],
					'name'   => $campaign['campaign_name'],
					'intent' => $campaign['campaign_intent'],
				);
			},
			$query->get_campaigns_for_order( $order_id )
		);

		$products = array_map(
			function ( $item ) {
				return array(
					'id'       => (int) $item->product_id,
					'name'     => $item->product_name ?? '',
					'quantity' => (int) $item->qty,
				);
			},
			$query->get_line_items( $order_id )
		);

		return array(
			'id'             => $order_id,
			'date'           => $row->order_date,
			'campaigns'      => $campaigns,
			'customer_id'    => (int) $row->customer_id,
			'customer_name'  => $row->customer_name ?? '',
			'customer_email' => $row->customer_email ?? '',
			'total_spent'    => round( (float) $row->order_total, 2 ),
			'quantity'       => array_sum( array_column( $products, 'quantity' ) ),
			'products'       => $products,
		);
	}

	/**
	 * Formats raw line items for the single-order response, including per-line discount.
	 *
	 * @param array $items Raw line items from OrderQuery::get_line_items().
	 * @return array Formatted line items.
	 */
	private static function format_line_items( array $items ): array {
		$products_data = array();

		foreach ( $items as $item ) {
			$sub             = (float) $item->line_subtotal;
			$tot             = (float) $item->line_total;
			$products_data[] = array(
				'item_id'       => (int) $item->item_id,
				'id'            => (int) $item->product_id,
				'name'          => $item->product_name ?? '',
				'qty'           => (int) $item->qty,
				'unit_price'    => (float) $item->unit_price,
				'line_total'    => round( $tot, 2 ),
				'line_subtotal' => round( $sub, 2 ),
				'discount'      => round( $sub - $tot, 2 ),
			);
		}

		return $products_data;
	}

}
