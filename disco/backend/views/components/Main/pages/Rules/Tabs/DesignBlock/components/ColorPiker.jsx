import { PencilIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import ColorPicker from 'react-best-gradient-color-picker';

const CustomColorPicker = ({
	title = '',
	onChange,
	value = '#ff0000',
	className = '',
	hideGradient = true,
	disabled = false,
}) => {
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const pickerRef = useRef(null);

	// Toggle color picker visibility
	const handleClick = () => {
		if (disabled) return;
		setIsPickerOpen(!isPickerOpen);
	};

	// Close color picker when clicking outside of it
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target)
			) {
				setIsPickerOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div
			className={`${className} ${disabled ? 'disco-opacity-50 disco-cursor-not-allowed' : ''}`}
		>
			{title && (
				<div className="disco-text-sm disco-font-semibold disco-mb-2">
					{title}
				</div>
			)}
			<div className="disco-flex disco-gap-8 disco-bg-white disco-border disco-border-gray-100 disco-p-1.5 disco-rounded-lg">
				<div
					className="disco-rounded-md disco-h-6 disco-w-full disco-border disco-border-gray-200"
					style={{ background: value }}
				></div>
				<div
					onClick={() => handleClick(false)}
					className="disco-flex disco-justify-center disco-items-center disco-rounded-md disco-h-6 disco-w-full disco-cursor-pointer disco-bg-primary"
				>
					<PencilIcon className="disco-text-white disco-h-4" />
				</div>
			</div>

			{/* Color Picker Component - shown conditionally */}
			{isPickerOpen && (
				<div className="disco-fixed disco-top-0 disco-left-0 disco-w-full disco-h-full disco-bg-black disco-bg-opacity-50 disco-flex disco-justify-center disco-items-center disco-z-[100]">
					<div
						ref={pickerRef}
						className="disco-bg-white disco-p-4 disco-rounded-lg disco-shadow-lg"
					>
						<ColorPicker
							width={300}
							height={150}
							value={value}
							onChange={onChange}
							hideControls={hideGradient}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomColorPicker;
