import useIsPro from '@/lib/useIsPro';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router';
import DataTable from '../ui-blocks/DataTable';
import ProductsMoreDialog from '../ui-blocks/ProductsMoreDialog';
import CustomerAvatar from './CustomerAvatar';

const COLUMNS = [
	{ key: 'name', label: 'Customer' },
	{ key: 'state', label: 'State' },
	{ key: 'campaigns', label: 'Campaigns Used' },
	{ key: 'orders', label: 'Orders', sortable: true },
	{ key: 'spent', label: 'Spent', sortable: true },
];

const renderRow = (c, index) => (
	<tr
		key={index}
		className="disco-border-b disco-border-[#f3f4f6] last:disco-border-0 hover:disco-bg-[#f9fafb] disco-cursor-pointer disco-transition-colors"
	>
		<td className="disco-px-3 disco-py-2.5">
			{c.id != '0' ? (
				<Link
					to={`/customers/${c.id}`}
					className="disco-flex disco-items-center disco-gap-2.5 disco-group"
				>
					<CustomerAvatar
						avatar={c.avatar}
						fallback={c.initials}
						color={c.color}
					/>
					<div>
						<p className="disco-font-medium disco-text-gray-900 disco-leading-tight group-hover:disco-text-primary disco-transition-colors">
							{c.name}
						</p>
						<p className="disco-text-gray-400 disco-text-[10px] disco-mt-0.5 group-hover:disco-text-primary disco-transition-colors">
							{c.email}
						</p>
					</div>
				</Link>
			) : (
				<div className="disco-flex disco-items-center disco-gap-2.5">
					<CustomerAvatar
						avatar={c.avatar}
						fallback={c.initials}
						color={c.color}
					/>
					<div>
						<p className="disco-font-medium disco-text-gray-900 disco-leading-tight">
							{c.name || 'Guest'}
							<span className="disco-text-gray-400 disco-text-[8px] disco-border disco-rounded-full disco-bg-orange-100 disco-border-orange-200 disco-px-2 disco-py-0.5 disco-ml-2">
								Not Registered
							</span>
						</p>
						<p className="disco-text-gray-400 disco-text-[10px] disco-mt-0.5">
							{c.email}
						</p>
					</div>
				</div>
			)}
		</td>
		<td className="disco-px-3 disco-py-2.5 disco-text-gray-500 disco-whitespace-nowrap">
			{c.state}
		</td>
		<td className="disco-px-3 disco-py-2.5 disco-text-gray-500">
			<ProductsMoreDialog title="Campaigns" items={c.campaigns} />
		</td>
		<td className="disco-px-3 disco-py-2.5 disco-text-gray-600">
			{c.orders}
		</td>
		<td className="disco-px-3 disco-py-2.5 disco-font-semibold disco-text-gray-700">
			{c.spent}
		</td>
	</tr>
);

const CustomersTable = ({
	customers = [],
	isLoading = false,
	search = '',
	onSearchChange,
	sortKey = 'spent',
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
			data={customers}
			renderRow={renderRow}
			title="All Customers"
			total={total}
			searchPlaceholder="Search Customers..."
			search={search}
			onSearchChange={onSearchChange}
			sortKey={sortKey}
			sortDir={sortDir}
			onSort={onSort}
			page={page}
			totalPages={totalPages}
			onPageChange={onPageChange}
			isLoading={isLoading}
			cellPadding="disco-px-3"
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
							'to identify your highest-value customers — and find out which ones only buy when a discount is running.',
							'disco'
						)}
					</>
				),
			}}
		/>
	);
};

export default CustomersTable;
