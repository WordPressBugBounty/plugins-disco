import { analyticsApi } from '../api/analyticsApi';

export const ordersApi = analyticsApi.injectEndpoints({
	endpoints: (builder) => ({
		// GET /analytics/orders
		getOrders: builder.query({
			query: ({
				date_from,
				date_to,
				search,
				sort_by = 'revenue',
				order = 'desc',
				campaign_id,
				customer_id,
				page = 1,
				limit = 10,
			} = {}) => ({
				url: '/orders',
				params: { date_from, date_to, search, sort_by, order, campaign_id, customer_id, page, limit },
			}),
		}),

		// GET /analytics/orders/{id}
		getOrder: builder.query({
			query: ({ id }) => `/orders/${id}`,
		}),
	}),
});

export const {
	useGetOrdersQuery,
	useGetOrderQuery,
} = ordersApi;
