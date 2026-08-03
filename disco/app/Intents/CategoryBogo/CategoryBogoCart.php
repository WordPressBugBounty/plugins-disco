<?php
/**
 * Category BOGO cart reader / writer.
 *
 * @package    Disco
 * @subpackage \App\Intents\CategoryBogo
 */

namespace Disco\App\Intents\CategoryBogo;

use Disco\App\Calc\CalcFactory;
use Disco\App\Utility\Helper;
use Disco\App\Utility\Value;

/**
 * Reads the cart and marks the free quantity on the lines the customer added.
 *
 * Reading merges the cart into one entry per "cart product key"
 * (`productId:variationId`), keeping the cart item keys that make it up. The buy
 * quantity is therefore always the real cart quantity, so recalculation cannot
 * oscillate.
 *
 * Writing NEVER adds a line to the cart and NEVER removes one: the customer owns
 * what is in their cart. The engine only writes meta on the lines they already
 * added:
 *
 *  - whole line free  → `is_free_product`, priced at zero by the cart hook.
 *  - part of a line free → `disco_category_bogo_free_quantity`, and the cart hook
 *    charges only the paid units of that line.
 *  - no entitlement → both keys cleared, the line goes back to its normal price.
 *
 * Quantities are never touched, and meta is written straight onto
 * `cart_contents` because the WooCommerce setters recalculate totals, which
 * would recurse from inside `woocommerce_before_calculate_totals`.
 *
 * @package    Disco
 * @subpackage Disco\App\Intents\CategoryBogo
 * @category   Intention
 */
class CategoryBogoCart {

	/**
	 * Cart item meta key marking a line as managed by this engine.
	 */
	public const FREE_ITEM_FLAG = 'disco_category_bogo_free_item';

	/**
	 * Cart item meta key holding how many units of the line are free.
	 */
	public const FREE_QUANTITY_META = 'disco_category_bogo_free_quantity';

	/**
	 * Merge the cart into one entry per cart product key, in cart order.
	 *
	 * @param \WC_Cart $cart Cart object.
	 * @return array<string, array<string, mixed>>
	 */
	public function get_merged_cart_products( \WC_Cart $cart ): array {
		$cart_products = array();
		$cart_items    = $cart->get_cart();

		if ( ! is_array( $cart_items ) ) {
			return $cart_products;
		}

		foreach ( $cart_items as $cart_item_key => $cart_item ) {
			$cart_products = $this->merge_cart_item_into_product( $cart_products, (string) $cart_item_key, (array) $cart_item );
		}

		return $cart_products;
	}

	/**
	 * Mark a product's entitled free quantity across the lines that hold it.
	 *
	 * The entitlement is handed to the lines in cart order: a line is marked
	 * wholly free while the entitlement still covers it, the line it runs out on
	 * is marked partly free, and every later line goes back to paid.
	 *
	 * @param \WC_Cart             $cart          Cart object.
	 * @param array<string, mixed> $cart_product  Merged cart product.
	 * @param int                  $free_quantity Entitled free quantity.
	 */
	public function sync_cart_product_free_quantity( \WC_Cart $cart, array $cart_product, int $free_quantity ): void {
		$remaining_free_quantity = max( 0, $free_quantity );
		$line_quantities         = $this->get_cart_line_quantities( $cart_product );

		foreach ( $line_quantities as $cart_item_key => $line_quantity ) {
			$line_free_quantity = (int) min( $line_quantity, $remaining_free_quantity );

			$remaining_free_quantity -= $line_free_quantity;

			if ( $line_free_quantity <= 0 ) {
				$effective_product_id = Value::to_int( $cart_product['effective_product_id'] ?? 0 );

				$this->mark_cart_line_as_paid( $cart, (string) $cart_item_key, $effective_product_id );

				continue;
			}

			if ( $line_free_quantity >= $line_quantity ) {
				$this->mark_cart_line_fully_free( $cart, (string) $cart_item_key, $line_quantity );

				continue;
			}

			$this->mark_cart_line_partly_free( $cart, (string) $cart_item_key, $line_free_quantity );
		}
	}

	/**
	 * Cart product keys whose product sits in one of the given categories.
	 *
	 * @param array<string, array<string, mixed>> $cart_products Cart products by product key.
	 * @param array<int, int>                     $category_ids  Category ids.
	 * @return array<string, bool> Keyed by cart product key.
	 */
	public function get_product_keys_in_categories( array $cart_products, array $category_ids ): array {
		$matching_product_keys = array();

		foreach ( $cart_products as $product_key => $cart_product ) {
			if ( ! $this->is_product_in_categories( $cart_product, $category_ids ) ) {
				continue;
			}

			$matching_product_keys[ (string) $product_key ] = true;
		}

		return $matching_product_keys;
	}

	/**
	 * Whether a merged cart product sits in one of the given categories.
	 *
	 * @param array<string, mixed> $cart_product Merged cart product.
	 * @param array<int, int>      $category_ids Category ids.
	 */
	public function is_product_in_categories( array $cart_product, array $category_ids ): bool {
		if ( empty( $category_ids ) ) {
			return false;
		}

		$effective_product_id = Value::to_int( $cart_product['effective_product_id'] ?? 0 );

		return (bool) Helper::is_in_category( $effective_product_id, $category_ids );
	}

