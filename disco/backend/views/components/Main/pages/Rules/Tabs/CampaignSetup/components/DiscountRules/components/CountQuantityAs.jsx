import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import SingleSelect from '../../../../../../../components/SingleSelect';
import { updateOption } from '../../../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../../../hooks/useIsPro';

const COUNT_QUANTITY_AS_OPTIONS = {
	separate: __('Each product separately', 'disco'),
	variations: __('Same product, all variations', 'disco'),
	combined: __('All products in this discount', 'disco'),
};

// Only per-product counting is free; pooling across variations or across the
// whole discount is pro.
const PRO_OPTIONS = ['variations', 'combined'];

const EXAMPLES = {
	separate: (
		<>
			{__('Needs 5 units. 3 of ', 'disco')}
			<b>{__('Product A', 'disco')}</b>
			{__(' + 2 of ', 'disco')}
			<b>{__('Product B', 'disco')}</b>
			{__(
				"= 5 total, but doesn't count — they're different products, so neither reaches 5 on its own.",
				'disco'
			)}
		</>
	),
	variations: (
		<>
			{__('Needs 5 units. 3 of ', 'disco')}
			<b>{__('Product A (Small)', 'disco')}</b>
			{__(' + 2 of ', 'disco')}
			<b>{__('Product A (Large)', 'disco')}</b>
			{__(
				'= 5 total — counts, because both are the same product.',
				'disco'
			)}
		</>
	),
	combined: (
		<>
			{__('Needs 5 units. 3 of ', 'disco')}
			<b>{__('Product A', 'disco')}</b>
			{__(' + 2 of ', 'disco')}
			<b>{__('Product B', 'disco')}</b>
			{__(
				"= 5 total — counts, because both products are included in this discount. That's a category or list you picked above, or your whole store if you didn't limit it to anything.",
				'disco'
			)}
		</>
	),
};

const CountQuantityAs = () => {
	const dispatch = useDispatch();
	const isPro = useIsPro();
	const { count_quantity_as } = useSelector((state) => state.discount);

	const lockedOptions = isPro ? [] : PRO_OPTIONS;

	const handleChange = (active) => {
		if (lockedOptions.includes(active)) {
			return;
		}

		dispatch(updateOption({ option: 'count_quantity_as', value: active }));
	};

	const exampleBody = EXAMPLES[count_quantity_as] ?? EXAMPLES.separate;
	const exampleTitle = COUNT_QUANTITY_AS_OPTIONS[count_quantity_as] ?? '';

	return (
		<div className="disco-border-2 disco-border-primary disco-rounded-lg disco-p-4 disco-mb-5">
			<div className="disco-flex disco-items-center disco-gap-2 disco-mb-1.5">
				<label className="disco-text-base disco-font-medium disco-text-primary-dark disco-mb-0">
					{__('Count Quantity As', 'disco')}
				</label>
			</div>
			<p className="disco-text-xs disco-text-gray-500 disco-leading-snug disco-mb-3 disco-max-w-xl">
				{__(
					'Decides how items add up toward the quantity required below.',
					'disco'
				)}
			</p>

			<SingleSelect
				items={COUNT_QUANTITY_AS_OPTIONS}
				proItems={lockedOptions}
				selected={count_quantity_as}
				onchange={handleChange}
				placeholder={__('Select', 'disco')}
				className="disco-max-w-xs"
				buttonClass="!disco-border-primary !disco-bg-white"
			/>

			<div className="disco-bg-white disco-border disco-border-primary disco-rounded-md disco-mt-3 disco-py-2.5 disco-px-3.5">
				<p className="disco-text-[13px] disco-font-bold disco-text-primary-dark disco-mb-1">
					{exampleTitle}
				</p>
				<p className="disco-text-[13px] disco-text-gray-700 disco-leading-normal disco-mb-0">
					{exampleBody}
				</p>
			</div>
		</div>
	);
};

export default CountQuantityAs;
