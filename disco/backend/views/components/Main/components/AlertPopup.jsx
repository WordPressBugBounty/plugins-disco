import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { __ } from '@wordpress/i18n';
import { Fragment } from 'react';

const AlertPopup = ({
	open,
	setOpen,
	onRemove,
	removeBtnTestId = '',
	title = __('Remove Conditions', 'disco'),
	description = __(
		'This action will remove the conditions from the campaign. Are you sure you want to proceed?',
		'disco'
	),
	confirmLabel = __('Remove', 'disco'),
}) => (
	<Transition.Root show={open} as={Fragment}>
		<Dialog
			as="div"
			className="disco-relative disco-z-50"
			onClose={setOpen}
		>
			<Transition.Child
				as={Fragment}
				enter="disco-ease-out disco-duration-300"
				enterFrom="disco-opacity-0"
				enterTo="disco-opacity-100"
				leave="disco-ease-in disco-duration-200"
				leaveFrom="disco-opacity-100"
				leaveTo="disco-opacity-0"
			>
				<div className="disco-fixed disco-inset-0 disco-bg-gray-500 disco-bg-opacity-50 disco-transition-opacity" />
			</Transition.Child>
			<div className="disco-fixed disco-inset-0 disco-z-10 disco-w-screen disco-overflow-y-auto">
				<div className="disco-flex disco-min-h-full disco-items-end disco-justify-center disco-p-4 disco-text-center sm:disco-items-center sm:disco-p-0">
					<Transition.Child
						as={Fragment}
						enter="disco-ease-out disco-duration-300"
						enterFrom="disco-opacity-0 disco-translate-y-4 sm:disco-translate-y-0 sm:disco-scale-95"
						enterTo="disco-opacity-100 disco-translate-y-0 sm:disco-scale-100"
						leave="disco-ease-in disco-duration-200"
						leaveFrom="disco-opacity-100 disco-translate-y-0 sm:disco-scale-100"
						leaveTo="disco-opacity-0 disco-translate-y-4 sm:disco-translate-y-0 sm:disco-scale-95"
					>
						<Dialog.Panel className="disco-relative disco-transform disco-overflow-hidden disco-rounded-lg disco-bg-white disco-px-4 disco-pb-4 disco-pt-5 disco-text-left disco-shadow disco-transition-all sm:disco-my-8 sm:disco-w-full sm:disco-max-w-lg sm:disco-p-6">
							<div className="sm:disco-flex sm:disco-items-start">
								<div className="disco-mx-auto disco-flex disco-h-12 disco-w-12 disco-flex-shrink-0 disco-items-center disco-justify-center disco-rounded-full disco-bg-red-100 sm:disco-mx-0 sm:disco-h-10 sm:disco-w-10">
									<ExclamationTriangleIcon
										className="disco-h-6 disco-w-6 disco-text-red-600"
										aria-hidden="true"
									/>
								</div>
								<div className="disco-mt-3 disco-text-center sm:disco-ml-4 sm:disco-mt-0 sm:disco-text-left">
									<Dialog.Title
										as="h3"
										className="disco-text-base disco-font-semibold disco-leading-6 disco-text-gray-900"
									>
										{title}
									</Dialog.Title>
									<div className="disco-mt-2">
										<p className="disco-text-sm disco-text-gray-500">
											{description}
										</p>
									</div>
								</div>
							</div>
							<div className="disco-mt-5 sm:disco-mt-4 sm:disco-flex sm:disco-flex-row-reverse">
								<button
									data-testid={removeBtnTestId}
									type="button"
									className="disco-inline-flex disco-w-full disco-justify-center disco-rounded-md disco-bg-red-600 disco-px-3 disco-py-2 disco-text-sm disco-font-semibold disco-text-white disco-shadow-sm hover:disco-bg-red-500 sm:disco-ml-3 sm:disco-w-auto"
									onClick={() => {
										onRemove && onRemove();
										setOpen(false);
									}}
								>
									{confirmLabel}
								</button>
								<button
									type="button"
									className="disco-mt-3 disco-inline-flex disco-w-full disco-justify-center disco-rounded-md disco-bg-white disco-px-3 disco-py-2 disco-text-sm disco-font-semibold disco-text-gray-900 disco-shadow-sm disco-ring-1 disco-ring-inset disco-ring-gray-300 hover:disco-bg-gray-50 sm:disco-mt-0 sm:disco-w-auto"
									onClick={() => setOpen(false)}
								>
									{__('Cancel', 'disco')}
								</button>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</div>
		</Dialog>
	</Transition.Root>
);

export default AlertPopup;