	/**
	 * Add one cart item to its merged product entry.
	 *
	 * @param array<string, array<string, mixed>> $cart_products Merged products so far.
	 * @param string                              $cart_item_key Cart item key.
	 * @param array<string, mixed>                $cart_item     Cart item.
	 * @return array<string, array<string, mixed>>
	 */
	private function merge_cart_item_into_product( array $cart_products, string $cart_item_key, array $cart_item ): array {
		$product_id   = Value::to_int( $cart_item['product_id'] ?? 0 );
		$variation_id = Value::to_int( $cart_item['variation_id'] ?? 0 );

		if ( $product_id <= 0 && $variation_id <= 0 ) {
			return $cart_products;
		}

		$product_key = $product_id . ':' . $variation_id;

		if ( ! isset( $cart_products[ $product_key ] ) ) {
			$cart_products[ $product_key ] = $this->create_cart_product_entry( $product_id, $variation_id, $cart_item );
		}

		$merged_product  = $cart_products[ $product_key ];
		$line_quantity   = Value::to_int( $cart_item['quantity'] ?? 0 );
		$merged_quantity = Value::to_int( $merged_product['quantity'] );
		$line_quantities = array();

		if ( is_array( $merged_product['line_quantities'] ) ) {
			$line_quantities = $merged_product['line_quantities'];
		}

		$line_quantities[ $cart_item_key ] = $line_quantity;

		$merged_product['quantity']        = $merged_quantity + $line_quantity;
		$merged_product['line_quantities'] = $line_quantities;
		$cart_products[ $product_key ]     = $merged_product;

		return $cart_products;
	}

	/**
	 * Build a fresh merged product entry for a cart item.
	 *
	 * `effective_product_id` is the id the engine prices and categorises by: the variation
	 * id for a variation, the product id otherwise.
	 *
	 * @param int                  $product_id   Product id.
	 * @param int                  $variation_id Variation id.
	 * @param array<string, mixed> $cart_item    Cart item.
	 * @return array<string, mixed>
	 */
	private function create_cart_product_entry( int $product_id, int $variation_id, array $cart_item ): array {
		return array(
			'effective_product_id' => $variation_id > 0 ? $variation_id : $product_id,
			'product_id'           => $product_id,
			'variation_id'         => $variation_id,
			'quantity'             => 0,
			'price'                => (float) CalcFactory::get_price( $cart_item ),
			'line_quantities'      => array(),
		);
	}

	/**
	 * Quantity of every cart line holding a merged product, in cart order.
	 *
	 * @param array<string, mixed> $cart_product Merged cart product.
	 * @return array<string, int>
	 */
	private function get_cart_line_quantities( array $cart_product ): array {
		if ( empty( $cart_product['line_quantities'] ) || ! is_array( $cart_product['line_quantities'] ) ) {
			return array();
		}

		$line_quantities = array();

		foreach ( $cart_product['line_quantities'] as $cart_item_key => $line_quantity ) {
			$line_quantities[ (string) $cart_item_key ] = Value::to_int( $line_quantity );
		}

		return $line_quantities;
	}

	/**
	 * Mark a whole cart line as free.
	 *
	 * @param \WC_Cart $cart          Cart object.
	 * @param string   $cart_item_key Cart item key.
	 * @param int      $free_quantity Units of the line that are free.
	 */
	private function mark_cart_line_fully_free( \WC_Cart $cart, string $cart_item_key, int $free_quantity ): void {
		if ( ! isset( $cart->cart_contents[ $cart_item_key ] ) ) {
			return;
		}

		$cart->cart_contents[ $cart_item_key ]['is_free_product']          = true;
		$cart->cart_contents[ $cart_item_key ][ self::FREE_ITEM_FLAG ]     = true;
		$cart->cart_contents[ $cart_item_key ][ self::FREE_QUANTITY_META ] = $free_quantity;
	}

	/**
	 * Mark part of a cart line as free.
	 *
	 * `is_free_product` is deliberately not set: the line still has paid units,
	 * so the cart hook prices it down instead of zeroing it.
	 *
	 * @param \WC_Cart $cart          Cart object.
	 * @param string   $cart_item_key Cart item key.
	 * @param int      $free_quantity Units of the line that are free.
	 */
	private function mark_cart_line_partly_free( \WC_Cart $cart, string $cart_item_key, int $free_quantity ): void {
		if ( ! isset( $cart->cart_contents[ $cart_item_key ] ) ) {
			return;
		}

		unset( $cart->cart_contents[ $cart_item_key ]['is_free_product'] );

		$cart->cart_contents[ $cart_item_key ][ self::FREE_ITEM_FLAG ]     = true;
		$cart->cart_contents[ $cart_item_key ][ self::FREE_QUANTITY_META ] = $free_quantity;
	}

	/**
	 * Clear every free marker from a cart line.
	 *
	 * The product object is refreshed because the line's price may already have
	 * been zeroed or reduced earlier in the request; reusing it would keep the
	 * discount after the entitlement is gone.
	 *
	 * @param \WC_Cart $cart          Cart object.
	 * @param string   $cart_item_key Cart item key.
	 * @param int      $effective_product_id     Product / variation id.
	 */
	private function mark_cart_line_as_paid( \WC_Cart $cart, string $cart_item_key, int $effective_product_id ): void {
		if ( ! isset( $cart->cart_contents[ $cart_item_key ] ) ) {
			return;
		}

		unset(
			$cart->cart_contents[ $cart_item_key ]['is_free_product'],
			$cart->cart_contents[ $cart_item_key ]['free_product_note'],
			$cart->cart_contents[ $cart_item_key ][ self::FREE_ITEM_FLAG ],
			$cart->cart_contents[ $cart_item_key ][ self::FREE_QUANTITY_META ]
		);

		$product = wc_get_product( $effective_product_id );

		if ( ! $product instanceof \WC_Product ) {
			return;
		}

		$cart->cart_contents[ $cart_item_key ]['data'] = $product;
	}

}
