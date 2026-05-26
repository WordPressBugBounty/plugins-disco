import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../../../components/LoadingSpinner';

const ImagePreview = ({
	images = [],
	onDelete,
	handleUploadBadgeSelect = () => {},
	isLoading = false,
	selectedDesign = null,
}) => {
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const handleDeleteClick = (id) => {
		setDeleteId(id);
		setOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (deleteId) {
			try {
				await onDelete(deleteId);
				toast.error(__('Image Deleted.', 'disco'));
			} catch {
				toast.error(__('Failed to delete image.', 'disco'));
			}
		}
		setOpen(false);
		setDeleteId(null);
	};

	return (
		<>
			<div className="disco-max-h-[350px] disco-overflow-y-auto disco-rounded-lg disco-bg-white disco-my-4 disco-py-4 disco-px-4 disco-border-1 disco-no-scrollbar">
				<h3 className="disco-text-base disco-font-semibold disco-mb-2">
					{__('Uploaded Images', 'disco')}
				</h3>
				{isLoading ? (
					<div className="disco-flex disco-items-center disco-justify-center disco-py-6">
						<LoadingSpinner size={6} />
					</div>
				) : images.length === 0 ? (
					<p className="disco-text-gray-400 disco-text-sm disco-text-center disco-py-6">
						{__(
							'No images uploaded yet. Upload an image below.',
							'disco'
						)}
					</p>
				) : (
					<div className="disco-grid disco-grid-cols-4 disco-gap-4">
						{images.map((img, index) => {
							const src = typeof img === 'string' ? img : img.url;
							const id = typeof img === 'object' ? img.id : null;
							return (
								<div
									key={id || index}
									className={`disco-group disco-relative disco-flex disco-flex-col disco-border disco-rounded-md disco-p-3 disco-items-center disco-justify-center ${selectedDesign === id ? 'disco-border-primary' : 'disco-border-gray-200'}`}
								>
									{id && (
										<button
											onClick={() =>
												handleDeleteClick(id)
											}
											className="disco-absolute disco-top-1 disco-right-1 disco-hidden group-hover:disco-flex disco-items-center disco-justify-center disco-w-5 disco-h-5 disco-rounded-full disco-bg-red-500 disco-cursor-pointer hover:disco-bg-red-600 disco-z-10"
										>
											<XMarkIcon className="disco-w-3 disco-h-3 disco-text-white" />
										</button>
									)}
									<img
										src={src}
										alt={`Uploaded ${index + 1}`}
										onClick={() =>
											handleUploadBadgeSelect(img)
										}
										className="disco-object-contain"
									/>
								</div>
							);
						})}
					</div>
				)}
			</div>

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
												{__('Delete Image', 'disco')}
											</Dialog.Title>
											<div className="disco-mt-2">
												<p className="disco-text-sm disco-text-gray-500">
													{__(
														'Are you sure you want to delete this image? This action cannot be undone.',
														'disco'
													)}
												</p>
											</div>
										</div>
									</div>
									<div className="disco-mt-5 sm:disco-mt-4 sm:disco-flex sm:disco-flex-row-reverse">
										<button
											type="button"
											className="disco-inline-flex disco-w-full disco-justify-center disco-rounded-md disco-bg-red-600 disco-px-3 disco-py-2 disco-text-sm disco-font-semibold disco-text-white disco-shadow-sm hover:disco-bg-red-500 sm:disco-ml-3 sm:disco-w-auto"
											onClick={handleConfirmDelete}
										>
											{__('Delete', 'disco')}
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
		</>
	);
};

export default ImagePreview;
