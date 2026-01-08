import {
  logoutUser,
  setUserData,
  storeUserCheckPermissons,
} from '../../store/auth/AuthSlice';
import {persistor} from '../../store/store';
import {toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    updateUser: build.mutation<any, any>({
      query: ({payload, _id}) => {
        return {
          url: `user/${_id}`,
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            dispatch(setUserData(response?.data?.user));
            toastSuccessMessage(response?.data?.message);
          }
        } catch (error: any) {
          // console.log('update user error ==>', error);
          if (error?.error?.data?.message) {
            toast.show(error.error.data.message);
          } else {
            toast.show('Something went wrong');
          }
        }
      },
    }),
    getUserDataById: build.query<any, any>({
      query: payload => {
        return {
          url: `user/${payload}`,
          method: 'GET',
        };
      },
      // providesTags: ['getUserTag'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response.meta.response.status == 200) {
            dispatch(setUserData(response?.data?.user));
            toast.show(response?.data?.message);
          }
        } catch (error: any) {
          // console.log('update user error ==>', error);
          if (error?.error?.data?.message) {
            toast.show(error.error.data.message);
          } else {
            toast.show('Something went wrong');
          }
        }
      },
    }),
    getUserDataByToken: build.query<any, any>({
      query: payload => {
        return {
          url: `profile`,
          method: 'GET',
        };
      },
      providesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          if (response?.meta?.response?.status == 200) {
            console.log('Successfully get user details ...');
            dispatch(setUserData(response?.data?.profile));
          }
        } catch (error: any) {
          // console.log('update user error ==>', error);
          if (error?.error?.data?.message) {
            console.log('>> error >666 ', error.error.data.message);
          } else {
            console.log('>> error >666 BB  Something went wrong');
          }
        }
      },
    }),
    updateUserDataProfile: build.mutation<any, any>({
      query: payload => {
        return {
          url: `profile`,
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response.meta.response.status == 200) {
            toast.show(response?.data?.message);
          }
        } catch (error: any) {
          // console.log('update user error ==>', error);
          if (error?.error?.data?.message) {
            toast.show(error.error.data.message);
          } else {
            toast.show('Something went wrong');
          }
        }
      },
    }),
    updateUserFinance: build.mutation<any, any>({
      query: ({payload, _id}) => {
        return {
          url: `user/${_id}/finance`,
          method: 'PATCH',
          body: payload,
        };
      },
      invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            // If the API returns updated user, update the store
            if (response?.data?.user) {
              dispatch(setUserData(response?.data?.user));
            }
            toastSuccessMessage('Finance preference updated');
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
    logout: build.mutation<any, any>({
      query: payload => {
        return {
          url: `remove-token`,
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          console.log(arg, 'arguments');
          const response: any = await queryFulfilled;
          console.log(response);
          if (response?.meta?.response?.status == 200) {
            dispatch({type: 'logout'});
            dispatch(logoutUser());
            await persistor.purge();
            await persistor.flush();
          }
        } catch (error: any) {
          console.log('error in removing tokken  ==>', error);
          if (error?.error?.data?.message) {
            toast.show(error.error.data.message);
          } else {
            toast.show('Something went wrong while logout');
          }
        }
      },
    }),
    getUserCheckPermissions: build.query<any, any>({
      query: param => {
        // ?feature=isell&key=other
        return {
          url: `check-permission${param}`,
          method: 'GET',
        };
      },
      // providesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          if (response?.meta?.response?.status == 200) {
            console.log('Successfully get user check permisions ...');
            dispatch(storeUserCheckPermissons(response?.data));
          }
        } catch (error: any) {
          // console.log('update user error ==>', error);
          if (error?.error?.data?.message) {
            console.log('>> error >777 ', error.error.data.message);
          } else {
            console.log('>> error >777 BB  Something went wrong');
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {
  useLogoutMutation,
  useUpdateUserMutation,
  useLazyGetUserDataByIdQuery,
  useLazyGetUserDataByTokenQuery,
  useUpdateUserDataProfileMutation,
  useLazyGetUserCheckPermissionsQuery,
  useUpdateUserFinanceMutation,
} = userApi;
