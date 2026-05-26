import { __ } from '@wordpress/i18n';
import { useSelector } from 'react-redux';

const CampaignNameSummary = () => {
	const { name, discount_intent } = useSelector((state) => state.discount);

	return (
		<div className="disco-flex disco-gap-36">
			<div>
				<p className="disco-text-base disco-font-extralight">
					{__('Campaign Name', 'disco')}
				</p>
				<div className="disco-text-xl disco-text-primary">{name}</div>
			</div>
			<div>
				<p className="disco-text-base disco-font-extralight">
					{__('Discount Intent', 'disco')}
				</p>
				<div className="disco-text-xl">{discount_intent}</div>
			</div>
		</div>
	);
};

export default CampaignNameSummary;
