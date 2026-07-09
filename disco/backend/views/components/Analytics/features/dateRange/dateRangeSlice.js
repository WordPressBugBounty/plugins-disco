import { createSelector, createSlice } from '@reduxjs/toolkit';
import { format, subDays } from 'date-fns';

function toApiDate(date) {
	return format(date, 'yyyy-MM-dd');
}

const today = new Date();
const defaultStart = subDays(today, 27);

const initialState = {
	startDate: toApiDate(defaultStart),
	endDate: toApiDate(today),
};

const dateRangeSlice = createSlice({
	name: 'dateRange',
	initialState,
	reducers: {
		setDateRange(state, action) {
			state.startDate = action.payload.startDate;
			state.endDate = action.payload.endDate;
		},
	},
});

export const { setDateRange } = dateRangeSlice.actions;

export const selectDateRange = (state) => state.dateRange;

export const selectDateRangeParams = createSelector(
	[selectDateRange],
	(dateRange) => ({
		date_from: dateRange.startDate,
		date_to: dateRange.endDate,
	})
);

export default dateRangeSlice.reducer;
