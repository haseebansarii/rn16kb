import {Alert} from 'react-native';
import {navigationRef} from '../../navigators/utils';
import {setUserData} from '../../store/auth/AuthSlice';
type TSignup = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  userName: string;
  confirmPassword: string;
  status: string;
};

import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const SignUp = api.injectEndpoints({
  endpoints: builder => ({
    UpdateMcDealership: builder.mutation({
      query: payload => {
        //motorcentral_dealership
        return {
          url: `update-mc-dealership/${payload.id}`,
          method: 'PUT',
          body: payload.body,
        };
      },
      // transformResponse: result => result,
      invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        //  console.log('args======', args);
        try {
          const response: any = await queryFulfilled;
          console.log(
            '>>> response UpdateMcDealership ',
            JSON.stringify(response?.data?.user),
          );
          if (response?.meta?.response?.status == 200) {
            // dispatch(setUserData(response?.data?.user))
            toastSuccessMessage('Dealership Id udpated successfully');
          }
        } catch (e: any) {
          if (e?.error?.data?.errors && e?.error?.data?.errors[0]) {
            toastDangerMessage(e?.error?.data?.errors[0]);
          } else {
            toastDangerMessage(e?.error?.data?.message || e?.error?.error);
          }
        }
      },
    }),
    UploadMotorcentralRecords: builder.mutation({
      query: payload => {
        //motorcentral_dealership
        return {
          url: `upload-motorcentral-records`,
          method: 'POST',
          body: payload,
        };
      },
      // transformResponse: result => result,
      // invalidatesTags: ["getUserDataProfile"],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        //  console.log('args======', args);
        try {
          const response: any = await queryFulfilled;
          console.log(
            '>>> response UploadMotorcentralRecords ',
            JSON.stringify(response?.data),
          );
          if (response?.meta?.response?.status == 200) {
            // dispatch(setUserData(response?.data?.user))
            toastSuccessMessage(response?.data?.message);
          }
        } catch (e: any) {
          console.log('>> e UploadMotorcentralRecords ', e);

          if (e?.error?.data?.errors && e?.error?.data?.errors[0]) {
            toastDangerMessage(e?.error?.data?.errors[0]);
          } else {
            toastDangerMessage(e?.error?.data?.message || e?.error?.error);
          }
        }
      },
    }),
    Fetchmotorcentral: builder.query({
      query: (payload: any) => {
        return {
          url: 'fetch-motorcentral-records',
          method: 'GET',
        };
      },

      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        try {
          const response: any = await queryFulfilled;
          console.log(
            '>>> response Fetchmotorcentral ',
            JSON.stringify(response),
          );
          if (response?.meta?.response?.status == 200) {
            // dispatch(setUserData(response?.data?.user))
            toastSuccessMessage(
              response?.data?.message || 'Something went wrong!',
            );
          }
        } catch (e: any) {
          console.log(e, 'error Fetchmotorcentral ');
          console.log('>>>e?.error?.data?.message ', e?.error?.data?.message);
          if (e?.error?.data?.errors && e?.error?.data?.errors[0]) {
            toastDangerMessage(e?.error?.data?.errors[0]);
          } else {
            toastDangerMessage(e?.error?.data?.message || e?.error?.error);
          }
        }
      },
    }),
    GetmotorCentralRecord: builder.query({
      query: () => {
        return {
          url: 'motorcentral-record',
          method: 'GET',
        };
      },
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        try {
          console.log('>>>>>> response GetmotorCentralRecord 333 00 ');

          const response: any = await queryFulfilled;
          console.log(
            '>>> response GetmotorCentralRecord 333 ',
            JSON.stringify(response),
          );
          return response;
        } catch (e: any) {
          console.log(e, 'error GetmotorCentralRecord ');
          console.log('>>>e?.error?.data?.message ', e?.error?.data?.message);
          if (e?.error?.data?.errors && e?.error?.data?.errors[0]) {
            toastDangerMessage(e?.error?.data?.errors[0]);
          } else {
            toastDangerMessage(e?.error?.data?.message || e?.error?.error);
          }
          return e;
        }
      },
    }),
    DeleteMotorcentralRecords: builder.mutation({
      query: payload => {
        return {
          url: `delete-motorcentral-records`,
          method: 'POST',
          body: payload,
        };
      },
      // transformResponse: result => result,
      // invalidatesTags: ["getUserDataProfile"],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        //  console.log('args======', args);
        try {
          const response: any = await queryFulfilled;
          console.log(
            '>>> response DeleteMotorcentralRecords ',
            JSON.stringify(response?.data),
          );
          if (response?.meta?.response?.status == 200) {
            // dispatch(setUserData(response?.data?.user))
            Alert.alert('Success', response?.data?.message);
          }
        } catch (e: any) {
          console.log('>> e DeleteMotorcentralRecords ', e);

          if (e?.error?.data?.errors && e?.error?.data?.errors[0]) {
            Alert.alert('Error', e?.error?.data?.errors[0]);
          } else {
            console.log(
              '>>> test 00 ',
              e?.error?.data?.message || e?.error?.error,
            );

            Alert.alert('Error', e?.error?.data?.message || e?.error?.error);
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {
  useLazyFetchmotorcentralQuery,
  useUpdateMcDealershipMutation,
  useLazyGetmotorCentralRecordQuery,
  useUploadMotorcentralRecordsMutation,
  useDeleteMotorcentralRecordsMutation,
} = SignUp;
