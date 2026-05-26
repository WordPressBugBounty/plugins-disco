import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import CustomNumberInput from '../../../../../../components/CustomNumberInput';
import SingleSelect from '../../../../../../components/SingleSelect';
import { updateTable } from '../../../../../../features/discount/discountSlice';
import {
	fontItems,
	fontWeightItems,
} from '../../../../../../utilities/font-item.js';
import SettingsContainer from '../../components/SettingsContainer';
const CellCustomization = () => {
	const dispatch = useDispatch();
	const { cell_customization } = useSelector(
		(state) => state.discount.design_blocks.table
	);

	return (
		<SettingsContainer
			title={__('Cell Customization', 'disco')}
			className="disco-mt-3"
		>
			<SingleSelect
				placeholder={__('Select Font', 'disco')}
				items={fontItems}
				selected={cell_customization['font-family']}
				onchange={(value) => {
					dispatch(
						updateTable({
							name: 'cell_customization',
							value: {
								...cell_customization,
								'font-family': value,
							},
						})
					);
				}}
				className="disco-bg-white disco-w-full"
				buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
			/>
			<CustomNumberInput
				placeholder={__('Font Size', 'disco')}
				className="disco-w-44 disco-flex-shrink-0 disco-font-extralight"
				initialValue={parseInt(cell_customization['font-size'])}
				min={4}
				max={30}
				onChange={(value) => {
					dispatch(
						updateTable({
							name: 'cell_customization',
							value: {
								...cell_customization,
								['font-size']: `${value}px`,
							},
						})
					);
				}}
			/>
			<SingleSelect
				placeholder={__('Font Weight', 'disco')}
				items={fontWeightItems}
				selected={cell_customization['font-weight']}
				onchange={(value) => {
					dispatch(
						updateTable({
							name: 'cell_customization',
							value: {
								...cell_customization,
								'font-weight': value,
							},
						})
					);
				}}
				className="disco-bg-white disco-w-full"
				buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
			/>
		</SettingsContainer>
	);
};

export default CellCustomization;
