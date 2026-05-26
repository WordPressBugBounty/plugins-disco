import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: DISCO.json_url,
		prepareHeaders: (headers) => {
			headers.set('X-WP-Nonce', DISCO.rest_nonce);
		},
	}),
	tagTypes: ['Campaigns', 'Campaign', 'Settings', 'UploadedImages'],
	endpoints: () => ({}),
});
