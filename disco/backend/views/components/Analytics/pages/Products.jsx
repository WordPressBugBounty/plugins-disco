import ProductsTable from '@/components/products/ProductsTable';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { useGetProductsQuery } from '@/features/products/productsApi';
import useIsPro from '@/lib/useIsPro';
import { campaignsSort, fmt } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const SORT_MAP = {
	orders: 'orders',
	customers: 'customers',
	revenue: 'revenue',
};

const Products = () => {
	const dateParams = useSelector(selectDateRangeParams);
	const [page, setPage] = useState(1);
	const [sortKey, setSortKey] = useState('revenue');
	const [sortDir, setSortDir] = useState('desc');
	const [search, setSearch] = useState('');
	const isPro = useIsPro();

	const {
		data: res,
		isLoading,
		isFetching,
	} = useGetProductsQuery({
		...dateParams,
		limit: isPro ? 20 : 10,
		sort_by: SORT_MAP[sortKey] ?? 'revenue',
		order: sortDir,
		page,
		...(search ? { search } : {}),
	});

	const products = (res?.data ?? []).map((p) => ({
		id: p.id,
		image: p.image,
		name: p.name,
		unitPrice: `${fmt(p.unit_price)} unit price`,
		category: (p.categories ?? []).map((c) => c.name).join(', ') || '—',
		campaigns: campaignsSort([...p.campaigns]),
		orders: p.total_orders,
		customers: p.total_customers,
		revenue: fmt(p.total_revenue),
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
					{__('Products', 'disco')}
				</h1>
				<p className="disco-text-xs disco-text-[#9ca3af] disco-mt-0.5">
					{__('Revenue and discount performance by product', 'disco')}
				</p>
			</div>
			<ProductsTable
				products={products}
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

export default Products;
