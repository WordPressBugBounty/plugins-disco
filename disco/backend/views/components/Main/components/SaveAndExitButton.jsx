import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import Publish from '../../../asset/img/status/Publish.svg';
import {
	useAddCampaignMutation,
	useUpdateCampaignMutation,
} from '../features/campaigns/campaignsApi';
import { cleanFilters, validateEmptyField } from '../utilities/utilities';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { SaveButton, UpdateButton } from './SaveAndUpdateButton';

const SaveAndExitButton = () => {
	const [searchParams] = useSearchParams();
	const [{ isSuccess: added, isError: addingError }] =
		useAddCampaignMutation();
	const [updateCampaign, { isLoading: updating, isSuccess: updated }] =
		useUpdateCampaignMutation();

	const discount = useSelector((state) => state.discount);
	const { showEditor } = useSelector((state) => state.interaction);
	const { status } = discount;

	const currentTab = discount?.ui?.[0];
	const publishButtonLabel = currentTab === 2 ? 'Publish' : 'Update & Exit';
	const publishLoadingText = currentTab === 2 ? 'Publishing' : 'Updating';

	const navigate = useNavigate();

	const handleUpdateAndExit = () => {
		if (validateEmptyField(discount) === false) {
			return;
		}

		const dataForRequest = { ...discount };
		if (!dataForRequest.discount_valid_from) {
			delete dataForRequest.discount_valid_from;
		}
		if (!dataForRequest.discount_valid_to) {
			delete dataForRequest.discount_valid_to;
		}
		delete dataForRequest.created_by;
		delete dataForRequest.modified_by;
		dataForRequest.conditions = cleanFilters(discount.conditions);
		updateCampaign({
			id: discount.id,
			data: {
				...dataForRequest,
				priority: String(dataForRequest.priority),
				status: status === '1' ? '1' : currentTab === 2 ? '1' : '0',
			},
		});
	};

	useEffect(() => {
		if (added) {
			toast.success(__('New Campaign Added.', 'disco'));
			navigate('/');
		}
		if (updated) {
			toast.success(__('Campaign Updated.', 'disco'));
			navigate('/');
		}
		if (addingError) {
			toast.error(__('Something Went Wrong', 'disco'));
		}
	}, [added, updated, addingError]);

	return (
		<div className="disco-flex disco-gap-3">
			{searchParams.get('edit') ? (
				<div className="disco-flex disco-items-center disco-gap-3">
					<UpdateButton />
					<Button
						className="!disco-py-1.5 !disco-px-4 !disco-font-normal"
						disabled={updating || showEditor}
						onClick={handleUpdateAndExit}
						icon={
							currentTab === 2 ? (
								<img src={Publish} alt="Publish icon" />
							) : (
								''
							)
						}
						iconPositionLeft=""
					>
						{updating ? (
							<div className="disco-flex disco-gap-2 disco-items-center">
								<span>{__(publishLoadingText, 'disco')}</span>
								<LoadingSpinner size={4} />
							</div>
						) : (
							__(publishButtonLabel, 'disco')
						)}
					</Button>
				</div>
			) : (
				<div className="disco-flex disco-items-center disco-gap-3">
					<SaveButton disabled={showEditor} />
				</div>
			)}
		</div>
	);
};
export default SaveAndExitButton;
