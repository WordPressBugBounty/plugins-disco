import { useGetCustomersQuery } from '@/features/customers/customersApi';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import useIsPro from '@/lib/useIsPro';
import { fmt } from '@/lib/utils';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../ui-blocks/DataTable';

const COLUMNS = [
	{ key: 'name', label: 'Customer' },
	{ key: 'email', label: 'Email' },
	{ key: 'orders', label: 'Order', sortable: true },
	{ key: 'total_spent', label: 'Total', sortable: true },
];

const renderRow = (customer, index) => (
	<tr
		key={index}
		className="disco-border-b disco-border-[#f3f4f6] last:disco-border-0 hover:disco-bg-[#f9fafb] disco-transition-colors"
	>
		<td className="disco-px-4 disco-py-3">
			<span className="disco-font-medium disco-text-[#0dc98b]">
				{customer.name}
			</span>
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#6b7280]">
			{customer.email}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#374151]">
			{customer.orders}
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-semibold disco-text-[#111827]">
			{fmt(customer.total_spent)}
		</td>
	</tr>
);

const CampaignCustomersTable = ({ campaignId }) => {
	const isPro = useIsPro();
	const dateParams = useSelector(selectDateRangeParams);
	const [search, setSearch] = useState('');
	const [sortKey, setSortKey] = useState('total_spent');
	const [sortDir, setSortDir] = useState('desc');
	const [page, setPage] = useState(1);

	const {
		data: res,
		isLoading,
		isFetching,
	} = useGetCustomersQuery({
		...dateParams,
		campaign_id: campaignId,
		search: search || undefined,
		sort_by: sortKey,
		order: sortDir,
		page: page,
		limit: isPro ? 20 : 10,
	});

	const customers = res?.data;
	const totalPages = res?.collection?.total_pages ?? 1;

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
			data={customers}
			renderRow={renderRow}
			title="Recent customers on this Campaign"
			total={res?.collection?.total ?? 0}
			searchPlaceholder="Search customers..."
			search={search}
			onSearchChange={setSearch}
			sortKey={sortKey}
			sortDir={sortDir}
			onSort={onSort}
			page={page}
			totalPages={totalPages}
			onPageChange={setPage}
			isLoading={isLoading || isFetching}
			className="disco-rounded-tl-none disco-rounded-tr-none"
			locked={!isPro}
		/>
	);
};

export default CampaignCustomersTable;
