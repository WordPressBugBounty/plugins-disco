import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomNumberInput from '../../../../../components/CustomNumberInput';
import FontStyleButtons from '../../../../../components/FontStyleButtons';
import SingleSelect from '../../../../../components/SingleSelect';
import { updateBadge } from '../../../../../features/discount/discountSlice';
import { fontItems, fontWeightItems } from '../../../../../utilities/font-item';

const BadgeFontProperties = ({
	label = '',
	className = '',
	type = 'title',
	textareaRef = null,
}) => {
	// const [selectedFont, setSelectedFont] = useState('');
	// const [fontWeight, setFontWeight] = useState('');
	// const [customOption, setCustomOption] = useState('');

	const [selectedFont, setSelectedFont] = useState('');
	const [fontSize, setFontSize] = useState(12);

	const { badge } = useSelector((state) => state.discount.design_blocks);
	const isValueEditable = badge?.badge_type === 'value_editable';

	const textData = badge?.[type] || {};
	const dispatch = useDispatch();

	const handleTextChange = (key, value) => {
		dispatch(
			updateBadge({
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

	const handleItalicToggle = () => {
		const isItalic = textData['font-style'] === 'italic';
		handleTextChange('font-style', isItalic ? 'normal' : 'italic');
	};

	const handleUnderlineToggle = () => {
		const isUnderline = textData['text-decoration'] === 'underline';
		handleTextChange('text-decoration', isUnderline ? 'none' : 'underline');
	};

	const handleCustomOptionSelect = (value) => {
		if (!value) return;

		const insertText = `[${value}]`;

		// Insert at cursor position if textarea ref is available
		if (textareaRef?.current) {
			const textarea = textareaRef.current;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const currentText = textData.text || '';
			const newText =
				currentText.substring(0, start) +
				insertText +
				currentText.substring(end);

			handleTextChange('text', newText);

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
			const currentText = badge?.title?.text || '';
			handleTextChange('text', currentText + insertText);
		}
	};

	const customOptions = {
		'': __('Variable', 'disco'),
		discounted_percentage: __('Discount Percentage', 'disco'),
		discounted_amount: __('Discount Amount', 'disco'),
	};

	const currentWeight = textData['font-weight'] || 400;
	const isBold =
		currentWeight === 700 ||
		currentWeight === 'bold' ||
		currentWeight === '700';
	const isItalic = textData['font-style'] === 'italic';
	const isUnderline = textData['text-decoration'] === 'underline';

	return (
		<div className={` ${className}`}>
			<span className="disco-text-sm disco-font-semibold">{label}</span>
			<div className="disco-flex disco-justify-between disco-items-center 2xl:disco-justify-start disco-bg-white disco-p-2 disco-gap-2 disco-rounded-lg disco-mt-1">
				<FontStyleButtons
					isBold={isBold}
					isItalic={isItalic}
					isUnderline={isUnderline}
					onBoldToggle={handleBoldToggle}
					onItalicToggle={handleItalicToggle}
					onUnderlineToggle={handleUnderlineToggle}
					disabled={isValueEditable}
					className="disco-font-bold disco-text-base"
				/>
				<SingleSelect
					placeholder={__('Select Font', 'disco')}
					items={fontItems}
					selected={textData['font-family'] || selectedFont}
					onchange={(value) => {
						setSelectedFont(value);
						handleTextChange('font-family', value);
					}}
					className="disco-bg-white"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm disco-min-w-[165px] 2xl:disco-max-w-full"
					disabled={isValueEditable}
				/>
				<CustomNumberInput
					placeholder="Size"
					initialValue={parseInt(textData['font-size']) || fontSize}
					min={1}
					max={99}
					onChange={(value) => {
						setFontSize(value);
						handleTextChange('font-size', value + 'px');
					}}
					className="!disco-py-1 disco-gap-1 disco-flex-shrink-0 disco-font-thin disco-text-sm"
					disabled={isValueEditable}
				/>
				<SingleSelect
					placeholder={__('Weight', 'disco')}
					items={fontWeightItems}
					selected={currentWeight}
					onchange={(value) => {
						// setFontWeight(value);
						handleTextChange(
							'font-weight',
							parseInt(value) || value
						);
					}}
					className="disco-bg-white disco-flex-grow"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm disco-min-w-[130px]"
					disabled={isValueEditable}
				/>
				<SingleSelect
					placeholder={__('Variable', 'disco')}
					items={customOptions}
					selected=""
					onchange={handleCustomOptionSelect}
					className="disco-bg-white disco-flex-grow"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm disco-min-w-[165px] 2xl:disco-max-w-full"
				/>
			</div>
		</div>
	);
};

export default BadgeFontProperties;
