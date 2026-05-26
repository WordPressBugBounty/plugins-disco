import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { updateCountdown } from '../../../../../../features/discount/discountSlice';
import BorderRadius from '../../components/BorderRadiusControl';
import ColorPiker from '../../components/ColorPiker';
import CustomNumberInput from '../../components/CustomNumberInput';

const AreaEdit = () => {
	const dispatch = useDispatch();
	const { countdown } = useSelector((state) => state.discount.design_blocks);
	const container = countdown?.container || {};
	const title = countdown?.title || {};
	const subtitle = countdown?.subtitle || {};

	const handleContainerChange = (key, value) => {
		dispatch(
			updateCountdown({
				name: 'container',
				value: { ...container, [key]: value },
			})
		);
	};

	const handleRadiusChange = (radius) => {
		dispatch(
			updateCountdown({
				name: 'container',
				value: { ...container, radius },
			})
		);
	};

	const handleTitleColorChange = (value) => {
		dispatch(
			updateCountdown({
				name: 'title',
				value: { ...title, color: value },
			})
		);
	};

	const handleSubtitleColorChange = (value) => {
		dispatch(
			updateCountdown({
				name: 'subtitle',
				value: { ...subtitle, color: value },
			})
		);
	};

	// Parse padding values
	const getPaddingValues = () => {
		const padding = container?.padding;
		if (!padding || typeof padding !== 'string') {
			return { top: 12, right: 16, bottom: 12, left: 16 };
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
		return { top: 12, right: 16, bottom: 12, left: 16 };
	};

	const paddingValues = getPaddingValues();

	const handlePaddingChange = (position, value) => {
		const newPadding = { ...paddingValues, [position]: value };
		const paddingStr = `${newPadding.top}px ${newPadding.right}px ${newPadding.bottom}px ${newPadding.left}px`;
		handleContainerChange('padding', paddingStr);
	};

	return (
		<>
			{/* Border, Radius */}
			<div className="disco-w-full disco-mt-3 disco-flex disco-justify-between disco-gap-4">
				<CustomNumberInput
					title={__('Border', 'disco')}
					name="border"
					id="container-border"
					initialValue={container?.border || 0}
					min={0}
					max={10}
					onChange={(value) => handleContainerChange('border', value)}
				/>
				<BorderRadius
					title={__('Radius', 'disco')}
					button={{
						isChain: container?.isChain || false,
						radius: container?.radius || {
							'top-left': '6px',
							'top-right': '6px',
							'bottom-left': '6px',
							'bottom-right': '6px',
						},
					}}
					handleRadius={handleRadiusChange}
					handleIsChain={() =>
						dispatch(
							updateCountdown({
								name: 'container',
								value: {
									...container,
									isChain: !container?.isChain,
								},
							})
						)
					}
				/>
			</div>

			{/* Padding */}
			<div className="disco-w-full disco-mt-3 disco-flex disco-justify-between disco-gap-4">
				<CustomNumberInput
					title={__('Padding Top', 'disco')}
					name="padding-top"
					id="padding-top"
					initialValue={paddingValues.top}
					min={0}
					max={50}
					onChange={(value) => handlePaddingChange('top', value)}
				/>
				<CustomNumberInput
					title={__('Padding Right', 'disco')}
					name="padding-right"
					id="padding-right"
					initialValue={paddingValues.right}
					min={0}
					max={50}
					onChange={(value) => handlePaddingChange('right', value)}
				/>
				<CustomNumberInput
					title={__('Padding Bottom', 'disco')}
					name="padding-bottom"
					id="padding-bottom"
					initialValue={paddingValues.bottom}
					min={0}
					max={50}
					onChange={(value) => handlePaddingChange('bottom', value)}
				/>
				<CustomNumberInput
					title={__('Padding Left', 'disco')}
					name="padding-left"
					id="padding-left"
					initialValue={paddingValues.left}
					min={0}
					max={50}
					onChange={(value) => handlePaddingChange('left', value)}
				/>
			</div>

			{/* Colors */}
			<div className="disco-flex disco-mt-4 disco-justify-between disco-gap-2">
				<ColorPiker
					title={__('Primary Text', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={title?.color || '#FFFFFF'}
					onChange={handleTitleColorChange}
				/>
				<ColorPiker
					title={__('Secondary Text', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={subtitle?.color || '#FFFFFF'}
					onChange={handleSubtitleColorChange}
				/>
				<ColorPiker
					title={__('Background', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={container?.background || '#07C889'}
					hideGradient={false}
					onChange={(value) =>
						handleContainerChange('background', value)
					}
				/>
				<ColorPiker
					title={__('Border Color', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={container?.['border-color'] || 'rgba(0, 0, 0, 0)'}
					onChange={(value) =>
						handleContainerChange('border-color', value)
					}
				/>
			</div>
		</>
	);
};

export default AreaEdit;
