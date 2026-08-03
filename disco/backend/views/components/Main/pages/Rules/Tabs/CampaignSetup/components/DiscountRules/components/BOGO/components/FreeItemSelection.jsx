import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import SingleSelect from '../../../../../../../../../components/SingleSelect';
import { updateOption } from '../../../../../../../../../features/discount/discountSlice';

const FREE_ITEM_SELECTION_OPTIONS = {
	cart_order: __('Cart order (default)', 'disco'),
	lowest: __('Lowest priced item', 'disco'),
	highest: __('Highest priced item', 'disco'),
};

const EXAMPLES = {
	cart_order: (
		<>
			{__(
				'The item is granted to whichever qualifying product was added to the cart first. Example: Gloves at',
				'disco'
			)}{' '}
			<strong>$12</strong>, <strong>$18</strong>, <strong>$25</strong>{' '}
			{__('were added in that order — the', 'disco')} <strong>$12</strong>{' '}
			{__('pair (added first) is granted, regardless of price.', 'disco')}
		</>
	),
	lowest: (
		<>
			{__('Cart has Gloves at', 'disco')} <strong>$12</strong>,{' '}
			<strong>$18</strong>, <strong>$25</strong>. {__('The', 'disco')}{' '}
			<strong>$12</strong>{' '}
			{__(
				'pair is auto-selected as the free / discounted item, protecting margin.',
				'disco'
			)}
		</>
	),
	highest: (
		<>
			{__('Cart has Gloves at', 'disco')} <strong>$12</strong>,{' '}
			<strong>$18</strong>, <strong>$25</strong>. {__('The', 'disco')}{' '}
			<strong>$25</strong>{' '}
			{__(
				'pair is auto-selected — useful for maximizing perceived reward value in a promotion.',
				'disco'
			)}
		</>
	),
};

const FreeItemSelection = () => {
	const dispatch = useDispatch();
	const { free_item_selection } = useSelector((state) => state.discount);

	const handleChange = (active) => {
		dispatch(
			updateOption({ option: 'free_item_selection', value: active })
		);
	};

	const exampleBody = EXAMPLES[free_item_selection] ?? EXAMPLES.cart_order;
	const exampleTitle = FREE_ITEM_SELECTION_OPTIONS[free_item_selection] ?? '';

	return (
		<div className="disco-border disco-border-primary disco-rounded-lg disco-p-4 disco-mb-6">
			<label className="disco-block disco-text-base disco-font-medium disco-text-black disco-mb-1.5">
				{__('Free Item Selection', 'disco')}
			</label>

			<SingleSelect
				items={FREE_ITEM_SELECTION_OPTIONS}
				selected={free_item_selection}
				onchange={handleChange}
				placeholder={__('Select', 'disco')}
				className="disco-max-w-max disco-min-w-80 disco-mb-3 !disco-bg-white"
			/>

			<div className="disco-bg-white disco-border disco-border-primary disco-rounded-md disco-py-2.5 disco-px-3.5">
				<p className="disco-text-sm disco-font-bold disco-text-primary-dark disco-mb-1">
					{exampleTitle}
				</p>
				<p className="disco-text-sm disco-text-gray-600 disco-leading-relaxed disco-mb-0">
					{exampleBody}
				</p>
			</div>
		</div>
	);
};

export default FreeItemSelection;
