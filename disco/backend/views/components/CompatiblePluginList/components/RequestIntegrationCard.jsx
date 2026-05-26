import { __ } from '@wordpress/i18n';

export default function RequestIntegrationCard() {
	const handleClick = () => {
		window.open(
			'https://discoplugin.com/my-account/support/',
			'_blank',
			'noopener,noreferrer'
		);
	};

	return (
		<div
			onClick={handleClick}
			className="disco-group disco-cursor-pointer disco-bg-[#f8fafc] disco-border-2 disco-border-dashed disco-border-[#e2e8f0] disco-rounded-[14px] disco-flex disco-flex-col disco-items-center disco-justify-center disco-gap-3 disco-min-h-[200px] hover:disco-border-primary disco-transition-all disco-duration-300"
		>
			<div className="disco-w-11 disco-h-11 disco-rounded-[22px] disco-bg-[#f1f5f9] disco-flex disco-items-center disco-justify-center disco-text-[#1e293b] disco-text-xl disco-font-normal group-hover:disco-bg-primary group-hover:!disco-text-white disco-transition-all disco-duration-300">
				&#xff0b;
			</div>
			<div className="disco-text-center">
				<p className="disco-text-[13px] disco-font-bold disco-text-[#334155] disco-leading-none disco-mb-1.5">
					{__('Request an Integration', 'disco')}
				</p>
				<p className="disco-text-[11.5px] disco-font-normal disco-text-[#94a3b8] disco-leading-[16.1px] disco-text-center">
					{__("Using a plugin that isn't listed?", 'disco')}
					<br />
					{__("Tell us and we'll prioritize it.", 'disco')}
				</p>
			</div>
		</div>
	);
}
