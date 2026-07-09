import useIsPro from '@/lib/useIsPro';
import { truncate } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import DataTable from '../ui-blocks/DataTable';
import ProductsMoreDialog from '../ui-blocks/ProductsMoreDialog';

const COLUMNS = [
	{ key: 'id', label: 'Order' },
	{ key: 'customer', label: 'Customer' },
	{ key: 'total_spent', label: 'Total Spent', sortable: true },
	{ key: 'campaign', label: 'Campaign' },
	{ key: 'products', label: 'Products' },
	{ key: 'date', label: 'Date', sortable: true },
];

const renderRow = (order) => (
	<tr
		key={order.id}
		className="disco-border-b disco-border-[#f3f4f6] last:disco-border-0 hover:disco-bg-[#f9fafb] disco-cursor-pointer disco-transition-colors"
	>
		<td className="disco-px-4 disco-py-3 disco-font-mono disco-text-[#9ca3af]">
			{order.id}
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-medium disco-text-[#111827] disco-whitespace-nowrap">
			{order.customer}
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-semibold disco-text-[#111827]">
			{order.total_spent}
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-medium disco-text-[#2fa86d] disco-whitespace-nowrap">
			{truncate(order.campaign, 30)}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#6b7280]">
			<ProductsMoreDialog title="Products" items={order.products} />
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#9ca3af] disco-whitespace-nowrap">
			{order.date}
		</td>
	</tr>
);

const OrdersTable = ({
	orders = [],
	isLoading = false,
	search = '',
	onSearchChange,
	sortKey = 'date',
	sortDir = 'desc',
	onSort,
	page = 1,
	totalPages = 1,
	total = 0,
	onPageChange,
}) => {
	const isPro = useIsPro();

	return (
		<DataTable
			columns={COLUMNS}
			data={orders}
			renderRow={renderRow}
			title="Recent Orders"
			total={total}
			searchPlaceholder="Search orders..."
			search={search}
			onSearchChange={onSearchChange}
			sortKey={sortKey}
			sortDir={sortDir}
			onSort={onSort}
			page={page}
			totalPages={totalPages}
			onPageChange={onPageChange}
			isLoading={isLoading}
			locked={!isPro}
			lockOverlay={{
				size: 'lg',
				label: __('Upgrade to pro', 'disco'),
				titleClassName:
					'disco-max-w-md disco-text-base disco-font-normal disco-text-[#111827] disco-leading-snug',
				title: (
					<>
						<strong className="disco-font-semibold">
							{__('Upgrade to Disco Pro', 'disco')}
						</strong>{' '}
						{__(
							'to access your complete order history — every order that used a discount campaign, with full revenue and attribution data.',
							'disco'
						)}
					</>
				),
			}}
		/>
	);
};

export default OrdersTable;
