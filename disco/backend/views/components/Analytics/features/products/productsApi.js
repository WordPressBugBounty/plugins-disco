import { analyticsApi } from '../api/analyticsApi';

export const productsApi = analyticsApi.injectEndpoints({
	endpoints: (builder) => ({
		// GET /analytics/products
		getProducts: builder.query({
			query: ({
				date_from,
				date_to,
				search,
				sort_by = 'revenue',
				order = 'desc',
				campaign_id,
				customer_id,
				order_id,
				page = 1,
				limit = 10,
			} = {}) => ({
				url: '/products',
				params: { date_from, date_to, search, sort_by, order, campaign_id, customer_id, order_id, page, limit },
			}),
		}),

		// GET /analytics/products/{id}
		getProduct: builder.query({
			query: ({ id, date_from, date_to }) => ({
				url: `/products/${id}`,
				params: { date_from, date_to },
			}),
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductQuery,
} = productsApi;
