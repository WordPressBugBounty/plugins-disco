export default function DiscoResourceCard({
	tag,
	title,
	date,
	read,
	imageUrl,
	link,
}) {
	return (
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			className="disco-bg-white disco-rounded-2xl disco-overflow-hidden disco-shadow-sm disco-border-2 disco-border-gray-100 hover:disco-shadow-md disco-cursor-pointer disco-flex disco-flex-col disco-no-underline hover:disco-border-primary hover:-disco-translate-y-1 disco-transition-all  focus:disco-shadow-none"
		>
			<div className="disco-relative disco-h-44 disco-overflow-hidden">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt=""
						className="disco-w-full disco-h-full"
					/>
				) : (
					<div className="disco-w-full disco-h-full disco-bg-gray-100 disco-flex disco-items-center disco-justify-center disco-text-gray-300 disco-text-4xl">
						📄
					</div>
				)}
			</div>
			<div className="disco-p-5 disco-flex disco-flex-col disco-flex-1">
				<span className="disco-text-xs disco-font-semibold disco-text-gray-400 disco-uppercase disco-tracking-wide disco-mb-2">
					{tag}
				</span>
				<h3 className="disco-text-base disco-font-bold disco-text-gray-800 disco-m-0 disco-mb-auto disco-leading-snug">
					{title}
				</h3>
				<div className="disco-flex disco-items-center disco-justify-between disco-mt-4 disco-pt-3 disco-border-t disco-border-gray-100">
					<span className="disco-text-xs disco-text-gray-400">
						{date}
					</span>
					<span className="disco-text-xs disco-text-gray-400">
						{read}
					</span>
				</div>
			</div>
		</a>
	);
}
