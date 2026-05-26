import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartPage } from '../../../../../../features/discount/discountSlice';
import BorderRadius from '../../components/BorderRadiusControl';
import ColorPiker from '../../components/ColorPiker';
import CustomNumberInput from '../../components/CustomNumberInput';

const NoticeArea = () => {
	const dispatch = useDispatch();
	const { cart } = useSelector((state) => state.discount.design_blocks);
	const banner = cart?.banner || {};

	const handleBannerChange = (key, value) => {
		dispatch(
			updateCartPage({
				name: 'banner',
				value: { ...banner, [key]: value },
			})
		);
	};

	const handleRadiusChange = (radius) => {
		dispatch(
			updateCartPage({
				name: 'banner',
				value: { ...banner, radius },
			})
		);
	};

	return (
		<>
			{/* Height, Border, Radius */}
			<div className="disco-w-full disco-mt-3 disco-flex disco-justify-between disco-gap-4">
				<CustomNumberInput
					title={__('Height', 'disco')}
					name="height"
					id="banner-height"
					initialValue={parseInt(banner?.height) || 45}
					min={30}
					max={100}
					onChange={(value) =>
						handleBannerChange('height', `${value}px`)
					}
				/>
				<CustomNumberInput
					title={__('Border', 'disco')}
					name="border"
					id="banner-border"
					initialValue={banner?.border || 0}
					min={0}
					max={10}
					onChange={(value) => handleBannerChange('border', value)}
				/>
				<BorderRadius
					title={__('Radius', 'disco')}
					button={{
						isChain: banner?.isChain || false,
						radius: banner?.radius || {
							'top-left': '8px',
							'top-right': '8px',
							'bottom-left': '8px',
							'bottom-right': '8px',
						},
					}}
					handleRadius={handleRadiusChange}
					handleIsChain={() =>
						dispatch(
							updateCartPage({
								name: 'banner',
								value: { ...banner, isChain: !banner?.isChain },
							})
						)
					}
				/>
			</div>
			<div className="disco-flex disco-mt-4 disco-justify-between disco-gap-2">
				<ColorPiker
					title={__('Text Color', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={banner?.color || '#ffffff'}
					onChange={(value) => handleBannerChange('color', value)}
				/>
				<ColorPiker
					title={__('Background', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={banner?.background || '#07C889'}
					onChange={(value) =>
						handleBannerChange('background', value)
					}
				/>
				<ColorPiker
					title={__('Border Color', 'disco')}
					className="disco-min-w-32 disco-flex-grow"
					value={banner?.['border-color'] || '#07C889'}
					onChange={(value) =>
						handleBannerChange('border-color', value)
					}
				/>
			</div>
		</>
	);
};

export default NoticeArea;
