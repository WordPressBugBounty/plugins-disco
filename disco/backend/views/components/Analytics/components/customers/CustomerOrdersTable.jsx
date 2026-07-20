import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { useGetOrdersQuery } from '@/features/orders/ordersApi';
import useIsPro from '@/lib/useIsPro';
import { fmt, fmtDate, truncate } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../ui-blocks/DataTable';
import ProductsMoreDialog from '../ui-blocks/ProductsMoreDialog';

const COLUMNS = [
	{ key: 'id', label: 'Order' },
	{ key: 'campaign', label: 'Campaign' },
	{ key: 'intent', label: 'Intent Type' },
	{ key: 'total_spent', label: 'Spent', sortable: true },
	{ key: 'products', label: 'Products' },
	{ key: 'quantity', label: 'Quantity', sortable: true },
	{ key: 'date', label: 'Date', sortable: true },
];

const SORT_MAP = { total_spent: 'revenue', quantity: 'quantity', date: 'date' };

const renderRow = (order) => (
	<tr
		key={order.id}
		className="disco-border-b disco-border-[#f3f4f6] last:disco-border-0 hover:disco-bg-[#f9fafb] disco-transition-colors"
	>
		<td className="disco-px-4 disco-py-3 disco-font-mono disco-text-[#9ca3af]">
			#{order.id}
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-medium disco-text-[#2fa86d] disco-whitespace-nowrap">
			{truncate(
				(order.campaigns ?? []).map((c) => c.name).join(', '),
				30
			) || '—'}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-gray-500 disco-font-medium disco-whitespace-nowrap">
			{order?.campaigns[0]?.intent}
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-semibold disco-text-[#111827]">
			{fmt(order.total_spent)}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#6b7280]">
			<ProductsMoreDialog title="Products" items={order.products ?? []} />
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-semibold disco-text-[#111827]">
			{order.quantity}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#9ca3af] disco-whitespace-nowrap">
			{fmtDate(order.date)}
		</td>
	</tr>
);

const CustomerOrdersTable = ({ customerId }) => {
	const isPro = useIsPro();
	const dateParams = useSelector(selectDateRangeParams);
	const [sortKey, setSortKey] = useState('date');
	const [sortDir, setSortDir] = useState('desc');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);

	const {
		data: res,
		isLoading,
		isFetching,
	} = useGetOrdersQuery({
		...dateParams,
		customer_id: customerId,
		sort_by: SORT_MAP[sortKey] ?? 'revenue',
		order: sortDir,
		page,
		search,
		limit: isPro ? 20 : 10,
	});

	const orders = res?.data ?? [];
	const totalPages = res?.collection?.total_pages ?? 1;
	const total = res?.collection?.total ?? 0;

	const onSort = (key) => {
		if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
		else {
			setSortKey(key);
			setSortDir('desc');
		}
		setPage(1);
	};

	return (
		<DataTable
			columns={COLUMNS}
			data={orders}
			renderRow={renderRow}
			title="Recent orders from this Customer"
			total={total}
			searchPlaceholder="Search by id..."
			search={search}
			onSearchChange={setSearch}
			sortKey={sortKey}
			sortDir={sortDir}
			onSort={onSort}
			page={page}
			totalPages={totalPages}
			onPageChange={setPage}
			isLoading={isLoading || isFetching}
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
							'to unlock your complete campaign data — including real revenue per campaign, discount ROI, and full trend history.',
							'disco'
						)}
					</>
				),
			}}
		/>
	);
};

export default CustomerOrdersTable;
