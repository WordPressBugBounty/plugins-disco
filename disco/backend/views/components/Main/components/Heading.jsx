// @ts-ignore
const Heading = ({ children, className = '' }) => {
	return (
		<h3 className={`disco-text-xl disco-font-medium ${className}`}>
			{children}
		</h3>
	);
};
export default Heading;
