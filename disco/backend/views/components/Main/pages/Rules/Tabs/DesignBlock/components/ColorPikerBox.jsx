import { __ } from '@wordpress/i18n';
import CustomColorPiker from './ColorPiker';

const ColorPikerBox = ({
	fontColor,
	backgroundColor,
	borderColor,
	handleFontColor,
	handleBackgroundColor,
	handleBorderColor,
	bgColorDisabled,
	borderColorDisabled,
}) => {
	return (
		<div className="disco-w-full disco-mt-4 disco-flex disco-justify-between disco-gap-4">
			<CustomColorPiker
				title={__('Font Color', 'disco')}
				value={fontColor}
				onChange={handleFontColor}
				className="disco-w-full"
			/>
			<CustomColorPiker
				title={__('Background Color', 'disco')}
				value={backgroundColor}
				onChange={handleBackgroundColor}
				hideGradient={false}
				disabled={bgColorDisabled}
				className="disco-w-full"
			/>
			<CustomColorPiker
				title={__('Border Color', 'disco')}
				value={borderColor}
				onChange={handleBorderColor}
				className="disco-w-full"
				disabled={borderColorDisabled}
			/>
		</div>
	);
};
export default ColorPikerBox;
