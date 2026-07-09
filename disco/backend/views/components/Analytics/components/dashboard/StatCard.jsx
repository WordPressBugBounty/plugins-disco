import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CARD_STYLES = {
	campaigns: 'disco-bg-[#f3efff]',
	net: 'disco-bg-[#f6fff9]',
	discount: 'disco-bg-[#fff8ec]',
	orders: 'disco-bg-[#e5eeff]',
	discountOrders: 'disco-bg-[#e9ffff]',
	customers: 'disco-bg-[#eeffe6]',
};

const StatCard = ({
	title,
	subtitle,
	value,
	trend,
	icon,
	variant = 'net',
	isLoading,
	isTrendUp,
}) => {
	return (
		<div
			className={cn(
				'disco-relative disco-overflow-hidden disco-rounded-[10px] disco-border-2 disco-border-[#e5e7eb] disco-p-4 disco-flex-1 disco-min-w-[240px]',
				CARD_STYLES[variant]
			)}
		>
			<div className="disco-flex disco-items-start disco-justify-between disco-mb-2">
				<div>
					<p className="disco-text-xs disco-font-semibold disco-uppercase disco-tracking-[0.5px] disco-text-black">
						{title}
					</p>
					{subtitle && (
						<p className="disco-text-[8px] disco-text-[#575757]">
							{subtitle}
						</p>
					)}
				</div>
				<img src={icon} alt={title} className="disco-w-6 disco-h-6" />
			</div>

			{isLoading ? (
				<>
					<div className="disco-h-8 disco-w-24 disco-bg-gray-300/50 disco-rounded disco-mb-2 disco-animate-pulse" />
					<div className="disco-h-5 disco-w-32 disco-bg-gray-300/50 disco-rounded-full disco-animate-pulse" />
				</>
			) : (
				<>
					<p className="disco-text-2xl disco-font-bold disco-text-[#111827] disco-tracking-tight disco-mb-2">
						{value}
					</p>
					{trend && (
						<Badge
							className={`${isTrendUp ? '!disco-bg-[#dcfce7] disco-text-[#15803d]' : '!disco-bg-[#FFE0DE] disco-text-[#DC5243]'}   disco-text-[8px] disco-font-medium disco-rounded-full disco-px-2 disco-py-0.5 disco-border-0`}
						>
							{trend}
						</Badge>
					)}
				</>
			)}
		</div>
	);
};

export default StatCard;
