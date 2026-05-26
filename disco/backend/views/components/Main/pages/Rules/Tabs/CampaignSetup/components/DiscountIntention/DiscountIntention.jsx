import { __ } from '@wordpress/i18n';
import ComponentBox from '../../../../../../components/ComponentBox';
import CampaignTypes from './components/IntentionTypes';
import CommonHeadingBox from "../../../../../../components/CommonHeadingBox";

const DiscountIntention = () => {
	return (
		<div className="disco-mx-5">
			<ComponentBox className="disco-mt-5 disco-rounded-xl disco-overflow-hidden">
				<CommonHeadingBox
					title={__('Discount Intent', 'disco')}
					url='https://discoplugin.com/docs/discount-intent/'
				/>
				<div className="disco-mt-2 ">
					<CampaignTypes/>
				</div>
			</ComponentBox>
		</div>
	);
};
export default DiscountIntention;
