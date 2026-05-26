// @ts-ignore
const ComponentContainer = ({ children, className = '' }) => {
	return (
		<div className={`disco-mt-2 disco-flex ${className}`}>{children}</div>
	);
};
export default ComponentContainer;
