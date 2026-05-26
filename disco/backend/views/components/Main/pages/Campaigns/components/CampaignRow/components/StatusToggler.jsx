import { Switch } from '@headlessui/react';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import { usePatchCampaignMutation } from '../../../../../features/campaigns/campaignsApi';

const StatusToggler = ({ campaign }) => {
	const [patchDiscount, { isSuccess, isLoading, data }] =
		usePatchCampaignMutation();

	const handleToggleStatus = (status, id) => {
		patchDiscount({ id, data: { status: status ? '1' : '0' } });
	};

	useEffect(() => {
		if (isSuccess) {
			if (data.status === '1') {
				toast.success(__('Campaign Enabled.', 'disco'));
			}
			if (data.status === '0') {
				toast.warn(__('Campaign Disabled.', 'disco'));
			}
		}
	}, [isSuccess]);

	return (
		<div className="disco-flex disco-items-center disco-gap-1.5">
			<Switch
				disabled={isLoading}
				onChange={(status) => handleToggleStatus(status, campaign.id)}
				checked={campaign.status === '1' ? true : false}
				className={`${
					campaign.status === '1'
						? 'disco-bg-primary'
						: 'disco-bg-gray-200'
				}
											disco-relative disco-inline-flex disco-h-5 disco-w-9 disco-flex-shrink-0 disco-cursor-pointer disco-rounded-full disco-border-2 disco-border-transparent disco-transition-colors disco-duration-200 disco-ease-in-out focus:disco-outline-none
										`}
			>
				<span
					aria-hidden="true"
					className={` ${
						campaign.status === '1'
							? 'disco-translate-x-4'
							: 'disco-translate-x-0'
					} disco-pointer-events-none disco-inline-block disco-h-4 disco-w-4 disco-transform disco-rounded-full disco-bg-white disco-shadow disco-ring-0 disco-transition disco-duration-200 disco-ease-in-out
											`}
				/>
			</Switch>
			{isLoading ? (
				<LoadingSpinner size={5} />
			) : (
				<div className="disco-w-7"></div>
			)}
		</div>
	);
};
export default StatusToggler;
