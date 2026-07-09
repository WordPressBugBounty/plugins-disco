import { fmt, formatTooltipDate } from '@/lib/utils';

const CustomTooltipByRevenueChart = ({ active, payload, label, interval }) => {
	if (!active || !payload?.length) return null;
	return (
		<div className="disco-bg-[#1e2327] disco-text-white disco-rounded-lg disco-p-2 disco-text-[10px] disco-shadow-lg">
			<p className="disco-text-[#bbcfff] disco-mb-1">
				{formatTooltipDate(label, interval)}
			</p>
			{payload.map((p) => (
				<p key={p.name} style={{ color: p.color }}>
					{p.name === 'net_sales' ? 'Net Sales' : 'Discount Sales'}:{' '}
					<strong className="disco-text-white">{fmt(p.value)}</strong>
				</p>
			))}
		</div>
	);
};

export default CustomTooltipByRevenueChart;
