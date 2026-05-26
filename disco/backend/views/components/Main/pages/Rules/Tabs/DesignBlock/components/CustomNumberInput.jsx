import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import cn from '../../../../../utilities/cn';

const CustomNumberInput = ({
	testid = '',
	className = '',
	title = '',
	placeholder = '',
	id = '',
	name = '',
	onChange = () => {},
	initialValue = 0,
	min = 0,
	max = 100,
	disabled = false,
}) => {
	const [value, setValue] = useState(initialValue);

	// Sync with initialValue when it changes from parent
	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const handleIncrement = () => {
		if (disabled) return;
		const currentVal = value === '' ? 0 : Number(value);
		const newValue = Math.min(currentVal + 1, max);
		setValue(newValue);
		onChange(newValue);
	};

	const handleDecrement = () => {
		if (disabled) return;
		const currentVal = value === '' ? 0 : Number(value);
		const newValue = Math.max(currentVal - 1, min);
		setValue(newValue);
		onChange(newValue);
	};

	const handleInputChange = (e) => {
		if (disabled) return;
		const inputValue = e.target.value;
		// Allow empty string or any number while typing
		if (inputValue === '' || inputValue === '-') {
			setValue(inputValue);
		} else {
			const numValue = parseFloat(inputValue);
			if (!isNaN(numValue)) {
				setValue(inputValue);
				// Only trigger onChange if within range
				if (numValue >= min && numValue <= max) {
					onChange(numValue);
				}
			}
		}
	};

	const handleBlur = () => {
		let finalValue = value;
		if (value === '' || value === '-' || isNaN(Number(value))) {
			finalValue = min;
		} else {
			finalValue = Math.max(min, Math.min(max, Number(value)));
		}
		setValue(finalValue);
		onChange(finalValue);
	};

	return (
		<div className={`${className}`}>
			{title && (
				<div className="disco-text-sm disco-font-semibold disco-mb-2">
					{title}
				</div>
			)}
			<div className="disco-relative disco-inline-flex disco-items-center disco-w-full disco-border disco-border-gray-200 disco-rounded-lg disco-bg-white disco-overflow-hidden disco-pl-1 disco-pr-2">
				<input
					autoComplete="off"
					className={cn(
						`disco-bg-transparent disco-c-appearance-none disco-w-full disco-text-gray-500 disco-text-sm !disco-border-none !disco-outline-none focus:!disco-border-none focus:!disco-ring-0 disabled:disco-cursor-not-allowed`,
						className
					)}
					type="number"
					name={name}
					id={id}
					value={value}
					placeholder={placeholder}
					onChange={handleInputChange}
					onBlur={handleBlur}
					min={min}
					data-testid={testid}
					disabled={disabled}
				/>
				<div className="disco-flex disco-flex-col disco-items-center disco-justify-center disco-border disco-border-gray-200 disco-rounded-full disco-w-6 disco-h-6 disco-px-0.5 disco-ml-2 disco-bg-gray-100">
					<ChevronUpIcon
						onClick={handleIncrement}
						className="disco-w-4 disco-h-4 disco-text-gray-500 disco-cursor-pointer hover:disco-text-gray-700"
					/>
					<ChevronDownIcon
						onClick={handleDecrement}
						className="disco-w-4 disco-h-4 disco-text-gray-500 disco-cursor-pointer hover:disco-text-gray-700"
					/>
				</div>
			</div>
		</div>
	);
};

export default CustomNumberInput;
