import { useDispatch, useSelector } from 'react-redux';
import { updateTable } from '../../../../../../features/discount/discountSlice';
import ColorPikerBox from '../../components/ColorPikerBox';
import LayoutControl from './LayoutControl';

const HeadingTabSection = () => {
	const dispatch = useDispatch();
	const { heading_customization } = useSelector(
		(state) => state.discount.design_blocks.table
	);

	// 🔹 Generic color handler
	const handleColorChange = (key, value) => {
		dispatch(
			updateTable({
				name: 'heading_customization',
				value: {
					...heading_customization,
					[key]: value,
				},
			})
		);
	};

	// 🔹 Handle height and border updates
	const handleHeightBorderChange = (key, newValue) => {
		let updatedValue = newValue;

		if (key === 'height') {
			updatedValue = `${newValue}px`;
		}

		if (key === 'border-right' || key === 'border-bottom') {
			updatedValue = `${newValue}px solid`;
		}

		dispatch(
			updateTable({
				name: 'heading_customization',
				value: {
					...heading_customization,
					[key]: updatedValue,
				},
			})
		);
	};

	return (
		<div>
			{/* 🎨 Color pickers */}
			<ColorPikerBox
				fontColor={heading_customization.color}
				backgroundColor={heading_customization.background}
				borderColor={heading_customization['border-color']}
				handleFontColor={(value) => handleColorChange('color', value)}
				handleBackgroundColor={(value) =>
					handleColorChange('background', value)
				}
				handleBorderColor={(value) =>
					handleColorChange('border-color', value)
				}
			/>

			<LayoutControl
				height={parseInt(heading_customization['height'])}
				columnBorder={parseInt(heading_customization['border-right'])} // convert '1px solid #4b5563' → 1
				rowBorder={parseInt(heading_customization['border-bottom'])}
				onHeightChange={(value) =>
					handleHeightBorderChange('height', value)
				}
				onColumnBorderChange={(value) =>
					handleHeightBorderChange('border-right', value)
				}
				onRowBorderChange={(value) =>
					handleHeightBorderChange('border-bottom', value)
				}
			/>
		</div>
	);
};

export default HeadingTabSection;
