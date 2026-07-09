import dateRangeReducer, {
	selectDateRange,
	selectDateRangeParams,
	setDateRange,
} from '../../features/dateRange/dateRangeSlice';

describe('dateRangeSlice', () => {
	describe('Reducer', () => {
		it('has correct initial state with defaults', () => {
			const state = dateRangeReducer(undefined, { type: 'init' });

			expect(state).toHaveProperty('startDate');
			expect(state).toHaveProperty('endDate');
			// Should be valid date strings
			expect(state.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
			expect(state.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});

		it('sets date range with setDateRange action', () => {
			const state = dateRangeReducer(
				undefined,
				setDateRange({
					startDate: '2025-01-01',
					endDate: '2025-01-31',
				})
			);

			expect(state.startDate).toBe('2025-01-01');
			expect(state.endDate).toBe('2025-01-31');
		});

		it('overwrites previous date range', () => {
			const state1 = dateRangeReducer(
				undefined,
				setDateRange({
					startDate: '2025-01-01',
					endDate: '2025-01-31',
				})
			);

			const state2 = dateRangeReducer(
				state1,
				setDateRange({
					startDate: '2025-06-01',
					endDate: '2025-06-30',
				})
			);

			expect(state2.startDate).toBe('2025-06-01');
			expect(state2.endDate).toBe('2025-06-30');
		});
	});

	describe('Selectors', () => {
		const mockState = {
			dateRange: {
				startDate: '2025-03-01',
				endDate: '2025-03-31',
			},
		};

		it('selectDateRange returns the date range state', () => {
			const result = selectDateRange(mockState);
			expect(result).toEqual({
				startDate: '2025-03-01',
				endDate: '2025-03-31',
			});
		});

		it('selectDateRangeParams returns API-formatted params', () => {
			const result = selectDateRangeParams(mockState);
			expect(result).toEqual({
				date_from: '2025-03-01',
				date_to: '2025-03-31',
			});
		});
	});

	describe('Default range', () => {
		it('default end date is today', () => {
			const state = dateRangeReducer(undefined, { type: 'init' });
			const today = new Date().toISOString().split('T')[0];
			expect(state.endDate).toBe(today);
		});

		it('default start date is 27 days before today', () => {
			const state = dateRangeReducer(undefined, { type: 'init' });
			const start = new Date();
			start.setDate(start.getDate() - 27);
			const expected = start.toISOString().split('T')[0];
			expect(state.startDate).toBe(expected);
		});
	});
});
