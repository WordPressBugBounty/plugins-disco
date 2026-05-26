import { apiSlice } from '../api/apiSlice';

export const imageUploadApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		uploadImage: builder.mutation({
			query: ({ file, type }) => {
				const formData = new FormData();
				formData.append('image', file);
				formData.append('type', type);
				return {
					url: 'image-upload',
					method: 'POST',
					body: formData,
				};
			},
			invalidatesTags: (result, error, { type }) => [
				{ type: 'UploadedImages', id: type },
			],
		}),
		deleteImage: builder.mutation({
			query: (id) => ({
				url: `image-upload/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['UploadedImages'],
		}),
		getUploadedImages: builder.query({
			query: (type) => `image-upload/${type}`,
			providesTags: (result, error, type) => [
				{ type: 'UploadedImages', id: type },
			],
		}),
	}),
});

export const {
	useUploadImageMutation,
	useDeleteImageMutation,
	useGetUploadedImagesQuery,
} = imageUploadApi;
