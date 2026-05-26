import { LinkIcon } from '@heroicons/react/16/solid';

const BorderRadiusControl = ({
	title,
	className,
	labelClassName = '',
	handleIsChain,
	button,
	handleRadius,
	disabled = false,
}) => {
	const handleChange = (e, corner) => {
		if (disabled) return;
		const value = `${e.target.value}px`;

		// If chained, set all corners to the same value
		if (button.isChain) {
			handleRadius({
				...button.radius,
				'top-left': value,
				'top-right': value,
				'bottom-left': value,
				'bottom-right': value,
			});
		} else {
			handleRadius({
				...button.radius,
				[corner]: value,
			});
		}
	};

	const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

	return (
		<div
			className={`${className} ${disabled ? 'disco-opacity-50 disco-cursor-not-allowed' : ''}`}
		>
			<div className="disco-flex disco-items-center disco-justify-between disco-pb-1">
				<span
					className={`disco-text-sm disco-font-semibold ${labelClassName}`}
				>
					{title}
				</span>
				<button
					onClick={handleIsChain}
					className="disco-p-1 disco-text-gray-500 disco-hover:text-gray-700"
					disabled={disabled}
				>
					{button.isChain ? (
						<LinkIcon className="disco-w-4 disco-h-4 disco-rotate-45 disco-text-green-500" /> // Linked icon
					) : (
						<LinkIcon className="disco-w-4 disco-h-4 disco-rotate-45 disco-text-gray-400" /> // Unlinked icon
					)}
				</button>
			</div>

			<div className="disco-flex disco-space-x-1.5">
				{corners.map((corner) => (
					<span key={corner} className="disco-relative">
						<div
							className={`disco-absolute ${
								corner === 'top-left'
									? 'disco-top-0 disco-left-0 disco-scale-x-[-1]'
									: corner === 'top-right'
										? 'disco-top-0 disco-right-0'
										: corner === 'bottom-left'
											? 'disco-bottom-0 disco-left-0 disco-rotate-180'
											: 'disco-bottom-px -disco-right-px disco-rotate-90'
							}`}
						>
							<svg
								width="18"
								height="15"
								viewBox="0 0 18 15"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0.867188 1.19922L9.68719 1.19922C13.6526 1.19922 16.8672 4.41381 16.8672 8.37922L16.8672 14.1992"
									stroke="#9EA5AD"
									strokeWidth="2"
								/>
							</svg>
						</div>

						<input
							type="number"
							min="0"
							value={parseInt(button.radius[corner])}
							name={corner}
							onChange={(e) => handleChange(e, corner)}
							className="disco-w-full disco-h-8 disco-flex disco-text-center disco-bg-transparent disco-py-2 !disco-rounded-lg disco-c-appearance-none disco-text-gray-500 disco-justify-center disco-text-sm !disco-border-gray-200 !disco-outline-none focus:!disco-border-gray-300 focus:!disco-ring-0 disabled:disco-cursor-not-allowed"
						/>
					</span>
				))}
			</div>
		</div>
	);
};

export default BorderRadiusControl;
