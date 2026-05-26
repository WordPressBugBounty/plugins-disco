import { campaignsApi } from '../campaigns/campaignsApi';
import {
	applyCountdownDesign,
	updateBadge,
	updateCartPage,
	updateCountdown,
	updateTable,
	updateTextHighlight,
} from '../discount/discountSlice';

import { setSaveStatus } from '../interaction/interactionSlice';

let abortController = null;
let debounceTimer = null;

const designAutoSaveMiddleware = (store) => (next) => async (action) => {
	const designActions = [
		applyCountdownDesign.type,
		updateBadge.type,
		updateTextHighlight.type,
		updateCountdown.type,
		updateTable.type,
		updateCartPage.type,
	];

	const result = next(action);
	const state = store.getState().discount;

	// 🔹 WHEN SAVE REQUEST SUCCESSFULLY COMPLETED
	if (campaignsApi.endpoints.patchCampaign.matchFulfilled(action)) {
		store.dispatch(setSaveStatus('success'));
	}

	// Auto-save only on design tab
	if (!designActions.includes(action.type) || state.ui[0] !== 1) {
		return result;
	}

	// Debounce
	if (debounceTimer) clearTimeout(debounceTimer);

	debounceTimer = setTimeout(() => {
		// Abort previous pending request
		if (abortController) {
			abortController.abort();
		}

		abortController = new AbortController();
		const signal = abortController.signal;

		// Read fresh state at fire time, not at dispatch time
		const freshState = store.getState().discount;

		//Before saving, set status = "saving"
		store.dispatch(setSaveStatus('saving'));

		// Send mutation request
		store.dispatch(
			campaignsApi.endpoints.patchCampaign.initiate(
				{
					id: freshState.id,
					data: { design_blocks: freshState.design_blocks },
				},
				{ signal }
			)
		);
	}, 3000);

	return result;
};

export default designAutoSaveMiddleware;
