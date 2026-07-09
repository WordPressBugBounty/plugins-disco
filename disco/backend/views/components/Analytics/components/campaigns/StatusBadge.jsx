const STATUS_STYLES = {
	active: { dot: '#16a34a', text: '#374151' },
	expired: { dot: '#9ca3af', text: '#6b7280' },
	deleted: { dot: '#ef4444', text: '#374151' },
};

const StatusBadge = ({ status }) => {
	let style = STATUS_STYLES[status] || { dot: '#d1d5db', text: '#6b7280' };

	return (
		<span
			className="disco-inline-flex disco-items-center disco-gap-1.5 disco-text-xs"
			style={{ color: style.text }}
		>
			<span
				className="disco-size-[6px] disco-rounded-full disco-shrink-0"
				style={{ backgroundColor: style.dot }}
			/>
			{status}
		</span>
	);
};

export default StatusBadge;
