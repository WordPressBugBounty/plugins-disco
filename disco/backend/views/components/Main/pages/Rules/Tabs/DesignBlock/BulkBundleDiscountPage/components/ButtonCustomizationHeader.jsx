import Status from '../../components/Status';
const ButtonCustomizationHeader = ({ title, status, onChange }) => {
	return (
		<div className="disco-mt-4 disco-flex disco-justify-between disco-items-center">
			<h1 className="disco-text-sm disco-font-semibold">{title}</h1>
			<Status status={status} handleStatus={onChange} />
		</div>
	);
};

export default ButtonCustomizationHeader;
