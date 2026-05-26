import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { __ } from '@wordpress/i18n';
const Popup = ({
	title = 'Products Added',
	data = [],
	open = false,
	onClose = () => {},
}) => {
	const totalCount = data.length.toString().padStart(2, '0');

	return (
		<Dialog
			open={open}
			onClose={onClose}
			className="disco-relative disco-z-50"
		>
			<div
				className="disco-fixed disco-inset-0 disco-bg-black/50"
				aria-hidden="true"
			/>
			<div className="disco-fixed disco-inset-0 disco-flex disco-items-center disco-justify-center disco-p-2">
				<Dialog.Panel className="disco-bg-white disco-rounded-xl disco-shadow-2xl disco-min-w-xs disco-p-4 disco-max-h-[60vh] disco-flex disco-flex-col">
					<Dialog.Title className="disco-text-lg disco-font-semibold disco-mb-4 disco-flex disco-justify-between disco-items-center">
						<div className="disco-flex disco-items-center disco-gap-2">
							{title}
							<span className="disco-text-lg disco-font-medium disco-text-gray-600">
								({totalCount})
							</span>
						</div>
						<button
							onClick={onClose}
							className="disco-text-gray-500 hover:disco-text-black disco-text-xl disco-font-light"
						>
							<XMarkIcon className="disco-size-5 disco-text-red-700" />
						</button>
					</Dialog.Title>

					{/* 2. Content: Product List */}
					{data.length > 0 ? (
						<div className="disco-space-y-1 disco-flex-grow disco-overflow-y-auto disco-p-2 disco-rounded-md disco-shadow">
							{data.map((item) => (
								<div
									key={item.id}
									className="disco-p-1 disco-flex disco-items-center disco-gap-3"
								>
									<div className="disco-w-6 disco-h-6 disco-flex disco-items-center disco-justify-center disco-text-xl">
										{item.image ? (
											<img
												src={item.image}
												alt={item.name}
												className="disco-w-6 disco-h-6 disco-rounded"
											/>
										) : (
											<span className="disco-text-base">
												{item.emoji || '📦'}
											</span>
										)}
									</div>

									<p className="disco-text-gray-700 disco-font-light">
										{item.id} - {item.name}
									</p>
								</div>
							))}
						</div>
					) : (
						<div className="disco-text-center disco-text-gray-500 disco-py-8">
							{__('No items available.', 'disco')}
						</div>
					)}
				</Dialog.Panel>
			</div>
		</Dialog>
	);
};

export default Popup;
