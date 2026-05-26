import { LinkIcon } from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';

const ImageResizeControls = ({
	width,
	height,
	aspectRatio,
	lockAspectRatio,
	onWidthChange,
	onHeightChange,
	onToggleLock,
	onSave,
	disabled = false,
	saving = false,
	buttonText = 'Save Now',
}) => {
	const handleWidthChange = (val) => {
		onWidthChange(val);
		if (lockAspectRatio && aspectRatio && val > 0) {
			onHeightChange(String(Math.round(val / aspectRatio)));
		}
	};

	const handleHeightChange = (val) => {
		onHeightChange(val);
		if (lockAspectRatio && aspectRatio && val > 0) {
			onWidthChange(String(Math.round(val * aspectRatio)));
		}
	};

	return (
		<div className="disco-mt-4">
			<div className="disco-flex disco-items-end disco-space-x-2">
				<div className="disco-flex-1">
					<label className="disco-block disco-mb-1 disco-text-sm disco-font-medium disco-text-gray-700">
						{__('Width (px)', 'disco')}
					</label>
					<input
						type="number"
						value={width}
						onChange={(e) => handleWidthChange(e.target.value)}
						placeholder={__('Width', 'disco')}
						min="1"
						className="!disco-bg-gray-100 disco-c-appearance-none disco-w-full disco-text-gray-500 disco-text-sm !disco-border-none !disco-outline-none focus:!disco-border-none focus:!disco-ring-0 disabled:disco-cursor-not-allowed"
					/>
				</div>
				<button
					onClick={onToggleLock}
					title={
						lockAspectRatio
							? __('Unlock aspect ratio', 'disco')
							: __('Lock aspect ratio', 'disco')
					}
					className={`disco-mb-1 disco-p-1 disco-rounded disco-cursor-pointer ${
						lockAspectRatio
							? 'disco-text-primary'
							: 'disco-text-gray-400'
					}`}
				>
					<LinkIcon className="disco-w-4 disco-h-4" />
				</button>
				<div className="disco-flex-1">
					<label className="disco-block disco-text-sm disco-font-medium disco-mb-1 disco-text-gray-700">
						{__('Height (px)', 'disco')}
					</label>
					<input
						type="number"
						value={height}
						onChange={(e) => handleHeightChange(e.target.value)}
						placeholder={__('Height', 'disco')}
						min="1"
						className="!disco-bg-gray-100 disco-c-appearance-none disco-w-full disco-text-gray-500 disco-text-sm !disco-border-none !disco-outline-none focus:!disco-border-none focus:!disco-ring-0 disabled:disco-cursor-not-allowed"
					/>
				</div>
			</div>
			<div className="disco-mt-3">
				<button
					onClick={onSave}
					disabled={disabled || saving}
					className="disco-w-full disco-py-1.5 disco-bg-gray-200 disco-text-gray-600 disco-rounded-md disco-text-sm disco-font-semibold disco-cursor-pointer hover:disco-bg-gray-300 disabled:disco-opacity-50 disabled:disco-cursor-not-allowed"
				>
					{saving
						? __('Saving...', 'disco')
						: __(buttonText, 'disco')}
				</button>
			</div>
		</div>
	);
};

export default ImageResizeControls;
