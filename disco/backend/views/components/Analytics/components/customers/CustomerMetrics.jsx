import useIsPro from '@/lib/useIsPro';
import { fmt } from '@/lib/utils';
import { ShoppingCart, Tag, Users, Wallet } from 'lucide-react';
import MetricCard from '../campaigns/MetricCard';

const CustomerMetrics = ({ totalSpent, orders, campaignsCount }) => {
	const isPro = useIsPro();
	const metrics = [
		{
			icon: Wallet,
			iconBg: '#dcfce7',
			label: 'Total Spent',
			value: fmt(totalSpent),
		},
		{
			icon: ShoppingCart,
			iconBg: '#FEF9C3',
			label: 'Orders',
			value: orders,
		},
		{
			icon: Tag,
			iconBg: '#DBEAFE',
			label: 'Campaigns Used',
			value: campaignsCount,
		},
		{
			icon: Users,
			iconBg: '#F8C3FE4A',
			label: 'Avg Order Value',
			value: orders > 0 ? fmt(totalSpent / orders) : '$0.00',
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

export default CustomerMetrics;
