import CustomersTable from '@/components/customers/CustomersTable';
import { useGetCustomersQuery } from '@/features/customers/customersApi';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import useIsPro from '@/lib/useIsPro';
import { campaignsSort, fmt } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const AVATAR_COLORS = [
	'#06b6d4',
	'#ec4899',
	'#f59e0b',
	'#f97316',
	'#3b82f6',
	'#84cc16',
	'#8b5cf6',
	'#ef4444',
	'#a78bfa',
	'#10b981',
];

function getInitials(name) {
	if (!name) return '?';
	const parts = name.trim().split(/\s+/);
	return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

const SORT_MAP = {
	spent: 'total_spent',
	orders: 'orders',
};

const Customers = () => {
	const dateParams = useSelector(selectDateRangeParams);
	const [page, setPage] = useState(1);
	const [sortKey, setSortKey] = useState('spent');
	const [sortDir, setSortDir] = useState('desc');
	const [search, setSearch] = useState('');
	const isPro = useIsPro();

	const {
		data: res,
		isLoading,
		isFetching,
	} = useGetCustomersQuery({
		...dateParams,
		limit: isPro ? 20 : 10,
		sort_by: SORT_MAP[sortKey] ?? 'total_spent',
		order: sortDir,
		page,
		...(search ? { search } : {}),
	});

	const customers = (res?.data ?? []).map((c, index) => ({
		id: c.id,
		initials: getInitials(c.name).toUpperCase(),
		color: AVATAR_COLORS[index % AVATAR_COLORS.length],
		name: c.name || '—',
		email: c.email || '—',
		state: c.state || '—',
		campaigns: campaignsSort([...c.campaigns]),
		orders: c.orders,
		spent: fmt(c.total_spent),
		avatar: c.avatar,
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
					{__('Customers', 'disco')}
				</h1>
				<p className="disco-text-xs disco-text-[#9ca3af] disco-mt-0.5">
					{__(
						'Customers who used at least one Disco campaign',
						'disco'
					)}
				</p>
			</div>
			<CustomersTable
				customers={customers}
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

export default Customers;
