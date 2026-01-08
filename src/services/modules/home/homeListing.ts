import {
  homeListing,
  setCountryList,
  setLocationData,
  setLocationSearchData,
} from '../../../store/home/ListingSlice';
import {toastDangerMessage} from '../../../utils/helpers';
import {api} from '../../api';

export const homeListingApi = api.injectEndpoints({
  endpoints: build => ({
    homeListing: build.query<any, any>({
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
            console.log('success response home listing get api');
            dispatch(homeListing(response?.data?.items));
          }
        } catch (error) {
          console.log('error==== 11', error);
        }
      },
    }),
    countryList: build.query<any, any>({
      query: () => {
        return {
          url: `country`,
          method: 'GET',
        };
      },
      //   providesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, getState, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            // console.log('success response home country get api', response.data);
            dispatch(setCountryList(response?.data?.items));
          }
        } catch (error) {
          console.log('error==== 22 ', error);
        }
      },
    }),
    geoCodeApi: build.query<any, any>({
      query: payload => {
        console.log('payload===== 8888 ====', payload);
        return {
          url: `get-geocoded-address?key=address&value=${payload}`,
          method: 'GET',
        };
      },
      providesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, getState, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            console.log(
              'geoCode=========',
              JSON.stringify(response.data.results[0].geometry.location),
            );
            console.log(
              '>> test 33 44 ',
              response.data.results[0].geometry.location,
            );

            dispatch(
              setLocationData(response.data.results[0].geometry.location),
            );
          }
        } catch (error) {
          //toastDangerMessage(error.error.data.message);
          console.log('error==== 33', error);
        }
      },
    }),
    getNearByListing: build.query<any, any>({
      query: payload => {
        let url = `listing${payload}`;
        console.log('>>>> url 44 ', url);

        return {
          url: url,
          method: 'GET',
        };
      },
      //   providesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, getState, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            // console.log(
            //   'getNearByListing=========',
            //   JSON.stringify(response.data.items),
            // );
            console.log(
              'success response getNearByListing',
              response?.data?.items?.length,
            );
            dispatch(setLocationSearchData(response?.data?.items));
          }
        } catch (error) {
          console.log('error==== 44', error);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useHomeListingQuery,
  useLazyHomeListingQuery,
  useLazyCountryListQuery,
  useLazyGeoCodeApiQuery,
  useLazyGetNearByListingQuery,
} = homeListingApi;
