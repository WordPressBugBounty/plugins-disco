import CampaignsTable from '@/components/campaigns/CampaignsTable';
import { useGetCampaignsQuery } from '@/features/campaigns/campaignsApi';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import useIsPro from '@/lib/useIsPro';
import { fmt } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const CAMPAIGN_COLORS = [
	'#ef4444',
	'#3b82f6',
	'#8b5cf6',
	'#f59e0b',
	'#10b981',
	'#f97316',
	'#06b6d4',
	'#ec4899',
	'#84cc16',
	'#a78bfa',
];

function formatDateRange(valid_date) {
	if (!valid_date || valid_date === 'Unknown') return '—';
	const { from, to } = valid_date;
	if (!from && !to) return '—';
	const fmt = (d) => {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
	};
	return `${fmt(from)} – ${fmt(to)}`;
}

const CampaignsReports = () => {
	const [search, setSearch] = useState('');
	const [sortKey, setSortKey] = useState('revenue');
	const [sortDir, setSortDir] = useState('desc');
	const dateParams = useSelector(selectDateRangeParams);
	const isPro = useIsPro();

	const {
		data: res,
		isLoading,
		isFetching,
	} = useGetCampaignsQuery({
		...dateParams,
		limit: isPro ? 20 : 10,
		sort_by: sortKey,
		order: sortDir,
		search: search || undefined,
		page: 1,
	});

	const campaigns = (res?.data ?? []).map((c, index) => ({
		id: c.campaign_id,
		name: c.campaign_name,
		dotColor: CAMPAIGN_COLORS[index % CAMPAIGN_COLORS.length],
		intent: c.intent,
		dateRange: formatDateRange(c.valid_date),
		orders: c.orders,
		customers: c.customers,
		revenue: fmt(c.revenue),
		status: c.status,
	}));

	return (
		<div className="disco-min-h-screen disco-bg-[#f9fafb] disco-p-6">
			<div className="disco-mb-5">
				<h1 className="disco-text-lg disco-font-bold disco-text-[#111827] disco-tracking-tight">
					{__('Campaigns', 'disco')}
				</h1>
				<p className="disco-text-xs disco-text-[#9ca3af] disco-mt-0.5">
					{__('All discount campaigns', 'disco')}
				</p>
			</div>

			<CampaignsTable
				campaigns={campaigns}
				isLoading={isLoading || isFetching}
				search={search}
				sortKey={sortKey}
				sortDir={sortDir}
				onSearchChange={setSearch}
				onSort={(key) => {
					if (key === sortKey) {
						setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
					} else {
						setSortKey(key);
						setSortDir('desc');
					}
				}}
				count={res?.collection?.count}
				total={res?.collection?.total}
			/>
		</div>
	);
};

export default CampaignsReports;
