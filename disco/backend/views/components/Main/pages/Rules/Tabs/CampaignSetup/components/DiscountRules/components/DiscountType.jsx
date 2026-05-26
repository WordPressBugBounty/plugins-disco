import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { __ } from '@wordpress/i18n';
import Input from '../../../../../../../components/Input';
import SingleSelect from '../../../../../../../components/SingleSelect';
import { useGetDiscountTypesQuery } from '../../../../../../../features/discount/discountApi';
import { updateDiscountRule } from '../../../../../../../features/discount/discountSlice';
import CommonHeadingBox from '../../../../../../../components/CommonHeadingBox';
import ComponentBox from '../../../../../../../components/ComponentBox';
import { docUrls } from '../../../../../../../data/docUrls';

const DiscountType = () => {
	const { data: types, isLoading } = useGetDiscountTypesQuery();

	const { discount_rules, discount_intent } = useSelector(
		(state) => state.discount
	);

	const [typeValues, setTypeValues] = useState({});

	useEffect(() => {
		const { ...typesValueCopy } = types?.values || {};
		switch (discount_intent) {
			case 'Product':
				delete typesValueCopy.free;
				delete typesValueCopy.fixed_per_product;
				setTypeValues(typesValueCopy);
				break;
			case 'Cart':
				delete typesValueCopy.free;
				setTypeValues(typesValueCopy);
				break;
			default:
				setTypeValues(types?.values);
				break;
		}
	}, [discount_intent]);

	const { discount_type, discount_value } = discount_rules[0];

	const dispatch = useDispatch();

	const handleTypeChange = (active) => {
		dispatch(
			updateDiscountRule({
				...discount_rules[0],
				discount_type: active,
			})
		);
	};
	const handleChange = (e) => {
		const { name, value } = e.target;

		// Limit "discount_label" to 35 characters
		if (name === 'discount_label' && value.length > 35) {
			return;
		}

		dispatch(
			updateDiscountRule({
				...discount_rules[0],
				[name]: value,
			})
		);
	};

	return (
		<ComponentBox className="disco-mt-5">
			<CommonHeadingBox
				title={__(`${discount_intent} Rules`, 'disco')}
				url={docUrls[discount_intent]}
			/>
			<div className="disco-flex disco-gap-6 disco-p-4">
				<div className="disco-grow disco-max-w-[300px]">
					<label className="disco-block !disco-text-base disco-text-black disco-mb-2">
						{__('Discount Type:', 'disco')}
					</label>
					{isLoading ? (
						<div className="disco-bg-gray-200 disco-h-[42px] disco-rounded-md disco-animate-pulse"></div>
					) : (
						<SingleSelect
							items={typeValues}
							selected={discount_type}
							onchange={handleTypeChange}
							placeholder={__('Select Discount Type', 'disco')}
							className="disco-bg-white"
						/>
					)}
				</div>

				{discount_type !== 'free' && (
					<div>
						<label className="disco-block !disco-text-base disco-text-black disco-mb-2">
							{__('Discount Value:', 'disco')}
						</label>
						<Input
							name="discount_value"
							onChange={handleChange}
							value={discount_value}
							placeholder={__('Value', 'disco')}
							type="number"
							className=""
						/>
					</div>
				)}

				{discount_intent === 'Cart' && (
					<div className="disco-relative">
						<label className="disco-block !disco-text-base disco-text-black disco-mb-2">
							{__('Discount Label:', 'disco')}
						</label>
						<Input
							value={discount_rules[0].discount_label}
							onChange={handleChange}
							name="discount_label"
							placeholder={__('Discount Label', 'disco')}
						/>
					</div>
				)}
			</div>
		</ComponentBox>
	);
};
export default DiscountType;
