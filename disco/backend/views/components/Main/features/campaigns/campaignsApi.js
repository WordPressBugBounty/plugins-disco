import { apiSlice } from './../api/apiSlice';

export const campaignsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCampaigns: builder.query({
			query: () => `campaigns`,
			transformResponse: (res) =>
				res.sort((a, b) => Number(b.priority) - Number(a.priority)),
			providesTags: ['Campaigns'],
		}),
		getCampaign: builder.query({
			query: (id) => `campaigns/${id}`,
			providesTags: ['Campaign'],
		}),
		addCampaign: builder.mutation({
			query: (data) => ({
				url: 'campaigns',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Campaigns'],
		}),
		deleteCampaign: builder.mutation({
			query: (id) => ({
				url: `campaigns/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Campaigns'],
		}),
		patchCampaign: builder.mutation({
			query: ({ id, data }) => ({
				url: `campaigns/${id}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: ['Campaigns'],
		}),
		updateCampaign: builder.mutation({
			query: ({ id, data }) => ({
				url: `campaigns/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Campaigns', 'Campaign'],
		}),
	}),
});

export const {
	useGetCampaignsQuery,
	useGetCampaignQuery,
	useAddCampaignMutation,
	useDeleteCampaignMutation,
	usePatchCampaignMutation,
	useUpdateCampaignMutation,
} = campaignsApi;
