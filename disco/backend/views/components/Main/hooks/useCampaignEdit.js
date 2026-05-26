import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router';
import { useGetCampaignQuery } from '../features/campaigns/campaignsApi';
import {
	useGetBOGOTypesQuery,
	useGetDiscountBasedOnQuery,
	useGetDiscountIntentsQuery,
	useGetDiscountMethodsQuery,
	useGetDiscountTypesQuery,
	useGetFiltersQuery,
	useGetWhatGetsDiscountQuery,
} from '../features/discount/discountApi';
import { editCampaign } from '../features/discount/discountSlice';

const useEditCampaign = () => {
	const [searchParams] = useSearchParams();
	const [id, setId] = useState('');
	const [skip, setSkip] = useState(true);
	const { data: campaign, isLoading } = useGetCampaignQuery(id, { skip });
	const [uiLoading, setUiLoading] = useState(true);
	const dispatch = useDispatch();
	const { isError, error } = useGetDiscountIntentsQuery();
	const hasCampaignLoaded = useRef(false);

	// Trigger these queries to ensure data is loaded, if necessary
	useGetFiltersQuery();
	useGetWhatGetsDiscountQuery();
	useGetDiscountMethodsQuery();
	useGetDiscountTypesQuery();
	useGetDiscountBasedOnQuery();
	useGetBOGOTypesQuery();

	const { state } = useLocation();

	useEffect(() => {
		if (searchParams.get('edit') && skip) {
			if (state) {
				dispatch(editCampaign(state));
				hasCampaignLoaded.current = true;
			} else {
				setUiLoading(true);
				const id = searchParams.get('edit');
				setId(id);
				setSkip(false);
			}
		}
	}, [searchParams, skip, state, dispatch]);

	useEffect(() => {
		if (
			isError &&
			error.status === 403 &&
			error.data.code === 'rest_cookie_invalid_nonce'
		) {
			window.location.replace(DISCO.site_url + '/wp-login.php');
		}
	}, [isError, error]);

	// Only dispatch editCampaign on initial load, not on refetches
	useEffect(() => {
		if (campaign && !hasCampaignLoaded.current) {
			dispatch(editCampaign(campaign));
			hasCampaignLoaded.current = true;
		}
		setUiLoading(false);
	}, [campaign, dispatch]);

	return {
		isLoading: isLoading || uiLoading,
	};
};

export default useEditCampaign;
