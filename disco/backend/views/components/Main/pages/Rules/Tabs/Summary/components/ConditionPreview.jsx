import React from 'react';

const ConditionPreview = ({ conditions = [] }) => {
	// Capitalize helper
	const capitalize = (input) => {
		if (!input) return '—';

		const formatText = (text) => {
			if (typeof text !== 'string') return String(text); // convert numbers or other types to string

			let formatted = text
				.replace(/_/g, ' ') // replace underscores with spaces
				.split(' ')
				.filter(Boolean)
				.map(
					(word) =>
						word.charAt(0).toUpperCase() +
						word.slice(1).toLowerCase()
				)
				.join(' ');

			// Truncate if longer than 20 characters
			if (formatted.length > 20) {
				formatted = formatted.substring(0, 20) + '…';
			}

			return formatted;
		};

		// If input is an array
		if (Array.isArray(input)) {
			return input.map((item, index) => {
				let content;

				if (typeof item === 'object' && item !== null) {
					// If object has id and name, use them
					if ('id' in item && 'name' in item) {
						content = `${item.id} - ${item.name}`;
					} else {
						// Object without id/name → convert to JSON string
						content = JSON.stringify(item);
					}
				} else {
					// Strings, numbers, booleans → format text
					content = formatText(item);
				}

				return (
					<div
						className="disco-flex disco-p-2 disco-text-xs disco-bg-gray-50 disco-rounded disco-mb-1"
						key={index}
					>
						{content}
					</div>
				);
			});
		}

		// If input is a single value (string/number)
		return formatText(input);
	};

	return (
		<div>
			{conditions.map((group, groupIndex) => {
				const nextGroup = conditions[groupIndex + 1];
				const nextGroupConnector = nextGroup?.base_operator;

				return (
					<React.Fragment key={group.id || groupIndex}>
						{/* Condition Group Card */}
						<div className="disco-w-[410px] disco-p-4 disco-bg-white disco-border disco-border-gray-200 disco-rounded-xl disco-shadow-md disco-mb-2">
							{group?.base_filters?.map((filter, filterIndex) => {
								const nextFilter =
									group.base_filters[filterIndex + 1];

								return (
									<React.Fragment
										key={filter.id || filterIndex}
									>
										<div className="disco-grid disco-grid-cols-3 disco-gap-2 disco-mb-1 disco-text-sm disco-font-light disco-items-center">
											<span className="disco-truncate disco-justify-self-start">
												{capitalize(
													filter?.compare_with
												)}
											</span>
											<span className="disco-truncate disco-justify-self-center">
												{capitalize(filter?.condition)}
											</span>
											<span className="disco-truncate disco-justify-self-end">
												{capitalize(filter?.compare)}
											</span>
										</div>

										{/* Connector inside same group */}
										{nextFilter?.operator && (
											<div className="disco-text-sm disco-font-light disco-text-primary disco-mb-2">
												{nextFilter.operator.toUpperCase()}
											</div>
										)}
									</React.Fragment>
								);
							})}
						</div>

						{/* Connector between groups - use next group's first filter operator */}
						{nextGroupConnector && (
							<div className="disco-flex disco-mb-2">
								<div className="disco-text-sm disco-font-light disco-text-white disco-bg-primary disco-flex disco-px-2 disco-py-1 disco-rounded disco-text-center">
									{nextGroupConnector.toUpperCase()}
								</div>
							</div>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
};

export default ConditionPreview;
