import { CheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toggleCampaignSelect } from '../../../../features/campaigns/campaignSlice';
import cn from '../../../../utilities/cn';
import {
	dateStringToTimestamp,
	dateTimeFormatter,
	truncate,
} from '../../../../utilities/utilities';
import ActionMenu from './components/ActionMenu';
import DeleteConfirmation from './components/DeleteConfirmation';
import StatusImage from './components/StatusImage';
import StatusToggler from './components/StatusToggler';
import TableCell from './components/TableCell';

const CampaignRow = ({ discountIntents, campaign, last }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { campaign_ids } = useSelector((state) => state.campaignState);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const handleToggleCampaignSelect = (id) => {
		dispatch(toggleCampaignSelect(id));
	};

	const handleNavigateToEdit = () => {
		navigate(`disco?edit=${campaign.id}`, { state: campaign });
	};

	const getStatus = (start, end) => {
		const startDate = dateStringToTimestamp(start);
		const endDate = dateStringToTimestamp(end);
		const currentDate = new Date();
		if (!startDate && !endDate) return __('Active', 'disco');
		if (!startDate && endDate && endDate > currentDate)
			return __('Active', 'disco');
		if (startDate && currentDate < startDate)
			return __('Scheduled', 'disco');
		if (endDate && currentDate > endDate) return __('Expired', 'disco');
		if (
			startDate &&
			endDate &&
			currentDate > startDate &&
			currentDate < endDate
		)
			return __('Active', 'disco');
	};

	return (
		<tr
			className={`even:!disco-bg-white odd:!disco-bg-gray-50 disco-rounded disco-w-full disco-bg-white`}
		>
			<TableCell
				className={cn(
					'disco-ps-4 disco-border-b disco-border-gray-100 disco-whitespace-nowrap disco-py-2 disco-pr-4 disco-text-sm ',
					{ 'disco-rounded-bl-lg': last }
				)}
			>
				<button
					onClick={() => handleToggleCampaignSelect(campaign.id)}
					className={`disco-shrink-0 disco-h-4 disco-w-4 disco-rounded disco-border disco-flex disco-justify-center disco-items-center ${
						campaign_ids.includes(campaign.id)
							? 'disco-border-primary-dark'
							: 'disco-border-gray-500 '
					}`}
				>
					{campaign_ids.includes(campaign.id) && (
						<CheckIcon className="disco-text-primary-dark" />
					)}
				</button>
			</TableCell>
			<TableCell className="disco-border-b disco-border-gray-100 disco-whitespace-nowrap disco-py-2 disco-pr-4 disco-text-sm disco-text-gray-900">
				<StatusToggler campaign={campaign} />
			</TableCell>
			<TableCell className=" disco-border-b disco-border-gray-100 disco-whitespace-nowrap disco-py-2 disco-pr-4 disco-text-sm ">
				<div role="button" onClick={handleNavigateToEdit}>
					<span className="disco-block disco-text-base disco-transition-colors hover:disco-text-primary">
						{truncate(campaign.name, 30)}
					</span>
				</div>
			</TableCell>
			<TableCell className=" disco-border-b disco-border-gray-100 disco-whitespace-nowrap disco-py-2 disco-pr-4 disco-text-sm disco-text-gray-900">
				{discountIntents.values[campaign.discount_intent]}
			</TableCell>
			<TableCell className=" disco-border-b disco-border-gray-100 disco-whitespace-nowrap disco-py-2 disco-pr-4 disco-text-sm disco-text-gray-900">
				{campaign.discount_intent === 'Product' ||
				campaign.discount_intent === 'Cart' ? (
					<>
						<span className="disco-capitalize">
							{campaign?.discount_rules[0]?.discount_type
								?.split('_')
								?.join(' ') +
								' (' +
								campaign?.discount_rules[0]?.discount_value +
								')'}
						</span>
					</>
				) : (
					<span>Mixed</span>
				)}
			</TableCell>
			<TableCell className=" disco-border-b disco-border-gray-100 disco-whitespace-nowrap disco-py-2 disco-pr-4 disco-text-sm disco-text-gray-900">
				{dateTimeFormatter(campaign.created_date)}
			</TableCell>
			<TableCell className="disco-flex disco-justify-center disco-border-b disco-border-gray-100 disco-whitespace-nowrap disco-py-2 disco-text-sm disco-text-gray-900">
				<StatusImage
					status={getStatus(
						campaign.discount_valid_from,
						campaign.discount_valid_to
					)}
				/>
			</TableCell>

			<TableCell
				className={cn(
					'disco-border-b disco-border-gray-100 disco-whitespace-nowrap disco-py-2 disco-text-sm disco-text-gray-900',
					{ 'disco-rounded-br-lg': last }
				)}
			>
				<div className="disco-flex disco-w-full disco-justify-center disco-items-center">
					<div className="disco-w-5" />
					<ActionMenu
						campaign={campaign}
						setDeleteModalOpen={setDeleteModalOpen}
					/>
				</div>
			</TableCell>
			<DeleteConfirmation
				deleteId={campaign.id}
				open={deleteModalOpen}
				setOpen={setDeleteModalOpen}
			/>
		</tr>
	);
};
export default CampaignRow;
