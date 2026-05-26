import LoadingSpinner from '../../components/LoadingSpinner';
import useCampaignEdit from '../../hooks/useCampaignEdit';
import MainTabs from './Tabs/MainTabs';

const RulesPage = () => {
	const { isLoading } = useCampaignEdit();

	if (isLoading) {
		return (
			<div className="disco-h-96 disco-w-full disco-flex disco-justify-center disco-items-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="disco-mt-2.5 disco-mr-5 disco-ml-0.5 disco-flex disco-gap-4">
			<div className="disco-flex-grow disco-border disco-border-gray-200 disco-bg-gray-100 disco-rounded-lg">
				<MainTabs />
			</div>
		</div>
	);
};
export default RulesPage;
