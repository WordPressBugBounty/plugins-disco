export default function SkeletonCard() {
	return (
		<div className="disco-bg-white disco-rounded-2xl disco-overflow-hidden disco-shadow-sm disco-border disco-border-gray-100 disco-flex disco-flex-col">
			<div className="disco-h-44 disco-bg-gray-100 disco-animate-pulse" />
			<div className="disco-p-5 disco-flex disco-flex-col disco-gap-3">
				<div className="disco-h-3 disco-w-20 disco-bg-gray-100 disco-rounded disco-animate-pulse" />
				<div className="disco-h-4 disco-bg-gray-100 disco-rounded disco-animate-pulse" />
				<div className="disco-h-4 disco-w-3/4 disco-bg-gray-100 disco-rounded disco-animate-pulse" />
				<div className="disco-mt-4 disco-pt-3 disco-border-t disco-border-gray-100 disco-flex disco-justify-between">
					<div className="disco-h-3 disco-w-24 disco-bg-gray-100 disco-rounded disco-animate-pulse" />
					<div className="disco-h-3 disco-w-20 disco-bg-gray-100 disco-rounded disco-animate-pulse" />
				</div>
			</div>
		</div>
	);
}
