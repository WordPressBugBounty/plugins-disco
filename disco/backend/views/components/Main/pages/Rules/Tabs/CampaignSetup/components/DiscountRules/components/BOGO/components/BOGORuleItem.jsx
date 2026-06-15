import { TrashIcon } from '@heroicons/react/24/outline';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncMultiSelect from '../../../../../../../../../components/AsyncMultiSelect';
import AlertPopup from '../../../../../../../../../components/AlertPopup';
import CheckBox from '../../../../../../../../../components/CheckBox';
import Input from '../../../../../../../../../components/Input';
import LoadingSpinner from '../../../../../../../../../components/LoadingSpinner';
import SingleSelect from '../../../../../../../../../components/SingleSelect';
import { useGetDiscountTypesQuery } from '../../../../../../../../../features/discount/discountApi';
import {
	deleteDiscountRule,
	keepOnlyRecursiveRule,
	updateDiscountRule,
} from '../../../../../../../../../features/discount/discountSlice';
import { useGetSearchItemQuery } from '../../../../../../../../../features/search/searchApi';

const BOGORuleItem = ({ rule, index }) => {
	const { data: types, isLoading } = useGetDiscountTypesQuery();
	const { bogo_type, discount_rules } = useSelector(
		(state) => state.discount
	);
	const dispatch = useDispatch();
	const [showRecursiveModal, setShowRecursiveModal] = useState(false);

	const handleChange = (e) => {
		dispatch(
			updateDiscountRule({
				...rule,
				[e.target.name]: e.target.value,
			})
		);
	};

	const handleProductMultiSelect = (selected) => {
		dispatch(
			updateDiscountRule({
				...rule,
				get_ids: selected,
			})
		);
	};

	const handleRecursiveChange = () => {
		// Disabling recursive: just toggle off.
		if (rule.recursive === 'yes') {
			dispatch(updateDiscountRule({ ...rule, recursive: 'no' }));
			return;
		}

		// Enabling recursive while other rules exist: confirm before dropping them.
		if (discount_rules.length > 1) {
			setShowRecursiveModal(true);
			return;
		}

		// Single rule: enable recursive directly.
		dispatch(updateDiscountRule({ ...rule, recursive: 'yes' }));
	};

	const handleRecursiveConfirm = () => {
		dispatch(keepOnlyRecursiveRule(rule.id));
	};

	const handleTypeChange = (active) => {
		dispatch(
			updateDiscountRule({
				...rule,
				discount_type: active,
			})
		);
	};

	const handleRuleDelete = (id) => {
		dispatch(deleteDiscountRule(id));
	};

	if (isLoading) {
		return (
			<div>
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="disco-grid disco-grid-cols-12 disco-gap-4 !disco-mt-0">
			<div className="disco-col-span-3 disco-bg-gray-100 disco-border disco-p-3 disco-pt-2 disco-rounded-b-lg disco-border-white !disco-border-t-0 disco-flex disco-gap-4">
				<div className="disco-grow flex-shrink-0">
					<label
						className="disco-text-base disco-block disco-text-black disco-mb-2"
						htmlFor="minimum-quantity"
					>
						{rule.recursive === 'yes'
							? __('Item Quantity', 'disco')
							: __('Min Quantity', 'disco')}
					</label>
					<Input
						value={rule.min}
						onChange={handleChange}
						name="min"
						className="disco-w-full"
						placeholder={
							rule.recursive === 'yes'
								? __('Item Quantity', 'disco')
								: __('Minimum', 'disco')
						}
						type="number"
					/>
				</div>

				{rule.recursive === 'no' && (
					<div className="disco-grow flex-shrink-0">
						<label
							className="disco-text-base disco-block disco-text-black disco-mb-2"
							htmlFor="maximum-quantity"
						>
							{__('Max Quantity', 'disco')}
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
			</div>

			<div className="disco-col-span-9 disco-border disco-p-3 disco-pt-2 disco-bg-gray-100 disco-rounded-b-lg disco-border-white disco-border-t-0 disco-flex disco-gap-4">
				{bogo_type === 'products' && (
					<div className="disco-grow flex-shrink-0">
						<label
							className="disco-text-base disco-block disco-text-black disco-mb-2"
							htmlFor="discount-value"
						>
							{__('Select Products', 'disco')}
						</label>
						<AsyncMultiSelect
							widthClass="disco-w-48 disco-bg-white disco-rounded-lg"
							placeHolder={__('Search Product', 'disco')}
							endpoint="/search/product/?search="
							selected={rule.get_ids}
							queryHook={useGetSearchItemQuery}
							onChange={handleProductMultiSelect}
						/>
					</div>
				)}

				{bogo_type === 'categories' && (
					<div className="disco-grow flex-shrink-0">
						<label
							className="disco-text-base disco-block disco-text-black disco-mb-2"
							htmlFor="discount-value"
						>
							{__('Select Categories', 'disco')}
						</label>
						<AsyncMultiSelect
							widthClass="disco-w-48 disco-bg-white disco-rounded-lg"
							placeHolder={__('Search Category', 'disco')}
							endpoint="/search/category/?search="
							selected={rule.get_ids}
							queryHook={useGetSearchItemQuery}
							onChange={handleProductMultiSelect}
						/>
					</div>
				)}

				<div className="disco-grow flex-shrink-0">
					<label
						className="disco-text-base disco-block disco-text-black disco-mb-2"
						htmlFor="discount-value"
					>
						{__('Get Quantity', 'disco')}
					</label>
					<Input
						value={rule.get_quantity}
						onChange={handleChange}
						name="get_quantity"
						className="disco-w-full"
						placeholder={__('Get Quantity', 'disco')}
						type="number"
					/>
				</div>
				<div className="disco-min-w-[200px] disco-grow flex-shrink-0 disco-rounded-lg">
					<label
						className="disco-text-base disco-block disco-text-black disco-mb-2"
						htmlFor="discount-type"
					>
						{__('Discount Type', 'disco')}
					</label>

					<SingleSelect
						className="disco-min-w-[200px] disco-w-full disco-bg-white disco-rounded-lg"
						items={types.values}
						// items={Object.fromEntries(
						// 	Object.entries(types.values).filter(([key]) => key === 'free')
						// )}
						selected={rule.discount_type}
						onchange={handleTypeChange}
						placeholder={__('Select Discount Type', 'disco')}
					/>
				</div>

				{rule.discount_type !== 'free' && (
					<div className="disco-grow flex-shrink-0">
						<label
							className="disco-text-base disco-block disco-text-black disco-mb-2"
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
				<div className=" disco-grow flex-shrink-0">
					<label
						className="disco-opacity-0 disco-text-sm disco-block disco-text-gray-500 disco-mb-1"
						htmlFor="bulk-title"
					>
						{__('Placeholder', 'disco')}
					</label>
					<div className="disco-flex disco-items-center disco-mt-4 disco-gap-4">
						<CheckBox
							checked={rule.recursive === 'yes' ? true : false}
							onChange={handleRecursiveChange}
							label={__('Recursive', 'disco')}
							testid={`recursive-checkbox-${index}`}
						/>
						<AlertPopup
							open={showRecursiveModal}
							setOpen={setShowRecursiveModal}
							onRemove={handleRecursiveConfirm}
							removeBtnTestId={`recursive-confirm-${index}`}
							title={__('Switch to Recursive', 'disco')}
							description={__(
								'Recursive applies a single repeating rule based on the combined quantity. All other rules will be removed. Do you want to continue?',
								'disco'
							)}
							confirmLabel={__('Continue', 'disco')}
						/>
						{index !== 0 ? (
							<button
								onClick={() => handleRuleDelete(rule.id)}
								className=" disco-rounded-full disco-shrink-0 disco-items-center"
							>
								<TrashIcon className="disco-h-4 disco-w-4 disco-text-red-500 disco-transition-colors" />
							</button>
						) : (
							<div className="disco-shrink-0 disco-w-4"></div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
export default BOGORuleItem;
