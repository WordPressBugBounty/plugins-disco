import { analyticsApi } from '../api/analyticsApi';

export const campaignsApi = analyticsApi.injectEndpoints({
	endpoints: (builder) => ({
		// GET /analytics/campaigns
		getCampaigns: builder.query({
			query: ({
				date_from,
				date_to,
				search,
				customer_id,
				sort_by = 'revenue',
				order = 'desc',
				page = 1,
				limit = 10,
			} = {}) => ({
				url: '/campaigns',
				params: { date_from, date_to, search, customer_id, sort_by, order, page, limit },
			}),
		}),

		// GET /analytics/campaigns/{id}
		getCampaign: builder.query({
			query: ({ id, date_from, date_to }) => ({
				url: `/campaigns/${id}`,
				params: { date_from, date_to },
			}),
		}),
	}),
});

export const {
	useGetCampaignsQuery,
	useGetCampaignQuery,
} = campaignsApi;
