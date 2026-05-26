import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import CustomNumberInput from '../../../../../../components/CustomNumberInput';
import SingleSelect from '../../../../../../components/SingleSelect';
import { updateTable } from '../../../../../../features/discount/discountSlice';
import {
	fontItems,
	fontWeightItems,
} from '../../../../../../utilities/font-item';
import SettingsContainer from '../../components/SettingsContainer';
import ButtonCustomizationHeader from './ButtonCustomizationHeader';
import ButtonProperties from './ButtonProperties';

const ButtonCustomization = () => {
	const { button } = useSelector(
		(state) => state.discount.design_blocks.table
	);
	const dispatch = useDispatch();
	const handleButtonEnable = (value) => {
		// Dispatch 1: Update the button's enable status
		dispatch(
			updateTable({
				name: 'button',
				value: { ...button, enable: value },
			})
		);

		// Construct the heading object based on 'value'
		const newHeading = {
			title: 'Title',
			discount: 'Discount',
			range: 'Ranges',
			...(value && { buy_now: 'Buy Now' }),
		};

		// Dispatch 2: Update the heading object
		dispatch(
			updateTable({
				name: 'heading',
				value: newHeading,
			})
		);
	};

	return (
		<>
			<ButtonCustomizationHeader
				title={__('Button Customization', 'disco')}
				status={button.enable}
				onChange={(value) => {
					handleButtonEnable(value);
				}}
			/>
			<ButtonProperties />
			<SettingsContainer>
				<SingleSelect
					placeholder={__('Select Font', 'disco')}
					items={fontItems}
					selected={button['font-family']}
					onchange={(e) => {
						dispatch(
							updateTable({
								name: 'button',
								value: { ...button, 'font-family': e },
							})
						);
					}}
					className="disco-bg-white disco-w-full"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
				<CustomNumberInput
					placeholder={__('Font Size', 'disco')}
					className="disco-w-44 disco-flex-shrink-0 disco-font-extralight"
					initialValue={parseInt(button['font-size'])}
					min={4}
					max={30}
					onChange={(e) => {
						dispatch(
							updateTable({
								name: 'button',
								value: { ...button, 'font-size': e + 'px' },
							})
						);
					}}
				/>
				<SingleSelect
					placeholder={__('Font Weight', 'disco')}
					items={fontWeightItems}
					selected={button['font-weight']}
					onchange={(e) => {
						dispatch(
							updateTable({
								name: 'button',
								value: { ...button, 'font-weight': e },
							})
						);
					}}
					className="disco-bg-white disco-w-full"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
			</SettingsContainer>
		</>
	);
};

export default ButtonCustomization;
