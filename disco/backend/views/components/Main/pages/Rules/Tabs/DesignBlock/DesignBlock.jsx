import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import FooterButtons from '../../../../components/FooterButtons';
import { useUpdateCampaignMutation } from '../../../../features/campaigns/campaignsApi';
import { setTab } from '../../../../features/discount/discountSlice';
import {
	setComponentToEdit,
	setShowEditor,
} from '../../../../features/interaction/interactionSlice';
import {
	cleanFilters,
	validateEmptyField,
} from '../../../../utilities/utilities';
import RenderBlocks from './components/RenderBlocks';
import RenderEditor from './components/RenderEditor';
const DesignBlock = () => {
	const dispatch = useDispatch();
	const { discount_intent } = useSelector((state) => state.discount);
	const { showEditor, componentToEdit } = useSelector(
		(state) => state.interaction
	);

	const discount = useSelector((state) => state.discount);

	const [updateCampaign] = useUpdateCampaignMutation();
	const [searchParams] = useSearchParams();

	const handleContinue = () => {
		if (validateEmptyField(discount) === false) {
			return;
		}

		// Reset editor state before navigating
		dispatch(setShowEditor(false));
		dispatch(setComponentToEdit(''));

		if (searchParams.get('edit')) {
			const dataForRequest = { ...discount };

			delete dataForRequest.created_by;
			delete dataForRequest.modified_by;

			dataForRequest.conditions = cleanFilters(discount.conditions);

			updateCampaign({
				id: discount.id,
				data: {
					...dataForRequest,
					priority: String(dataForRequest.priority),
					ui: [discount.ui[0] + 1, 0],
				},
			});
		}

		dispatch(setTab(2));
	};
	const handleBack = () => {
		// Reset editor state before navigating back
		dispatch(setShowEditor(false));
		dispatch(setComponentToEdit(''));
		dispatch(setTab(0));
	};

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, []);

	return (
		<>
			<div className="disco-mx-3">
				{!showEditor ? (
					<RenderBlocks discount_intent={discount_intent} />
				) : (
					<RenderEditor componentName={componentToEdit} />
				)}
			</div>

			<FooterButtons
				handleContinue={handleContinue}
				handleBack={handleBack}
				disabled={showEditor}
			/>
		</>
	);
};
export default DesignBlock;
