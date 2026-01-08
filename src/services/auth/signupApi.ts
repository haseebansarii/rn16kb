import {navigationRef} from './../../navigators/utils';
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
type TSignupUpdate = {
  body: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    userName: string;
    confirmPassword: string;
    status: string;
  };
  id: string;
};
type TCheckSignupToken = {
  email: string;
  token: string;
};
import {
  setCongratulation,
  setSignUpUser,
  storeSubscriptionPlans,
} from '../../store/SignUp';
import {
  setIsAppUpdate,
  setUserData,
  storeMobileSettings,
  storeToken,
} from '../../store/auth/AuthSlice';

import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';
import {APP_VERSION, APP_VERSION_ANDROID, APP_VERSION_IOS} from '../../config';
import {storeSubscriptionPlansAccount} from '../../store/accountSettings/accountSettingsSlice';
import {Platform} from 'react-native';

type TLogin = {
  email: string;
  password: string;
  salt?: any;
  // firebase_token: string;
};
export const SignUp = api.injectEndpoints({
  endpoints: builder => ({
    LoginApi: builder.mutation({
      query: (payload: TLogin) => {
        return {
          url: 'login',
          method: 'POST',
          body: payload,
        };
      },

      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        // console.log('args======', args);
        try {
          const response = await queryFulfilled;
          console.log(response);
          if (response.meta.response.status == 200) {
            console.log('login api response', response?.data);
            dispatch(setUserData(response?.data?.user));
            dispatch(storeToken(response?.data?.token));
            toastSuccessMessage('User logged in successfully.');
          }
        } catch (error: any) {
          console.log('login error ==>', error?.error?.data);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),

    SignUpBasic: builder.mutation({
      query: (payload: TSignup) => {
        return {
          url: 'register-basic',
          method: 'POST',
          body: payload,
        };
      },
      // transformResponse: result => result,
      // invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        //  console.log('args======', args);
        try {
          const response: any = await queryFulfilled;

          if (response?.meta?.response?.status == 200) {
            toastSuccessMessage(response?.data?.message);
          }
        } catch (e: any) {
          if (
            e?.error?.data?.errors &&
            e?.error?.data?.errors[0] == 'Field {email} must be a unique value.'
          ) {
            toastDangerMessage('Email already exists');
          } else {
            toastDangerMessage(e?.error?.data?.message || e?.error?.error);
          }
        }
      },
    }),
    SignUpBasicUpdate: builder.mutation({
      query: (payload: TSignupUpdate) => {
        return {
          url: `register-basic/${payload.id}`,
          method: 'PUT',
          body: payload.body,
        };
      },
      // transformResponse: result => result,
      // invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        //  console.log('args======', args);
        try {
          const response: any = await queryFulfilled;

          if (response?.meta?.response?.status == 200) {
            toastSuccessMessage(response?.data?.message);
          }
        } catch (e: any) {
          toastDangerMessage(e?.error?.data?.message);
        }
      },
    }),

    GetCountryName: builder.query({
      query: (payload: any) => {
        return {
          url: payload,
          method: 'GET',
        };
      },

      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        try {
          const response: any = await queryFulfilled;
        } catch (e: any) {
          // console.log(e, 'error getting country name');
        }
      },
    }),

    SignUpComplete: builder.mutation({
      query: data => {
        const {id, ...remainData} = data;

        return {
          url: `register-complete`,
          method: 'POST',
          body: remainData,
        };
      },
      invalidatesTags: ['getUserDataProfile'],
      transformResponse: result => result,
      // invalidatesTags: ['readUser'],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        // const {navigation} = args;

        console.log('querry is fulfilling', args);
        try {
          const response: any = await queryFulfilled;
          console.log(
            '>>> response SignUpComplete  ',
            JSON.stringify(response?.data),
          );

          if (response?.meta?.response?.status == 200) {
            args?.setIsLoading(false);
            if (Platform.OS == 'android') {
              dispatch(setSignUpUser({cong: true}));
              dispatch(setCongratulation(true));
              toastSuccessMessage(response?.data?.message);
              if (response?.data?.token) {
                dispatch(setUserData(response?.data?.user));
                dispatch(storeToken(response?.data?.token));
              }
            } else {
              setTimeout(() => {
                dispatch(setSignUpUser({cong: true}));
                dispatch(setCongratulation(true));
                toastSuccessMessage(response?.data?.message);
                if (response?.data?.token) {
                  dispatch(setUserData(response?.data?.user));
                  dispatch(storeToken(response?.data?.token));
                }
              }, 500);
            }
          }
        } catch (e) {
          if (
            e?.error?.data?.errors &&
            e?.error?.data?.errors[0] == 'Field {email} must be a unique value.'
          ) {
            toastDangerMessage('Email already exists');
          } else {
            toastDangerMessage(
              e?.data?.message ||
                e?.error?.data?.message ||
                'Something went wrong!',
            );
          }
          console.log(e?.error?.data, 'error in sign up complete api ');
        }
      },
    }),
    OTPApi: builder.mutation({
      query: (payload: TCheckSignupToken) => {
        console.log('check token payload  for register ::::: ', payload);
        return {
          url: 'check-token',
          method: 'POST',
          body: payload,
        };
      },

      transformResponse: result => result,
      // invalidatesTags: ['readUser'],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        // const {navigation} = args;

        try {
          const response = await queryFulfilled;
          // console.log(response, 'api response');
          if (response?.meta?.response?.status == 200) {
            toastSuccessMessage(response?.data?.message);
          }
        } catch (e) {
          console.log('OTPApi error=======', JSON.stringify(e));
          toastDangerMessage(e.error.data.message);
        }
      },
    }),

    getSubscriptionPlans: builder.query<any, any>({
      query: payload => {
        return {
          url: `subscription-plan?status=enabled`,
          method: 'GET',
        };
      },
      providesTags: ['getPlans'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          // console.log('>>> response 222 ', JSON.stringify(response));

          dispatch(
            storeSubscriptionPlans(response?.data?.subscription_plans || []),
          );
          dispatch(
            storeSubscriptionPlansAccount(
              response?.data?.subscription_plans || [],
            ),
          );
        } catch (error: any) {
          // console.log('getSubscriptionPlans error', error);
          // if (error?.error?.data?.message) {
          //   showMessage({
          //     message: error.error.data.message,
          //     type: 'danger',
          //   });
          // } else {
          //   showMessage({
          //     message: 'Something went wrong',
          //     type: 'danger',
          //   });
        }
      },
    }),
    getMobileSetting: builder.query<any, any>({
      query: payload => {
        return {
          url: `mobile-setting`,
          method: 'GET',
        };
      },
      // providesTags: ['getSettings'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          console.log(
            '>>> response getMobileSetting 222 ',
            response?.data?.mobile_setting,
          );
          let data = response?.data?.mobile_setting;
          const appVersionObject =
            data && data.find(item => item?.meta_key === 'appVersion');
          let flag =
            appVersionObject?.meta_values &&
            parseInt(appVersionObject?.meta_values || 1) >
              parseInt(APP_VERSION);
          let PlatformCheckObject =
            Platform.OS === 'ios'
              ? data && data.find(item => item?.meta_key === 'appVersionIos')
              : data &&
                data.find(item => item?.meta_key === 'appVersionAndroid');
          let flagPlatform =
            PlatformCheckObject?.meta_values &&
            parseInt(PlatformCheckObject?.meta_values || 0) >
              parseInt(
                Platform.OS === 'ios' ? APP_VERSION_IOS : APP_VERSION_ANDROID,
              );
          dispatch(setIsAppUpdate(flag || flagPlatform));
          dispatch(storeMobileSettings(response?.data?.mobile_setting || []));
        } catch (error: any) {
          console.log('getMobileSetting error', error);
          // if (error?.error?.data?.message) {
          //   showMessage({
          //     message: error.error.data.message,
          //     type: 'danger',
          //   });
          // } else {
          //   showMessage({
          //     message: 'Something went wrong',
          //     type: 'danger',
          //   });
        }
      },
    }),
    resetPassword: builder.mutation({
      query: ({payload, code}: any) => {
        return {
          url: `auth/reset-password/${code}`,
          method: 'POST',
          body: payload,
        };
      },

      async onQueryStarted(arg: any, {dispatch, queryFulfilled}: any) {
        try {
          const response = await queryFulfilled;
          if (response.meta.response.status == 200) {
            toastSuccessMessage(response?.data?.message);
          }
        } catch (error: any) {
          // console.log('resetPassword error ==>', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (payload: any) => {
        return {
          url: 'auth/forget-password',
          method: 'POST',
          body: payload,
        };
      },

      async onQueryStarted(arg: any, {dispatch, queryFulfilled}: any) {
        try {
          const response = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            toastSuccessMessage(response?.data?.message);
          }
        } catch (error: any) {
          // console.log('forgotPassword error ==>', JSON.stringify(error));
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    sendOTP: builder.mutation({
      query: ({payload}: any) => {
        console.log('send otp payload forget password ::::: ', payload);

        return {
          url: 'check-token',
          method: 'POST',
          body: payload,
        };
      },

      async onQueryStarted(arg: any, {dispatch, queryFulfilled}: any) {
        try {
          const response = await queryFulfilled;
          if (response.meta.response.status == 200) {
            toastSuccessMessage(response?.data?.message);
          }
        } catch (error: any) {
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    changePassowrd: builder.mutation({
      query: ({payload}: any) => {
        return {
          url: 'auth/change-password',
          method: 'POST',
          body: payload,
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response = await queryFulfilled;
          if (response.meta.response.status == 200) {
            toastSuccessMessage(response?.data.message);
          }
        } catch (error) {
          // console.log('change password error ==>', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    logoutApi: builder.mutation({
      query: (payload: any) => {
        return {
          url: 'remove-token',
          method: 'POST',
          body: payload,
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response = await queryFulfilled;
          if (response.meta.response.status == 200) {
            toastSuccessMessage(response?.data.message);
          }
        } catch (error) {
          // console.log('logoutApi error ==>', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    resendOTP: builder.mutation({
      query: (payload: any) => {
        console.log('resend otp payload ::::: ', payload);
        return {
          url: 'resend-otp',
          method: 'POST',
          body: payload,
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response = await queryFulfilled;
          if (response.meta.response.status == 200) {
            toastSuccessMessage(response?.data.message);
          }
        } catch (error) {
          // console.log('resend OTP Code error ==>', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    deleteProfile: builder.mutation({
      query: (payload: any) => {
        return {
          url: `user/${payload}`,
          method: 'DELETE',
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response = await queryFulfilled;
          if (response.meta.response.status == 200) {
            toastSuccessMessage(response?.data.message);
          }
        } catch (error) {
          // console.log('resend OTP Code error ==>', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
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
  useSignUpBasicMutation,
  useSignUpBasicUpdateMutation,
  useLoginApiMutation,
  useLazyGetSubscriptionPlansQuery,
  useSignUpCompleteMutation,
  useOTPApiMutation,
  useForgotPasswordMutation,
  useSendOTPMutation,
  useLogoutApiMutation,
  useChangePassowrdMutation,
  useResetPasswordMutation,
  useResendOTPMutation,
  useLazyGetCountryNameQuery,
  useDeleteProfileMutation,
  useLazyGetMobileSettingQuery,
  useGetMobileSettingQuery,
} = SignUp;
