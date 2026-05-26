import { TrashIcon } from '@heroicons/react/24/outline';

import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../../../components/Button';
import LoadingSpinner from '../../../../../../../components/LoadingSpinner';
import { useGetFiltersQuery } from '../../../../../../../features/discount/discountApi';
import {
	addCondition,
	deleteCondition,
	deleteConditionGroup,
	updateConditionGroup,
	updateConditionValues,
} from '../../../../../../../features/discount/discountSlice';

import { __ } from '@wordpress/i18n';
import Condition from './Condition';
import SelectFilterDropdown from './FilterDropdown';
import OperatorRadio from './OperatorRadio';

const Conditions = () => {
	const { conditions: conditionsGroup } = useSelector(
		(state) => state.discount
	);
	const dispatch = useDispatch();

	const { data: allFilters, isLoading } = useGetFiltersQuery();

	const handleAddCondition = (conditionGroup) => {
		dispatch(addCondition(conditionGroup.id));
	};

	const handleChangeGroupOperator = (operator, conditionGroup) => {
		dispatch(
			updateConditionGroup({
				operator,
				id: conditionGroup.id,
			})
		);
	};

	const handleOperatorChange = (operator, filter, group) => {
		dispatch(
			updateConditionValues({
				values: { ...filter, operator },
				group_id: group.id,
			})
		);
	};

	const handleConditionGroupDelete = (conditionsGroup) => {
		dispatch(deleteConditionGroup(conditionsGroup.id));
	};

	const handleConditionDelete = (filter, conditionGroup) => {
		dispatch(
			deleteCondition({
				condition_id: filter.id,
				group_id: conditionGroup.id,
			})
		);
	};

	useEffect(() => {
		window.scroll({
			top: window.document.body.scrollHeight,
		});
	}, [conditionsGroup.length]);

	if (isLoading) {
		return (
			<div className="disco-px-5 disco-border-t disco-mt-5 disco-pt-5">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="disco-px-4">
			{conditionsGroup.map((conditionGroup, index) => {
				return (
					<div
						key={conditionGroup.id}
						className="disco-relative disco-border disco-rounded-lg disco-bg-white first:disco-mt-5 disco-mt-12 disco-pt-2 disco-pb-5"
					>
						<button
							onClick={() =>
								handleConditionGroupDelete(conditionGroup)
							}
							className="disco-absolute -disco-bottom-2 -disco-right-2 disco-transition-colors disco-text-white disco-rounded-full disco-flex disco-justify-center disco-items-center disco-h-5 disco-w-5"
						>
							<div className="disco-inline-flex disco-border disco-p-0.5 disco-border-red-500 disco-rounded-full">
								<XMarkIcon className="disco-h-4 disco-w-4 !disco-bg-red-500 disco-rounded-full" />
							</div>
						</button>
						<div className="disco-flex disco-justify-center">
							{index !== 0 && (
								<div className="disco-relative -disco-mt-11">
									<OperatorRadio
										fontSize="disco-text-[11px]"
										value={conditionGroup.base_operator}
										onChange={(operator) =>
											handleChangeGroupOperator(
												operator,
												conditionGroup
											)
										}
									/>
								</div>
							)}
						</div>
						{conditionGroup.base_filters.map((filter, index) => (
							<div key={filter.id}>
								{index !== 0 && (
									<div className="disco-mt-3 disco-px-5">
										<OperatorRadio
											fontSize="disco-text-[11px]"
											value={filter.operator}
											onChange={(operator) =>
												handleOperatorChange(
													operator,
													filter,
													conditionGroup
												)
											}
										/>
									</div>
								)}

								<div className="disco-flex  disco-gap-4 disco-mt-3 disco-px-5">
									<div className="">
										<SelectFilterDropdown
											allFilters={
												allFilters?.values ?? []
											}
											conditionGroup={conditionGroup}
											condition={filter}
										/>
									</div>
									<div className="disco-w-full disco-flex disco-gap-4 disco-justify-between disco-items-center">
										<Condition
											condition={filter}
											conditionGroup={conditionGroup}
											allFilters={allFilters.values}
										/>

										<button
											onClick={() =>
												handleConditionDelete(
													filter,
													conditionGroup
												)
											}
											className="disco-flex-shrink-0"
										>
											<TrashIcon className="disco-h-5 disco-w-5 disco-text-red-500 disco-transition-colors" />
										</button>
									</div>
								</div>
							</div>
						))}
						<div className="disco-px-5 disco-mt-3">
							<Button
								testId="add-another-condition"
								onClick={() =>
									handleAddCondition(conditionGroup)
								}
								type={'transparent'}
								className="!disco-px-2 !disco-py-1.5 !disco-text-sm !disco-font-regular"
							>
								<PlusCircleIcon className="disco-h-5 disco-w-5 disco-text-primary" />
								{__('Add Another Condition', 'disco')}
							</Button>
						</div>
					</div>
				);
			})}
		</div>
	);
};
export default Conditions;
