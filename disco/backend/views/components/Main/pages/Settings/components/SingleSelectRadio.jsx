import {RadioGroup} from "@headlessui/react";
import {__} from "@wordpress/i18n";

const SingleSelectRadio = ({ options, handleChange, selected }) => {
	return (
		<div className="disco-flex disco-items-center disco-gap-6">
			<RadioGroup
				className="disco-flex disco-rounded-lg disco-border disco-overflow-hidden disco-border-primary disco-items-stretch disco-z-[2] disco-shadow-custom"
				value={selected}
				onChange={handleChange}
			>

				{Object.keys(options).map((key) => (
					<RadioGroup.Option key={key} className={({checked})=>`disco-text-sm !disco-px-4 !disco-py-2 disco-cursor-pointer  disco-font-border disco-select-none ${
						checked
							? ' disco-bg-primary disco-text-white'
							: 'disco-bg-white'
					} `} value={key}>

						{__(options[key],'disco')}

					</RadioGroup.Option>
				))}
			</RadioGroup>
		</div>
	);
}

export default SingleSelectRadio;
