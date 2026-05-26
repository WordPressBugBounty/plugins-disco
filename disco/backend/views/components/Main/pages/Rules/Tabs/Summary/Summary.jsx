import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ComponentBox from '../../../../components/ComponentBox';
import FooterButtons from '../../../../components/FooterButtons';
import { setTab } from '../../../../features/discount/discountSlice';
import CampaignNameSummary from './components/CampaignNameSummary';
import CampaignSetupSummary from './components/CampaignSetupSummary';
import DesignBlockSummery from './components/DesignBlockSummery';

const Summary = () => {
	const dispatch = useDispatch();
	const handleBack = () => {
		dispatch(setTab(1));
	};

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, []);

	return (
		<>
			<ComponentBox className="disco-mx-3 disco-my-3 disco-p-4 disco-bg-white disco-rounded-xl">
				<CampaignNameSummary />
				<CampaignSetupSummary className="disco-mt-6" />
				<DesignBlockSummery className="disco-mt-4" />
			</ComponentBox>
			<FooterButtons next={false} handleBack={handleBack} />
		</>
	);
};
export default Summary;
