function HeroSection() {
	return (
		<div className="disco-text-center disco-py-6 disco-px-4 disco-bg-primary-light disco-rounded-2xl disco-border disco-border-primary disco-mb-6">
			<div className="disco-inline-flex disco-items-center disco-gap-1.5 disco-bg-[#FFCBA133] disco-border disco-border-[#F78411] disco-rounded-full disco-px-4 disco-py-1.5 disco-mb-5">
				<span className="disco-text-[#F78411]">{'●'}</span>
				<span className="disco-text-sm disco-font-medium disco-text-[#090909]">
					Trusted by 1000+ WooCommerce Stores
				</span>
			</div>
			<h1 className="disco-text-4xl md:disco-text-5xl disco-font-extrabold disco-text-black disco-leading-tight disco-mb-3">
				More Opportunity.
				<br />
				<span className="disco-text-[#10C88A]">
					More Discounts.
				</span>{' '}
				<span className="disco-text-[#F59E0B]">More Revenue.</span>
			</h1>
			<p className="disco-text-[#090909] disco-max-w-xl disco-mx-auto disco-text-sm">
				Upgrade to Disco Pro and get everything you need to run a
				high-converting WooCommerce store easily.
			</p>
		</div>
	);
}

export default HeroSection;
