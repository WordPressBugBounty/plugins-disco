import { __ } from '@wordpress/i18n';
import CustomNumberInput from '../../components/CustomNumberInput';

const LayoutControl = ({
	height,
	columnBorder,
	rowBorder,
	onHeightChange,
	onColumnBorderChange,
	onRowBorderChange,
}) => {
	return (
		<div className="disco-flex disco-justify-between disco-gap-4 disco-mt-2">
			<CustomNumberInput
				title={__('Height', 'disco')}
				placeholder={__('Height', 'disco')}
				className="disco-w-full"
				id="height"
				name="height"
				initialValue={height}
				min={0}
				max={100}
				onChange={onHeightChange}
			/>
			<CustomNumberInput
				title={__('Column Border Width', 'disco')}
				placeholder={__('Column Border', 'disco')}
				className="disco-w-full"
				id="column-border"
				name="column-border"
				initialValue={columnBorder}
				min={0}
				max={100}
				onChange={onColumnBorderChange}
			/>
			<CustomNumberInput
				title={__('Row Border Width', 'disco')}
				placeholder={__('Row Border', 'disco')}
				className="disco-w-full"
				id="row-border"
				name="row-border"
				initialValue={rowBorder}
				min={0}
				max={100}
				onChange={onRowBorderChange}
			/>
		</div>
	);
};

export default LayoutControl;
