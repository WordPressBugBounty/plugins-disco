import { analyticsApi } from '../api/analyticsApi';

export const customersApi = analyticsApi.injectEndpoints({
	endpoints: (builder) => ({
		// GET /analytics/customers
		getCustomers: builder.query({
			query: ({
				date_from,
				date_to,
				search,
				sort_by = 'total_spent',
				order = 'asc',
				campaign_id,
				order_id,
				page = 1,
				limit = 10,
			} = {}) => ({
				url: '/customers',
				params: { date_from, date_to, search, sort_by, order, campaign_id, order_id, page, limit },
			}),
		}),

		// GET /analytics/customers/{id}
		getCustomer: builder.query({
			query: ({ id, date_from, date_to }) => ({
				url: `/customers/${id}`,
				params: { date_from, date_to },
			}),
		}),
	}),
});

export const {
	useGetCustomersQuery,
	useGetCustomerQuery,
} = customersApi;
