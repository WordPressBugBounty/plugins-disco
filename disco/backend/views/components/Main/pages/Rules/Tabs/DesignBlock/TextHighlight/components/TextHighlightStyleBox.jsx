import { __ } from '@wordpress/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { updateTextHighlight } from '../../../../../../features/discount/discountSlice';
import BorderRadius from '../../components/BorderRadiusControl';
import CustomNumberInput from '../../components/CustomNumberInput';

const TextHighlightStyleBox = () => {
	const { container, badge_type } = useSelector(
		(state) => state.discount.design_blocks.text_highlight
	);

	const isValueEditable = badge_type === 'value_editable';

	const dispatch = useDispatch();

	const handleTextHighlightUpdate = (key, value) => {
		dispatch(
			updateTextHighlight({
				name: 'container',
				value: {
					...container,
					[key]: value,
				},
			})
		);
	};

	const handleRadiusChange = (radius) => {
		dispatch(
			updateTextHighlight({
				name: 'container',
				value: { ...container, radius },
			})
		);
	};

	return (
		<div className="disco-w-full disco-mt-3 disco-flex disco-justify-between disco-gap-4">
			<CustomNumberInput
				title={__('Width', 'disco')}
				name={'width'}
				id={'width'}
				initialValue={parseInt(container?.width) || 100}
				min={1}
				max={300}
				onChange={(value) =>
					handleTextHighlightUpdate('width', value + 'px')
				}
				disabled={isValueEditable}
			/>
			<CustomNumberInput
				title={__('Height', 'disco')}
				name={'height'}
				id={'height'}
				initialValue={parseInt(container?.height) || 40}
				min={1}
				max={100}
				onChange={(value) =>
					handleTextHighlightUpdate('height', value + 'px')
				}
				disabled={isValueEditable}
			/>
			<CustomNumberInput
				title={__('Border', 'disco')}
				name={'border'}
				id={'border'}
				initialValue={parseInt(container?.['border-width']) || 0}
				min={0}
				max={100}
				onChange={(value) =>
					handleTextHighlightUpdate('border-width', value + 'px')
				}
				disabled={isValueEditable}
			/>
			<BorderRadius
				title={__('Radius', 'disco')}
				button={{
					isChain: container?.isChain || false,
					radius: container?.radius || {
						'top-left': '0px',
						'top-right': '0px',
						'bottom-left': '0px',
						'bottom-right': '0px',
					},
				}}
				handleRadius={handleRadiusChange}
				handleIsChain={() =>
					dispatch(
						updateTextHighlight({
							name: 'container',
							value: {
								...container,
								isChain: !container?.isChain,
							},
						})
					)
				}
				disabled={isValueEditable}
			/>
		</div>
	);
};

export default TextHighlightStyleBox;
