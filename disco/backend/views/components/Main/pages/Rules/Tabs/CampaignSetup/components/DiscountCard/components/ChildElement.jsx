const ChildElement = ({ heading, children, className }) => {
	return (
		<div
			className={` ${className}`}
		>
			<div className="disco-text-black disco-font-base disco-text-base disco-col-span-3 disco-mb-2">
				{heading && <h4>{heading}</h4>}
			</div>
			<div className="disco-col-span-9">{children}</div>
		</div>
	);
};
export default ChildElement;
