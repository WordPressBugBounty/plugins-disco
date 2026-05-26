import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import CustomNumberInput from '../../../../../../components/CustomNumberInput';
import FontStyleButtons from '../../../../../../components/FontStyleButtons';
import Input from '../../../../../../components/Input';
import SingleSelect from '../../../../../../components/SingleSelect';
import { updateCartPage } from '../../../../../../features/discount/discountSlice';
import {
	fontItems,
	fontWeightItems,
} from '../../../../../../utilities/font-item';
import Status from '../../components/Status';

const ButtonSection = () => {
	const dispatch = useDispatch();
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const banner = cart?.banner || {};
	const button = banner?.button || {};

	const handleButtonChange = (key, value) => {
		dispatch(
			updateCartPage({
				name: 'banner',
				value: {
					...banner,
					button: { ...button, [key]: value },
				},
			})
		);
	};

	const handleBoldToggle = () => {
		const currentWeight = button['font-weight'] || 600;
		const isBold =
			currentWeight === 700 ||
			currentWeight === 'bold' ||
			currentWeight === '700';
		handleButtonChange('font-weight', isBold ? 400 : 700);
	};

	const handleItalicToggle = () => {
		const isItalic = button['font-style'] === 'italic';
		handleButtonChange('font-style', isItalic ? 'normal' : 'italic');
	};

	const handleUnderlineToggle = () => {
		const isUnderline = button['text-decoration'] === 'underline';
		handleButtonChange(
			'text-decoration',
			isUnderline ? 'none' : 'underline'
		);
	};

	const handleFontWeightChange = (value) => {
		handleButtonChange('font-weight', parseInt(value) || value);
	};

	const currentWeight = button['font-weight'] || 600;
	const isBold =
		currentWeight === 700 ||
		currentWeight === 'bold' ||
		currentWeight === '700';
	const isItalic = button['font-style'] === 'italic';
	const isUnderline = button['text-decoration'] === 'underline';

	const isButtonEnabled = button?.enable !== false;

	const handleEnableToggle = () => {
		handleButtonChange('enable', !isButtonEnabled);
	};

	return (
		<div className="disco-mt-3">
			<div className="disco-flex disco-justify-between disco-items-center disco-mb-1">
				<h1 className="disco-text-sm disco-font-semibold">
					{__('Banner Button', 'disco')}
				</h1>
				<Status
					status={isButtonEnabled}
					handleStatus={handleEnableToggle}
				/>
			</div>
			<>
				<div className="disco-flex disco-justify-between disco-items-center disco-bg-white disco-p-2 disco-gap-2 disco-rounded-lg">
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
						selected={button['font-family'] || ''}
						onchange={(value) =>
							handleButtonChange('font-family', value)
						}
						className="disco-bg-white disco-flex-grow"
						buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
					/>
					<CustomNumberInput
						placeholder={__('Size', 'disco')}
						className="!disco-py-1 disco-gap-1 disco-flex-shrink-0 disco-font-thin disco-text-sm"
						initialValue={parseInt(button['font-size']) || 14}
						min={4}
						max={30}
						onChange={(value) =>
							handleButtonChange('font-size', `${value}px`)
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
				</div>
				<div className="disco-flex disco-justify-between disco-gap-4 disco-mt-3">
					<Input
						type="text"
						value={button?.text || ''}
						onChange={(e) =>
							handleButtonChange('text', e.target.value)
						}
						placeholder={__('Shop Now', 'disco')}
						className="!disco-w-full disco-h-8 disco-text-sm"
					/>
					<Input
						type="text"
						value={button?.url || ''}
						onChange={(e) =>
							handleButtonChange('url', e.target.value)
						}
						placeholder={__('Enter your button url', 'disco')}
						className="!disco-w-full !disco-h-8 disco-text-sm"
					/>
				</div>
			</>
		</div>
	);
};

export default ButtonSection;
