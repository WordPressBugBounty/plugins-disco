const BadgeCardContainer = ({ children, className = '' }) => {
	return (
		<div
			className={`disco-bg-gray-100 disco-min-h-[305px] disco-border disco-border-white disco-rounded-md disco-flex disco-justify-center disco-items-center ${className}`}
		>
			{children}
		</div>
	);
};

export default BadgeCardContainer;
