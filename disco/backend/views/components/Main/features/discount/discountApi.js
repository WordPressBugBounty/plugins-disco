import { apiSlice } from './../api/apiSlice';
import {buildQueryUrl} from "../../utilities/utilities";

export const discountApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getFilters: builder.query({
			query: () => buildQueryUrl('dropdown/', 'search=filters'),
		}),
		getConditions: builder.query({
			query: () => buildQueryUrl('dropdown/', 'search=conditions'),
		}),
		getDiscountIntents: builder.query({
			query: () => buildQueryUrl('dropdown/', 'search=discount_intents'),
		}),
		getDiscountTypes: builder.query({
			query: () => buildQueryUrl('dropdown/', 'search=discount_types'),
		}),
		getDiscountMethods: builder.query({
			query: () => buildQueryUrl('dropdown/', 'search=discount_methods'),
		}),
		getWhatGetsDiscount: builder.query({
			query: () => buildQueryUrl('dropdown/', 'search=products'),
		}),
		getDiscountBasedOn: builder.query({
			query: () => buildQueryUrl('dropdown/', 'search=discount_based_on'),
		}),
		getBOGOTypes: builder.query({
			query: () => buildQueryUrl('dropdown/', 'search=bogo_types'),
		}),
	}),
});

export const {
	useGetFiltersQuery,
	useGetConditionsQuery,
	useGetDiscountIntentsQuery,
	useGetDiscountTypesQuery,
	useGetDiscountMethodsQuery,
	useGetWhatGetsDiscountQuery,
	useGetDiscountBasedOnQuery,
	useGetBOGOTypesQuery,
} = discountApi;
