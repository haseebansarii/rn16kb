import {
  setProductsReport,
  storeUserReports,
} from '../../store/profileTab/profileTabSlice';
import {toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const reportsUser = (any = api.injectEndpoints({
  endpoints: build => ({
    getReportsUser: build.query<any, any>({
      query: () => {
        return {
          url: `user-reports`,
          method: 'GET',
        };
      },
      // providesTags: ['get-reports'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          dispatch(storeUserReports(response?.data?.stats || {}));
        } catch (error: any) {
          // console.log('getReportsUser error', error);
        }
      },
    }),
    getReportProducts: build.query<any, any>({
      query: payload => {
        let url = `report?skip=${payload?.skip ? payload?.skip : 0}&limit=20`;
        if (payload?.fromDate) {
          url = url + '&from_date=' + payload.fromDate;
        }
        if (payload?.toDate) {
          url = url + '&to_date=' + payload.toDate;
        }
        console.log('url====getReportProducts=====', url);
        return {
          url: url,
          method: 'GET',
        };
      },
      // providesTags: ['get-reports'],
      async onQueryStarted(arg, {dispatch, queryFulfilled, getState}) {
        try {
          const response: any = await queryFulfilled;
          // console.log(
          //   'reportProducts response ::::',
          //   JSON.stringify(response?.data),
          // );
          if (response?.meta?.response?.status == 200) {
            // dispatch(setlistData(response?.data));

            if (arg?.skip > 0) {
              // Append the new notifications to the existing ones
              const currentListData =
                getState()?.profileTab?.productsReport?.items;
              const updatedListData = {
                items: [...currentListData, ...response?.data?.items],
                pagination: response?.data?.pagination,
              };
              dispatch(setProductsReport(updatedListData || {}));
            } else {
              // If no existing data, simply add the new notifications
              dispatch(setProductsReport(response?.data || {}));
            }
          }
        } catch (error: any) {
          //console.log('getReportsUser error', error);
        }
      },
    }),
    contactUsPost: build.mutation<any, any>({
      query: body => {
        return {
          url: `contact-us`,
          method: 'POST',
          body: body,
        };
      },
      // invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response.meta.response.status == 200) {
            toastSuccessMessage(response?.data?.message);
          }
        } catch (error: any) {
          if (error?.error?.data?.message) {
            toast.show(error.error.data.message);
          } else {
            toast.show('Something went wrong');
          }
        }
      },
    }),
  }),
  overrideExisting: true,
}));

export const {
  useLazyGetReportsUserQuery,
  useLazyGetReportProductsQuery,
  useContactUsPostMutation,
} = reportsUser;
