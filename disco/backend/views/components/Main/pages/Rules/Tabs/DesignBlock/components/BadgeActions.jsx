const BadgeActions = ({ children, className='' }) => {
	return (
		<div className={`disco-flex disco-gap-3 disco-mt-2 ${className}`}>
			{children}
		</div>
	);
}

export default BadgeActions;
