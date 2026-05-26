import { Switch } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
	useAddCampaignMutation,
	useUpdateCampaignMutation,
} from '../features/campaigns/campaignsApi';
import { updateOption } from '../features/discount/discountSlice';
import { cleanFilters, validateEmptyField } from '../utilities/utilities';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

export const SaveButton = ({ disabled = false }) => {
	const [addCampaign, { data, isLoading, isSuccess, isError }] =
		useAddCampaignMutation();
	const navigate = useNavigate();

	const discount = useSelector((state) => state.discount);
	const { discount_intent } = discount;
	const handleSave = () => {
		if (validateEmptyField(discount) === false) {
			return;
		}

		const dataForRequest = {
			...discount,
			conditions: cleanFilters(discount.conditions),
		};
		addCampaign(dataForRequest);
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success(__('New Campaign Added.', 'disco'));
			navigate(`?edit=${data.id}`, {
				state: { ...data },
			});
		}
		if (isError) {
			toast.success(__('Something Went Wrong.', 'disco'));
		}
	}, [data]);

	return (
		<Button
			className="!disco-py-2 !disco-px-4 !disco-font-normal disabled:disco-opacity-50 disabled:!disco-cursor-not-allowed"
			disabled={isLoading || !discount_intent || disabled}
			onClick={handleSave}
			type="transparent"
			iconPositionLeft={false}
			icon={
				<CheckCircleIcon className="disco-h-5 disco-w-5 !disco-text-primary" />
			}
		>
			{isLoading ? (
				<div className="disco-flex disco-gap-2 disco-items-center">
					<span>{__('Saving', 'disco')}</span>
					<LoadingSpinner size={4} />
				</div>
			) : (
				__('Save', 'disco')
			)}
		</Button>
	);
};

export const UpdateButton = ({ disabled = false }) => {
	const dispatch = useDispatch();
	const [updateCampaign, { isLoading, isSuccess, isError }] =
		useUpdateCampaignMutation();
	const discount = useSelector((state) => state.discount);

	const handleUpdate = () => {
		if (validateEmptyField(discount) === false) {
			return;
		}

		const dataForRequest = { ...discount };

		delete dataForRequest.created_by;
		delete dataForRequest.modified_by;

		dataForRequest.conditions = cleanFilters(discount.conditions);

		updateCampaign({
			id: discount.id,
			data: {
				...dataForRequest,
				priority: String(dataForRequest.priority),
			},
		});
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success(__('Campaign Updated.', 'disco'));
		}
		if (isError) {
			toast.success(__('Something Went Wrong.', 'disco'));
		}
	}, [isSuccess]);

	const handleToggleStatus = (status, id) => {
		dispatch(
			updateOption({
				option: 'status',
				value: status === '1' ? '0' : '1',
			})
		);
		updateCampaign({ id, data: { status: status === '1' ? '0' : '1' } });
	};

	return (
		<>
			<div className="disco-flex disco-gap-2 disco-justify-center disco-items-center">
				<h2 className="disco-text-base disco-font-semibold">
					{discount.status === '1'
						? __('Enabled', 'disco')
						: __('Disabled', 'disco')}
				</h2>
				<Switch
					disabled={isLoading || disabled}
					onChange={() =>
						handleToggleStatus(discount.status, discount.id)
					}
					checked={discount.status === '1' ? true : false}
					className={`${
						discount.status === '1'
							? 'disco-bg-primary'
							: 'disco-bg-gray-200'
					}
											disco-relative disco-inline-flex disco-h-5 disco-w-9 disco-flex-shrink-0 disco-cursor-pointer disco-rounded-full disco-border-2 disco-border-transparent disco-transition-colors disco-duration-200 disco-ease-in-out focus:disco-outline-none
										`}
				>
					<span
						aria-hidden="true"
						className={` ${
							discount.status === '1'
								? 'disco-translate-x-4'
								: 'disco-translate-x-0'
						} disco-pointer-events-none disco-inline-block disco-h-4 disco-w-4 disco-transform disco-rounded-full disco-bg-white disco-shadow disco-ring-0 disco-transition disco-duration-200 disco-ease-in-out
											`}
					/>
				</Switch>
			</div>

			<Button
				className="!disco-py-1.5 !disco-px-4 !disco-font-normal"
				disabled={isLoading || disabled}
				onClick={handleUpdate}
			>
				{isLoading ? (
					<div className="disco-flex disco-gap-2 disco-items-center">
						<span> {__('Updating', 'disco')}</span>
						<LoadingSpinner size={4} />
					</div>
				) : (
					__('Update', 'disco')
				)}
			</Button>
		</>
	);
};
