import { CircleCheck, Shield, Star, Zap } from 'lucide-react';
import DiscoProLogo from '../../../../asset/img/logo/disco-logo.png';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';

const FEATURES = [
	'Real revenue per campaign - no guessing',
	'Which products sell more when discounts run',
	'Your highest-value customers, identified',
	'Discount given vs revenue earned, tracked',
	'Spot losing campaigns before they cost you',
];

const UpgradeModal = () => {
	return (
		<Dialog open modal={false}>
			<DialogContent className="disco-w-[478px] disco-ml-[100px]">
				{/* Header */}
				<div className="disco-relative disco-overflow-hidden disco-bg-[#d7f5e2] disco-px-9 disco-pb-6 disco-pt-9">
					{/* Radial gradient accent */}
					<div
						className="disco-pointer-events-none disco-absolute disco-inset-0"
						style={{
							background:
								'radial-gradient(ellipse at 80% 0%, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0) 70%)',
						}}
					/>

					{/* PRO badge + plugin name */}
					<div className="disco-flex disco-items-center disco-gap-2">
						<span
							className="disco-inline-flex disco-items-center disco-gap-1 disco-rounded-full disco-px-2 disco-py-0.5 disco-text-xs disco-font-semibold disco-uppercase disco-text-[#422006]"
							style={{
								background:
									'linear-gradient(133deg, #F59E0B 0%, #FBBF24 100%)',
							}}
						>
							<Star className="disco-size-3" />
							PRO
						</span>
						<span className="disco-text-xs disco-font-medium disco-uppercase disco-tracking-[0.88px] disco-text-black">
							Disco Plugin
						</span>
					</div>

					{/* Logo + title */}
					<div className="disco-mt-4 disco-flex disco-items-center disco-gap-4">
						<div className="disco-relative disco-flex disco-size-[52px] disco-shrink-0 disco-items-center disco-justify-center disco-rounded-[14px] disco-bg-white disco-shadow-[0_0_0_6px_rgba(34,197,94,0.1)]">
							<img
								src={DiscoProLogo}
								alt="Disco Pro"
								className="disco-h-9 disco-w-auto"
							/>
						</div>
						<div>
							<h2 className="disco-text-2xl disco-font-bold disco-tracking-[-0.24px] disco-text-black">
								Disco Pro Analytics
							</h2>
							<p className="disco-text-[13px] disco-font-light disco-text-black/75">
								Upgrade to unlock advanced analytics & insights.
							</p>
						</div>
					</div>
				</div>

				{/* Body */}
				<div className="disco-px-9 disco-pb-8 disco-pt-5">
					{/* Feature list */}
					<div className="disco-flex disco-flex-col disco-gap-3">
						{FEATURES.map((feature) => (
							<div
								key={feature}
								className="disco-flex disco-items-center disco-gap-2.5"
							>
								<CircleCheck className="disco-size-5 disco-shrink-0 disco-fill-green-500/20 disco-text-primary-dark disco-text-base" />
								<span className="disco-text-base disco-text-slate-600">
									{feature}
								</span>
							</div>
						))}
					</div>

					{/* Divider */}
					<div className="disco-my-5 disco-h-px disco-bg-slate-200" />

					{/* CTA buttons */}
					<div className="disco-flex disco-flex-col disco-gap-3">
						<Button
							className="disco-w-full disco-py-6 disco-rounded-xl disco-bg-primary disco-text-base disco-font-semibold disco-tracking-[0.16px] disco-text-white hover:disco-bg-primary-dark"
							onClick={() =>
								window.open(
									'https://discoplugin.com/#pricing',
									'_blank'
								)
							}
						>
							<Zap className="disco-size-4" />
							Upgrade to Pro
						</Button>
					</div>

					{/* Trust note */}
					<div className="disco-mt-5 disco-flex disco-items-center disco-justify-center disco-gap-1 disco-border-t disco-border-dashed disco-border-slate-200 disco-pt-4 disco-text-xs disco-text-slate-600">
						<Shield className="disco-size-4 disco-text-slate-400" />
						<span>14-day money-back guarantee</span>
						<span className="disco-mx-1">·</span>
						<a
							href="https://discoplugin.com/#pricing"
							target="_blank"
							rel="noopener noreferrer"
							className="disco-text-primary hover:disco-underline hover:disco-text-primary visited:disco-text-primary"
						>
							View pricing →
						</a>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default UpgradeModal;
