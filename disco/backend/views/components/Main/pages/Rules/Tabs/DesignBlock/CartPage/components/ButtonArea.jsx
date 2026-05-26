import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartPage } from '../../../../../../features/discount/discountSlice';
import BorderRadius from '../../components/BorderRadiusControl';
import ColorPiker from '../../components/ColorPiker';
import CustomNumberInput from '../../components/CustomNumberInput';

const ButtonArea = () => {
	const dispatch = useDispatch();
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const banner = cart?.banner || {};
	const button = banner?.button || {};

	const handleButtonChange = (key, value) => {
		dispatch(
			updateCartPage({
				name: 'banner',
				value: {
					...banner,
					button: { ...button, [key]: value },
				},
			})
		);
	};

	const handleRadiusChange = (radius) => {
		dispatch(
			updateCartPage({
				name: 'banner',
				value: {
					...banner,
					button: { ...button, radius },
				},
			})
		);
	};

	return (
		<>
			{/* Height, Width, Border, Radius */}
			<div className="disco-w-full disco-mt-3 disco-flex disco-justify-between disco-gap-4">
				<CustomNumberInput
					title={__('Height', 'disco')}
					name="height"
					id="btn-height"
					initialValue={parseInt(button?.height) || 35}
					min={20}
					max={100}
					onChange={(value) =>
						handleButtonChange('height', `${value}px`)
					}
				/>
				<CustomNumberInput
					title={__('Width', 'disco')}
					name="width"
					id="btn-width"
					initialValue={parseInt(button?.width) || 90}
					min={50}
					max={300}
					onChange={(value) =>
						handleButtonChange('width', `${value}px`)
					}
				/>
				<CustomNumberInput
					title={__('Border', 'disco')}
					name="border"
					id="btn-border"
					initialValue={parseInt(button?.border) || 0}
					min={0}
					max={20}
					onChange={(value) => handleButtonChange('border', value)}
				/>
				<BorderRadius
					title={__('Radius', 'disco')}
					button={{
						isChain: button?.isChain || false,
						radius: button?.radius || {
							'top-left': '4px',
							'top-right': '4px',
							'bottom-left': '4px',
							'bottom-right': '4px',
						},
					}}
					handleRadius={handleRadiusChange}
					handleIsChain={() =>
						dispatch(
							updateCartPage({
								name: 'banner',
								value: {
									...banner,
									button: {
										...button,
										isChain: !button?.isChain,
									},
								},
							})
						)
					}
				/>
			</div>

			{/* Color Pickers */}
			<div className="disco-flex disco-mt-4 disco-justify-between disco-gap-2">
				<ColorPiker
					title={__('Text Color', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={button?.color || '#07C889'}
					onChange={(value) => handleButtonChange('color', value)}
				/>
				<ColorPiker
					title={__('Background', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={button?.background || '#ffffff'}
					onChange={(value) =>
						handleButtonChange('background', value)
					}
				/>
				<ColorPiker
					title={__('Border Color', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={button?.['border-color'] || '#ffffff'}
					onChange={(value) =>
						handleButtonChange('border-color', value)
					}
				/>
			</div>
		</>
	);
};

export default ButtonArea;
