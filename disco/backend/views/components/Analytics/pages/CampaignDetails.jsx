import CampaignCustomersTable from '@/components/campaigns/CampaignCustomersTable';
import CampaignHeader from '@/components/campaigns/CampaignHeader';
import CampaignMetrics from '@/components/campaigns/CampaignMetrics';
import CampaignNotFound from '@/components/campaigns/CampaignNotFound';
import CampaignProductsTable from '@/components/campaigns/CampaignProductsTable';
import { useGetCampaignQuery } from '@/features/campaigns/campaignsApi';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { cn, fmt, formatDate } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

const CAMPAIGN_COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

const TABS = [
	{ id: 'products', label: __('Products', 'disco') },
	{ id: 'customers', label: __('Customers', 'disco') },
];

const CampaignDetails = () => {
	const { campaignId } = useParams();
	const dateParams = useSelector(selectDateRangeParams);
	const { data, isLoading, isError } = useGetCampaignQuery({
		id: campaignId,
		...dateParams,
	});
	const [activeTab, setActiveTab] = useState('products');

	if (isError) {
		return <CampaignNotFound />;
	}

	const campaign = data
		? {
				dotColor:
					CAMPAIGN_COLORS[data.campaign_id % CAMPAIGN_COLORS.length],
				name: data.campaign_name,
				intent: data.intent,
				dateRange: `${formatDate(data.valid_date?.from)} - ${formatDate(data.valid_date?.to)}`,
				status: data.status,
				totalOrders: data.total_orders,
				customers: data.total_customers,
				revenue: fmt(data.revenue),
			}
		: null;

	return (
		<div className="disco-min-h-screen disco-bg-[#f9fafb] disco-p-6 disco-space-y-3">
			{isLoading ? (
				<div className="disco-space-y-3">
					<div className="disco-h-16 disco-animate-pulse disco-rounded-xl disco-bg-white disco-border disco-border-[#e5e7eb]" />
					<div className="disco-flex disco-gap-3">
						{Array.from({ length: 2 }).map((_, i) => (
							<div
								key={i}
								className="disco-flex-1 disco-h-20 disco-animate-pulse disco-rounded-xl disco-bg-white disco-border disco-border-[#e5e7eb]"
							/>
						))}
					</div>
				</div>
			) : campaign ? (
				<>
					{/* Campaign header */}
					<CampaignHeader campaign={campaign} />

					{/* Metric cards */}
					<CampaignMetrics
						revenue={data.revenue}
						averageOrderValue={data.average_order_value}
						totalOrders={data.total_orders}
						customers={data.total_customers}
					/>
				</>
			) : null}

			{/* Tabs */}
			<div className="disco-bg-white disco-border disco-border-[#e5e7eb] disco-rounded-xl disco-overflow-hidden">
				<div className="disco-flex disco-gap-0 disco-border-b disco-border-[#e5e7eb] disco-px-4 disco-pt-3">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								'disco-px-3 disco-pb-2.5 disco-text-xs disco-font-medium disco-border-b-2 disco-transition-colors disco-mr-1',
								activeTab === tab.id
									? 'disco-border-[#0dc98b] disco-text-[#0dc98b]'
									: 'disco-border-transparent disco-text-[#6b7280] hover:disco-text-[#111827]'
							)}
						>
							{tab.label}
						</button>
					))}
				</div>

				{activeTab === 'products' ? (
					<CampaignProductsTable embedded campaignId={campaignId} />
				) : (
					<CampaignCustomersTable embedded campaignId={campaignId} />
				)}
			</div>
		</div>
	);
};

export default CampaignDetails;
