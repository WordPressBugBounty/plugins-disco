import { __ } from '@wordpress/i18n';
import useIsPro from '../../../../../../hooks/useIsPro';

const PRICING_URL =
	'https://discoplugin.com/?utm_source=display_banner&utm_medium=button&utm_campaign=free-pro&utm_id=1';

const UnlockProBanner = () => {
	const isPro = useIsPro();
	if (isPro) {
		return null;
	}

	return (
		<div className="disco-relative disco-overflow-hidden disco-rounded-[18px] disco-border disco-border-[rgba(34,197,94,0.15)] disco-flex disco-items-center disco-justify-between disco-gap-6 disco-px-10 disco-py-5 disco-bg-[linear-gradient(142deg,#0C1A10_0%,#1A3323_100%)]">
			{/* Radial glow decoration (top-right) */}
			<div className="disco-absolute disco-right-[29px] disco-top-[-30px] disco-w-[160px] disco-h-[160px] disco-pointer-events-none disco-bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12)_0%,rgba(34,197,94,0)_65%)]" />

			{/* Text content */}
			<div className="disco-flex disco-flex-col disco-gap-1 disco-min-w-0">
				<p className="disco-m-0 disco-text-[15px] disco-font-extrabold disco-text-white disco-tracking-[-0.1px] disco-leading-snug">
					{__('Stores using Display blocks see ', 'disco')}
					<span className="disco-text-[#4ade80]">
						{__('34% higher AOV', 'disco')}
					</span>
					{__(' on average', 'disco')}
				</p>
				<p className="disco-m-0 disco-text-[12px] disco-leading-[18px] disco-text-white/80">
					<strong className="disco-font-bold">
						{__(
							"You're building a campaign without visuals — that's like running a sale with no signs. Display blocks separate winners from losers.",
							'disco'
						)}
					</strong>
				</p>
			</div>

			{/* CTA Button */}
			<a
				href={PRICING_URL}
				target="_blank"
				rel="noopener noreferrer"
				className="disco-relative disco-shrink-0 disco-flex disco-items-center disco-justify-center disco-h-[33px] disco-min-w-[179px] disco-rounded-[14px] disco-text-white disco-text-[12px] disco-font-extrabold disco-text-center disco-no-underline disco-px-5 disco-whitespace-nowrap disco-bg-[linear-gradient(135deg,#F59E0B_0%,#F97316_100%)] disco-shadow-[0px_3px_12px_0px_rgba(245,158,11,0.35)] hover:disco-text-white hover:disco-scale-105 disco-transition-all disco-duration-300 focus:disco-rounded-[14px] focus:!disco-outline-none focus:!disco-shadow-none focus:!disco-border-none"
			>
				{__('⚡ Unlock Display Blocks', 'disco')}
			</a>
		</div>
	);
};

export default UnlockProBanner;
