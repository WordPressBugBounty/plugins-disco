export default function DiscoChannelCard({
	title,
	desc,
	icon,
	iconBg,
	pro,
	link,
	isPro,
}) {
	return (
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			className="disco-flex disco-items-center disco-gap-4 disco-p-4 disco-rounded-xl disco-border disco-border-gray-200 disco-bg-gray-50 hover:disco-bg-white hover:disco-shadow-sm disco-transition-all disco-cursor-pointer hover:disco-border-primary disco-no-underline"
		>
			<span
				className={`disco-w-12 disco-h-12 disco-rounded-xl ${iconBg} disco-flex disco-items-center disco-justify-center disco-text-2xl disco-flex-shrink-0`}
			>
				{icon}
			</span>
			<div className="disco-flex-1">
				<p className="disco-font-semibold disco-text-gray-800 disco-m-0 disco-text-base">
					{title}
				</p>
				<p className="disco-text-sm disco-text-gray-400 disco-m-0">
					{desc}
				</p>
			</div>
			{!isPro && pro && (
				<span className="disco-flex disco-items-center disco-gap-1 disco-bg-yellow-50 disco-border disco-border-yellow-200 disco-text-yellow-700 disco-text-xs disco-font-semibold disco-px-2.5 disco-py-1 disco-rounded-full">
					🔒 Pro
				</span>
			)}
		</a>
	);
}
