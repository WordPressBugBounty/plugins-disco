import OrdersTable from '@/components/orders/OrdersTable';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { useGetOrdersQuery } from '@/features/orders/ordersApi';
import useIsPro from '@/lib/useIsPro';
import { fmt } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function formatDate(dateStr) {
	if (!dateStr) return '—';
	return new Date(dateStr).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

const SORT_MAP = {
	revenue: 'revenue',
	date: 'date',
};

const Orders = () => {
	const dateParams = useSelector(selectDateRangeParams);
	const [page, setPage] = useState(1);
	const [sortKey, setSortKey] = useState('date');
	const [sortDir, setSortDir] = useState('desc');
	const [search, setSearch] = useState('');
	const isPro = useIsPro();

	const {
		data: res,
		isLoading,
		isFetching,
	} = useGetOrdersQuery({
		...dateParams,
		limit: isPro ? 20 : 10,
		sort_by: SORT_MAP[sortKey] ?? 'revenue',
		order: sortDir,
		page,
		...(search ? { search } : {}),
	});

	const orders = (res?.data ?? []).map((o) => ({
		id: `#${o.id}`,
		customer: o.customer_name || '—',
		campaign: (o.campaigns ?? []).map((c) => c.name).join(', ') || '—',
		products: o.products ?? [],
		total_spent: fmt(o.total_spent),
		quantity: o.quantity,
		date: formatDate(o.date),
	}));

	const total = res?.collection?.total ?? 0;
	const totalPages = res?.collection?.total_pages ?? 1;
	const count = res?.collection?.count ?? 0;

	const handleSort = (key) => {
		if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
		else {
			setSortKey(key);
			setSortDir('desc');
		}
		setPage(1);
	};

	const handleSearch = (value) => {
		setSearch(value);
		setPage(1);
	};

	return (
		<div className="disco-min-h-screen disco-bg-[#f9fafb] disco-p-6">
			<div className="disco-mb-5">
				<h1 className="disco-text-lg disco-font-bold disco-text-[#111827] disco-tracking-tight">
					{__('Orders', 'disco')}
				</h1>
				<p className="disco-text-xs disco-text-[#9ca3af] disco-mt-0.5">
					{__('Orders influenced by Disco campaigns', 'disco')}
				</p>
			</div>
			<OrdersTable
				orders={orders}
				isLoading={isLoading || isFetching}
				search={search}
				onSearchChange={handleSearch}
				sortKey={sortKey}
				sortDir={sortDir}
				onSort={handleSort}
				page={page}
				totalPages={totalPages}
				total={total}
				count={count}
				onPageChange={setPage}
			/>
		</div>
	);
};

export default Orders;
