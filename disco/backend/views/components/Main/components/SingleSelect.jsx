import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
import { Fragment } from 'react';

const SingleSelect = ({
	menu = false,
	placeholder = __('Select', 'disco'),
	items,
	onchange = () => {},
	selected,
	disabled = false,
	className = '',
	buttonClass = '',
	// Keys of pro-only options: rendered greyed out with a "Pro" badge and not
	// selectable. Matches the option styling used by the Conditions filter
	// dropdown.
	proItems = [],
	proUrl = 'https://discoplugin.com/pricing/?utm_source=pro-text&utm_medium=free-to-pro&utm_campaign=free-to-pro&utm_id=1',
}) => {
	return (
		<Listbox
			className={`${className} ${disabled ? 'disco-opacity-50' : ''}`}
			disabled={disabled}
			value={selected}
			onChange={!disabled && onchange}
		>
			<div className="disco-relative">
				<Listbox.Button
					className={`disco-relative disco-cursor-pointer disco-w-full disco-rounded-md disco-border disco-text-base disco-border-primary disco-py-2 disco-pl-2.5 disco-pr-8 disco-text-left focus:disco-outline-none ${buttonClass}`}
				>
					<span className="disco-block disco-truncate">
						{items[selected] || placeholder}
					</span>
					<span className="disco-pointer-events-none disco-absolute disco-inset-y-0 disco-right-0 disco-flex disco-items-center disco-pr-0.5">
						<ChevronDownIcon
							className="disco-h-5 disco-w-5 disco-text-primary"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
				<Transition
					as={Fragment}
					leave="disco-transition disco-ease-in disco-duration-100"
					leaveFrom="disco-opacity-100"
					leaveTo="disco-opacity-0"
				>
					<Listbox.Options className="disco-z-50 disco-absolute disco-cursor-pointer disco-mt-1.5 disco-max-h-60 disco-w-full disco-overflow-auto disco-rounded-md disco-bg-white disco-text-base disco-shadow-lg disco-ring-1 disco-ring-black disco-ring-opacity-5 focus:disco-outline-none sm:disco-text-sm">
						{items &&
							Object.keys(items).map((item) => (
								<Listbox.Option
									key={item}
									disabled={proItems.includes(item)}
									className={({ active }) =>
										`disco-relative disco-py-1 disco-pl-4 disco-mb-0 ${
											proItems.includes(item)
												? '!disco-text-gray-400 !disco-cursor-not-allowed'
												: `hover:disco-bg-[#dfffefe6] ${
														active && !menu
															? 'disco-bg-primary-light'
															: 'disco-text-gray-900'
													}`
										}`
									}
									value={item}
								>
									{({ selected }) => (
										<>
											<span
												className={`disco-block disco-truncate ${
													selected && !menu
														? 'disco-font-medium'
														: 'disco-font-normal'
												}`}
											>
												{items[item]}{' '}
												{proItems.includes(item) && (
													<span className="disco-bg-red-500 disco-px-1.5 disco-py-1 disco-text-xs disco-text-white disco-rounded-md">
														<a
															href={proUrl}
															target="_blank"
															rel="noreferrer"
															onClick={(e) =>
																e.stopPropagation()
															}
															className="disco-text-xs disco-text-white hover:!disco-text-white focus:!disco-outline-none visited:disco-text-white focus:!disco-ring-0"
														>
															{__('Pro', 'disco')}
														</a>
													</span>
												)}
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
export default SingleSelect;
