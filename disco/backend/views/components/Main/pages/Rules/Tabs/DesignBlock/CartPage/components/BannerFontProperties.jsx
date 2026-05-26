import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import CustomNumberInput from '../../../../../../components/CustomNumberInput';
import FontStyleButtons from '../../../../../../components/FontStyleButtons';
import SingleSelect from '../../../../../../components/SingleSelect';
import { updateCartPage } from '../../../../../../features/discount/discountSlice';
import {
	fontItems,
	fontWeightItems,
} from '../../../../../../utilities/font-item';

const BannerFontProperties = ({
	label = '',
	className = '',
	textareaRef = null,
}) => {
	const dispatch = useDispatch();
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const { discount_intent } = useSelector((state) => state.discount);
	const banner = cart?.banner || {};

	const handleBannerChange = (key, value) => {
		dispatch(
			updateCartPage({
				name: 'banner',
				value: { ...banner, [key]: value },
			})
		);
	};

	const handleBoldToggle = () => {
		const currentWeight = banner['font-weight'] || 400;
		const isBold =
			currentWeight === 700 ||
			currentWeight === 'bold' ||
			currentWeight === '700';
		handleBannerChange('font-weight', isBold ? 400 : 700);
	};

	const handleFontWeightChange = (value) => {
		handleBannerChange('font-weight', parseInt(value) || value);
	};

	const handleItalicToggle = () => {
		const isItalic = banner['font-style'] === 'italic';
		handleBannerChange('font-style', isItalic ? 'normal' : 'italic');
	};

	const handleUnderlineToggle = () => {
		const isUnderline = banner['text-decoration'] === 'underline';
		handleBannerChange(
			'text-decoration',
			isUnderline ? 'none' : 'underline'
		);
	};

	const handleCustomOptionSelect = (value) => {
		if (!value) return;

		const insertText = `[${value}]`;

		// Insert at cursor position if textarea ref is available
		if (textareaRef?.current) {
			const textarea = textareaRef.current;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const currentText = banner?.text || '';
			const newText =
				currentText.substring(0, start) +
				insertText +
				currentText.substring(end);

			handleBannerChange('text', newText);

			// Set cursor position after inserted text
			setTimeout(() => {
				textarea.focus();
				textarea.setSelectionRange(
					start + insertText.length,
					start + insertText.length
				);
			}, 0);
		} else {
			// Fallback: append to end
			const currentText = banner?.text || '';
			handleBannerChange('text', currentText + insertText);
		}
	};

	const currentWeight = banner['font-weight'] || 400;
	const isBold =
		currentWeight === 700 ||
		currentWeight === 'bold' ||
		currentWeight === '700';
	const isItalic = banner['font-style'] === 'italic';
	const isUnderline = banner['text-decoration'] === 'underline';

	const customOptions = {
		'': 'Variable',
		discounted_percentage: 'Discount Percentage',
		discounted_amount: 'Discount Amount',
		remaining_quantity: 'Remaining Quantity',
		remaining_amount: 'Remaining Amount',
		remaining_cart_items: 'Remaining Cart Items',
	};

	if (discount_intent === 'Shipping') {
		delete customOptions.discounted_percentage;
		delete customOptions.discounted_amount;
	}

	return (
		<div className={`${className}`}>
			<span className="disco-text-sm disco-font-semibold">{label}</span>
			<div className="disco-flex disco-justify-between disco-items-center 2xl:disco-justify-start disco-bg-white disco-p-2 disco-gap-2 disco-rounded-lg disco-mt-1">
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
					selected={banner['font-family'] || ''}
					onchange={(value) =>
						handleBannerChange('font-family', value)
					}
					className="disco-bg-white disco-flex-grow"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
				<CustomNumberInput
					placeholder={__('Size', 'disco')}
					className="!disco-py-1 disco-gap-1 disco-flex-shrink-0 disco-font-thin disco-text-sm"
					initialValue={parseInt(banner['font-size']) || 14}
					min={4}
					max={30}
					onChange={(value) =>
						handleBannerChange('font-size', `${value}px`)
					}
				/>
				<SingleSelect
					placeholder={__('Weight', 'disco')}
					items={fontWeightItems}
					selected={currentWeight}
					onchange={handleFontWeightChange}
					className="disco-bg-white disco-flex-grow"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
				<SingleSelect
					placeholder={__('Variable', 'disco')}
					items={customOptions}
					selected=""
					onchange={handleCustomOptionSelect}
					className="disco-bg-white disco-flex-grow"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
			</div>
		</div>
	);
};

export default BannerFontProperties;
