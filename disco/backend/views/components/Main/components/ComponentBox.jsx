// @ts-ignore
const ComponentBox = ({ children, className = '' }) => {
	return (
		<div
			className={`disco-border disco-border-white disco-bg-gray-25 disco-rounded-xl ${className}`}
		>
			{children}
		</div>
	);
};
export default ComponentBox;
