import { __ } from '@wordpress/i18n';
import CustomNumberInput from '../../../../../../components/CustomNumberInput';
import SingleSelect from '../../../../../../components/SingleSelect';

// Add props for font, font weight, and their setters
const FontPropertiesBox = ({
	title,
	className,
	selectedFont,
	onFontChange,
	fontSize,
	onFontSizeChange,
	selectedFontWeight,
	onFontWeightChange,
}) => {
	return (
		<div className={`${className}`}>
			<h1 className="disco-text-sm disco-font-semibold disco-mb-2">
				{title}
			</h1>
			<div className="disco-flex disco-justify-between 2xl:disco-justify-start disco-bg-white disco-p-2 disco-rounded-md">
				<SingleSelect
					placeholder={__('Select Font', 'disco')}
					items={{
						1: 'Arial',
						2: 'Times New Roman',
						3: 'Courier New',
						4: 'Verdana',
						5: 'Georgia',
						6: 'Comic Sans MS',
						7: 'Impact',
					}}
					selected={selectedFont} // Use prop value
					onchange={onFontChange} // Use prop function
					className="disco-bg-white disco-w-44"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
				<CustomNumberInput
					placeholder={__('Font Size', 'disco')}
					className="disco-w-44 disco-font-extralight"
					initialValue={fontSize}
					min={4}
					max={30}
					onChange={onFontSizeChange}
				/>
				<SingleSelect
					placeholder={__('Font Weight', 'disco')}
					items={{
						1: 'Light',
						2: 'Regular',
						3: 'Bold',
						4: 'Extra Bold',
					}}
					selected={selectedFontWeight} // Use prop value
					onchange={onFontWeightChange} // Use prop function
					className="disco-bg-white disco-w-44"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
			</div>
		</div>
	);
};

export default FontPropertiesBox;
