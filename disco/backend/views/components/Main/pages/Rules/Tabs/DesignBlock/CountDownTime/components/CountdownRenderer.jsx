/**
 * CountdownRenderer - Renders countdown timer based on design properties
 */

// Helper to convert design object to inline style object
const toStyleObject = (styleObj) => {
	if (!styleObj) return {};
	const result = {};
	Object.entries(styleObj).forEach(([key, value]) => {
		// Skip non-CSS properties
		if (key === 'text') return;
		// Convert kebab-case to camelCase for React
		const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
		result[camelKey] = value;
	});
	return result;
};

// Helper to get container border style
const getContainerStyle = (container) => {
	const style = toStyleObject(container);
	if (container.border && container.border > 0) {
		style.border = `${container.border}px solid ${container['border-color']}`;
	}
	return style;
};

const CountdownRenderer = ({
	design,
	days = '02',
	hours = '88',
	minutes = '55',
	seconds = '05',
}) => {
	if (!design) return null;

	const { hasSeparator } = design;
	const containerStyle = getContainerStyle(design.container);
	const titleStyle = toStyleObject(design.title);
	const subtitleStyle = toStyleObject(design.subtitle);
	const boxContainerStyle = toStyleObject(design.box_container);
	const boxStyle = toStyleObject(design.box);
	const numberStyle = toStyleObject(design.number);
	const labelStyle = toStyleObject(design.label);
	const separatorStyle = toStyleObject(design.separator);

	const timeUnits = [
		{ value: days, label: 'DAYS' },
		{ value: hours, label: 'HOURS' },
		{ value: minutes, label: 'MINUTES' },
		{ value: seconds, label: 'SECONDS' },
	];

	return (
		<div style={containerStyle}>
			{/* Title Section */}
			<div style={{ marginBottom: '8px' }}>
				<h3 style={titleStyle}>{design.title.text}</h3>
				<p style={subtitleStyle}>{design.subtitle.text}</p>
			</div>

			{/* Time Boxes */}
			<div style={boxContainerStyle}>
				{timeUnits.map((unit, index) => (
					<div
						key={unit.label}
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<div style={boxStyle}>
							<span style={numberStyle}>{unit.value}</span>
							<span style={labelStyle}>{unit.label}</span>
						</div>
						{hasSeparator && index < timeUnits.length - 1 && (
							<span style={separatorStyle}>:</span>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default CountdownRenderer;
