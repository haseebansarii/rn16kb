// import { showMessage } from 'react-native-flash-message';
import {api} from '../../api';
import {
  setlistData,
  setlistDataExtra,
  setlistDataIbuy,
  setlistFilters,
} from '../../../store/Listings';
import {customSplitArray} from '../../../utils/helpers';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    getListData: build.query<any, any>({
      query: payload => {
        let url =
          payload.filters === true
            ? `listing?&pageName=${payload.pageName}${
                payload.searchFilters && payload.searchFilters
              }`
            : !payload.filterType
            ? `${
                payload.pageName === 'iwatch' ? 'favourite' : 'listing'
              }?&pageName=${payload.pageName}`
            : `${
                payload.pageName === 'iwatch' ? 'favourite' : 'listing'
              }?&pageName=${payload.pageName}&filter_type=${
                payload.filterType
              }`;

        if (payload.pageName !== 'isell') {
          url =
            url +
            `&skip=${payload?.skip > 0 ? payload?.skip : 0}&limit=${
              payload?.limit > 30 ? payload?.limit : 30
            }`;
        }

        console.log('>>>url 00 ', url);

        return {
          url: url,
          method: 'GET',
        };
      },
      providesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled, getState}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            console.log(
              `Successfully listing api called ${arg?.pageName} page ...`,
            );
            // console.log(
            //   '>>> response?.data 66 ',
            //   JSON.stringify(response?.data),
            // );

            // dispatch(setlistData(response?.data));
            const currentListData = getState()?.list?.listData?.items;
            if (arg?.skip > 0) {
              const mergedList = currentListData.concat(response?.data?.items); // More efficient than spread
              const updatedListData = {
                items: mergedList,
                pagination: response?.data?.pagination,
              };
              dispatch(setlistData(updatedListData));
            } else {
              // If no existing data, simply add the new notifications
              dispatch(setlistData(response?.data));
            }
          }
        } catch (error: any) {
          //  console.log('reports error', error);
          if (error?.error?.data?.message) {
            // showMessage({
            //   message: error.error.data.message,
            //   type: 'danger',
            // });
          } else {
            // showMessage({
            //   message: 'Something went wrong',
            //   type: 'danger',
            // });
          }
        }
      },
    }),
    getListDataIbuy: build.query<any, any>({
      query: payload => {
        let url =
          payload.filters === true
            ? `listing?&pageName=${payload.pageName}${
                payload.searchFilters && payload.searchFilters
              }`
            : !payload.filterType
            ? `${
                payload.pageName === 'iwatch' ? 'favourite' : 'listing'
              }?&pageName=${payload.pageName}`
            : `${
                payload.pageName === 'iwatch' ? 'favourite' : 'listing'
              }?&pageName=${payload.pageName}&filter_type=${
                payload.filterType
              }`;

        if (payload.pageName !== 'isell') {
          url =
            url +
            `&skip=${payload?.skip > 0 ? payload?.skip : 0}&limit=${
              payload?.limit > 30 ? payload?.limit : 30
            }`;
        }

        console.log('>>>url 00 ', url);

        return {
          url: url,
          method: 'GET',
        };
      },
      providesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled, getState}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            console.log(
              `Successfully listing api called ${arg?.pageName} page ...`,
            );
            // console.log(
            //   '>>> response?.data 66 ',
            //   JSON.stringify(response?.data),
            // );

            // dispatch(setlistData(response?.data));
            const currentListData = getState()?.list?.listDataIbuy?.items;
            if (arg?.skip > 0) {
              // Append the new notifications to the existing ones
              // if (arg?.skip > 60) {
              //   const [firstPart, secondPart] = customSplitArray(
              //     currentListData,
              //     arg?.limit || 30,
              //   );
              //   console.log('>>> firstPart 22 ', firstPart?.length);
              //   console.log('>>> secondPart 33 ', secondPart?.length);
              //   const updatedListData = {
              //     items: [...secondPart, ...response?.data?.items],
              //     pagination: response?.data?.pagination,
              //   };
              //   console.log(
              //     '>>>updatedListData ',
              //     updatedListData?.items?.length,
              //   );

              //   dispatch(setlistDataIbuy(updatedListData));

              //   const currentListDataExtra =
              //     getState()?.list?.listDataExtra?.items || [];
              //   const updatedListDataExtra = {
              //     items: [...currentListDataExtra, ...firstPart],
              //     pagination: response?.data?.pagination,
              //   };
              //   console.log(
              //     '>>>updatedListDataExtra ',
              //     updatedListDataExtra?.items?.length,
              //   );
              //   dispatch(setlistDataExtra(updatedListDataExtra));
              // } else {
              const mergedList = currentListData.concat(response?.data?.items); // More efficient than spread
              const updatedListData = {
                items: mergedList,
                pagination: response?.data?.pagination,
              };

              dispatch(setlistDataIbuy(updatedListData));
              // }
            } else {
              // If no existing data, simply add the new notifications
              dispatch(setlistDataIbuy(response?.data));
            }
          }
        } catch (error: any) {
          //  console.log('reports error', error);
          if (error?.error?.data?.message) {
            // showMessage({
            //   message: error.error.data.message,
            //   type: 'danger',
            // });
          } else {
            // showMessage({
            //   message: 'Something went wrong',
            //   type: 'danger',
            // });
          }
        }
      },
    }),
    getSingleListing: build.query<any, any>({
      query: payload => {
        return {
          url: `listing/${payload}`,
          method: 'GET',
        };
      },
      providesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            //console.log('success Single listing api');
            // dispatch(setlistFilters())
          }
        } catch (error: any) {
          //   console.log('single listing api data error ...', error);
        }
      },
    }),
    getListingFilters: build.query<any, any>({
      query: payload => {
        return {
          url: `filter-list`,
          method: 'GET',
        };
      },
      // providesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          if (response?.meta?.response?.status == 200) {
            dispatch(setlistFilters(response?.data?.filters || []));
          }
        } catch (error: any) {
          //   console.log('single listing api data error ...', error);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetListDataQuery,
  useLazyGetListDataIbuyQuery,
  useLazyGetSingleListingQuery,
  useLazyGetListingFiltersQuery,
} = userApi;
