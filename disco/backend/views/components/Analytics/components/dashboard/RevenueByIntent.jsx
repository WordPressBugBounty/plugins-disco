import { Card } from '@/components/ui/card';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { useGetIntentsPerformanceQuery } from '@/features/summary/summaryApi';
import useIsPro from '@/lib/useIsPro';
import { cn, fmt } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ProLockOverlay from '../ui-blocks/ProLockOverlay';

const INTENT_COLORS = {
	product: '#f16060',
	shipping: '#5895f7',
	bulk: '#9c74f7',
	bogo: '#f6ad2f',
	bundle: '#f68839',
	cart: '#44c1da',
	others: '#06b6fe',
};

const defaults_intents = [
	{
		intent: 'Product',
		revenue: 0,
		orders: 0,
		percentage: 0,
	},
	{
		intent: 'Cart',
		revenue: 0,
		orders: 0,
		percentage: 0,
	},
	{
		intent: 'Shipping',
		revenue: 0,
		orders: 0,
		percentage: 0,
	},
	{
		intent: 'Bulk',
		revenue: 0,
		orders: 0,
		percentage: 0,
	},
	{
		intent: 'BOGO',
		revenue: 0,
		orders: 0,
		percentage: 0,
	},
	{
		intent: 'Bundle',
		revenue: 0,
		orders: 0,
		percentage: 0,
	},
	{
		intent: 'Others',
		revenue: 0,
		orders: 0,
		percentage: 0,
	},
];

function getColor(intent, index) {
	const key = intent?.toLowerCase();
	return (
		INTENT_COLORS[key] ??
		Object.values(INTENT_COLORS)[
			index % Object.values(INTENT_COLORS).length
		]
	);
}

const CustomTooltip = ({ active, payload }) => {
	if (!active || !payload?.length) return null;
	const {
		name,
		value,
		payload: { color },
	} = payload[0];
	return (
		<div className="disco-bg-white disco-border disco-border-[#e5e7eb] disco-rounded-lg disco-px-2 disco-py-1 disco-text-[10px] disco-shadow disco-z-50">
			<span style={{ color }}>{name}: </span>
			<strong>{value}%</strong>
		</div>
	);
};

const RevenueByIntent = ({ className }) => {
	const isPro = useIsPro();
	const dateParams = useSelector(selectDateRangeParams);
	const { data: res, isLoading } = useGetIntentsPerformanceQuery(dateParams);
	const intentsRes = res;

	const intentsData = defaults_intents.map((defaultIntent) => {
		const matchIntent = (intentsRes?.data ?? []).find(
			(item) =>
				item.intent.toLowerCase() === defaultIntent.intent.toLowerCase()
		);
		return {
			name: defaultIntent.intent,
			value: matchIntent ? matchIntent.percentage : 0,
			color: getColor(defaultIntent.intent),
		};
	});

	const chartData = (intentsRes?.data ?? []).map((item, i) => ({
		name: item.intent,
		value: item.percentage,
		color: getColor(item.intent, i),
	}));

	const totalRevenue = intentsRes?.total_revenue ?? 0;
	const totalLabel = totalRevenue
		? totalRevenue >= 1000
			? `${fmt((totalRevenue / 1000).toFixed(2))}k`
			: `${fmt(totalRevenue.toFixed(2))}`
		: '--';

	return (
		<Card
			className={cn(
				'disco-relative disco-ring-0 disco-border-2 disco-border-[#e5e7eb] disco-rounded-[10px] disco-p-4 disco-gap-2',
				className
			)}
		>
			{!isPro && (
				<ProLockOverlay
					showIcon
					title={__('Intent breakdown', 'disco')}
					label={__('Unlock', 'disco')}
				/>
			)}
			<div>
				<h3 className="disco-text-base disco-font-semibold disco-text-[#1f2937]">
					{__('Revenue by intent', 'disco')}
				</h3>
				<p className="disco-text-xs disco-text-[#9ca3af]">
					{__('Campaign type breakdown', 'disco')}
				</p>
			</div>

			{isLoading ? (
				<div className="disco-h-[200px] disco-animate-pulse disco-rounded-lg disco-bg-[#f3f4f6]" />
			) : (
				<div className="disco-flex disco-flex-col disco-items-center disco-gap-4">
					<div
						className="disco-relative disco-shrink-0"
						style={{ width: 160, height: 160 }}
					>
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={chartData}
									cx="50%"
									cy="50%"
									innerRadius={52}
									outerRadius={78}
									dataKey="value"
									strokeWidth={0}
									paddingAngle={1}
								>
									{chartData.map(({ name, color }) => (
										<Cell key={name} fill={color} />
									))}
								</Pie>
								<Tooltip
									wrapperStyle={{
										zIndex: 999,
									}}
									content={<CustomTooltip />}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="disco-absolute disco-inset-0 disco-flex disco-flex-col disco-items-center disco-justify-center disco-pointer-events-none">
							<span className="disco-text-base disco-font-bold disco-text-[#111827]">
								{totalLabel}
							</span>
							<span className="disco-text-xs disco-text-[#9ca3af]">
								{__('revenue', 'disco')}
							</span>
						</div>
					</div>

					<ul className="disco-w-full disco-flex disco-flex-col disco-flex-1">
						{intentsData?.map(({ name, value, color }) => (
							<li
								key={name}
								className="disco-flex disco-items-center disco-justify-between disco-text-xs"
							>
								<span className="disco-flex disco-items-center disco-gap-1.5 disco-text-[#4b5563]">
									<span
										className="disco-size-[6px] disco-rounded-sm disco-shrink-0"
										style={{ background: color }}
									/>
									{name}
								</span>
								<span className="disco-font-semibold disco-text-[#1f2937]">
									{value}%
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</Card>
	);
};

export default RevenueByIntent;
