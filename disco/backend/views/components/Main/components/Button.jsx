const Button = ({
	testId = '',
	disabled = false,
	className = '',
	children = '',
	type = 'primary',
	icon = '',
	iconPositionLeft = true,
	onClick = () => {},
}) => {
	const baseClassNames =
		'disco-text-base disco-shadow-custom disco-border disco-rounded-lg disco-px-8 disco-py-2.5 disco-flex disco-items-center disco-gap-2 disco-outline-none disco-font-medium disco-transition-colors disco-duration-200';

	const getTypeClassNames = () => {
		switch (type) {
			case 'primary':
				return `${baseClassNames} disco-text-white disco-bg-primary disco-border-primary hover:disco-bg-primary-dark hover:disco-border-primary-dark`;

			case 'secondary':
				return `${baseClassNames} disco-text-grey-dark disco-bg-gray-100 disco-border-gray-200 hover:disco-bg-gray-200 hover:disco-border-gray-300`;

			case 'transparent':
				return `${baseClassNames} disco-text-black disco-bg-transparent disco-border-primary`;

			default:
				return baseClassNames;
		}
	};

	let buttonClasses = `${getTypeClassNames()} ${className}`;

	// Handle icon position (right/left)
	if (!iconPositionLeft) {
		buttonClasses += ' !disco-flex-row-reverse';
	}

	// Apply disabled styles
	if (disabled) {
		buttonClasses += ' disco-opacity-50 disco-cursor-not-allowed';
	}

	return (
		<button
			data-testid={testId}
			disabled={disabled}
			onClick={!disabled ? onClick : () => {}}
			className={buttonClasses}
		>
			{icon && icon}
			{children}
		</button>
	);
};

export default Button;
