import { allConditions, filters } from './../data/data';

const useConditions = (filter) => {
	const conditionsIds = filters.find(
		(_filter) => _filter.filter_name === filter.filter_name
	)?.conditions;

	return allConditions.filter((condition) =>
		conditionsIds.includes(condition.id)
	);
};

export default useConditions;
