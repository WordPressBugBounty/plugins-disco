import InfoIcon from '../../../../../components/InfoIcon';

const BadgeTitle = ({ title = '', className = '', url = '' }) => {
	return (
		<div className={`disco-rounded-t-xl ${className}`}>
			<div className="disco-flex disco-items-center disco-gap-1.5">
				<h1 className="disco-text-lg disco-font-semibold">{title}</h1>
				<InfoIcon url={url} />
			</div>
		</div>
	);
};
export default BadgeTitle;
