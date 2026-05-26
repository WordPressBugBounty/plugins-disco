import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import product2 from '../../../../../../../../asset/img/badge-images/product-placeholder/product2.svg';
import Button from '../../../../../../components/Button';
import { updateTextHighlight } from '../../../../../../features/discount/discountSlice';
import textHighlightDesign, {
	DEFAULT_TEXT_HIGHLIGHT_DESIGN,
} from '../../../../../../utilities/text-highlight-design';
import BadgeCardContainer from '../../components/BadgeCardContainer';
import Rating from '../../components/Rating';

const TextHighlightView = ({ setSelectedBadge }) => {
	const dispatch = useDispatch();
	const { text_highlight } = useSelector(
		(state) => state.discount.design_blocks
	);

	// Get border radius with fallbacks
	const getBorderRadius = (radius) => {
		if (!radius) return '0px';
		return `${radius['top-left'] || '0px'} ${radius['top-right'] || '0px'} ${radius['bottom-right'] || '0px'} ${radius['bottom-left'] || '0px'}`;
	};

	// Get background style (handles both solid colors and gradients)
	const getBackgroundStyle = (bgColor) => {
		if (!bgColor) return {};
		// Check if it's a gradient
		if (bgColor.includes('gradient')) {
			return { background: bgColor };
		}
		return { backgroundColor: bgColor };
	};

	const renderBannerText = () => {
		const rawText = text_highlight?.title?.text;
		const text =
			typeof rawText === 'string'
				? rawText
				: '[discounted_percentage] OFF - Limited Time!';
		return text
			.replace(/\[discounted_percentage\]/g, '20%')
			.replace(/\[discounted_amount\]/g, '$10')
			.replace(/\[remaining_quantity\]/g, '5')
			.replace(/\[remaining_amount\]/g, '$50')
			.replace(/\[remaining_cart_items\]/g, '2');
	};

	const handleResetBanner = () => {
		// Reset to first banner design (banner1)
		dispatch(
			updateTextHighlight({
				name: 'container',
				value: textHighlightDesign.editable[0].container,
			})
		);
		dispatch(
			updateTextHighlight({
				name: 'title',
				value: textHighlightDesign?.editable[0]?.title,
			})
		);
		dispatch(
			updateTextHighlight({
				name: 'selected_design',
				value: DEFAULT_TEXT_HIGHLIGHT_DESIGN,
			})
		);

		dispatch(
			updateTextHighlight({
				name: 'badge_type',
				value: 'editable',
			})
		);

		setSelectedBadge('editable');
	};

	return (
		<BadgeCardContainer className="disco-h-[400px] disco-px-3 disco-bg-white disco-top-0 !disco-sticky">
			<div className="">
				<div className="disco-flex disco-gap-3 disco-bg-gray-50 disco-border disco-border-white disco-rounded-lg disco-px-6 disco-py-6 disco-shadow-md">
					<div className="disco-bg-white disco-flex disco-justify-center disco-items-center disco-rounded-md disco-p-4">
						<img src={product2} alt="img" className="disco-h-40" />
					</div>
					<div>
						<p className="disco-text-lg disco-font-medium disco-text-black">
							{__('Full Shirt for Men', 'disco')}
						</p>
						<div className="disco-mt-0.5 disco-flex disco-justify-between disco-items-center">
							<div className="disco-flex disco-gap-2 disco-items-center">
								<span className="disco-text-lg disco-font-bold">
									$165
								</span>
								<span className="disco-text-base disco-line-through disco-decoration-red-500">
									$285
								</span>
							</div>
						</div>
						{/* Text highlighter badge preview */}
						{text_highlight?.badge_type === 'upload' ? (
							<div style={text_highlight?.container}>
								<img
									src={text_highlight?.image?.url}
									alt="design"
									style={{
										width: '100%',
										height: '100%',
									}}
								/>
							</div>
						) : (
							<>
								<div
									style={{
										...text_highlight?.container,
										...getBackgroundStyle(
											text_highlight?.container?.[
												'background-color'
											]
										),
										borderRadius: getBorderRadius(
											text_highlight?.container?.radius
										),
									}}
								>
									{text_highlight?.badge_type ===
										'value_editable' && (
										<img
											src={text_highlight?.design?.url}
											alt="design"
											style={{
												width: '100%',
												height: '100%',
											}}
										/>
									)}
									<p
										style={{
											...text_highlight?.title,
											'font-weight':
												`${text_highlight?.title?.['font-weight']}` ||
												'normal',
										}}
									>
										{renderBannerText()}
									</p>
								</div>
							</>
						)}
						{/* Text highlighter badge preview */}
						<div className="disco-flex disco-gap-1 disco-items-center disco-mt-0.5">
							<Rating
								ratingHight={4}
								ratingWidth={4}
								ratingAvgClass="!disco-text-base"
								totalReviewClass="!disco-text-sm"
							/>
						</div>
						<button className="disco-text-orange-400 disco-text-sm disco-border disco-border-orange-400 disco-w-full disco-p-1 disco-mt-1">
							{__('Add to Cart', 'disco')}
						</button>
					</div>
				</div>
				<div className="disco-flex disco-mt-1 disco-justify-center disco-gap-4 disco-py-4">
					<Button
						onClick={handleResetBanner}
						type="transparent"
						className="disco-border-red-500"
					>
						{__('Reset All', 'disco')}
					</Button>
				</div>
			</div>
		</BadgeCardContainer>
	);
};

export default TextHighlightView;
