import { PlusIcon } from '@heroicons/react/16/solid';
import { __ } from '@wordpress/i18n';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { reset } from '../../../features/discount/discountSlice';

const EmptyCampaigns = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleCreateCampaign = () => {
		navigate('disco');
		dispatch(reset());
	};

	return (
		<div
			data-testid="empty-campaigns"
			className="disco:flex disco:flex-col disco:items-center disco:pt-20 disco:pb-24 disco:px-4"
		>
			<div className="disco:flex disco:flex-col disco:items-center disco:gap-4 disco:text-center">
				<h3 className="disco:text-[28px]! disco:leading-10! disco:font-extrabold disco:text-[#111111] disco:m-0!">
					{__(
						'No campaigns yet — your first one takes 2 minutes',
						'disco'
					)}
				</h3>
				<p className="disco:text-lg! disco:leading-6.25! disco:font-medium disco:text-[#597A67] disco:max-w-160 disco:m-0">
					{__(
						'Stores using automated discounts see up to 34% higher average order value. Start in 2 minutes',
						'disco'
					)}
				</p>
				<button
					data-testid="create-first-campaign-btn"
					onClick={handleCreateCampaign}
					className="disco:flex disco:items-center disco:gap-1.5 disco:h-10.75 disco:px-5 disco:rounded-xl disco:bg-[#0BC88A] disco:hover:bg-[#0AB57D] disco:text-white disco:text-[17px] disco:font-semibold disco:shadow-[0px_3px_6px_0px_rgba(22,163,74,0.25)] disco:transition-colors disco:duration-200"
				>
					<PlusIcon className="disco:h-4 disco:w-4" />
					{__('Create Your First Campaign', 'disco')}
				</button>
			</div>
		</div>
	);
};

export default EmptyCampaigns;
