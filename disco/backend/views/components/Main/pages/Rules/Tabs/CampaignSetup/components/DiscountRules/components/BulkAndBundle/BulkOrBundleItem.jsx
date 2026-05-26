import {useEffect, useState} from "react";
import { TrashIcon } from '@heroicons/react/24/outline';
import { __ } from '@wordpress/i18n';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../../../../../../../components/Input';
import LoadingSpinner from '../../../../../../../../components/LoadingSpinner';
import { useGetDiscountTypesQuery } from '../../../../../../../../features/discount/discountApi';
import {
	deleteDiscountRule,
	updateDiscountRule, updateTable,
} from '../../../../../../../../features/discount/discountSlice';
import SingleSelect from '../../.././../../../../../components/SingleSelect';
import {discountRulesToTableData} from "../../../../../../../../utilities/utilities";
const BulkOrBundleItem = ({ rule, index, discountIntent }) => {
	const { data: types, isLoading } = useGetDiscountTypesQuery();
	const { discount_intent } = useSelector((state) => state.discount);
	const dispatch = useDispatch();

	const [typeValues, setTypeValues] = useState({});
	const { discount_rules } = useSelector((state) => state.discount);
	const rowData = discountRulesToTableData(discount_rules);

	useEffect(() => {
		const {...typesValueCopy} = types?.values || {};
		switch (discount_intent) {
			case 'Bulk':
			case 'Bundle':
				delete typesValueCopy.free
				setTypeValues(typesValueCopy)
				break;
			default:
				setTypeValues(types?.values)
				break;
		}
	}, [discount_intent]);

	const handleChange = (e) => {
		dispatch(
			updateDiscountRule({
				...rule,
				[e.target.name]: e.target.value,
			})
		);

		dispatch( updateTable({
			name: 'data',
			value: rowData,
		}) );
	};
	const handleTypeChange = (active) => {
		dispatch(
			updateDiscountRule({
				...rule,
				discount_type: active,
			})
		);
	};

	const handleRecursiveChange = (e) => {
		dispatch(
			updateDiscountRule({
				...rule,
				[e.target.name]: rule.recursive === 'yes' ? 'no' : 'yes',
			})
		);
	};

	const handleRuleDelete = (id) => {
		dispatch(deleteDiscountRule(id));
	};

	if (isLoading) {
		return (
			<div className="">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="disco-flex disco-items-end disco-gap-4">
			<div className="disco-grow flex-shrink-0">
				<label
					className="disco-block !disco-text-base disco-text-black disco-mb-2"
					htmlFor="minimum-quantity"
				>
					{discountIntent === 'Bulk'
						? __('Minimum Quantity', 'disco')
						: 'Item Quantity'}
				</label>
				<Input
					value={rule.min}
					onChange={handleChange}
					name="min"
					className="disco-w-full"
					placeholder={
						discountIntent === 'Bulk'
							? __('Minimum', 'disco')
							: 'Quantity'
					}
					type="number"
				/>
			</div>
			{discountIntent === 'Bulk' && (
				<div className="disco-grow flex-shrink-0">
					<label
						className="disco-block !disco-text-base disco-text-black disco-mb-2"
						htmlFor="maximum-quantity"
					>
						{__('Maximum Quantity', 'disco')}
					</label>
					<Input
						value={rule.max}
						onChange={handleChange}
						name="max"
						className="disco-w-full"
						placeholder={__('Maximum', 'disco')}
						type="number"
					/>
				</div>
			)}
			<div className="disco-grow flex-shrink-0">
				<label
					className="disco-block !disco-text-base disco-text-black disco-mb-2"
					htmlFor="discount-type"
				>
					{__('Discount Type', 'disco')}
				</label>

				<SingleSelect
					className="disco-min-w-[250px] disco-w-full !disco-bg-white"
					items={typeValues}
					selected={rule.discount_type}
					onchange={handleTypeChange}
					placeholder={__('Select Discount Type','disco')}
				/>
			</div>
			{rule.discount_type !== 'free' && (
				<div className="disco-grow flex-shrink-0">
					<label
						className="disco-block !disco-text-base disco-text-black disco-mb-2"
						htmlFor="discount-value"
					>
						{__('Discount Value', 'disco')}
					</label>
					<Input
						value={rule.discount_value}
						onChange={handleChange}
						name="discount_value"
						className="disco-w-full"
						placeholder={__('Value', 'disco')}
						type="number"
					/>
				</div>
			)}
			<div className="disco-grow flex-shrink-0">
				<label
					className="disco-block !disco-text-base disco-text-black disco-mb-2"
					htmlFor="bulk-title"
				>
					{__('Discount Label', 'disco')}
				</label>

				<Input
					value={rule.discount_label}
					onChange={handleChange}
					name="discount_label"
					className="disco-w-full"
					placeholder={__('Discount Label', 'disco')}
				/>
			</div>
			<div className="">
				<div className="disco-flex disco-items-center disco-gap-4 disco-mb-3">
					{discountIntent === 'Bundle' && (
						<div className="disco-flex disco-items-center -disco-mb-1 disco-gap-1">
							<input
								className="!disco-text-white !disco-border-primary disco-rounded-sm focus:disco-ring-primary focus:disco-ring-offset-2"
								checked={
									rule.recursive === 'yes' ? true : false
								}
								name="recursive"
								onChange={handleRecursiveChange}
								id={rule.id}
								type="checkbox"
							/>
							<label
								className="disco-text-sm disco-select-none disco-block disco-text-black disco-mb-1"
								htmlFor={rule.id}
							>
								{__('Recursive', 'disco')}
							</label>
						</div>
					)}

					{index !== 0 ? (
						<button
							onClick={() => handleRuleDelete(rule.id)}
							className="disco-shrink-0"
						>
							<TrashIcon className="disco-h-4 disco-w-4 disco-text-red-500 disco-transition-colors"/>
						</button>
					) : (
						<div className="disco-shrink-0 disco-w-4"></div>
					)}
				</div>
			</div>
		</div>
	);
};
export default BulkOrBundleItem;
