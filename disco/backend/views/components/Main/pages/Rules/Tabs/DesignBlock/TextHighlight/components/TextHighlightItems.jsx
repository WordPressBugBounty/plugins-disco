import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { updateTextHighlight } from '../../../../../../features/discount/discountSlice';
import textHighlightDesign from '../../../../../../utilities/text-highlight-design';

const TextHighlightItems = ({ className = '', selectedBadge }) => {
	const dispatch = useDispatch();
	const { text_highlight } = useSelector(
		(state) => state.discount.design_blocks
	);

	const handleDesignSelect = (designKey) => {
		const selectedDesign = textHighlightDesign[selectedBadge].find(
			(design) => design.id === designKey
		);
		if (!selectedDesign) return;

		// Update selected design key
		dispatch(
			updateTextHighlight({ name: 'selected_design', value: designKey })
		);
		// Update badge type
		dispatch(
			updateTextHighlight({ name: 'badge_type', value: selectedBadge })
		);

		// Apply title styles (keep existing text)
		dispatch(
			updateTextHighlight({
				name: 'title',
				value: selectedDesign.title,
			})
		);

		// Apply container styles
		dispatch(
			updateTextHighlight({
				name: 'container',
				value: selectedDesign.container,
			})
		);

		dispatch(
			updateTextHighlight({
				name: 'image',
				value: selectedDesign.image,
			})
		);

		// Apply image URL
		if (selectedBadge === 'value_editable') {
			dispatch(
				updateTextHighlight({
					name: 'design',
					value: selectedDesign.design,
				})
			);
		}
	};

	return (
		<div
			className={`disco-max-h-[544px] disco-rounded-lg disco-bg-white disco-my-4 disco-py-4 disco-px-4 disco-border-1 ${className}`}
		>
			<div className="disco-grid disco-grid-cols-2 disco-gap-4 ">
				{textHighlightDesign[selectedBadge].length > 0 ? (
					Object.values(textHighlightDesign?.[selectedBadge]).map(
						(design, index) => {
							const isSelected =
								text_highlight?.selected_design === design.id;
							const designKey = design.id;

							return (
								<div
									key={index}
									onClick={() =>
										handleDesignSelect(designKey)
									}
									className={`disco-flex disco-flex-col disco-border disco-rounded-md disco-p-3 disco-items-center disco-justify-center ${isSelected && 'disco-border-primary'}`}
								>
									<img
										src={design.image.url}
										alt={`Badge ${index + 1}`}
										className="disco-object-contain"
									/>
								</div>
							);
						}
					)
				) : (
					<p className="disco-text-gray-500 disco-text-sm disco-col-span-4 disco-text-center">
						{__(
							'No badges available for the selected option.',
							'disco'
						)}
					</p>
				)}
			</div>
		</div>
	);
};

export default TextHighlightItems;
