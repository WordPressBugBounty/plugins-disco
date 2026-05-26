const BadgeComponentContainer = ({ children, className = '' }) => {
	return (
		<div
			className={`disco-mt-1 disco-min-h-[390px] disco-bg-white disco-p-4 disco-rounded-xl ${className}`}
		>
			{children}
		</div>
	);
};

export default BadgeComponentContainer;
