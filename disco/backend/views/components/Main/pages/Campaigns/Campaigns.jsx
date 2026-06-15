import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProCard from '../../components/ProCard';
import { setCampaignsInState } from '../../features/campaigns/campaignSlice';
import { useGetCampaignsQuery } from '../../features/campaigns/campaignsApi';
import {
	useGetBOGOTypesQuery,
	useGetDiscountBasedOnQuery,
	useGetDiscountTypesQuery,
	useGetFiltersQuery,
	useGetWhatGetsDiscountQuery,
} from '../../features/discount/discountApi';
import { useGetSettingsQuery } from '../../features/settings/settingsApi';
import useIsPro from '../../hooks/useIsPro';
import ActionsBar from './components/ActionsBar';
import CampaignsList from './components/CampaignsList';
import EmptyCampaigns from './components/EmptyCampaigns';
import Header from './components/Header';

const Campaigns = () => {
	const isPro = useIsPro();
	/*
	 * for caching api data
	 * don't remove this hooks
	 */
	const {} = useGetFiltersQuery();
	const {} = useGetWhatGetsDiscountQuery();
	const {} = useGetDiscountTypesQuery();
	const {} = useGetSettingsQuery();
	const {} = useGetDiscountBasedOnQuery();
	const {} = useGetBOGOTypesQuery();

	const dispatch = useDispatch();

	const {
		data: allCampaigns,
		isLoading,
		isError,
		error,
	} = useGetCampaignsQuery();

	useEffect(() => {
		if (isError) {
			if (
				error.status === 403 &&
				error.data.code === 'rest_cookie_invalid_nonce'
			) {
				window.location.replace(DISCO.site_url + '/wp-login.php');
			}
		}
	}, [isError]);

	useEffect(() => {
		if (allCampaigns && allCampaigns.length > 0) {
			dispatch(setCampaignsInState(allCampaigns));
		}
	}, [allCampaigns]);

	const hasNoCampaigns =
		!isLoading &&
		!isError &&
		(allCampaigns === undefined || allCampaigns.length === 0);

	return (
		<div className="disco-flex disco-mt-2.5 disco-w-full">
			<div className="disco-bg-gray-50 disco-flex-grow disco-rounded-lg disco-mr-4 disco-ml-0.5">
				<div className="disco-p-5">
					<Header />
					{hasNoCampaigns ? (
						<EmptyCampaigns />
					) : (
						<>
							<ActionsBar allCampaigns={allCampaigns} />
							<CampaignsList
								isLoading={isLoading}
								isError={isError}
								error={error}
							/>
						</>
					)}
				</div>
			</div>
			{!isPro && (
				<div className="disco-min-w-[290px] disco-max-w-[290px] disco-mr-4">
					<ProCard />
				</div>
			)}
		</div>
	);
};
export default Campaigns;
