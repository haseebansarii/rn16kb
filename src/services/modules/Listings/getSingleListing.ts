// import { showMessage } from 'react-native-flash-message';
import {api} from '../../api';
import {editSingleListingData, singleListing} from '../../../store/Listings';
import {toastDangerMessage, toastSuccessMessage} from '../../../utils/helpers';

export const userApi: any = api.injectEndpoints({
  endpoints: build => ({
    singleListing: build.query<any, any>({
      query: payload => {
        return {
          url: `listing/${payload}`,
          method: 'GET',
        };
      },
      providesTags: [{type: 'getList', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            dispatch(editSingleListingData(response?.data));
          }
        } catch (error: any) {
          console.log('single listing api data error ...', error);
        }
      },
    }),
    updateListing: build.mutation<any, any>({
      query: payload => {
        console.log('>>`listing/${payload.id}` ', `listing/${payload.id}`);

        console.log('>>>payload.body ', payload.body);

        return {
          url: `listing/${payload.id}`,
          method: 'PUT',
          body: payload.body,
        };
      },
      invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            // toastSuccessMessage('Listing updated successfully');
          }
        } catch (error: any) {
          console.log(
            'update listing api data error ...',
            JSON.stringify(error),
          );
          if (error?.error?.data?.message) {
            toastDangerMessage(
              `${error?.error?.data?.message} ${
                error?.error?.data?.errors?.[0] || ''
              }`,
            );
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    updateListingStatus: build.mutation<any, any>({
      query: payload => {
        return {
          url: `listing-status/${payload.id}`,
          method: 'PUT',
          body: payload.body,
        };
      },
      invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            toastSuccessMessage('Listing updated successfully');
          }
        } catch (error: any) {
          console.log('update listing status error>>', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error?.error?.data?.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    updateViews: build.mutation<any, string>({
      query: id => ({
        url: `listing-views/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            console.log('Views updated successfully');
          }
        } catch (error: any) {
          console.log('updateViews error >>', error);
          toastDangerMessage('Something went wrong updating views');
        }
      },
    }),
    markListingAsSold: build.mutation<any, any>({
      query: payload => {
        return {
          url: `listing/${payload.id}/sold`,
          method: 'POST',
        };
      },
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            toastSuccessMessage('Listing marked as sold successfully');
          }
        } catch (error: any) {
          if (error?.error?.data?.message) {
            toastDangerMessage(error?.error?.data?.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
  }),

  overrideExisting: true,
});

export const {
  useSingleListingQuery,
  useLazySingleListingQuery,
  useUpdateListingMutation,
  useUpdateListingStatusMutation,
  useUpdateViewsMutation,
  useMarkListingAsSoldMutation,
} = userApi;
