import { Menu, Transition } from '@headlessui/react';
import {
	DocumentArrowUpIcon,
	DocumentDuplicateIcon,
	PencilSquareIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';

import { Cog6ToothIcon } from '@heroicons/react/16/solid';
import { __ } from '@wordpress/i18n';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import { useAddCampaignMutation } from '../../../../../features/campaigns/campaignsApi';
import cn from '../../../../../utilities/cn';
import { prepareCampaignForRequest } from '../../../../../utilities/utilities';

// Rough height of the dropdown, used until it has been rendered once and measured.
const ESTIMATED_MENU_HEIGHT = 160;
// Matches the mt-2 / mb-2 gap between the trigger and the dropdown.
const MENU_GAP = 8;

const ActionMenu = ({ setDeleteModalOpen, campaign }) => {
	const navigate = useNavigate();
	const [addCampaign, { isLoading, isSuccess }] = useAddCampaignMutation();

	// dropdown direction start
	const triggerRef = useRef(null);
	const menuHeightRef = useRef(ESTIMATED_MENU_HEIGHT);
	const [openUpward, setOpenUpward] = useState(false);

	// Keep the measured height around so the next open uses the real value.
	const handleMenuRef = useCallback((node) => {
		if (node) {
			menuHeightRef.current = node.offsetHeight;
		}
	}, []);

	// Flip the dropdown above the trigger when the viewport has no room below.
	const updateDirection = useCallback(() => {
		const trigger = triggerRef.current;

		if (!trigger) {
			return;
		}

		const rect = trigger.getBoundingClientRect();
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;
		const requiredSpace = menuHeightRef.current + MENU_GAP;

		setOpenUpward(spaceBelow < requiredSpace && spaceAbove > spaceBelow);
	}, []);
	// dropdown direction end

	// campaign export functionality start
	const downloadLinkRef = useRef(null);
	const campaignJSON = JSON.stringify(campaign);

	const blob = new Blob([campaignJSON], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const fileName = campaign.name.split(' ').join('_') + '.disco';
	// campaign export functionality end

	const handleAction = (action) => {
		switch (action) {
			case 'edit':
				navigate(`disco?edit=${campaign.id}`, { state: campaign });
				break;
			case 'duplicate': {
				const dataForRequest = prepareCampaignForRequest(
					campaign,
					'Copy'
				);
				addCampaign(dataForRequest);
				break;
			}
			case 'export':
				downloadLinkRef.current.click();
				break;
			case 'delete':
				setDeleteModalOpen(true);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success(__('Campaign Successfully Duplicated.', 'disco'));
		}
	}, [isSuccess]);

	return (
		<>
			<Menu
				as="div"
				className="disco:relative disco:inline-block disco:text-left"
			>
				<div ref={triggerRef}>
					<Menu.Button
						className="disco:flex disco:outline-none"
						onClick={updateDirection}
					>
						<Cog6ToothIcon
							data-testid="disco-campaign-actions"
							className="disco:h-5 disco:w-5 disco:text-gray-600"
						/>
					</Menu.Button>
				</div>

				<Transition
					as={Fragment}
					enter="disco:transition disco:ease-out disco:duration-100"
					enterFrom="disco:transform disco:opacity-0 disco:scale-95"
					enterTo="disco:transform disco:opacity-100 disco:scale-100"
					leave="disco:transition disco:ease-in disco:duration-75"
					leaveFrom="disco:transform disco:opacity-100 disco:scale-100"
					leaveTo="disco:transform disco:opacity-0 disco:scale-95"
				>
					<Menu.Items
						ref={handleMenuRef}
						className={cn(
							openUpward
								? 'disco:bottom-full disco:mb-2 disco:origin-bottom-right'
								: 'disco:top-full disco:mt-2 disco:origin-top-right',
							'disco:absolute disco:-right-10 disco:z-10 disco:w-36 disco:divide-y disco:divide-gray-100 disco:rounded-md disco:bg-white disco:shadow-lg disco:border disco:border-gray-200 disco:outline-hidden'
						)}
					>
						<div className="disco:py-1">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => handleAction('edit')}
										className={cn(
											active
												? 'disco:bg-primary-light disco:text-gray-900'
												: 'disco:text-gray-700',
											'disco:group disco:flex disco:items-center disco:w-full disco:px-3 disco:py-1.5 disco:text-sm disco:font-normal'
										)}
									>
										<PencilSquareIcon
											className="disco:mr-2 disco:h-4.5 disco:w-4.5 disco:text-gray-500 disco:group-hover:text-gray-600"
											aria-hidden="true"
										/>
										{__('Edit', 'disco')}
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() =>
											handleAction('duplicate')
										}
										className={cn(
											active
												? 'disco:bg-primary-light disco:text-gray-900'
												: 'disco:text-gray-700',
											'disco:group disco:flex disco:items-center disco:w-full disco:px-3 disco:py-1.5 disco:text-sm disco:font-normal'
										)}
									>
										<DocumentDuplicateIcon
											className="disco:mr-2 disco:h-4.5 disco:w-4.5 disco:text-gray-500 disco:group-hover:text-gray-600"
											aria-hidden="true"
										/>
										{__('Duplicate', 'disco')}
									</button>
								)}
							</Menu.Item>
						</div>
						<div className="disco:py-1">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => handleAction('export')}
										className={cn(
											active
												? 'disco:bg-primary-light disco:text-gray-900'
												: 'disco:text-gray-700',
											'disco:group disco:flex disco:items-center disco:w-full disco:px-3 disco:py-1.5 disco:text-sm disco:font-normal'
										)}
									>
										<DocumentArrowUpIcon
											className="disco:mr-2 disco:h-4.5 disco:w-4.5 disco:text-gray-500 disco:group-hover:text-gray-600"
											aria-hidden="true"
										/>
										{__('Export', 'disco')}
									</button>
								)}
							</Menu.Item>
						</div>
						<div className="disco:py-1">
							<Menu.Item>
								{({ active }) => (
									<button
										onClick={() => handleAction('delete')}
										className={cn(
											active
												? 'disco:bg-primary-light disco:text-gray-900'
												: 'disco:text-gray-700',
											'disco:group disco:flex disco:items-center disco:w-full disco:px-3 disco:py-1.5 disco:text-sm disco:font-normal'
										)}
									>
										<TrashIcon
											className="disco:mr-2 disco:h-4.5 disco:w-4.5 disco:text-red-500 disco:group-hover:text-red-600"
											aria-hidden="true"
										/>
										{__('Delete', 'disco')}
									</button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>

			<a
				ref={downloadLinkRef}
				href={url}
				download={fileName}
				style={{ display: 'none' }}
			>
				{__('Download', 'disco')}
			</a>
			{isLoading ? (
				<LoadingSpinner size={5} />
			) : (
				<div className="disco:h-5 disco:w-5"></div>
			)}
		</>
	);
};

export default ActionMenu;
