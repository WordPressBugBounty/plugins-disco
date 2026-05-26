import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from 'react';

const MultiSelect = ({
	placeholder = __('Select', 'disco'),
	items,
	selected = [],
	onChange = () => {},
}) => {
	const [selectValue, setSelectedValue] = useState(selected);

	const handleChange = (selected) => {
		setSelectedValue(selected);
	};

	const handleRemoveItem = (value) => {
		setSelectedValue((prevState) =>
			prevState.filter((item) => item !== value)
		);
	};

	useEffect(() => {
		onChange(selectValue);
	}, [selectValue]);

	return (
		<Listbox value={selected} onChange={handleChange} multiple>
			<div className="disco-relative disco-test">
				<Listbox.Button className="disco-relative disco-cursor-pointer disco-min-w-[200px] disco-flex-grow disco-w-full disco-rounded-md disco-border disco-text-base disco-border-gray-200 disco-py-2 disco-pl-3 disco-pr-10 disco-text-left focus:disco-outline-none">
					<span className="disco-flex disco-flex-wrap disco-gap-1.5 disco-truncate">
						{selected.length > 0
							? selected?.map((value) => (
									<span
										className="disco-flex disco-rounded-sm disco-items-center disco-text-[12px] disco-bg-gray-200 disco-px-1.5 disco-pe-0 disco-py-0.5"
										key={value}
									>
										{items[value]}

										<XMarkIcon
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveItem(value);
											}}
											className="disco-h-5 disco-w-5 disco-px-1"
										/>
									</span>
								))
							: placeholder}
					</span>
					<span className="disco-pointer-events-none disco-absolute disco-inset-y-0 disco-right-0 disco-flex disco-items-center disco-pr-2">
						<ChevronUpDownIcon
							className="disco-h-5 disco-w-5 disco-text-gray-400"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
				<Transition
					as={Fragment}
					leave="disco-transition disco-ease-in disco-duration-100"
					leaveFrom="disco-opacity-100"
					leaveTo="disco-opacity-0"
					className="disco-absolute disco-z-50"
				>
					<Listbox.Options className="disco-absolute disco-cursor-pointer disco-mt-1.5 disco-max-h-60 disco-w-full disco-overflow-auto disco-rounded-md disco-bg-white disco-text-base disco-shadow-lg disco-ring-1 disco-ring-black disco-ring-opacity-5 focus:disco-outline-none sm:disco-text-sm !disco-z-41 ">
						{items &&
							Object.keys(items).map((item) => (
								<Listbox.Option
									key={item}
									className={({ active }) =>
										`disco-relative disco-py-1 disco-pl-4 disco-mb-0 ${
											active
												? 'disco-bg-green-100'
												: 'disco-text-gray-900'
										}`
									}
									value={item}
								>
									{({ selected }) => (
										<>
											<span
												className={`disco-block disco-truncate ${
													selected
														? 'disco-font-medium'
														: 'disco-font-normal'
												}`}
											>
												{items[item]}
											</span>
										</>
									)}
								</Listbox.Option>
							))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
};
export default MultiSelect;
