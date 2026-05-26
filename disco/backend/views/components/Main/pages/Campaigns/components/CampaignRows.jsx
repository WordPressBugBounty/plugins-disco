import CampaignRow from './CampaignRow/CampaignRow';

const CampaignRows = ({ campaigns, discountIntents }) => {
	return (
		<tbody>
			{campaigns.map((campaign, index) => (
				<CampaignRow
					key={campaign.id}
					last={
						campaigns.length > 0
							? campaigns.length === index + 1
							: false
					}
					discountIntents={discountIntents}
					campaign={campaign}
				/>
			))}
		</tbody>
	);
};
export default CampaignRows;
