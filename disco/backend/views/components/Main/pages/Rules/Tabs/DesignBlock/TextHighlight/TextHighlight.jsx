import { useDispatch, useSelector } from 'react-redux';
import { updateTextHighlight } from '../../../../../features/discount/discountSlice';
import useIsPro from '../../../../../hooks/useIsPro';
import BadgeActions from '../components/BadgeActions';
import BadgeComponentContainer from '../components/BadgeComponentContainer';
import BadgeTitle from '../components/BadgeTitle';
import ProFeatureButton from '../components/ProFeatureButton';
import Status from '../components/Status';
import TextHighlightCard from './components/TextHighlightCard';
import { __ } from '@wordpress/i18n';

const TextHighlight = () => {
	const { text_highlight } = useSelector(
		(state) => state.discount.design_blocks
	);
	const isPro = useIsPro();
	const tryNowUrl =
		'https://discoplugin.com/pricing/?utm_source=bulk-table&utm_medium=free-to-pro&utm_campaign=from-display-page&utm_id=1';

	const dispatch = useDispatch();

	const handleStatus = (status) => {
		dispatch(updateTextHighlight({ name: 'enable', value: status }));
	};

	return (
		<BadgeComponentContainer>
			<TextHighlightCard />
			<BadgeTitle
				title={__('Text Highlight', 'disco')}
				url="https://discoplugin.com/docs/display-text-highlight/"
				className="disco-mt-3"
			/>
			<BadgeActions>
				<Status
					status={text_highlight?.enable || false}
					handleStatus={handleStatus}
					disabled={!isPro}
					dataTestid="text-highlight-status"
				/>
				<ProFeatureButton
					tryNowUrl={tryNowUrl}
					componentToEdit="TextHighlightEdit"
					testId="text-highlight"
				/>
			</BadgeActions>
		</BadgeComponentContainer>
	);
};

export default TextHighlight;
