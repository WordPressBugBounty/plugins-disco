/* eslint-disable no-undef */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
	baseUrl: DISCO.json_url + '/analytics',
	prepareHeaders: (headers) => {
		headers.set('X-WP-Nonce', DISCO.rest_nonce);
	},
});

const baseQuery = (args, api, extraOptions) => {
	if (args && typeof args === 'object' && args.params) {
		const { params, url, ...rest } = args;
		const stripped = Object.fromEntries(
			Object.entries(params).filter(([, v]) => v !== undefined)
		);
		const queryString = new URLSearchParams(stripped).toString();
		const separator = DISCO.is_pretty_url ? '?' : '&';
		args = {
			...rest,
			url: queryString ? `${url}${separator}${queryString}` : url,
		};
	}
	return rawBaseQuery(args, api, extraOptions);
};

export const analyticsApi = createApi({
	reducerPath: 'analyticsApi',
	baseQuery,
	endpoints: () => ({}),
});
