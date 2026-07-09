import useIsPro from '@/lib/useIsPro';
import { truncate } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router';
import DataTable from '../ui-blocks/DataTable';
import IntentBadge from './IntentBadge';
import StatusBadge from './StatusBadge';

const COLUMNS = [
	{ key: 'name', label: 'Name' },
	{ key: 'intent', label: 'Intent' },
	{ key: 'revenue', label: 'Revenue', sortable: true },
	{ key: 'dateRange', label: 'Date Range' },
	{ key: 'orders', label: 'Orders', sortable: true },
	{ key: 'customers', label: 'Customers', sortable: true },
	{ key: 'status', label: 'Status' },
];

const renderRow = (campaign) => (
	<tr
		key={campaign.id}
		className="disco-border-b disco-border-[#f3f4f6] last:disco-border-0 hover:disco-bg-[#f9fafb] disco-cursor-pointer disco-transition-colors"
	>
		<td className="disco-px-4 disco-py-3">
			<span className="disco-flex disco-items-center disco-gap-2">
				<span
					className="disco-size-[7px] disco-rounded-[2px] disco-shrink-0"
					style={{
						backgroundColor: campaign.dotColor,
					}}
				/>
				<Link
					to={`/campaigns-reports/${campaign.id}`}
					className="disco-font-medium disco-text-gray-900 hover:disco-text-primary focus:disco-text-primary"
				>
					{truncate(campaign.name, 30)}
				</Link>
			</span>
		</td>
		<td className="disco-px-4 disco-py-3">
			<IntentBadge intent={campaign.intent} />
		</td>
		<td className="disco-px-4 disco-py-3 disco-font-medium disco-text-[#374151]">
			{campaign.revenue}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#6b7280]">
			{campaign.dateRange}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#374151]">
			{campaign.orders}
		</td>
		<td className="disco-px-4 disco-py-3 disco-text-[#374151]">
			{campaign.customers}
		</td>
		<td className="disco-px-4 disco-py-3">
			<StatusBadge status={campaign.status} />
		</td>
	</tr>
);

const CampaignsTable = ({
	campaigns = [],
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
			data={campaigns}
			renderRow={renderRow}
			title="Recent Campaigns"
			total={total}
			searchPlaceholder="Search campaigns..."
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
							'to unlock your complete campaign data — including real revenue per campaign, discount ROI, and full trend history.',
							'disco'
						)}
					</>
				),
			}}
		/>
	);
};

export default CampaignsTable;
