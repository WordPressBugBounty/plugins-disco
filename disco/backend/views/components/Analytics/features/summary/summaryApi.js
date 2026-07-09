import { analyticsApi } from '../api/analyticsApi';

export const summaryApi = analyticsApi.injectEndpoints({
	endpoints: (builder) => ({
		// GET /analytics/summary
		getSummary: builder.query({
			query: ({ date_from, date_to } = {}) => ({
				url: '/summary',
				params: { date_from, date_to },
			}),
		}),

		// GET /analytics/revenue-chart
		getRevenueChart: builder.query({
			query: ({ date_from, date_to } = {}) => ({
				url: '/revenue-chart',
				params: { date_from, date_to },
			}),
		}),

		// GET /analytics/intents-performance
		getIntentsPerformance: builder.query({
			query: ({ date_from, date_to } = {}) => ({
				url: '/intents-performance',
				params: { date_from, date_to },
			}),
		}),
	}),
});

export const {
	useGetSummaryQuery,
	useGetRevenueChartQuery,
	useGetIntentsPerformanceQuery,
} = summaryApi;
