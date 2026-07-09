import { __ } from '@wordpress/i18n';
import { Sparkles } from 'lucide-react';

const MetricCard = ({ icon: Icon, iconBg, label, value, locked = false }) => (
	<div className="disco-relative disco-bg-white disco-border disco-border-[#e5e7eb] disco-rounded-xl disco-px-4 disco-py-3.5 disco-flex disco-items-center disco-gap-3 disco-flex-1 disco-overflow-hidden">
		<span
			className="disco-size-8 disco-flex disco-items-center disco-justify-center disco-rounded-lg disco-text-base disco-shrink-0"
			style={{ backgroundColor: iconBg }}
		>
			<Icon className="disco-size-4" />
		</span>
		<div>
			<p className="disco-text-[10px] disco-font-semibold disco-text-[#9ca3af] disco-uppercase disco-tracking-wider disco-leading-none">
				{label}
			</p>
			<p className="disco-text-base disco-font-bold disco-text-[#111827] disco-mt-1 disco-leading-tight">
				{value}
			</p>
		</div>

		{locked && (
			<div className="disco-absolute disco-inset-0 disco-flex disco-items-center disco-justify-center disco-bg-white/80 disco-backdrop-blur-[2px]">
				<span className="disco-inline-flex disco-items-center disco-gap-1 disco-rounded-md disco-bg-primary disco-px-2 disco-py-1 disco-text-[11px] disco-font-semibold disco-text-white">
					<Sparkles className="disco-size-3" />
					{__('Pro feature', 'disco')}
				</span>
			</div>
		)}
	</div>
);

export default MetricCard;
