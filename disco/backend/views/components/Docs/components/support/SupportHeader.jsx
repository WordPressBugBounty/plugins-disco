export default function DiscoSupportHeader() {
	return (
		<div className="disco-flex disco-flex-col disco-justify-center">
			<div className="disco-flex disco-items-center disco-gap-2 disco-mb-3">
				<span className="disco-w-6 disco-h-0.5 disco-bg-green-500 disco-rounded-full disco-inline-block"></span>
				<span className="disco-text-xs disco-font-bold disco-tracking-widest disco-text-green-600 disco-uppercase">
					Need Help?
				</span>
			</div>
			<h2 className="disco-text-2xl disco-font-bold disco-text-gray-900 disco-m-0 disco-mb-3 disco-leading-tight">
				Contact Our Support Team
			</h2>
			<p className="disco-text-sm disco-text-gray-500 disco-m-0 disco-leading-relaxed disco-max-w-xs">
				We typically respond within 24 hours on business days. Pro users
				get priority response.
			</p>
		</div>
	);
}
