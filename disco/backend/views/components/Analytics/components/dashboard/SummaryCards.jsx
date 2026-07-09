import StatCard from '@/components/dashboard/StatCard';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { useGetSummaryQuery } from '@/features/summary/summaryApi';
import { fmt } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';

function formatTrend(metric) {
	if (!metric) return '-- vs last period';
	const { change_percent, trend, previous, current } = metric;
	if (change_percent === null && previous === 0 && current === 0) {
		return '↓ 0% vs last period';
	} else if (change_percent === null && previous === 0 && current > 0) {
		return '↑ 100%+ vs last period';
	}
	const abs = Math.abs(change_percent).toFixed(1);
	return trend === 'up'
		? `↑ +${abs}% vs last period`
		: `↓ -${abs}% vs last period`;
}

const CARD_CONFIGS = [
	{
		title: __('Active Campaigns', 'disco'),
		icon: require('../../../../asset/img/icons/analytics/target.svg')
			.default,
		variant: 'campaigns',
		getValue: (d) => d?.active_campaigns?.current ?? '--',
		isTrendUp: (d) => d?.active_campaigns?.trend === 'up',
	},
	{
		title: __('Net Sale', 'disco'),
		subtitle: '(Woo + Disco)',
		icon: require('../../../../asset/img/icons/analytics/chart.svg')
			.default,
		variant: 'net',
		getValue: (d) => fmt(d?.net_sales?.current),
		getTrend: (d) => formatTrend(d?.net_sales),
		isTrendUp: (d) => d?.net_sales?.trend === 'up',
	},
	{
		title: __('Discount Sale', 'disco'),
		subtitle: '(By Disco)',
		icon: require('../../../../asset/img/icons/analytics/discount.svg')
			.default,
		variant: 'discount',
		getValue: (d) => fmt(d?.discount_sales?.current),
		getTrend: (d) => formatTrend(d?.discount_sales),
		isTrendUp: (d) => d?.discount_sales?.trend === 'up',
	},
	{
		title: __('Total Orders', 'disco'),
		subtitle: '(Woo + Disco)',
		icon: require('../../../../asset/img/icons/analytics/orders.svg')
			.default,
		variant: 'orders',
		getValue: (d) => d?.total_orders?.current ?? '--',
		getTrend: (d) => formatTrend(d?.total_orders),
		isTrendUp: (d) => d?.total_orders?.trend === 'up',
	},
	{
		title: __('Orders with Discount', 'disco'),
		subtitle: '(Disco)',
		icon: require('../../../../asset/img/icons/analytics/check.svg')
			.default,
		variant: 'discountOrders',
		getValue: (d) => d?.disco_orders?.current ?? '--',
		getTrend: (d) => formatTrend(d?.disco_orders),
		isTrendUp: (d) => d?.disco_orders?.trend === 'up',
	},
	{
		title: __('Customers', 'disco'),
		subtitle: '(Disco)',
		icon: require('../../../../asset/img/icons/analytics/customers.svg')
			.default,
		variant: 'customers',
		getValue: (d) => d?.customers?.current ?? '--',
		getTrend: (d) => formatTrend(d?.customers),
		isTrendUp: (d) => d?.customers?.trend === 'up',
	},
];

const SummaryCards = () => {
	const dateParams = useSelector(selectDateRangeParams);
	const { data: res, isLoading, isFetching } = useGetSummaryQuery(dateParams);
	const data = res?.data;

	return (
		<div className="disco-grid disco-grid-cols-4 disco-gap-2.5 disco-mb-3">
			{CARD_CONFIGS.map(
				({
					title,
					subtitle,
					icon,
					variant,
					getValue,
					getTrend,
					isTrendUp,
				}) => (
					<StatCard
						key={title}
						title={title}
						subtitle={subtitle}
						value={getValue(data)}
						trend={getTrend ? getTrend(data) : null}
						icon={icon}
						variant={variant}
						isLoading={isLoading || isFetching}
						isTrendUp={isTrendUp(data)}
					/>
				)
			)}
		</div>
	);
};

export default SummaryCards;
