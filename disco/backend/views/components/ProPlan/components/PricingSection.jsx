import { useState } from 'react';
import { StarIcon } from './icons';
import PricingCard from './PricingCard';
import pricingPlans from '../data/pricing';

function PricingSection() {
	const [yearly, setYearly] = useState(true);

	return (
		<div className="disco-max-w-5xl disco-mx-auto disco-px-4 disco-pb-10">
			{/* Toggle */}
			<div className="disco-flex disco-items-center disco-justify-center disco-gap-3 disco-mb-8">
				<span
					className={`disco-text-sm disco-font-medium ${yearly ? 'disco-text-gray-900' : 'disco-text-gray-400'}`}
				>
					Yearly
				</span>
				<button
					onClick={() => setYearly(!yearly)}
					className={`disco-relative disco-w-12 disco-h-6 disco-rounded-full disco-transition-colors ${!yearly ? 'disco-bg-emerald-500' : 'disco-bg-gray-300'}`}
				>
					<span
						className={`disco-absolute disco-top-0.5 disco-w-5 disco-h-5 disco-bg-white disco-rounded-full disco-shadow disco-transition-transform ${!yearly ? 'disco-left-6' : 'disco-left-0.5'}`}
					/>
				</button>
				<span
					className={`disco-text-sm disco-font-medium ${!yearly ? 'disco-text-gray-900' : 'disco-text-gray-400'}`}
				>
					Lifetime
				</span>

				<span
					className="disco-text-white disco-text-xs disco-font-bold disco-px-2 disco-py-0.5 disco-rounded-full disco-transition-all"
					style={{
						background: !yearly
							? `linear-gradient(103deg, #16A34A 0%, #22C55E 100%)`
							: 'linear-gradient(103deg, #F59E0B 0%, #C55022 100%)',
					}}
				>
					{!yearly ? 'BEST VALUE' : 'SAVE 60%'}
				</span>
			</div>
			<p className="disco-text-center disco-text-gray-400 disco-text-sm disco-mb-8">
				Upgrade now and save big. Pay once — only renew to continue
				updates.
			</p>

			{/* Cards */}
			<div className="disco-w-full disco-grid disco-grid-cols-1 md:disco-grid-cols-3 disco-gap-6 disco-items-start">
				{pricingPlans.map((plan, i) => (
					<PricingCard key={i} plan={plan} yearly={yearly} />
				))}
			</div>

			{/* Trust bar */}
			<div className="disco-flex disco-flex-wrap disco-items-center disco-justify-center disco-gap-6 disco-mt-10 disco-text-sm disco-text-gray-500">
				<span className="disco-font-semibold disco-text-black">
					<span className="disco-font-bold disco-text-lg disco-text-primary">
						700+
					</span>{' '}
					Active stores
				</span>
				<span className="disco-flex disco-items-center disco-gap-1">
					{[1, 2, 3, 4, 5].map((n) => (
						<StarIcon key={n} filled />
					))}
					<span className="disco-ml-1 disco-font-medium">
						4.6/5 rating
					</span>
				</span>
				<span>
					<span className="disco-font-bold disco-text-lg disco-text-primary">
						14-days
					</span>{' '}
					Money-back guarantee
				</span>
				<span>
					<span className="disco-font-bold disco-text-lg disco-text-primary">
						24h
					</span>{' '}
					Priority support
				</span>
			</div>
		</div>
	);
}

export default PricingSection;
