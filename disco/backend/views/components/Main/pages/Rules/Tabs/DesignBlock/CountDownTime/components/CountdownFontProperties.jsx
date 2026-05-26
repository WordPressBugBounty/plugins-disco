import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import CustomNumberInput from '../../../../../../components/CustomNumberInput';
import FontStyleButtons from '../../../../../../components/FontStyleButtons';
import SingleSelect from '../../../../../../components/SingleSelect';
import { updateCountdown } from '../../../../../../features/discount/discountSlice';
import {
	fontItems,
	fontWeightItems,
} from '../../../../../../utilities/font-item';

const CountdownFontProperties = ({
	label = '',
	className = '',
	type = 'title', // 'title' or 'subtitle'
}) => {
	const dispatch = useDispatch();
	const { countdown } = useSelector((state) => state.discount.design_blocks);
	const textData = countdown?.[type] || {};

	const handleTextChange = (key, value) => {
		dispatch(
			updateCountdown({
				name: type,
				value: { ...textData, [key]: value },
			})
		);
	};

	const handleBoldToggle = () => {
		const currentWeight = textData['font-weight'] || 400;
		const isBold =
			currentWeight === 700 ||
			currentWeight === 'bold' ||
			currentWeight === '700';
		handleTextChange('font-weight', isBold ? 400 : 700);
	};

	const handleFontWeightChange = (value) => {
		handleTextChange('font-weight', parseInt(value) || value);
	};

	const handleItalicToggle = () => {
		const isItalic = textData['font-style'] === 'italic';
		handleTextChange('font-style', isItalic ? 'normal' : 'italic');
	};

	const handleUnderlineToggle = () => {
		const isUnderline = textData['text-decoration'] === 'underline';
		handleTextChange('text-decoration', isUnderline ? 'none' : 'underline');
	};

	const currentWeight = textData['font-weight'] || 400;
	const isBold =
		currentWeight === 700 ||
		currentWeight === 'bold' ||
		currentWeight === '700';
	const isItalic = textData['font-style'] === 'italic';
	const isUnderline = textData['text-decoration'] === 'underline';

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
					selected={textData['font-family'] || ''}
					onchange={(value) => handleTextChange('font-family', value)}
					className="disco-bg-white disco-flex-grow"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
				<CustomNumberInput
					placeholder={__('Size', 'disco')}
					className="!disco-py-1 disco-gap-1 disco-flex-shrink-0 disco-font-thin disco-text-sm"
					initialValue={parseInt(textData['font-size']) || 14}
					min={4}
					max={30}
					onChange={(value) =>
						handleTextChange('font-size', `${value}px`)
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
		</div>
	);
};

export default CountdownFontProperties;
