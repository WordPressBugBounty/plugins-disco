const Badge = ({ children, color = 'green' }) => {
	const colors = {
		green: 'disco-bg-emerald-100 disco-text-emerald-700',
		orange: 'disco-bg-orange-100 disco-text-orange-600',
		blue: 'disco-bg-blue-100 disco-text-blue-600',
	};
	return (
		<span
			className={`disco-inline-block disco-text-xs disco-font-semibold disco-px-2 disco-py-0.5 disco-rounded-full ${colors[color]}`}
		>
			{children}
		</span>
	);
};

export default Badge;
