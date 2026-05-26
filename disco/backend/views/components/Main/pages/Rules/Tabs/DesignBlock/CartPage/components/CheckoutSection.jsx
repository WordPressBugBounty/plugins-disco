import { useDispatch, useSelector } from 'react-redux';
import FontStyleButtons from '../../../../../../components/FontStyleButtons';
import SingleSelect from '../../../../../../components/SingleSelect';
import { updateCartPage } from '../../../../../../features/discount/discountSlice';
import {
	fontItems,
	fontWeightItems,
} from '../../../../../../utilities/font-item';
import BadgeTextWithDynamicProperties from '../../components/BadgeTextWithDynamicProperties';
import ColorPiker from '../../components/ColorPiker';
import CustomNumberInput from '../../components/CustomNumberInput';
import { __ } from '@wordpress/i18n';

const CheckoutSection = () => {
	const dispatch = useDispatch();
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const checkoutMessage = cart?.checkout_message || {};

	const handleCheckoutChange = (key, value) => {
		dispatch(
			updateCartPage({
				name: 'checkout_message',
				value: { ...checkoutMessage, [key]: value },
			})
		);
	};

	const handleBoldToggle = () => {
		const currentWeight = checkoutMessage['font-weight'] || 400;
		const isBold =
			currentWeight === 700 ||
			currentWeight === 'bold' ||
			currentWeight === '700';
		handleCheckoutChange('font-weight', isBold ? 400 : 700);
	};

	const handleItalicToggle = () => {
		const isItalic = checkoutMessage['font-style'] === 'italic';
		handleCheckoutChange('font-style', isItalic ? 'normal' : 'italic');
	};

	const handleUnderlineToggle = () => {
		const isUnderline = checkoutMessage['text-decoration'] === 'underline';
		handleCheckoutChange(
			'text-decoration',
			isUnderline ? 'none' : 'underline'
		);
	};

	const handleFontWeightChange = (value) => {
		handleCheckoutChange('font-weight', parseInt(value) || value);
	};

	const currentWeight = checkoutMessage['font-weight'] || 400;
	const isBold =
		currentWeight === 700 ||
		currentWeight === 'bold' ||
		currentWeight === '700';
	const isItalic = checkoutMessage['font-style'] === 'italic';
	const isUnderline = checkoutMessage['text-decoration'] === 'underline';

	return (
		<div className="disco-mt-3">
			<h1 className="disco-text-sm disco-font-semibold">
				{__('Checkout Message', 'disco')}
			</h1>
			<div className="disco-flex disco-justify-between disco-items-center disco-bg-white disco-p-2 disco-gap-2 disco-rounded-lg disco-mt-1">
				<FontStyleButtons
					isBold={isBold}
					isItalic={isItalic}
					isUnderline={isUnderline}
					onBoldToggle={handleBoldToggle}
					onItalicToggle={handleItalicToggle}
					onUnderlineToggle={handleUnderlineToggle}
				/>
				<SingleSelect
					placeholder={__('Select Font', 'disco')}
					items={fontItems}
					selected={checkoutMessage['font-family'] || ''}
					onchange={(value) =>
						handleCheckoutChange('font-family', value)
					}
					className="disco-bg-white disco-flex-grow"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
				<CustomNumberInput
					name="font-size"
					id="checkout-font-size"
					initialValue={parseInt(checkoutMessage['font-size']) || 14}
					min={1}
					max={99}
					onChange={(value) =>
						handleCheckoutChange('font-size', `${value}px`)
					}
					className="disco-bg-white disco-max-w-32 disco-flex-grow"
				/>
				<SingleSelect
					placeholder={__('Weight', 'disco')}
					items={fontWeightItems}
					selected={currentWeight}
					onchange={handleFontWeightChange}
					className="disco-bg-white disco-flex-grow"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
				<ColorPiker
					className="disco-min-w-24 disco-flex-grow"
					value={checkoutMessage?.color || '#16a34a'}
					onChange={(value) => handleCheckoutChange('color', value)}
				/>
			</div>
			<BadgeTextWithDynamicProperties
				onChange={(e) => handleCheckoutChange('text', e.target.value)}
				value={
					checkoutMessage?.text ||
					'You have saved [discounted_amount] on this order'
				}
				data={[
					{ label: 'discounted_amount', value: '$10' },
					{ label: 'discounted_percentage', value: '20%' },
					{ label: 'remaining_quantity', value: '5' },
					{ label: 'remaining_amount', value: '$50' },
					{ label: 'remaining_cart_items', value: '2' },
				]}
			/>
		</div>
	);
};

export default CheckoutSection;
