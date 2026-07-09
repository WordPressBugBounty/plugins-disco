import { Card } from '@/components/ui/card';
import { useGetCampaignsQuery } from '@/features/campaigns/campaignsApi';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import useIsPro from '@/lib/useIsPro';
import { cn, fmt, truncate } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import EmptyData from '../ui-blocks/EmptyData';
import ProLockOverlay from '../ui-blocks/ProLockOverlay';

const CAMPAIGN_COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

const TopCampaigns = ({ className }) => {
	const isPro = useIsPro();
	const dateParams = useSelector(selectDateRangeParams);
	const { data: res, isLoading } = useGetCampaignsQuery({
		...dateParams,
		limit: 5,
		sort_by: 'revenue',
		order: 'desc',
	});
	const campaigns = res?.data ?? [];

	if (!isLoading && campaigns.length === 0) {
		return <EmptyData />;
	}

	return (
		<Card
			className={cn(
				'disco-relative disco-ring-0 disco-border-2 disco-border-[#e5e7eb] disco-rounded-[10px] disco-p-4 disco-gap-0',
				className
			)}
		>
			{!isPro && !isLoading && (
				<ProLockOverlay
					label={__('Upgrade to See All', 'disco')}
					position="disco-inset-x-0 disco-bottom-0 disco-h-[55%]"
					rounded="disco-rounded-b-[10px]"
				/>
			)}
			<div className="disco-flex disco-items-center disco-justify-between">
				<h3 className="disco-text-base disco-font-semibold disco-text-[#1f2937]">
					{__('Top campaigns', 'disco')}
				</h3>
				<Link
					to="/campaigns-reports"
					className="disco-text-xs disco-font-medium disco-text-primary hover:disco-underline hover:disco-text-primary"
				>
					{__('View all', 'disco')} →
				</Link>
			</div>

			{isLoading ? (
				<div className="disco-space-y-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="disco-h-8 disco-animate-pulse disco-rounded disco-bg-[#f3f4f6]"
						/>
					))}
				</div>
			) : (
				<ul>
					{campaigns.map(
						({ campaign_id, campaign_name, revenue }, index) => (
							<li
								key={campaign_id}
								className="disco-flex disco-items-center disco-justify-between disco-py-2 disco-border-b disco-border-[#f3f4f6] last:disco-border-0"
							>
								<span className="disco-flex disco-items-center disco-gap-2 disco-text-xs disco-font-medium disco-text-[#1f2937]">
									<span
										className="disco-size-[6px] disco-rounded-[3px] disco-shrink-0"
										style={{
											background:
												CAMPAIGN_COLORS[
													index %
														CAMPAIGN_COLORS.length
												],
										}}
									/>
									{truncate(campaign_name, 30)}
								</span>
								<span className="disco-text-xs disco-font-semibold disco-text-[#111827]">
									{fmt(revenue)}
								</span>
							</li>
						)
					)}
				</ul>
			)}
		</Card>
	);
};

export default TopCampaigns;
