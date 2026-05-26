import { useState } from 'react';

const TextStyleSelector = ({
	options = [
		{ label: 'B', value: 'bold', styleClass: 'disco-font-bold' },
		{ label: 'I', value: 'italic', styleClass: 'disco-font-italic' },
		{ label: 'U', value: 'underline', styleClass: 'disco-underline' },
	],
	initialSelected = '',
	onChange,
	className = '',
	disabled = false,
}) => {
	const [selectedStyle, setSelectedStyle] = useState(initialSelected);

	const handleStyleChange = (style) => {
		setSelectedStyle(style);
		onChange && onChange(style);
	};

	return (
		<div
			className={`disco-flex disco-bg-white disco-rounded disco-items-center disco-space-x-1 ${className} ${disabled ? 'disco-opacity-50' : ''}`}
		>
			{options.map((option) => (
				<button
					key={option.value}
					onClick={() => handleStyleChange(option.value)}
					className={`disco-px-1 disco-py-1 disco-flex disco-items-center disco-justify-center ${
						selectedStyle === option.value
							? 'disco-border disco-px-2 disco-text-primary disco-border-primary disco-rounded disco-bg-green-50'
							: 'disco-bg-white'
					}`}
					disabled={disabled}
				>
					<span className={option.styleClass}>{option.label}</span>
				</button>
			))}
		</div>
	);
};

export default TextStyleSelector;
