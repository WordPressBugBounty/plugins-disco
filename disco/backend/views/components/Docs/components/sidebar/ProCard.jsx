import { __ } from '@wordpress/i18n';
import { Zap } from 'lucide-react';
import checkIcon from '../../../../asset/img/icons/check-icon.svg';

const PRICING_URL =
	'https://discoplugin.com/?utm_source=doc_page&utm_medium=banner&utm_campaign=free-pro&utm_id=1#pricing';

export default function DiscoProCard() {
	const proFeatures = [
		'Multi-Currency Integrations',
		'ACF Custom Field Conditions',
		'Advanced BOGO (% ,Fixed & Free)',
		'Unlimited Advance Conditions',
		'10X Conversion With Display Discount',
		'Purchase History-Based Discount',
		'Segmentation-Based Discount',
		'Dedicated Priority Support',
	];

	return (
		<div className="disco:rounded-lg disco:overflow-hidden disco:text-white disco:bg-linear-to-br disco:from-[#1a2e1a] disco:via-[#2d4a2d] disco:to-[#1a3a2a]">
			<div className="disco:p-4">
				<h3 className="disco:text-xl! disco:text-white! disco:font-bold! disco:m-0 disco:mb-1!">
					{__('Unlock', 'disco')}{' '}
					<span className="disco:text-primary">
						{__('Disco Pro', 'disco')}
					</span>
				</h3>
				<p className="disco:text-sm! disco:text-gray-300 disco:m-0 disco:mb-3!">
					{__(
						'Get more discount power, analytics and integrations',
						'disco'
					)}
				</p>

				<div className="disco:flex disco:flex-col disco:gap-3">
					{proFeatures.map((f, i) => (
						<div
							key={i}
							className="disco:flex disco:items-center disco:gap-2"
						>
							<span className="disco:w-5 disco:h-5 disco:rounded-full disco:bg-[#22C55E33] disco:border disco:border-primary disco:flex disco:items-center disco:justify-center disco:shrink-0">
								<img src={checkIcon} alt="check icon" />
							</span>
							<span className="disco:text-sm disco:text-gray-100">
								{f}
							</span>
						</div>
					))}
				</div>

				<a
					href={PRICING_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="disco:w-full disco:mt-6 disco:py-3.5 disco:px-6 disco:rounded-full disco:border-none disco:cursor-pointer disco:font-bold disco:text-base! disco:text-white! disco:flex disco:items-center disco:justify-center disco:gap-2 disco:transition-all! disco:hover:scale-105 disco:active:scale-95 disco:no-underline disco:hover:text-white! disco:bg-linear-to-r disco:from-amber-400 disco:to-orange-500 disco:shadow-orange-500/50 disco:shadow-md disco:outline-hidden disco:focus:shadow-none! disco:focus:text-white! disco:focus:rounded-full!"
				>
					<Zap size={16} strokeWidth={2} />
					{__('Upgrade Pro Now', 'disco')}
				</a>

				<p className="disco:text-center disco:text-xs! disco:text-gray-400! disco:mt-3! disco:mb-0">
					{__('🛡️ 14-day money-back guarantee', 'disco')}
				</p>
			</div>
		</div>
	);
}
