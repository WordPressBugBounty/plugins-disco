<?php // phpcs:ignoreFile
/**
 * Product Attributes
 *
 * @package    Disco
 * @subpackage \App\Attributes
 */

namespace Disco\App\Attributes;

/**
 * Class Product
 *
 * This class provides methods for retrieving various attributes of a WooCommerce product.
 *
 * @package    Disco
 * @subpackage \App\Attributes
 * @author     Ohidul Islam <wahid0003@gmail.com>
 * @link       https://webappick.com
 * @license    https://opensource.org/licenses/gpl-license.php GNU Public License
 * @category   Attributes
 */
class CustomerHistory {

	/**
	 * @var int
	 */
	private $customer_id;

	/**
	 * @var array
	 */
	private $ids;

	/**
	 * Customer constructor.
	 *
	 * @param array|object $ids         Product IDs.
	 * @param int          $customer_id Customer ID.
	 */
	public function __construct( $ids = array(), $customer_id = 0 ) {
		$this->customer_id = $customer_id;

		if ( is_user_logged_in() ) {
			$this->customer_id = wp_get_current_user()->ID;
		}

		if ( is_object( $ids ) ) {
			$ids = (array) $ids;
		}

		$this->ids = $ids;
	}

	/**
	 * Is Customer First Order.
	 *
	 * @return string
	 */
	public function is_first_order() {
		$orders = wc_get_customer_order_count( $this->customer_id );

		if ( $orders > 0 ) {
			return 'no';
		}

		return 'yes';
	}

	/**
	 * Get Customer Last Order Date.
	 *
	 * @return string|null
	 */
	public function last_order_date() {
		$last_order = wc_get_customer_last_order( $this->customer_id );

		if ( ! $last_order instanceof \WC_Order ) {
			return null;
		}

		$last_order_date = $last_order->get_date_created();

		if ( $last_order_date instanceof \WC_DateTime ) {
			return $last_order_date->date_i18n();
		}

		return null;
	}

	/**
	 * Get Customer Last Order Amount.
	 *
	 * @return float
	 */
	public function last_order_amount() {
		$last_order = wc_get_customer_last_order( $this->customer_id );

		if ( ! $last_order instanceof \WC_Order ) {
			return 0.00;
		}

		return $last_order->get_total();
	}

	/**
	 * Get Total Order Made By Customer.
	 *
	 * @return int
	 */
	public function total_order_made() {
		return wc_get_customer_order_count( $this->customer_id );
	}

	/**
	 * Get Total Amount Spent By Customer.
	 *
	 * @return string
	 */
	public function total_spent() {
		return wc_get_customer_total_spent( $this->customer_id );
	}

	/**
	 * Get total amount spent by customer
	 *
	 * @return float
	 */
	public function total_amount_sold() {
		$orders = wc_get_orders(
            array(
				'customer_id' => $this->customer_id,
				'limit'       => -1, // no limit
				'return'      => 'objects',
				'status'      => array_keys( wc_get_order_statuses() ), // all statuses
		)
            );

		$total = 0;

		/** @phpstan-ignore-next-line */
		foreach ( $orders as $order ) {
			$total += $order->get_total();
		}

		return $total;
	}

	/**
	 * Get Total Quantity Sold By Customer.
	 *
	 * @return int
	 */
	public function total_quantity_sold() {
		$total = 0;

		$orders = wc_get_orders(
            array(
				'customer_id' => $this->customer_id,
				'limit'       => -1,
				'return'      => 'objects',
				'status'      => array_keys( wc_get_order_statuses() ), // include all statuses
		)
            );

		if ( ! empty( $orders ) ) {
			/** @phpstan-ignore-next-line */
			foreach ( $orders as $order ) {
				foreach ( $order->get_items() as $item ) {
					$qty    = (int) $item->get_quantity();
					$total += $qty;
				}
			}
		}

		return (int) $total;
	}

	/**
	 * Get Total Quantity Sold By Specific Customers.
	 *
	 * @return int
	 */
	public function total_quantity_sold_by_ids() {
		$total_sold = 0;

		if ( ! empty( $this->ids ) ) {
			$quantities = array();

			foreach ( $this->ids as $id ) {
				$product = wc_get_product( $id );

				if ( ! ( $product instanceof \WC_Product ) ) {
					continue;
				}

				$quantities[] = $product->get_total_sales();
			}

			$total_sold = array_sum( $quantities );
		}

		return $total_sold;
	}

	/**
	 * Get Total Net Revenue By Specific Customers.
	 *
	 * @return float|int
	 */
	public function total_amount_sold_by_ids() {
		$total_sold = 0;

		if ( ! empty( $this->ids ) ) {
			$quantities = array();

			foreach ( $this->ids as $id ) {
				$quantities[] = $this->net_revenue( $id );
			}

			$total_sold = array_sum( $quantities );
		}

		return $total_sold;
	}

	/**
	 * Get products sum of total order quantity.
	 *
	 * @return float|int
	 */
	public function total_order_made_by_ids() {
		$total_sold = 0;

		if ( ! empty( $this->ids ) ) {
			$quantities = array();

			foreach ( $this->ids as $id ) {
				$quantities[] = $this->order_quantity( $id );
			}

			$total_sold = array_sum( $quantities );
		}

		return $total_sold;
	}

	/**
	 * Get Single product total order quantity.
	 *
	 * @param int $product_id Product ID.
	 * @return float
	 */
	private function order_quantity( $product_id ) {
		global $wpdb;

		return (float) $wpdb->get_var(// phpcs:ignore
			$wpdb->prepare(
				"
        SELECT COUNT(DISTINCT(order_id))
        FROM {$wpdb->prefix}wc_order_product_lookup
        WHERE product_id = %d AND customer_id = %d
    ",
				$product_id,
				$this->customer_id
			)
		);
	}

	/**
	 * Get Single product total net revenue.
	 *
	 * @param int $product_id Product ID.
	 * @return float
	 */
	private function net_revenue( $product_id ) {
		global $wpdb;

		return (float) $wpdb->get_var(// phpcs:ignore
			$wpdb->prepare(
				"
        SELECT SUM(product_net_revenue)
        FROM {$wpdb->prefix}wc_order_product_lookup
         WHERE product_id = %d AND customer_id = %d
    ",
				$product_id,
				$this->customer_id
			)
		);
	}

}
