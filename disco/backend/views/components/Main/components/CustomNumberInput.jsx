import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const CustomNumberInput = ({
	placeholder = 'Size',
	initialValue = 1,
	min = 1,
	max = 99,
	onChange,
	className = '',
	disabled = false,
}) => {
	const [value, setValue] = useState(initialValue);

	const handleIncrement = () => {
		if (disabled) return;
		if (value < max) {
			const newValue = value + 1;
			setValue(newValue);
			onChange && onChange(newValue);
		}
	};

	const handleDecrement = () => {
		if (disabled) return;
		if (value > min) {
			const newValue = value - 1;
			setValue(newValue);
			onChange && onChange(newValue);
		}
	};

	return (
		<div
			className={`disco-border disco-border-green-400 disco-bg-white disco-rounded-md disco-px-2 disco-flex disco-justify-between disco-items-center ${className} ${disabled ? 'disco-opacity-50 disco-cursor-not-allowed' : ''}`}
		>
			<span className="disco-text-black disco-text-sm">
				{placeholder}
			</span>
			<div className="disco-flex disco-space-x-1">
				<MinusCircleIcon
					className="disco-w-5 disco-h-5 disco-text-primary disco-text-sm"
					onClick={handleDecrement}
				/>
				<span className="disco-text-sm">{initialValue}</span>
				<PlusCircleIcon
					className="disco-w-5 disco-h-5 disco-text-primary"
					onClick={handleIncrement}
				/>
			</div>
		</div>
	);
};

export default CustomNumberInput;
