import { __ } from '@wordpress/i18n';

export default function BottomCTA() {
	return (
		<div
			className="disco-relative disco-rounded-[20px] disco-overflow-hidden disco-px-7 disco-py-7 disco-flex disco-items-center disco-justify-between disco-border disco-border-[rgba(34,197,94,0.2)]"
			style={{
				backgroundImage:
					'linear-gradient(134.55deg, #052E16 0%, #14532D 100%)',
			}}
		>
			<div className="disco-flex disco-flex-col disco-gap-2 disco-max-w-[60%]">
				<h2 className="disco-text-white disco-text-[16px] disco-font-extrabold disco-tracking-[-0.2px] disco-leading-none">
					{__(
						'Unlock all integrations + 10× more power with Disco Pro',
						'disco'
					)}
				</h2>
				<p className="disco-text-[rgba(255,255,255,0.6)] disco-text-[13px] disco-font-normal disco-leading-[19.5px]">
					{__(
						'Multi-currency discounts, role-based pricing, advanced analytics, and unlimited campaigns — used by 1000+ WooCommerce stores.',
						'disco'
					)}
				</p>
			</div>
			<a
				href="https://discoplugin.com/?utm_source=Compatible_page&utm_medium=banner&utm_campaign=free-pro&utm_id=1#pricing"
				target="_blank"
				rel="noopener noreferrer"
				className="disco-no-underline focus:disco-text-white focus:disco-rounded-xl disco-flex disco-items-center disco-justify-center disco-h-10 disco-px-5 disco-rounded-[14px] disco-text-white disco-text-[13px] disco-font-extrabold disco-shadow-[0px_8px_24px_0px_rgba(22,163,74,0.18)] disco-whitespace-nowrap disco-shrink-0 hover:disco-text-white hover:disco-scale-105 disco-transition-all disco-duration-300"
				style={{
					backgroundImage:
						'linear-gradient(105.54deg, #0DC98B 0%, #07C888 100%)',
				}}
			>
				{__('⚡ Upgrade to Pro →', 'disco')}
			</a>
			<span
				className="disco-absolute disco-text-[80px] disco-leading-none disco-opacity-[0.06] disco-text-[#1e293b] disco-pointer-events-none"
				style={{ right: '170px', bottom: '-20px' }}
			>
				&#9889;
			</span>
		</div>
	);
}
