import { useDispatch, useSelector } from 'react-redux';
import CustomNumberInput from '../../../../../../components/CustomNumberInput';
import Input from '../../../../../../components/Input';
import SingleSelect from '../../../../../../components/SingleSelect';
import { updateTable } from '../../../../../../features/discount/discountSlice';
import {
	fontItems,
	fontWeightItems,
} from '../../../../../../utilities/font-item';
import SettingsContainer from '../../components/SettingsContainer';
import { __ } from '@wordpress/i18n';

const HeadingTextSection = () => {
	const dispatch = useDispatch();
	const { heading, heading_customization } = useSelector(
		(state) => state.discount.design_blocks.table
	);
	const handleTableHeading = (fieldName, key, e) => {
		const newValue = { ...heading, [key]: e.target.value };
		dispatch(updateTable({ name: fieldName, value: newValue }));
	};

	return (
		<div>
			<SettingsContainer
				title={__('Heading Customization', 'disco')}
				className="disco-mt-3"
			>
				<SingleSelect
					placeholder={__('Select Font', 'disco')}
					items={fontItems}
					selected={heading_customization['font-family']}
					onchange={(value) => {
						dispatch(
							updateTable({
								name: 'heading_customization',
								value: {
									...heading_customization,
									'font-family': value,
								},
							})
						);
					}} // Use prop function
					className="disco-bg-white disco-w-44"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
				<CustomNumberInput
					placeholder={__('Font Size', 'disco')}
					className="disco-w-44 disco-font-extralight"
					initialValue={parseInt(heading_customization['font-size'])}
					min={4}
					max={30}
					onChange={(value) =>
						dispatch(
							updateTable({
								name: 'heading_customization',
								value: {
									...heading_customization,
									['font-size']: `${value}px`,
								},
							})
						)
					} // Use prop function
				/>
				<SingleSelect
					placeholder={__('Font Weight', 'disco')}
					items={fontWeightItems}
					selected={heading_customization['font-weight']} // Use prop value
					onchange={(value) => {
						dispatch(
							updateTable({
								name: 'heading_customization',
								value: {
									...heading_customization,
									'font-weight': value,
								},
							})
						);
					}}
					className="disco-bg-white disco-w-44"
					buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
				/>
			</SettingsContainer>

			<div className="disco-flex disco-mt-2 disco-gap-5 disco-justify-between 2xl:disco-justify-start">
				{Object.keys(heading).map((key) => (
					<Input
						key={key}
						type="text"
						placeholder={key}
						onChange={(e) => {
							handleTableHeading('heading', key, e);
						}}
						value={heading[key]}
						className="disco-h-8 disco-w-32 disco-text-xs"
					/>
				))}
			</div>
		</div>
	);
};

export default HeadingTextSection;
