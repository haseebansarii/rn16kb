import {api} from '../../api';

export const homeListingApi = api.injectEndpoints({
  endpoints: build => ({
    searchList: build.query<any, any>({
      query: payload => {
        return {
          url: `listing${payload}`,
          method: 'GET',
        };
      },
      providesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, getState, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            // console.log('success response home listing get api');
          }
        } catch (error) {
          console.log('error====', error);
        }
      },
    }),
    // countryList: build.query<any, any>({
    //   query: () => {
    //     return {
    //       url: `country`,
    //       method: 'GET',
    //     };
    //   },
    //   //   providesTags: [{type: 'Listing', id: 'LIST'}],
    //   async onQueryStarted(arg, {dispatch, getState, queryFulfilled}) {
    //     try {
    //       const response: any = await queryFulfilled;
    //       if (response?.meta?.response?.status === 200) {
    //         // console.log('success response home country get api', response.data);
    //         dispatch(setCountryList(response?.data?.items));
    //       }
    //     } catch (error) {
    //       console.log('error====', error);
    //     }
    //   },
    // }),
  }),
  overrideExisting: true,
});

export const {useLazySearchListQuery} = homeListingApi;
