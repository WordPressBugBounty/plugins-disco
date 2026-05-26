import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import FooterButtons from '../../../../components/FooterButtons';
import {
	useAddCampaignMutation,
	useUpdateCampaignMutation,
} from '../../../../features/campaigns/campaignsApi';
import { setTab } from '../../../../features/discount/discountSlice';
import {
	cleanFilters,
	validateEmptyField,
} from '../../../../utilities/utilities';
import CampaignName from './components/CampaignName/CampaignName';
import ConditionsCard from './components/ConditionsCard/ConditionsCard';
import DiscountCard from './components/DiscountCard/DiscountCard';
import DiscountIntention from './components/DiscountIntention/DiscountIntention';
import DiscountRules from './components/DiscountRules/DiscountRules';

const CampaignSetup = () => {
	const dispatch = useDispatch();
	const [addCampaign, { data, isSuccess, isError, isLoading: adding }] =
		useAddCampaignMutation();
	const [updateCampaign, { isLoading: updating }] =
		useUpdateCampaignMutation();

	const discount = useSelector((state) => state.discount);
	const { discount_intent } = discount;
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const handleNextPage = () => {
		if (validateEmptyField(discount) === false) {
			return;
		}

		if (searchParams.get('edit')) {
			const dataForRequest = { ...discount };

			delete dataForRequest.created_by;
			delete dataForRequest.modified_by;

			dataForRequest.conditions = cleanFilters(discount.conditions);

			updateCampaign({
				id: discount.id,
				data: {
					...dataForRequest,
					priority: String(dataForRequest.priority),
					ui: [1, 0],
				},
			});

			dispatch(setTab(1));
		} else {
			const dataForRequest = {
				...discount,
				status: '0',
				conditions: cleanFilters(discount.conditions),
			};
			addCampaign(dataForRequest);
		}
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success(__('New Campaign Added.', 'disco'));
			navigate(`?edit=${data.id}`, {
				state: { ...data, ui: [1, 0] },
			});
		}
		if (isError) {
			toast.success(__('Something Went Wrong.', 'disco'));
		}
	}, [data]);

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, []);

	return (
		<div className="disco-max-h-[calc(100vh-122px)] disco-overflow-y-auto disco-overscroll-container disco-no-scrollbar">
			<CampaignName />
			<DiscountIntention />
			{discount_intent && (
				<>
					<DiscountCard />
					<DiscountRules />
					<ConditionsCard />
				</>
			)}
			<FooterButtons
				cancel
				handleContinue={handleNextPage}
				disabled={!discount_intent}
				loading={adding || updating}
			/>
		</div>
	);
};
export default CampaignSetup;
