import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	campaign_ids: [],
	campaigns: [],
	searchTerm: '',
};

export const campaignSlice = createSlice({
	name: 'campaign',
	initialState,
	reducers: {
		resetSelectedIDs: (state) => {
			state.campaign_ids = [];
		},
		toggleCampaignSelect: (state, action) => {
			if (state.campaign_ids.includes(action.payload)) {
				state.campaign_ids = state.campaign_ids.filter(
					(id) => id !== action.payload
				);
			} else {
				state.campaign_ids.push(action.payload);
			}
		},
		setCampaignsInState: (state, action) => {
			state.campaigns = action.payload;
		},
		setSearchTerm: (state, action) => {
			state.searchTerm = action.payload;
		},
	},
});

export const {
	resetSelectedIDs,
	toggleCampaignSelect,
	setCampaignsInState,
	setSearchTerm,
} = campaignSlice.actions;

export default campaignSlice.reducer;
