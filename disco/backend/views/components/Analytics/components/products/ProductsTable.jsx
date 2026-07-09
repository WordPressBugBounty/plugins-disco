import useIsPro from '@/lib/useIsPro';
import { truncate } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import DataTable from '../ui-blocks/DataTable';
import ProductsMoreDialog from '../ui-blocks/ProductsMoreDialog';

const COLUMNS = [
	{ key: 'name', label: 'Product' },
	{ key: 'revenue', label: 'Net Sale', sortable: true },
	{ key: 'category', label: 'Category' },
	{ key: 'campaigns', label: 'Campaigns' },
	{ key: 'orders', label: 'Orders', sortable: true },
	{ key: 'customers', label: 'Customers', sortable: true },
];

const CategoryBadge = ({ category }) => (
	<span className="disco-inline-flex disco-items-center disco-px-2 disco-py-0.5 disco-rounded disco-text-[10px] disco-text-[#4b5563] disco-bg-[#f3f4f6] disco-whitespace-nowrap">
		{category}
	</span>
);

const renderRow = (product) => (
	<tr
		key={product.id}
		className="disco-border-b disco-border-[#f3f4f6] last:disco-border-0 hover:disco-bg-[#f9fafb] disco-cursor-pointer disco-transition-colors"
	>
		<td className="disco-px-4 disco-py-3">
			<div className="disco-flex disco-items-center disco-gap-2.5">
				{product.image ? (
					<img
						src={product.image}
						alt={product.name}
						className="disco-size-7 disco-rounded-lg disco-object-cover disco-shrink-0"
					/>
				) : (
					<span className="disco-size-7 disco-flex disco-items-center disco-justify-center disco-rounded-lg disco-bg-[#f3f4f6] disco-text-sm disco-shrink-0">
						{product.name?.charAt(0) ?? '?'}
					</span>
				)}
				<div>
					<p className="disco-font-medium disco-text-[#111827] disco-leading-tight">
						{truncate(product.name, 40)}
					</p>
					<p className="disco-text-[#9ca3af] disco-text-[10px] disco-mt-0.5">
						{product.unitPrice}
					</p>
				</div>
			</div>
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-semibold disco-text-[#111827]">
			{product.revenue}
		</td>
		<td className="disco-px-4 disco-py-3">
			<CategoryBadge category={product.category} />
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#6b7280]">
			<ProductsMoreDialog title="Campaigns" items={product.campaigns} />
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#374151]">
			{product.orders}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#374151]">
			{product.customers}
		</td>
	</tr>
);

const ProductsTable = ({
	products = [],
	isLoading = false,
	search = '',
	onSearchChange,
	sortKey = 'revenue',
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
			data={products}
			renderRow={renderRow}
			title="All Products"
			total={total}
			searchPlaceholder="Search products..."
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
							"to see which products respond best to discounts — and which ones you're over-discounting.",
							'disco'
						)}
					</>
				),
			}}
		/>
	);
};

export default ProductsTable;
