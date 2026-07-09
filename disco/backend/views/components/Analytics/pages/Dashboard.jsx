import RevenueByIntent from '@/components/dashboard/RevenueByIntent';
import RevenueChart from '@/components/dashboard/RevenueChart';
import SummaryCards from '@/components/dashboard/SummaryCards';
import TopCampaigns from '@/components/dashboard/TopCampaigns';
import TopProducts from '@/components/dashboard/TopProducts';
import { __ } from '@wordpress/i18n';

const Dashboard = () => (
	<div className="disco-min-h-screen disco-bg-[#f9fafb] disco-p-6">
		<div className="disco-mb-5">
			<h1 className="disco-text-lg disco-font-bold disco-text-[#111827] disco-tracking-tight">
				{__('Analytics Dashboard', 'disco')}
			</h1>
		</div>

		<SummaryCards />

		<div className="disco-flex disco-gap-2.5 disco-mb-3">
			<RevenueChart className="disco-flex-[2]" />
			<RevenueByIntent className="disco-flex-1" />
		</div>

		<div className="disco-flex disco-gap-2.5">
			<TopCampaigns className="disco-flex-1" />
			<TopProducts className="disco-flex-1" />
		</div>
	</div>
);

export default Dashboard;
