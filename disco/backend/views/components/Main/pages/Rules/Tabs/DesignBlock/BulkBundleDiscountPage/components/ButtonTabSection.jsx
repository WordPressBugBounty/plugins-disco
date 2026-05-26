import { useDispatch, useSelector } from 'react-redux';
import { updateTable } from '../../../../../../features/discount/discountSlice';
import ColorPikerBox from '../../components/ColorPikerBox';
import CustomNumberInput from '../../components/CustomNumberInput';
import { __ } from '@wordpress/i18n';

const ButtonTabSection = () => {
	const dispatch = useDispatch();

	// get both heading and styling so we can safely merge
	const { button } = useSelector(
		(state) => state.discount.design_blocks.table
	);

	const handleHeightChange = (value) => {
		dispatch(
			updateTable({
				name: 'button',
				value: {
					...button,
					height: `${value}px`,
				},
			})
		);
	};

	const handleBorderChange = (value) => {
		dispatch(
			updateTable({
				name: 'button',
				value: {
					...button,
					border: `${value}px solid`,
				},
			})
		);
	};

	const handleColorChange = (key, value) => {
		dispatch(
			updateTable({
				name: 'button',
				value: {
					...button,
					[key]: value,
				},
			})
		);
	};

	return (
		<div>
			<ColorPikerBox
				fontColor={button['color']}
				backgroundColor={button['background']}
				borderColor={button['border-color']}
				handleFontColor={(value) => handleColorChange('color', value)}
				handleBackgroundColor={(value) =>
					handleColorChange('background', value)
				}
				handleBorderColor={(value) =>
					handleColorChange('border-color', value)
				}
			/>
			<div className="disco-flex disco-flex-start disco-gap-4 disco-pt-2">
				<CustomNumberInput
					title={__('Button Height', 'disco')}
					placeholder={__('Height', 'disco')}
					id="height"
					name="height"
					initialValue={parseInt(button['height'])}
					min={0}
					max={100}
					onChange={handleHeightChange}
				/>

				<CustomNumberInput
					title={__('Button Border', 'disco')}
					placeholder={__('Button Border', 'disco')}
					id="border"
					name="border"
					initialValue={parseInt(button['border'])}
					min={0}
					max={20}
					onChange={handleBorderChange}
				/>
			</div>
		</div>
	);
};

export default ButtonTabSection;
