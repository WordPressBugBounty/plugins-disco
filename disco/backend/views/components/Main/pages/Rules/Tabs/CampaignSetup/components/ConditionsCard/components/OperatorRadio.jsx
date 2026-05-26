import { RadioGroup } from '@headlessui/react';
import { __ } from '@wordpress/i18n';
const OperatorRadio = ({ value, onChange, fontSize = 'disco-text-[9px]' }) => {
	return (
		<RadioGroup
			className="disco-relative disco-flex disco-z-[2]"
			value={value}
			onChange={onChange}
		>
			<RadioGroup.Option value="and">
				{({ checked }) => (
					<span
						className={` disco-rounded-s disco-cursor-pointer disco-px-2.5 disco-py-1 disco-border disco-border-r-0 disco-border-gray-200 disco-font-semibold disco-select-none ${fontSize} ${
							checked
								? 'disco-border-primary disco-bg-primary disco-text-white'
								: 'disco-bg-white'
						} `}
					>
						{__('AND', 'disco')}
					</span>
				)}
			</RadioGroup.Option>
			<RadioGroup.Option value="or">
				{({ checked }) => (
					<span
						className={` disco-rounded-e disco-cursor-pointer disco-px-2 disco-py-1 disco-border disco-border-l-0 disco-border-gray-200 disco-font-semibold disco-select-none ${fontSize}  ${
							checked
								? 'disco-border-primary disco-bg-primary disco-text-white'
								: 'disco-bg-white'
						} `}
					>
						{__('OR', 'disco')}
					</span>
				)}
			</RadioGroup.Option>
		</RadioGroup>
	);
};
export default OperatorRadio;
