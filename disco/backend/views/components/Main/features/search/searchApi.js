import { buildQueryUrl } from '../../utilities/utilities';
import { apiSlice } from '../api/apiSlice';

export const searchApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query({
			query: (query) =>
				buildQueryUrl('search/product', `search=${query}`),
		}),
		getTags: builder.query({
			query: (query) => buildQueryUrl('search/tag', `search=${query}`),
		}),
		getSearchItem: builder.query({
			query: ({ endpoint, searchQuery }) => {
				const [path, query = ''] = endpoint.split('?');
				return buildQueryUrl(path, `${query}${searchQuery}`);
			},
		}),
	}),
});

export const { useGetProductsQuery, useGetTagsQuery, useGetSearchItemQuery } =
	searchApi;
