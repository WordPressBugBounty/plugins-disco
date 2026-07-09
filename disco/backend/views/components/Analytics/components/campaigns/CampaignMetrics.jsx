import useIsPro from '@/lib/useIsPro';
import { fmt } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { ShoppingCart, Users, Wallet } from 'lucide-react';
import MetricCard from './MetricCard';

const CampaignMetrics = ({
	revenue,
	averageOrderValue,
	totalOrders,
	customers,
}) => {
	const isPro = useIsPro();
	const metrics = [
		{
			icon: Wallet,
			iconBg: '#dcfce7',
			label: __('Revenue', 'disco'),
			value: fmt(revenue),
		},
		{
			icon: ShoppingCart,
			iconBg: '#FEF9C3',
			label: __('Total Orders', 'disco'),
			value: totalOrders,
		},
		{
			icon: Users,
			iconBg: '#F8C3FE4A',
			label: __('Customers', 'disco'),
			value: customers,
		},
		{
			icon: ShoppingCart,
			iconBg: '#DBEAFE',
			label: __('Avg Order Value', 'disco'),
			value: fmt(averageOrderValue),
		},
	];

	return (
		<div className="disco-flex disco-gap-3">
			{metrics.map((m, index) => (
				<MetricCard key={m.label} {...m} locked={!isPro && index > 0} />
			))}
		</div>
	);
};

export default CampaignMetrics;
