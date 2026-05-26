import InfoIcon from './InfoIcon';

const CommonHeadingBox = ({ title = '', className = '', url = '' }) => {
	return (
		<div
			className={`!disco-bg-gray-100 disco-px-4 disco-py-2 disco-rounded-t-xl ${className}`}
		>
			<div className="disco-flex disco-items-center disco-gap-1.5">
				<h1 className="disco-text-xl">{title}</h1>
				<InfoIcon url={url} />
			</div>
		</div>
	);
};
export default CommonHeadingBox;
