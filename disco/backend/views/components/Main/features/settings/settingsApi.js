import { apiSlice } from './../api/apiSlice';

export const settingsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSettings: builder.query({
			query: () => `settings`,
			providesTags: ['Settings'],
		}),
		updateSettings: builder.mutation({
			query: (data) => ({
				url: `settings`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Settings'],
		}),
	}),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
