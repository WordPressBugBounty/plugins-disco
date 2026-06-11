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
		<div className="disco-rounded-2xl disco-overflow-hidden disco-text-white disco-bg-gradient-to-br disco-from-[#1a2e1a] disco-via-[#2d4a2d] disco-to-[#1a3a2a]">
			<div className="disco-p-6">
				<h3 className="disco-text-xl disco-text-white disco-font-bold disco-m-0 disco-mb-1">
					Unlock <span className="disco-text-primary">Disco Pro</span>
				</h3>
				<p className="disco-text-sm disco-text-gray-300 disco-m-0 disco-mb-5">
					Get more discount power, analytics and integrations
				</p>

				<div className="disco-flex disco-flex-col disco-gap-3">
					{proFeatures.map((f, i) => (
						<div
							key={i}
							className="disco-flex disco-items-center disco-gap-3"
						>
							<span className="disco-w-5 disco-h-5 disco-rounded-full disco-bg-[#22C55E33] disco-border disco-border-primary disco-flex disco-items-center disco-justify-center disco-flex-shrink-0">
								<svg
									width="7"
									height="7"
									viewBox="0 0 7 7"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="disco-h-2.5 disco-w-2.5"
								>
									<path
										d="M1.42211 6.93018C1.42211 6.85218 1.40711 6.81318 1.37711 6.81318L1.17011 6.91218C1.17011 6.87018 1.14611 6.84018 1.09811 6.82218L1.02611 6.81318C0.978113 6.81318 0.918113 6.83418 0.846113 6.87618C0.834113 6.84618 0.819113 6.81618 0.801113 6.78618C0.783113 6.75618 0.768113 6.72918 0.756113 6.70518C0.678113 6.55518 0.600113 6.39018 0.522113 6.21018C0.450113 6.02418 0.381113 5.84718 0.315113 5.67918C0.255113 5.51118 0.207113 5.37918 0.171113 5.28318C0.147113 5.20518 0.120113 5.08818 0.0901134 4.93218C0.0601134 4.77618 0.0301134 4.57818 0.000113402 4.33818C0.0661134 4.38018 0.117113 4.40118 0.153113 4.40118C0.195113 4.40118 0.234113 4.33818 0.270113 4.21218C0.288113 4.23618 0.321113 4.24818 0.369113 4.24818C0.405113 4.24818 0.432113 4.23618 0.450113 4.21218L0.594113 3.99618L0.756113 4.05018H0.765113C0.777113 4.05018 0.789113 4.04418 0.801113 4.03218C0.813113 4.02018 0.831113 4.00818 0.855113 3.99618C0.903113 3.96618 0.939113 3.95118 0.963113 3.95118L0.990113 3.96018C1.14011 4.03218 1.23611 4.16418 1.27811 4.35618C1.38611 4.81218 1.49411 5.04018 1.60211 5.04018C1.71011 5.04018 1.83611 4.92618 1.98011 4.69818C2.05211 4.58418 2.12411 4.45218 2.19611 4.30218C2.27411 4.15218 2.35211 3.98418 2.43011 3.79818C2.44211 3.87018 2.45411 3.90618 2.46611 3.90618C2.49611 3.90618 2.54711 3.83118 2.61911 3.68118C2.69711 3.53118 2.82011 3.32418 2.98811 3.06018C3.08411 2.89818 3.20411 2.71518 3.34811 2.51118C3.49811 2.30718 3.65711 2.09718 3.82511 1.88118C3.99311 1.66518 4.15511 1.46118 4.31111 1.26918C4.47311 1.07718 4.61711 0.912179 4.74311 0.774179C4.86911 0.636179 4.96211 0.546179 5.02211 0.50418C5.25011 0.348179 5.43011 0.198179 5.56211 0.0541794C5.55611 0.0961792 5.54711 0.135179 5.53511 0.17118C5.52911 0.20118 5.52611 0.222179 5.52611 0.234179C5.52611 0.258179 5.53811 0.270179 5.56211 0.270179L5.81411 0.144179V0.180179C5.81411 0.22818 5.82611 0.25218 5.85011 0.25218C5.86811 0.25218 5.90411 0.22518 5.95811 0.17118C6.01211 0.11718 6.04211 0.0781795 6.04811 0.0541794L6.03011 0.180179L6.33611 0.000179589L6.26411 0.16218C6.36011 0.0961794 6.42911 0.0631793 6.47111 0.0631793C6.49511 0.0631793 6.51311 0.0781793 6.52511 0.108179C6.53711 0.132179 6.54311 0.156179 6.54311 0.180179C6.54311 0.216179 6.52811 0.258179 6.49811 0.306179C6.46811 0.35418 6.42911 0.411179 6.38111 0.477179C6.34511 0.525179 6.28511 0.597179 6.20111 0.693179C6.12311 0.78318 6.00311 0.91818 5.84111 1.09818C5.67911 1.27218 5.46311 1.51518 5.19311 1.82718C5.12111 1.90518 5.01011 2.04318 4.86011 2.24118C4.71011 2.43318 4.53911 2.65818 4.34711 2.91618C4.16111 3.16818 3.97511 3.42318 3.78911 3.68118C3.60311 3.93918 3.43811 4.17318 3.29411 4.38318C3.15011 4.58718 3.04811 4.74018 2.98811 4.84218L2.43011 5.78718C2.31011 5.99118 2.21111 6.15918 2.13311 6.29118C2.05511 6.41718 1.99511 6.50418 1.95311 6.55218C1.86311 6.66018 1.76411 6.75618 1.65611 6.84018L1.57511 6.79518L1.50311 6.84018L1.42211 6.93018Z"
										fill="#4ADE80"
									/>
								</svg>
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
					<span>⚡</span> Upgrade to Pro Now
				</a>

				<p className="disco-text-center disco-text-xs disco-text-gray-400 disco-mt-3 disco-mb-0">
					🛡️ 14-days money-back guarantee
				</p>
			</div>
		</div>
	);
}
