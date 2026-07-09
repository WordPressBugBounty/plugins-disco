import IntentBadge from './IntentBadge';
import StatusBadge from './StatusBadge';

const CampaignHeader = ({ campaign }) => {
	const { dotColor, name, intent, dateRange, status } = campaign;

	return (
		<div className="disco-bg-white disco-border disco-border-[#e5e7eb] disco-rounded-xl disco-px-4 disco-py-4 disco-flex disco-items-center disco-justify-between">
			{/* Left: identity */}
			<div className="disco-flex disco-items-start disco-gap-3">
				<span
					className="disco-size-[9px] disco-rounded-[3px] disco-shrink-0 disco-mt-1.5"
					style={{ backgroundColor: dotColor }}
				/>
				<div>
					<h2 className="disco-text-sm disco-font-bold disco-text-[#111827] disco-tracking-tight disco-leading-snug">
						{name}
					</h2>
					<div className="disco-flex disco-items-center disco-gap-1.5 disco-mt-1.5 disco-flex-wrap">
						<IntentBadge intent={intent} />
						<span className="disco-text-xs disco-text-gray-500">
							{dateRange}
						</span>
						<StatusBadge status={status} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CampaignHeader;
