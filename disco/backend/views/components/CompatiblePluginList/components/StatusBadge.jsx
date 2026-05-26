import { __ } from '@wordpress/i18n';

function StatusBadge({ status }) {
	if (status === 'detected') {
		return (
			<div className="disco-flex disco-items-center disco-gap-1.5 disco-bg-[#dcfce7] disco-rounded-full disco-px-2.5 disco-py-1 disco-h-[21px]">
				<span className="disco-w-1.5 disco-h-1.5 disco-rounded-[3px] disco-bg-[#16a34a] disco-shrink-0" />
				<span className="disco-text-[#15803d] disco-text-[11px] disco-font-bold disco-tracking-[0.22px] disco-leading-none">
					{__('Detected', 'disco')}
				</span>
			</div>
		);
	}
	return (
		<div className="disco-flex disco-items-center disco-gap-1.5 disco-bg-[#f1f5f9] disco-rounded-full disco-px-2.5 disco-py-1 disco-h-[21px]">
			<span className="disco-w-1.5 disco-h-1.5 disco-rounded-[3px] disco-bg-[#94a3b8] disco-shrink-0" />
			<span className="disco-text-[#1e293b] disco-text-[11px] disco-font-bold disco-tracking-[0.22px] disco-leading-none">
				{__('Not Installed', 'disco')}
			</span>
		</div>
	);
}

export default StatusBadge;
