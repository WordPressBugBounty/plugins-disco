import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import designAutoSaveMiddleware from '../features/discount/designAutoSaveMiddleware';
import discountReducer from '../features/discount/discountSlice';
import campaignReducer from './../features/campaigns/campaignSlice';
import interactionReducer from './../features/interaction/interactionSlice';

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		discount: discountReducer,
		campaignState: campaignReducer,
		interaction: interactionReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(apiSlice.middleware)
			.concat(designAutoSaveMiddleware),
});
