import imgRatingStar from '../../../asset/img/icons/Star.svg';

const CtaSection = () => {
	return (
		<section
			className="disco-relative disco-w-full disco-max-w-5xl disco-mx-auto disco-rounded-3xl disco-border disco-border-emerald-500/10 disco-overflow-hidden"
			style={{
				background:
					'radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 60%), linear-gradient(180deg, #132019 0%, #0d1a14 50%, #0a1410 100%)',
			}}
		>
			{/* Glow effect */}
			<div
				className="disco-absolute disco-top-[-120px] disco-left-[-80px] disco-w-[350px] disco-h-[350px] disco-rounded-full disco-pointer-events-none"
				style={{
					background:
						'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
				}}
			/>

			<div className="disco-relative disco-z-10 disco-flex disco-flex-col lg:disco-flex-row disco-items-center disco-justify-between disco-gap-10 disco-px-10 lg:disco-px-16 disco-py-14">
				{/* Left content */}
				<div className="disco-flex-1">
					<p className="disco-text-xs disco-font-bold disco-tracking-[2.5px] disco-uppercase disco-text-primary disco-mb-4">
						<img
							src={imgRatingStar}
							alt="★"
							style={{ width: 12, height: 12 }}
						/>
						Ready to unlock full power?
					</p>

					<h2
						className="disco-text-4xl lg:disco-text-[40px] disco-font-extrabold disco-leading-tight disco-text-white disco-mb-4"
						style={{ fontFamily: "'Sora', sans-serif" }}
					>
						Start converting more with <br />
						<span className="disco-text-primary">
							Disco Pro today
						</span>
					</h2>

					<p className="disco-text-base disco-text-white/50 disco-leading-relaxed disco-max-w-[460px]">
						Join 700+ WooCommerce stores using Disco Pro. 14-day
						money-back guarantee. No risk.
					</p>
				</div>

				{/* Right CTA */}
				<div className="disco-flex disco-flex-col disco-items-center disco-gap-4 disco-flex-shrink-0">
					<a
						href="https://discoplugin.com/?utm_source=pro_plan_page&utm_medium=banner&utm_campaign=free-pro&utm_id=1#pricing"
						target="_blank"
						rel="noopener noreferrer"
						className="disco-inline-flex disco-items-center disco-gap-2.5 disco-px-6 disco-py-4 disco-bg-primary disco-text-white disco-text-sm disco-font-extrabold disco-rounded-2xl disco-no-underline disco-transition-all disco-duration-200 hover:disco-text-white hover:disco-scale-105 focus:disco-text-white focus:disco-rounded-2xl"
						style={{
							boxShadow: '0 6px 22px 0 rgba(245, 158, 11, 0.40)',
						}}
					>
						<span>⚡</span>
						Unlock Pro Now
					</a>

					<p className="disco-text-sm disco-text-white/35">
						14-days money-back · No contracts
					</p>
				</div>
			</div>
		</section>
	);
};

export default CtaSection;
