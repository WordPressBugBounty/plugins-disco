import { StarIcon } from './icons';

const testimonials = [
	{
		text: 'I will always recommend these guys because their plugins are always bug free and the support is always responsive. This plugin does exactly what it says and works well with my other woo plugins that I use. Would highly recommend.',
		name: 'thedeancorp',
		site: 'Nov • 5 Stars',
		stars: 5,
	},
	{
		text: 'Transform your project experience with the Disco plugin! Enjoy exceptional Quality, Reliable Performance, and an Intuitive User Experience. Effortlessly take your work to the next level!',
		name: 'mainmultistores',
		site: 'Pro • 5 Star',
		stars: 5,
	},
	{
		text: 'This plugin has significantly enhanced my WooCommerce store’s. It’s a must-have for WooCommerce store owners.',
		name: 'pandimovasilis',
		site: 'Pro • 10 Sites',
		stars: 5,
	},
];

function TestimonialsSection() {
	return (
		<div className="disco-max-w-5xl disco-mx-auto disco-px-4 disco-py-12">
			<h2 className="disco-text-3xl disco-font-extrabold disco-text-center disco-text-gray-900 disco-mb-2">
				What Pro Users Say
			</h2>
			<p className="disco-text-center disco-text-gray-400 disco-text-sm disco-mb-10">
				Real feedback from store owners who upgraded.
			</p>
			<div className="disco-grid disco-grid-cols-1 md:disco-grid-cols-3 disco-gap-6">
				{testimonials.map((t, i) => (
					<div
						key={i}
						className="disco-flex disco-flex-col disco-justify-between disco-bg-white disco-border-2 disco-border-gray-200 disco-rounded-xl disco-p-5 hover:disco-border-primary disco-transition-all"
					>
						<div>
							<div className="disco-flex disco-gap-0.5 disco-mb-3">
								{Array.from({ length: t.stars }).map((_, j) => (
									<StarIcon key={j} filled />
								))}
							</div>
							<p className="disco-text-sm disco-text-gray-600 disco-mb-4 disco-leading-relaxed">
								{t.text}
							</p>
						</div>

						<div className="disco-flex disco-items-center disco-gap-2">
							<div className="disco-w-8 disco-h-8 disco-rounded-full disco-bg-emerald-100 disco-flex disco-items-center disco-justify-center disco-text-emerald-600 disco-font-bold disco-text-xs">
								{t.name[0]}
							</div>
							<div>
								<p className="disco-text-sm disco-font-semibold disco-text-gray-800">
									{t.name}
								</p>
								{/* <p className="disco-text-xs disco-text-gray-400">
									{t.site}
								</p> */}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default TestimonialsSection;
