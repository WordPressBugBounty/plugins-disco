import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleSelect from '../../../../../components/SingleSelect';
import { updateTextHighlight } from '../../../../../features/discount/discountSlice';
import textHighlightDesign from '../../../../../utilities/text-highlight-design';
import BadgeHeader from '../components/BadgeHeader';
import BadgeTextWithDynamicProperties from '../components/BadgeTextWithDynamicProperties';
import ColorPikerBox from '../components/ColorPikerBox';
import UploadBadgeComponent from '../components/UploadBadgeComponent';
import BadgeSelector from '../ProductBadges/components/SelectBadge';
import TextHighlightItems from './components/TextHighlightItems';
import TextHighlightProperties from './components/TextHighlightProperties';
import TextHighlightStyleBox from './components/TextHighlightStyleBox';
import TextHighlightView from './components/TextHighlightView';

const TextHighlightEdit = () => {
	const badgeInitialType = useSelector(
		(state) =>
			state.discount.design_blocks.text_highlight?.badge_type ||
			'editable'
	);
	const [selectedBadge, setSelectedBadge] = useState(
		badgeInitialType || 'editable'
	);
	const textareaRef = useRef(null);

	const { text_highlight } = useSelector(
		(state) => state.discount.design_blocks
	);
	const isValueEditable = selectedBadge === 'value_editable';
	const isUpload = selectedBadge === 'upload';
	const dispatch = useDispatch();

	// handle title change
	const handleTextHighlightTitle = (key, value) => {
		dispatch(
			updateTextHighlight({
				name: 'title',
				value: { ...text_highlight.title, [key]: value },
			})
		);
	};

	// handle container change
	const handleContainerChange = (key, value) => {
		dispatch(
			updateTextHighlight({
				name: 'container',
				value: { ...text_highlight.container, [key]: value },
			})
		);
	};

	// handle position change
	const handlePositionChange = (value) => {
		dispatch(updateTextHighlight({ name: 'position', value }));
	};

	// handle image badge select from uploaded images
	const handleImageTextHighlightSelect = (image) => {
		dispatch(
			updateTextHighlight({
				name: 'selected_design',
				value: image.id,
			})
		);
		dispatch(
			updateTextHighlight({
				name: 'image',
				value: { url: image.url },
			})
		);
		dispatch(
			updateTextHighlight({
				name: 'badge_type',
				value: 'upload',
			})
		);
		dispatch(
			updateTextHighlight({
				name: 'container',
				value: textHighlightDesign?.image?.container || null,
			})
		);
		setSelectedBadge('upload');

		// clear old badge data when new badge is selected
		dispatch(
			updateTextHighlight({
				name: 'title',
				value: null,
			})
		);
		dispatch(
			updateTextHighlight({
				name: 'design',
				value: null,
			})
		);
	};

	const badgeOptions = [
		{ label: __('Editable', 'disco'), value: 'editable' },
		{ label: __('Value Editable', 'disco'), value: 'value_editable' },
		{ label: __('Upload', 'disco'), value: 'upload' },
	];

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, []);

	return (
		<div className="disco-bg-gray-50 disco-mr-4 disco-rounded-lg disco-pb-4">
			{/* <BadgeHeaderTabs /> */}
			<div className="disco-px-5 disco-py-1">
				<BadgeHeader
					title={__('Text Highlight', 'disco')}
					description={__(
						'Customize your promotional message on product page.',
						'disco'
					)}
				/>
				<div className="disco-max-h-[calc(100vh-225px)] disco-flex disco-gap-8 disco-pt-2 disco-pb-4 disco-mt-2 disco-justify-between">
					<div className="disco-w-3/5 disco-max-h-full disco-overflow-y-auto disco-no-scrollbar disco-overscroll-contain">
						<BadgeSelector
							title={__('Choose Badge', 'disco')}
							options={badgeOptions}
							selectedOption={selectedBadge}
							onChange={(option) => setSelectedBadge(option)}
						/>
						{isUpload ? (
							<UploadBadgeComponent
								title={__('Upload Your Badge', 'disco')}
								uploadType="text-highlight"
								handleUploadBadgeSelect={
									handleImageTextHighlightSelect
								}
								selectedDesign={text_highlight?.selected_design}
							/>
						) : (
							<>
								<TextHighlightItems
									selectedBadge={selectedBadge}
								/>
								<TextHighlightProperties
									label={__('Primary Text', 'disco')}
									textareaRef={textareaRef}
								/>
								<BadgeTextWithDynamicProperties
									onChange={(e) =>
										handleTextHighlightTitle(
											'text',
											e.target.value
										)
									}
									value={text_highlight?.title?.text || ''}
									data={[
										{
											label: __('Discount Type', 'disco'),
											value: __('Percentage', 'disco'),
										},
										{
											label: 'discounted_amount',
											value: '$10',
										},
									]}
									ref={textareaRef}
								/>

								{/* Select Position */}
								<div className="disco-flex disco-gap-2 disco-items-center disco-mt-3">
									<div className="disco-text-sm disco-font-semibold">
										Select Position
									</div>
									<SingleSelect
										items={{
											after_title: 'After Title',
											after_price: 'After Price',
											before_add_to_cart:
												'Before Add to Cart',
											after_add_to_cart:
												'After Add to Cart',
										}}
										selected={
											text_highlight?.position ||
											'after_add_to_cart'
										}
										onchange={handlePositionChange}
										className="disco-bg-white disco-w-44"
										buttonClass="!disco-rounded-lg !disco-py-1 disco-font-thin disco-text-sm"
									/>
								</div>

								<TextHighlightStyleBox />
								<ColorPikerBox
									fontColor={text_highlight?.title?.color}
									backgroundColor={
										text_highlight?.container?.[
											'background-color'
										]
									}
									borderColor={
										text_highlight?.container?.[
											'border-color'
										]
									}
									handleFontColor={(value) =>
										handleTextHighlightTitle('color', value)
									}
									handleBackgroundColor={(value) =>
										handleContainerChange(
											'background-color',
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
					<div className="disco-w-2/5">
						<TextHighlightView
							setSelectedBadge={setSelectedBadge}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default TextHighlightEdit;
