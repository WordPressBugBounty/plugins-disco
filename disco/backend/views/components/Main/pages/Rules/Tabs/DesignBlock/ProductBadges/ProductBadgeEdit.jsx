import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBadge } from '../../../../../features/discount/discountSlice';
import productBadgeDesign from '../../../../../utilities/product-badge-design';
import AxisBox from '../components/AxisBox';
import BadgeFontProperties from '../components/BadgeFontProperties';
import BadgeHeader from '../components/BadgeHeader';
import BadgeTextWithDynamicProperties from '../components/BadgeTextWithDynamicProperties';
import ColorPikerBox from '../components/ColorPikerBox';
import UploadBadgeComponent from '../components/UploadBadgeComponent';
import BadgeItems from './components/BadgeItems';
import ProductBadgeCardView from './components/ProductBadgeCardView';
import ProductBadgeStyleBox from './components/ProductBadgeStyleBox';
import BadgeSelector from './components/SelectBadge';

const ProductBadgeEdit = () => {
	const [selectedBadge, setSelectedBadge] = useState(
		useSelector(
			(state) =>
				state.discount.design_blocks.badge?.badge_type || 'editable'
		)
	);

	const textareaRef = useRef(null);

	const { badge } = useSelector((state) => state.discount.design_blocks);

	const isValueEditable = selectedBadge === 'value_editable';
	const isUpload = selectedBadge === 'upload';
	const dispatch = useDispatch();

	const badgeOptions = [
		{ label: 'Editable', value: 'editable' },
		// { label: 'Value Editable', value: 'value_editable' },
		{ label: 'Upload', value: 'upload' },
	];

	// handle title change
	const handleBadgeTitle = (key, value) => {
		dispatch(
			updateBadge({
				name: 'title',
				value: { ...badge.title, [key]: value },
			})
		);
	};

	// handle container change
	const handleContainerChange = (key, value) => {
		dispatch(
			updateBadge({
				name: 'container',
				value: { ...badge.container, [key]: value },
			})
		);
	};

	// handle image badge select from uploaded images
	const handleImageBadgeSelect = (image) => {
		dispatch(
			updateBadge({
				name: 'selected_design',
				value: image.id,
			})
		);
		dispatch(
			updateBadge({
				name: 'image',
				value: { url: image.url },
			})
		);
		dispatch(
			updateBadge({
				name: 'badge_type',
				value: 'upload',
			})
		);
		dispatch(
			updateBadge({
				name: 'container',
				value: productBadgeDesign?.image?.container || null,
			})
		);
		setSelectedBadge('upload');

		// clear old badge data when new badge is selected
		dispatch(
			updateBadge({
				name: 'title',
				value: null,
			})
		);
		dispatch(
			updateBadge({
				name: 'design',
				value: null,
			})
		);
	};

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, []);

	return (
		<div className="disco-bg-gray-50 disco-mr-4 disco-rounded-lg disco-pb-4">
			<div className="disco-px-5 disco-py-1">
				<BadgeHeader
					title={__('Product Badge', 'disco')}
					description={__(
						'Customize your promotional message on product.',
						'disco'
					)}
				/>
				<div className="disco-max-h-[calc(100vh-225px)] disco-flex disco-gap-8 disco-pt-2 disco-mt-2 disco-justify-between">
					<div className="disco-w-2/3 disco-overflow-y-auto disco-no-scrollbar disco-overscroll-contain">
						<BadgeSelector
							title={__('Choose Badge', 'disco')}
							options={badgeOptions}
							selectedOption={selectedBadge}
							onChange={(option) => setSelectedBadge(option)}
						/>
						{isUpload ? (
							<>
								<UploadBadgeComponent
									title={__('Upload Your Badge', 'disco')}
									uploadType="product-badge"
									handleUploadBadgeSelect={
										handleImageBadgeSelect
									}
									selectedDesign={badge?.selected_design}
								/>
								<AxisBox />
							</>
						) : (
							<>
								<BadgeItems selectedBadge={selectedBadge} />
								<BadgeFontProperties
									label={__('Enter your text here', 'disco')}
									onChange={(e) =>
										handleBadgeTitle('text', e.target.value)
									}
									value={badge?.title?.text || ''}
									data={[
										{
											label: __('Discount Type', 'disco'),
											value: 'Percentage',
										},
										{
											label: 'discounted_amount',
											value: '$10',
										},
									]}
									ref={textareaRef}
								/>
								<BadgeTextWithDynamicProperties
									onChange={(e) =>
										handleBadgeTitle('text', e.target.value)
									}
									value={badge?.title?.text || ''}
									data={[
										{
											label: __('Discount Type', 'disco'),
											value: 'Percentage',
										},
										{
											label: 'discounted_amount',
											value: '$10',
										},
									]}
									ref={textareaRef}
								/>
								<ProductBadgeStyleBox />
								<AxisBox />
								<ColorPikerBox
									fontColor={badge?.title?.color}
									backgroundColor={
										badge?.container?.background || '#fff'
									}
									borderColor={
										badge?.container?.['border-color']
									}
									handleFontColor={(value) =>
										handleBadgeTitle('color', value)
									}
									handleBackgroundColor={(value) =>
										handleContainerChange(
											'background',
											value
										)
									}
									handleBorderColor={(value) =>
										handleContainerChange(
											'border-color',
											value
										)
									}
									bgColorDisabled={isValueEditable}
									borderColorDisabled={isValueEditable}
								/>
							</>
						)}
					</div>
					<div className="disco-w-1/3">
						<ProductBadgeCardView
							setSelectedBadge={setSelectedBadge}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ProductBadgeEdit;
