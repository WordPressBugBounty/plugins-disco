import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import SingleSelect from '../../../../../../components/SingleSelect';
import { updateCountdown } from '../../../../../../features/discount/discountSlice';
import {
	fontItems,
	fontWeightItems,
} from '../../../../../../utilities/font-item';
import BorderRadius from '../../components/BorderRadiusControl';
import ColorPiker from '../../components/ColorPiker';
import CustomNumberInput from '../../components/CustomNumberInput';

const CountdownEdit = () => {
	const dispatch = useDispatch();
	const { countdown } = useSelector((state) => state.discount.design_blocks);
	const box = countdown?.box || {};
	const number = countdown?.number || {};
	const label = countdown?.label || {};

	const handleBoxChange = (key, value) => {
		dispatch(
			updateCountdown({
				name: 'box',
				value: { ...box, [key]: value },
			})
		);
	};

	const handleRadiusChange = (radius) => {
		dispatch(
			updateCountdown({
				name: 'box',
				value: { ...box, radius },
			})
		);
	};

	const handleNumberChange = (key, value) => {
		dispatch(
			updateCountdown({
				name: 'number',
				value: { ...number, [key]: value },
			})
		);
	};

	const handleLabelChange = (key, value) => {
		dispatch(
			updateCountdown({
				name: 'label',
				value: { ...label, [key]: value },
			})
		);
	};

	// Parse padding values
	const getPaddingValues = () => {
		const padding = box?.padding;
		if (!padding || typeof padding !== 'string') {
			return { top: 8, right: 12, bottom: 8, left: 12 };
		}
		const parts = padding.split(' ').map((p) => parseInt(p) || 0);
		if (parts.length === 1) {
			return {
				top: parts[0],
				right: parts[0],
				bottom: parts[0],
				left: parts[0],
			};
		} else if (parts.length === 2) {
			return {
				top: parts[0],
				right: parts[1],
				bottom: parts[0],
				left: parts[1],
			};
		} else if (parts.length === 4) {
			return {
				top: parts[0],
				right: parts[1],
				bottom: parts[2],
				left: parts[3],
			};
		}
		return { top: 8, right: 12, bottom: 8, left: 12 };
	};

	const paddingValues = getPaddingValues();

	const handlePaddingChange = (position, value) => {
		const newPadding = { ...paddingValues, [position]: value };
		const paddingStr = `${newPadding.top}px ${newPadding.right}px ${newPadding.bottom}px ${newPadding.left}px`;
		handleBoxChange('padding', paddingStr);
	};

	return (
		<>
			{/* Box: Border, Radius */}
			<div className="disco-w-full disco-mt-3 disco-flex disco-justify-between disco-gap-4">
				<CustomNumberInput
					title={__('Border', 'disco')}
					name="box-border"
					id="box-border"
					initialValue={parseInt(box?.border) || 0}
					min={0}
					max={10}
					onChange={(value) => handleBoxChange('border', value)}
				/>
				<BorderRadius
					title={__('Radius', 'disco')}
					button={{
						isChain: box?.isChain || false,
						radius: box?.radius || {
							'top-left': '2px',
							'top-right': '2px',
							'bottom-left': '2px',
							'bottom-right': '2px',
						},
					}}
					handleRadius={handleRadiusChange}
					handleIsChain={() =>
						dispatch(
							updateCountdown({
								name: 'box',
								value: { ...box, isChain: !box?.isChain },
							})
						)
					}
				/>
			</div>

			{/* Box Padding */}
			<div className="disco-w-full disco-mt-3 disco-flex disco-justify-between disco-gap-4">
				<CustomNumberInput
					title={__('Padding Top', 'disco')}
					name="box-padding-top"
					id="box-padding-top"
					initialValue={paddingValues.top}
					min={0}
					max={30}
					onChange={(value) => handlePaddingChange('top', value)}
				/>
				<CustomNumberInput
					title={__('Padding Right', 'disco')}
					name="box-padding-right"
					id="box-padding-right"
					initialValue={paddingValues.right}
					min={0}
					max={30}
					onChange={(value) => handlePaddingChange('right', value)}
				/>
				<CustomNumberInput
					title={__('Padding Bottom', 'disco')}
					name="box-padding-bottom"
					id="box-padding-bottom"
					initialValue={paddingValues.bottom}
					min={0}
					max={30}
					onChange={(value) => handlePaddingChange('bottom', value)}
				/>
				<CustomNumberInput
					title={__('Padding Left', 'disco')}
					name="box-padding-left"
					id="box-padding-left"
					initialValue={paddingValues.left}
					min={0}
					max={30}
					onChange={(value) => handlePaddingChange('left', value)}
				/>
			</div>

			{/* Box Colors */}
			<div className="disco-flex disco-mt-4 disco-justify-between disco-gap-2">
				<ColorPiker
					title={__('Background', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={box?.background || '#FFFFFF'}
					onChange={(value) => handleBoxChange('background', value)}
				/>
				<ColorPiker
					title={__('Border Color', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={box?.['border-color'] || 'rgba(0, 0, 0, 0)'}
					onChange={(value) => handleBoxChange('border-color', value)}
				/>
			</div>

			{/* Number Properties */}
			<div className="disco-mt-4">
				<h1 className="disco-text-sm disco-mb-2 disco-font-semibold">
					{__('Number Properties', 'disco')}
				</h1>
				<div className="disco-flex disco-justify-between disco-items-center disco-gap-4">
					<SingleSelect
						placeholder={__('Select Font', 'disco')}
						items={fontItems}
						selected={number['font-family'] || ''}
						onchange={(value) =>
							handleNumberChange('font-family', value)
						}
						className="disco-bg-white disco-min-w-40"
						buttonClass="!disco-py-1 disco-font-thin disco-text-sm"
					/>
					<CustomNumberInput
						placeholder={__('Size', 'disco')}
						initialValue={parseInt(number['font-size']) || 20}
						min={8}
						max={50}
						onChange={(value) =>
							handleNumberChange('font-size', `${value}px`)
						}
					/>
					<SingleSelect
						placeholder={__('Weight', 'disco')}
						items={fontWeightItems}
						selected={number['font-weight'] || 700}
						onchange={(value) =>
							handleNumberChange(
								'font-weight',
								parseInt(value) || value
							)
						}
						className="disco-bg-white disco-min-w-28"
						buttonClass="!disco-py-1 disco-font-thin disco-text-sm"
					/>
					<ColorPiker
						className="disco-min-w-32 disco-flex-grow"
						value={number?.color || '#FF4133'}
						onChange={(value) => handleNumberChange('color', value)}
					/>
				</div>
			</div>

			{/* Clock Text (Label) Properties */}
			<div className="disco-mt-4">
				<h1 className="disco-text-sm disco-mb-2 disco-font-semibold">
					{__('Clock Text', 'disco')}
				</h1>
				<div className="disco-flex disco-justify-between disco-items-center disco-gap-4">
					<SingleSelect
						placeholder={__('Select Font', 'disco')}
						items={fontItems}
						selected={label['font-family'] || ''}
						onchange={(value) =>
							handleLabelChange('font-family', value)
						}
						className="disco-bg-white disco-min-w-40"
						buttonClass="!disco-py-1 disco-font-thin disco-text-sm"
					/>
					<CustomNumberInput
						placeholder={__('Size', 'disco')}
						initialValue={parseInt(label['font-size']) || 9}
						min={6}
						max={20}
						onChange={(value) =>
							handleLabelChange('font-size', `${value}px`)
						}
					/>
					<SingleSelect
						placeholder={__('Weight', 'disco')}
						items={fontWeightItems}
						selected={label['font-weight'] || 400}
						onchange={(value) =>
							handleLabelChange(
								'font-weight',
								parseInt(value) || value
							)
						}
						className="disco-bg-white disco-min-w-28"
						buttonClass="!disco-py-1 disco-font-thin disco-text-sm"
					/>
					<ColorPiker
						className="disco-min-w-32 disco-flex-grow"
						value={label?.color || '#1A1D1F'}
						onChange={(value) => handleLabelChange('color', value)}
					/>
				</div>
			</div>
		</>
	);
};

export default CountdownEdit;
