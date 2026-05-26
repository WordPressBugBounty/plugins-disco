import React, { useState } from 'react';

const BadgeSelector = ({ title = "Select Badge", options = [], selectedOption, onChange }) => {
	const [internalSelected, setInternalSelected] = useState(selectedOption || options[0]?.value);

	const handleChange = (option) => {
		setInternalSelected(option);
		if (onChange) onChange(option);
	};

	const currentSelected = selectedOption !== undefined ? selectedOption : internalSelected;

	return (
		<div className="disco-flex disco-items-center disco-justify-between disco-w-full">
			<p className="disco-text-base">{title}</p>
			<div className="disco-flex disco-items-center disco-border disco-border-primary disco-bg-white disco-rounded-lg disco-overflow-hidden">
				{options.map((option, index) => (
					<React.Fragment key={option.value}>
						<label
							className="disco-flex disco-items-center disco-px-2 disco-py-1 disco-cursor-pointer"
							onClick={() => handleChange(option.value)}
						>
							<div className={`disco-flex disco-items-center ${currentSelected === option.value ? 'disco-text-green-500' : ''}`}>
								<div
									className={`disco-w-4 disco-h-4 disco-mr-1 disco-rounded-full disco-border-2 disco-flex disco-items-center disco-justify-center ${
										currentSelected === option.value ? 'disco-border-primary' : 'disco-border-gray-500'
									}`}
								>
									<div
										className={`disco-w-2 disco-h-2 disco-rounded-full ${
											currentSelected === option.value ? 'disco-bg-primary' : 'disco-bg-transparent'
										}`}
									></div>
								</div>
								<span className="disco-font-base">{option.label}</span>
							</div>
						</label>
						{index < options.length - 1 && <div className="disco-w-px disco-bg-primary"></div>}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default BadgeSelector;
