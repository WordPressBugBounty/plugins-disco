const filters = [
	{
		id: 0,
		filter_name: 'disabled',
		title: 'Product',
		status: 'disabled',
	},
	{
		id: 1,
		filter_name: 'title',
		title: 'Product Title',
		values: {
			operator: 'and',
			condition: 'contain',
			value: '',
		},
		conditions: [3, 4],
	},
	{
		id: 2,
		filter_name: 'price',
		title: 'Product Price',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 3,
		filter_name: 'total_sales',
		title: 'Total sales',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 4,
		filter_name: 'stock_quantity_of_product',
		title: 'Stock Quantity of Product',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 5,
		filter_name: 'product_publish_date',
		title: 'Product Publish Date',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
		},
		conditions: [5, 6, 7, 8, 9, 10, 11],
	},
	{
		id: 31,
		filter_name: 'category',
		title: 'Category',
		values: {
			categories: [],
			operator: 'and',
			condition: 'equal',
			value: '',
		},
		conditions: [5, 6],
	},
	{
		id: 32,
		filter_name: 'tags',
		title: 'Tags',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
		},
		conditions: [5, 6],
	},
	{
		id: 33,
		filter_name: 'attribute',
		title: 'Attributes',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
		},
		conditions: [5, 6],
	},
	{
		id: 6,
		filter_name: 'disabled',
		title: 'Cart',
		status: 'disabled',
	},
	{
		id: 7,
		filter_name: 'subtotal',
		title: 'Subtotal',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
			count_type: 'count_all_item_in_cart',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 8,
		filter_name: 'item_cart_quantity',
		title: 'Item/Cart Quantity',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
			count_type: 'count_all_item_in_cart',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 9,
		filter_name: 'coupon',
		title: 'Coupons',
		values: {
			operator: 'and',
			condition: 'create_coupon',
			value: '',
		},
	},
	{
		id: 10,
		filter_name: 'payment_method',
		title: 'Payment Method',
		values: {
			operator: 'and',
			condition: 'direct_bank_transfer',
			value: '',
		},
	},
	{
		id: 11,
		filter_name: 'line_item_count',
		title: 'Line Item Count',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
			count_type: 'count_all_item_in_cart',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 12,
		filter_name: 'weight',
		title: 'Total Weight',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 13,
		filter_name: 'disabled',
		title: 'Shipping',
		status: 'disabled',
	},
	{
		id: 14,
		filter_name: 'city',
		title: 'City',
		values: {
			operator: 'and',
			value: '',
		},
	},
	{
		id: 15,
		filter_name: 'country',
		title: 'Country',
		values: {
			operator: 'and',
			value: '',
		},
	},
	{
		id: 16,
		filter_name: 'state',
		title: 'State',
		values: {
			operator: 'and',
			value: '',
			state: '',
		},
	},
	{
		id: 17,
		filter_name: 'zip_code',
		title: 'Zip Code',
		values: {
			operator: 'and',
			value: '',
		},
	},
	{
		id: 18,
		filter_name: 'disabled',
		title: 'Customer',
		status: 'disabled',
	},
	{
		id: 19,
		filter_name: 'email',
		title: 'Email',
		values: {
			operator: 'and',
			value: '',
		},
	},
	{
		id: 20,
		filter_name: 'user',
		title: 'User',
		values: {
			operator: 'and',
			value: '',
		},
	},
	{
		id: 21,
		filter_name: 'is_logged_in',
		title: 'Is Logged In',
		values: {
			operator: 'and',
			condition: 'yes',
		},
		conditions: [15, 16],
	},
	{
		id: 22,
		filter_name: 'user_role',
		title: 'User Role',
		values: {
			operator: 'and',
			value: '',
		},
	},
	{
		id: 23,
		filter_name: 'disabled',
		title: 'Purchase History',
		status: 'disabled',
	},
	{
		id: 24,
		filter_name: 'first_purchase',
		title: 'First Purchase',
		values: {
			operator: 'and',
			condition: 'yes',
		},
		conditions: [15, 16],
	},
	{
		id: 25,
		filter_name: 'last_purchase',
		title: 'Last Purchase',
		values: {
			operator: 'and',
			condition: 'before',
			value: '',
			purchase_status: 'completed',
		},
		date_conditions: [17, 18],
	},
	{
		id: 26,
		filter_name: 'last_purchase_amount',
		title: 'Last Purchase Amount',
		values: {
			operator: 'and',
			condition: 'equal',
			value: '',
			purchase_status: 'completed',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 27,
		filter_name: 'number_of_purchase_made',
		title: 'Number of Purchase Made',
		values: {
			operator: 'and',
			date_condition: 'all_time',
			date: '',
			quantity_condition: 'equal',
			quantity: '',
			purchase_status: 'completed',
		},

		date_conditions: [
			{
				id: 17,
				condition_name: 'all_time',
				title: 'All Time',
			},
			{
				id: 18,
				condition_name: 'before',
				title: 'Before',
			},
			{
				id: 18,
				condition_name: 'after',
				title: 'After',
			},
		],

		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 28,
		filter_name: 'number_of_order_made_by_following_products',
		title: 'Number of Order Made by Following Products',
		values: {
			operator: 'and',
			date_condition: 'all_time',
			date: '',
			quantity_condition: 'equal',
			quantity: '',
			purchase_status: 'completed',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 29,
		filter_name: 'number_of_quantities_made_by_following_products',
		title: 'Number of Quantities Made by Following Products',
		values: {
			operator: 'and',
			date_condition: 'all_time',
			date: '',
			quantity_condition: 'equal',
			quantity: '',
			purchase_status: 'completed',
		},
		conditions: [5, 6, 7, 8, 9, 10],
	},
	{
		id: 30,
		filter_name: 'total_spent',
		title: 'Total Spent',
		values: {
			operator: 'and',
			date_condition: 'all_time',
			date: '',
			amount_condition: 'equal',
			amount: '',
		},

		date_conditions: [
			{
				id: 17,
				condition_name: 'all_time',
				title: 'All Time',
			},
			{
				id: 17,
				condition_name: 'before',
				title: 'Before',
			},
			{
				id: 18,
				condition_name: 'after',
				title: 'After',
			},
		],

		conditions: [5, 6, 7, 8, 9, 10],
	},
];

export default filters;
