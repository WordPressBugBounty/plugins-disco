import { apiSlice } from './../api/apiSlice';

export const campaignsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCampaigns: builder.query({
			queryFn: async (arg, api, extraOptions, fetchWithBQ) => {
				const result = await fetchWithBQ('campaigns');

				// the REST API responds 404 when no campaign exists yet
				if (
					result.error?.data?.code === 'rest_campaign_not_available'
				) {
					return { data: [] };
				}

				if (result.error) {
					return { error: result.error };
				}

				return {
					data: Array.isArray(result.data)
						? result.data.sort(
								(a, b) =>
									Number(b.priority) - Number(a.priority)
						  )
						: [],
				};
			},
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
