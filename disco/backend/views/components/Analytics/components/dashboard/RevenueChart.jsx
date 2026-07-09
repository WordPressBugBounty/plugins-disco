import { Card } from '@/components/ui/card';
import { selectDateRangeParams } from '@/features/dateRange/dateRangeSlice';
import { useGetRevenueChartQuery } from '@/features/summary/summaryApi';
import { cn, fmt, formatXAxisDate } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import CustomTooltipByRevenueChart from './CustomTooltipByRevenueChart';

const RevenueChart = ({ className }) => {
	const dateParams = useSelector(selectDateRangeParams);
	const { data: res, isLoading } = useGetRevenueChartQuery(dateParams);
	const data = res?.data ?? [];
	const interval = res?.interval ?? 'day';

	const daysDiff =
		(new Date(dateParams.date_to) - new Date(dateParams.date_from)) /
		(1000 * 60 * 60 * 24);
	const isLongRange = daysDiff > 90;

	return (
		<Card
			className={cn(
				'disco-ring-0 disco-border-2 disco-border-[#e5e7eb] disco-rounded-[10px] disco-p-4 disco-gap-2',
				className
			)}
		>
			<div>
				<h3 className="disco-text-base disco-font-semibold disco-text-[#1f2937]">
					{__('Revenue over time', 'disco')}
				</h3>
				<p className="disco-text-xs disco-text-[#9ca3af]">
					{__('Net revenue vs disco', 'disco')}
				</p>
			</div>

			{isLoading ? (
				<div className="disco-h-[280px] disco-animate-pulse disco-rounded-lg disco-bg-[#f3f4f6]" />
			) : (
				<ResponsiveContainer width="100%" height={280}>
					<LineChart
						data={data}
						margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
						<XAxis
							dataKey="date"
							tick={{ fontSize: 9, fill: '#637381' }}
							tickLine={false}
							axisLine={false}
							tickFormatter={(v) =>
								formatXAxisDate(v, isLongRange)
							}
						/>
						<YAxis
							tick={{ fontSize: 9, fill: '#637381' }}
							tickLine={false}
							axisLine={false}
							tickFormatter={(v) => `${fmt(v)}`}
						/>
						<Tooltip
							content={
								<CustomTooltipByRevenueChart
									interval={interval}
								/>
							}
						/>
						<Legend
							iconType="circle"
							iconSize={8}
							wrapperStyle={{
								fontSize: '11px',
								color: '#6b7280',
							}}
							formatter={(value) =>
								value === 'net_sales'
									? 'Net Sale'
									: 'Discount Sale'
							}
						/>
						<Line
							type="monotone"
							dataKey="net_sales"
							stroke="#47cd89"
							strokeWidth={2}
							dot={false}
							name="net_sales"
						/>
						<Line
							type="monotone"
							dataKey="discount_sales"
							stroke="#f59e0b"
							strokeWidth={2}
							dot={false}
							name="discount_sales"
						/>
					</LineChart>
				</ResponsiveContainer>
			)}
		</Card>
	);
};

export default RevenueChart;
