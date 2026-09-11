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
			className="disco:relative disco:z-50"
			onClose={setOpen}
		>
			<Transition.Child
				as={Fragment}
				enter="disco:ease-out disco:duration-300"
				enterFrom="disco:opacity-0"
				enterTo="disco:opacity-100"
				leave="disco:ease-in disco:duration-200"
				leaveFrom="disco:opacity-100"
				leaveTo="disco:opacity-0"
			>
				<div className="disco:fixed disco:inset-0 disco:bg-gray-500/50 disco:transition-opacity" />
			</Transition.Child>
			<div className="disco:fixed disco:inset-0 disco:z-10 disco:w-screen disco:overflow-y-auto">
				<div className="disco:flex disco:min-h-full disco:items-end disco:justify-center disco:p-4 disco:text-center disco:sm:items-center disco:sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="disco:ease-out disco:duration-300"
						enterFrom="disco:opacity-0 disco:translate-y-4 disco:sm:translate-y-0 disco:sm:scale-95"
						enterTo="disco:opacity-100 disco:translate-y-0 disco:sm:scale-100"
						leave="disco:ease-in disco:duration-200"
						leaveFrom="disco:opacity-100 disco:translate-y-0 disco:sm:scale-100"
						leaveTo="disco:opacity-0 disco:translate-y-4 disco:sm:translate-y-0 disco:sm:scale-95"
					>
						<Dialog.Panel className="disco:relative disco:transform disco:overflow-hidden disco:rounded-lg disco:bg-white disco:px-4 disco:pb-4 disco:pt-5 disco:text-left disco:shadow disco:transition-all disco:sm:my-8 disco:sm:w-full disco:sm:max-w-lg disco:sm:p-6">
							<div className="disco:sm:flex disco:sm:items-start">
								<div className="disco:mx-auto disco:flex disco:h-12 disco:w-12 disco:shrink-0 disco:items-center disco:justify-center disco:rounded-full disco:bg-red-100 disco:sm:mx-0 disco:sm:h-10 disco:sm:w-10">
									<ExclamationTriangleIcon
										className="disco:h-6 disco:w-6 disco:text-red-600"
										aria-hidden="true"
									/>
								</div>
								<div className="disco:mt-3 disco:text-center disco:sm:ml-4 disco:sm:mt-0 disco:sm:text-left">
									<Dialog.Title
										as="h3"
										className="disco:text-base disco:font-semibold disco:leading-6 disco:text-gray-900"
									>
										{title}
									</Dialog.Title>
									<div className="disco:mt-2">
										<p className="disco:text-sm disco:text-gray-500">
											{description}
										</p>
									</div>
								</div>
							</div>
							<div className="disco:mt-5 disco:sm:mt-4 disco:sm:flex disco:sm:flex-row-reverse">
								<button
									data-testid={removeBtnTestId}
									type="button"
									className="disco:inline-flex disco:w-full disco:justify-center disco:rounded-md disco:bg-red-600 disco:px-3 disco:py-2 disco:text-sm disco:font-semibold disco:text-white disco:shadow-sm disco:hover:bg-red-500 disco:sm:ml-3 disco:sm:w-auto"
									onClick={() => {
										onRemove && onRemove();
										setOpen(false);
									}}
								>
									{confirmLabel}
								</button>
								<button
									type="button"
									className="disco:mt-3 disco:inline-flex disco:w-full disco:justify-center disco:rounded-md disco:bg-white disco:px-3 disco:py-2 disco:text-sm disco:font-semibold disco:text-gray-900 disco:shadow-sm disco:ring-1 disco:ring-inset disco:ring-gray-300 disco:hover:bg-gray-50 disco:sm:mt-0 disco:sm:w-auto"
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
