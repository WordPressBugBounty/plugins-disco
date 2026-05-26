/**
 * Utility functions for countdown timer styling
 */

// Keys to skip when converting to style object
const SKIP_KEYS = ['text', 'isChain', 'radius', 'border', 'border-color'];

/**
 * Convert kebab-case CSS properties to camelCase React style object
 */
export const toStyleObject = (styleObj, skipKeys = SKIP_KEYS) => {
	if (!styleObj) return {};
	const result = {};
	Object.entries(styleObj).forEach(([key, value]) => {
		if (skipKeys.includes(key)) return;
		const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
		result[camelKey] = value;
	});
	return result;
};

/**
 * Build border radius string from radius object
 */
const getBorderRadius = (radius) => {
	if (!radius) return undefined;
	return `${radius['top-left']} ${radius['top-right']} ${radius['bottom-right']} ${radius['bottom-left']}`;
};

/**
 * Apply border styles to style object
 */
const applyBorderStyles = (style, borderWidth, borderColor) => {
	style.borderWidth = `${borderWidth}px`;
	style.borderStyle = 'solid';
	style.borderColor = borderColor;
};

/**
 * Get container style with border and radius
 */
export const getContainerStyle = (container) => {
	if (!container) return {};
	const style = toStyleObject(container);

	if (container.radius) {
		style.borderRadius = getBorderRadius(container.radius);
	}

	applyBorderStyles(
		style,
		container.border ?? 0,
		container['border-color'] ?? 'rgba(0, 0, 0, 0)'
	);

	return style;
};

/**
 * Get box style with border and radius
 */
export const getBoxStyle = (box) => {
	if (!box) return {};
	const style = toStyleObject(box);

	if (box.radius) {
		style.borderRadius = getBorderRadius(box.radius);
	}

	applyBorderStyles(
		style,
		box.border ?? 0,
		box['border-color'] ?? 'rgba(0, 0, 0, 0)'
	);

	return style;
};

/**
 * Replace discount variables with sample values for preview
 */
export const replaceVariables = (text) => {
	if (!text) return '';
	return text
		.replace(/\[discounted_percentage\]/g, '20%')
		.replace(/\[discount_amount\]/g, '$50')
		.replace(/\[remaining_quantity\]/g, '2')
		.replace(/\[remaining_amount\]/g, '$25');
};

/**
 * Calculate time left from target date
 */
export const calculateTimeLeft = (targetDate) => {
	const difference = new Date(targetDate) - new Date();
	if (difference > 0) {
		return {
			days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
			hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
			minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, '0'),
			seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
		};
	}
	return { days: '02', hours: '08', minutes: '15', seconds: '05' };
};

/**
 * Get time units array from time left object
 */
export const getTimeUnits = (timeLeft) => [
	{ value: timeLeft.days, label: 'DAYS' },
	{ value: timeLeft.hours, label: 'HOURS' },
	{ value: timeLeft.minutes, label: 'MINUTES' },
	{ value: timeLeft.seconds, label: 'SECONDS' },
];

/**
 * Build default countdown state from design
 */
export const buildDefaultCountdownState = (design) => ({
	selected_design: design.id,
	title: {
		text: design.title.text,
		'font-family': design.title['font-family'] || '',
		'font-size': design.title['font-size'],
		'font-weight': design.title['font-weight'],
		'font-style': design.title['font-style'] || 'normal',
		'text-decoration': 'none',
		color: design.title.color,
	},
	subtitle: {
		text: design.subtitle.text,
		'font-family': design.subtitle['font-family'] || '',
		'font-size': design.subtitle['font-size'],
		'font-weight': design.subtitle['font-weight'],
		'font-style': design.subtitle['font-style'] || 'normal',
		'text-decoration': 'none',
		color: design.subtitle.color,
	},
	container: {
		background: design.container.background,
		'border-radius': design.container['border-radius'],
		padding: design.container.padding,
		border: design.container.border || 0,
		'border-color': design.container['border-color'] || 'rgba(0, 0, 0, 0)',
		isChain: false,
		radius: {
			'top-left': '6px',
			'top-right': '6px',
			'bottom-right': '6px',
			'bottom-left': '6px',
		},
	},
	box: {
		background: design.box.background,
		'border-radius': design.box['border-radius'],
		padding: design.box.padding,
		'min-width': design.box['min-width'] || '50px',
		border: 0,
		'border-color': 'rgba(0, 0, 0, 0)',
		isChain: false,
		radius: {
			'top-left': '2px',
			'top-right': '2px',
			'bottom-right': '2px',
			'bottom-left': '2px',
		},
	},
	number: {
		'font-family': design.number['font-family'] || '',
		'font-size': design.number['font-size'],
		'font-weight': design.number['font-weight'],
		color: design.number.color,
	},
	label: {
		'font-family': design.label['font-family'] || '',
		'font-size': design.label['font-size'],
		'font-weight': design.label['font-weight'],
		color: design.label.color,
	},
	separator: {
		color: design.separator.color,
		'font-size': design.separator['font-size'],
		'font-weight': design.separator['font-weight'],
	},
	hasSeparator: design.hasSeparator,
	singleContainer: design.singleContainer,
});
