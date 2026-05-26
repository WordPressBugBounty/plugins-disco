import { apiSlice } from '../api/apiSlice';

export const searchApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query({
			query: (query) => `search/product?search=${query}`,
		}),
		getTags: builder.query({
			query: (query) => `search/tag?search=${query}`,
		}),
		getSearchItem: builder.query({
			query: ({ endpoint, searchQuery }) => `${endpoint}${searchQuery}`,
		}),
	}),
});

export const { useGetProductsQuery, useGetTagsQuery, useGetSearchItemQuery } =
	searchApi;
