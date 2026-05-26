import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Input from '../../../components/Input';
import SingleSelect from '../../../components/SingleSelect';
import {
	resetSelectedIDs,
	setCampaignsInState,
	setSearchTerm,
} from '../../../features/campaigns/campaignSlice';
import {
	useDeleteCampaignMutation,
	usePatchCampaignMutation,
} from '../../../features/campaigns/campaignsApi';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DeleteConfirmation from './CampaignRow/components/DeleteConfirmation';
import LoadingSpinner from '../../../components/LoadingSpinner';

const ActionsBar = ({ allCampaigns }) => {
	const actions = {
		enable: __('Enable', 'disco'),
		disable: __('Disable', 'disco'),
		delete: __('Delete', 'disco'),
	};
	const dispatch = useDispatch();
	const [selectedAction, setSelectedAction] = useState('');

	const { campaign_ids, searchTerm } = useSelector(
		(state) => state.campaignState
	);

	const [
		patchCampaign,
		{ isLoading: patchLoading, isSuccess: patchSuccess },
	] = usePatchCampaignMutation();
	const [{ isLoading: deleteLoading, isSuccess: bulkDeleteSuccess }] =
		useDeleteCampaignMutation();

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const handleActionChange = (action) => {
		if (campaign_ids.length === 0) {
			toast.error(__('Please select at least one campaign', 'disco'));
			return;
		}

		setSelectedAction(action);
		if (action) {
			if (action === 'enable') {
				campaign_ids.forEach((id) => {
					patchCampaign({ id, data: { status: '1' } });
				});
			}
			if (action === 'disable') {
				campaign_ids.forEach((id) => {
					patchCampaign({ id, data: { status: '0' } });
				});
			}
			if (action === 'delete') {
				setDeleteModalOpen(true);
				dispatch(setSearchTerm(''));
			}
		}
	};

	useEffect(() => {
		if (bulkDeleteSuccess) {
			dispatch(resetSelectedIDs());
			toast.error(__('Campaigns Deleted', 'disco'));
			setSelectedAction('');
		}

		if (patchSuccess && selectedAction == 'enable') {
			toast.success(__('Campaigns Enabled', 'disco'));
			setSelectedAction('');
		}
		if (patchSuccess && selectedAction == 'disable') {
			toast.warn(__('Campaigns Disabled', 'disco'));
			setSelectedAction('');
		}
	}, [bulkDeleteSuccess, patchSuccess]);

	const handleSearchTermChange = (e) => {
		dispatch(setSearchTerm(e.target.value));
		dispatch(
			setCampaignsInState(
				allCampaigns.filter((camp) =>
					camp.name
						.toLowerCase()
						.includes(e.target.value.toLowerCase())
				)
			)
		);
	};

	return (
		<div className="disco-mt-8 disco-mb-4 disco-flex disco-justify-between">
			<div className="disco-flex disco-gap-4">
				<div className="disco-min-w-[160px] disco-flex disco-items-center disco-gap-2">
					<SingleSelect
						disabled={patchLoading || deleteLoading}
						items={actions}
						selected={selectedAction}
						onchange={handleActionChange}
						className="disco-bg-white disco-w-[140px]"
						placeholder={__('Bulk Actions', 'disco')}
					/>
					{(patchLoading || deleteLoading) && (
						<LoadingSpinner size={6} />
					)}
				</div>
			</div>
			<div className="disco-flex disco-gap-4">
				<Input
					className="!disco-ps-8"
					value={searchTerm}
					onChange={handleSearchTermChange}
					placeholder={__('Search Campaign', 'disco')}
					icon={
						<MagnifyingGlassIcon className="disco-h-4 disco-w-4 disco-absolute disco-left-3 disco-text-gray-500" />
					}
				/>
			</div>

			<DeleteConfirmation
				deleteBtnTestId="delete-campaigns-btn"
				deleteIds={campaign_ids}
				open={deleteModalOpen}
				setOpen={setDeleteModalOpen}
			/>
		</div>
	);
};
export default ActionsBar;
