import {setCatagory, setSubCatagory} from '../../store/catagories/Catagories';
import {api} from '../api';

export const CategoriesApi = api.injectEndpoints({
  endpoints: builder => ({
    getCatagories: builder.query({
      query: params => {
        return {
          url: `category-list?${params}`,
          method: 'GET',
        };
      },
      // transformResponse: result => result,
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        try {
          const response = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            dispatch(setCatagory(response?.data?.categories));
          }
        } catch (e) {
          console.log('error=======', e);
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {useLazyGetCatagoriesQuery} = CategoriesApi;
