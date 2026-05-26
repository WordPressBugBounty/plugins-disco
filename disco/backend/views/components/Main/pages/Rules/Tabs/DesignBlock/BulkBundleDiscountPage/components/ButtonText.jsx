import Input from "../../../../../../components/Input";

const ButtonText = ({ title, buttonText, onChange }) => {
	return (
		<div className="disco-flex-grow">
			<p className="disco-text-sm disco-mb-2 disco-font-light">{title}</p>
			<Input
				value={buttonText}
				onChange={onChange}
				placeholder="Buy Now"
				className="disco-h-8 disco-w-48 disco-text-sm"
			/>
		</div>
	);
}

export default ButtonText;
