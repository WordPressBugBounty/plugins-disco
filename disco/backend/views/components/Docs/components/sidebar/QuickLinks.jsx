import quickLinks from "../../data/quickLinks";

export default function DiscoQuickLinks() {
	

	return (
		<div className="disco-bg-white disco-rounded-2xl disco-border disco-border-gray-200 disco-p-6 disco-shadow-sm">
			<h3 className="disco-text-lg disco-font-bold disco-text-gray-800 disco-m-0 disco-mb-4 disco-flex disco-items-center disco-gap-2">
				<span className="disco-w-1 disco-h-5 disco-bg-primary disco-rounded-full disco-inline-block"></span>
				Quick Links
			</h3>
			<div className="disco-flex disco-flex-col disco-gap-1">
				{quickLinks.map((obj, i) => (
					<a
						key={i}
						href={obj.link}
						target="_blank"
						rel="noopener noreferrer"
						className="disco-flex disco-items-center disco-gap-3 disco-py-2.5 disco-px-3 disco-rounded-lg disco-no-underline disco-text-gray-700 hover:disco-text-primary hover:disco-bg-gray-50 disco-transition-colors disco-cursor-pointer"
						// onClick={(e) => e.preventDefault()}
					>
						<span className="disco-text-lg">{obj.icon}</span>
						<span className="disco-text-sm disco-font-medium">
							{obj.label}
						</span>
					</a>
				))}
			</div>
		</div>
	);
}
