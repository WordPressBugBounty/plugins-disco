export default function PricingCard({ plan, yearly }) {
	const price = yearly ? plan.yearlyPrice : plan.lifetimePrice;
	const original = yearly ? plan.originalYearly : plan.originalLifetime;

	const checkoutUrl = yearly
		? plan.checkoutUrl.yearly
		: plan.checkoutUrl.lifetime;

	const handleClick = () => {
		window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
	};

	return (
		<div
			className={`disco-relative disco-rounded-2xl disco-border-2 disco-shadow-lg hover:disco-border-primary disco-p-6 disco-bg-white disco-transition-all ${plan.popular ? 'disco-border-emerald-400 disco-shadow-lg disco-shadow-emerald-100 disco-z-10' : 'disco-border-gray-200'}`}
		>
			{plan.popular && (
				<div className="disco-absolute disco-top-0 disco-left-0 disco-w-full disco-h-7 disco-bg-primary disco-text-white disco-text-xs disco-font-bold disco-px-4 disco-py-1 disco-rounded-tl-xl disco-rounded-tr-xl disco-flex disco-items-center disco-justify-center">
					MOST POPULAR
				</div>
			)}
			<h3
				className={`disco-text-lg disco-font-bold disco-text-gray-900 ${plan.popular ? 'disco-mt-4' : ''}`}
			>
				{plan.name}
			</h3>
			<p className="disco-text-sm disco-text-gray-400 disco-mb-4">
				{plan.sub}
			</p>
			<div className="disco-flex disco-items-baseline disco-gap-2 disco-mb-1">
				<span className="disco-text-4xl disco-font-extrabold disco-text-gray-900">
					${price}
				</span>
				{original && (
					<span className="disco-text-lg disco-text-gray-300 disco-line-through">
						${original}
					</span>
				)}
			</div>
			<p className="disco-text-xs disco-text-gray-400 disco-mb-5">
				Per year, billed annually
			</p>
			<button
				onClick={handleClick}
				className={`disco-w-full disco-py-2.5 disco-rounded-lg disco-font-semibold disco-text-sm  disco-transition-all ${plan.popular ? 'disco-bg-emerald-500 disco-text-white hover:disco-bg-primary' : 'disco-bg-[#F1F5F9] disco-border-[#E2E8F0] hover:disco-border-primary disco-text-[#334155] hover:disco-bg-primary hover:disco-text-white'}`}
			>
				⚡️ Get Started →
			</button>
			<ul className="disco-mt-5 disco-space-y-2.5">
				{plan.features.map((f, j) => (
					<li
						key={j}
						className="disco-flex disco-items-start disco-gap-2 disco-text-sm disco-text-gray-600"
					>
						<span className="disco-mt-0.5 disco-h-5 disco-w-5 disco-rounded-full disco-bg-primary-light disco-flex disco-items-center disco-justify-center disco-text-[#15803D]">
							{'✓'}
							{/* <CheckIcon /> */}
						</span>
						{f}
					</li>
				))}
			</ul>
			<p
				className={`disco-mt-4 disco-text-xs disco-font-medium disco-text-[#15803D] disco-bg-primary-light disco-py-3 disco-px-4 disco-rounded-lg`}
			>
				{'🛡️  Lifetime free after 5 years'}
			</p>
		</div>
	);
}
