export const CheckIcon = () => (
	<svg width="18" height="18" viewBox="0 0 20 20" fill="none">
		<path
			d="M16.667 5L7.5 14.167 3.333 10"
			stroke="#10b981"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const CheckCircle = ({ color = '#10b981' }) => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
		<circle cx="10" cy="10" r="9" fill={color} fillOpacity="0.12" />
		<path
			d="M14 7.5L8.5 13 6 10.5"
			stroke={color}
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const XIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path
			d="M12 4L4 12M4 4l8 8"
			stroke="#ef4444"
			strokeWidth="1.8"
			strokeLinecap="round"
		/>
	</svg>
);

export const StarIcon = ({ filled }) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 20 20"
		fill={filled ? '#facc15' : 'none'}
		stroke="#facc15"
		strokeWidth="1.5"
	>
		<path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78L10 1z" />
	</svg>
);
