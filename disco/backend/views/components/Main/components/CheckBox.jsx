import { Checkbox, Field, Label } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/solid';

const CheckBox = ({ checked, onChange, label, testid }) => {
	return (
		<Field className="disco-flex disco-items-center disco-gap-2 disco-cursor-pointer disco-mb-4">
			<Checkbox
				checked={checked}
				onChange={onChange}
				data-testid={testid}
				className="disco-w-4 disco-h-4 disco-rounded disco-border disco-border-primary data-[checked]:disco-bg-primary data-[checked]:disco-border-primary disco-bg-white disco-flex disco-items-center disco-justify-center"
			>
				<CheckIcon className="disco-hidden disco-w-3 disco-h-3 disco-text-white [[data-checked]_&]:disco-block" />
			</Checkbox>
			<Label className="disco-text-base disco-select-none disco-cursor-pointer">
				{label}
			</Label>
		</Field>
	);
};

export default CheckBox;
