import { __ } from '@wordpress/i18n';
import checkIcon from '../../../asset/img/icons/check-icon.svg';

const PRICING_URL =
	'https://discoplugin.com/?utm_source=campaign_page&utm_medium=banner&utm_campaign=free-pro&utm_id=1#pricing';

export default function DiscoProCard() {
	const proFeatures = [
		'Multi-Currency Integrations',
		'ACF Custom Field Conditions',
		'Advanced BOGO (% ,Fixed & Free)',
		'Unlimited Advance Conditions',
		'Display Blocks That Convert 10x',
		'Purchase History-Based Discount',
		'Segmentation-Based Discount',
		'Dedicated Priority Support',
	];

	return (
		<div className="disco-rounded-lg disco-overflow-hidden disco-text-white disco-bg-gradient-to-br disco-from-[#1a2e1a] disco-via-[#2d4a2d] disco-to-[#1a3a2a]">
			<div className="disco-p-4">
				<h3 className="disco-text-xl disco-text-white disco-font-bold disco-m-0 disco-mb-1">
					{__('Unlock', 'disco')}{' '}
					<span className="disco-text-primary">
						{__('Disco Pro', 'disco')}
					</span>
				</h3>
				<p className="disco-text-sm disco-text-gray-300 disco-m-0 disco-mb-5">
					{__(
						'Get more discount power, analytics and integrations',
						'disco'
					)}
				</p>

				<div className="disco-flex disco-flex-col disco-gap-3">
					{proFeatures.map((f, i) => (
						<div
							key={i}
							className="disco-flex disco-items-center disco-gap-2"
						>
							<span className="disco-w-5 disco-h-5 disco-rounded-full disco-bg-[#22C55E33] disco-border disco-border-primary disco-flex disco-items-center disco-justify-center disco-flex-shrink-0">
								<img src={checkIcon} alt="check icon" />
							</span>
							<span className="disco-text-sm disco-text-gray-100">
								{f}
							</span>
						</div>
					))}
				</div>

				<a
					href={PRICING_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="disco-w-full disco-mt-6 disco-py-3.5 disco-px-6 disco-rounded-full disco-border-none disco-cursor-pointer disco-font-bold disco-text-base disco-text-white disco-flex disco-items-center disco-justify-center disco-gap-2 disco-transition-transform hover:disco-scale-105 active:disco-scale-95 disco-no-underline hover:disco-text-white disco-bg-gradient-to-r disco-from-amber-400 disco-to-orange-500 disco-shadow-orange-500/50 disco-shadow-md disco-outline-none focus:disco-shadow-none focus:disco-text-white focus:disco-rounded-full"
				>
					<span>⚡</span> {__('Upgrade Pro Now', 'disco')}
				</a>

				<p className="disco-text-center disco-text-xs disco-text-gray-400 disco-mt-3 disco-mb-0">
					{__('🛡️ 14-day money-back guarantee', 'disco')}
				</p>
			</div>
		</div>
	);
}
