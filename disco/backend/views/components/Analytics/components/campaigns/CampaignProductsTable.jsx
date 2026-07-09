import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { useGetProductsQuery } from '@/features/products/productsApi';
import useIsPro from '@/lib/useIsPro';
import { fmt, truncate } from '@/lib/utils';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../ui-blocks/DataTable';

const COLUMNS = [
	{ key: 'name', label: 'Product' },
	{ key: 'category', label: 'Category' },
	{ key: 'quantity', label: 'Quantity', sortable: true },
	{ key: 'customers', label: 'Customers', sortable: true },
	{ key: 'revenue', label: 'Net sale', sortable: true },
];

// Map column key → API sort_by value
const SORT_MAP = {
	quantity: 'quantity',
	customers: 'customers',
	revenue: 'revenue',
};

const CategoryBadge = ({ category }) => (
	<span className="disco-inline-flex disco-items-center disco-px-2 disco-py-0.5 disco-rounded disco-text-[10px] disco-text-[#4b5563] disco-bg-[#f3f4f6]">
		{category}
	</span>
);

const renderRow = (product) => (
	<tr
		key={product.id}
		className="disco-border-b disco-border-[#f3f4f6] last:disco-border-0 hover:disco-bg-[#f9fafb] disco-cursor-pointer disco-transition-colors"
	>
		<td className="disco-px-4 disco-py-3">
			<span className="disco-flex disco-items-center disco-gap-2">
				{product.image ? (
					<img
						src={product.image}
						alt={product.name}
						className="disco-size-7 disco-rounded-lg disco-object-cover disco-shrink-0"
					/>
				) : (
					<span className="disco-size-7 disco-flex disco-items-center disco-justify-center disco-rounded-lg disco-bg-[#f3f4f6] disco-text-sm disco-shrink-0">
						🛍️
					</span>
				)}
				<span className="disco-font-medium disco-text-[#111827]">
					{truncate(product.name, 40)}
				</span>
			</span>
		</td>
		<td className="disco-px-4 disco-py-3">
			{product.categories?.[0] ? (
				<CategoryBadge category={product.categories[0].name} />
			) : (
				<span className="disco-text-[#9ca3af]">—</span>
			)}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#374151]">
			{product.total_quantity}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#374151]">
			{product.total_customers}
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-semibold disco-text-[#111827]">
			{fmt(product.total_revenue)}
		</td>
	</tr>
);

const CampaignProductsTable = ({ campaignId }) => {
	const isPro = useIsPro();
	const dateParams = useSelector(selectDateRangeParams);
	const [sortKey, setSortKey] = useState('revenue');
	const [sortDir, setSortDir] = useState('desc');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);

	const {
		data: res,
		isLoading,
		isFetching,
	} = useGetProductsQuery({
		...dateParams,
		campaign_id: campaignId,
		sort_by: SORT_MAP[sortKey] ?? 'revenue',
		order: sortDir,
		page,
		search,
		limit: isPro ? 20 : 10,
	});

	const products = res?.data ?? [];
	const totalPages = res?.collection?.total_pages ?? 1;

	const onSort = (key) => {
		if (key === sortKey) {
			setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
		} else {
			setSortKey(key);
			setSortDir('desc');
		}
	};

	return (
		<DataTable
			columns={COLUMNS}
			data={products}
			renderRow={renderRow}
			title="Recent products on this Campaign"
			total={res?.collection?.total ?? 0}
			searchPlaceholder="Search products..."
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

export default CampaignProductsTable;
