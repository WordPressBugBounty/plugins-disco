import { composeWithDevTools } from '@redux-devtools/extension';
import { configureStore } from '@reduxjs/toolkit';
import { analyticsApi } from '../features/api/analyticsApi';
import dateRangeReducer from '../features/dateRange/dateRangeSlice';

export const store = configureStore(
	{
		reducer: {
			[analyticsApi.reducerPath]: analyticsApi.reducer,
			dateRange: dateRangeReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(analyticsApi.middleware),
	},
	composeWithDevTools()
);
