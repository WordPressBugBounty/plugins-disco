import whyUpgradeReasons from '../data/whyUpgrade';

function WhyUpgradeSection() {
	return (
		<div className="disco-max-w-5xl disco-mx-auto disco-px-4 disco-py-14">
			<h2 className="disco-text-3xl disco-font-extrabold disco-text-center disco-text-gray-900 disco-mb-2">
				Why Store Owners Upgrade
			</h2>
			<p className="disco-text-center disco-text-gray-400 disco-text-sm disco-mb-10">
				The most common reasons Disco Free users switch to Pro.
			</p>
			<div className="disco-grid disco-grid-cols-1 md:disco-grid-cols-3 disco-gap-6">
				{whyUpgradeReasons.map((r, i) => (
					<div
						key={i}
						className={`disco-rounded-xl disco-p-5  disco-border-2 disco-border-gray-100 hover:disco-border-primary disco-transition-all`}
					>
						<div className="disco-text-3xl disco-mb-3">
							{r.icon}
						</div>
						<h3 className="disco-font-bold disco-text-gray-900 disco-mb-2">
							{r.title}
						</h3>
						<p className="disco-text-sm disco-text-gray-500 disco-mb-3">
							{r.desc}
						</p>
						<span className="disco-text-xs disco-font-medium disco-text-emerald-600">
							{'↑ '} {r.tag}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default WhyUpgradeSection;
