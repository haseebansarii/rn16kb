import {api} from '../api';
import {storeSubscriptionPlansAccount} from '../../store/accountSettings/accountSettingsSlice';
import {toastSuccessMessage} from '../../utils/helpers';
import {storeSubscriptionPlans} from '../../store/SignUp';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    getSubscriptionPlans: build.query<any, any>({
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
          console.log('successfully get getSubscriptionPlans response');
          dispatch(
            storeSubscriptionPlans(response?.data?.subscription_plans || []),
          );
          dispatch(
            storeSubscriptionPlansAccount(
              response?.data?.subscription_plans || [],
            ),
          );
        } catch (error: any) {
          console.log('getSubscriptionPlans error 12 ', error);
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
    cancelSubscription: build.query<any, any>({
      query: payload => {
        return {
          url: `cancel-subscription`,
          method: 'GET',
        };
      },
      // invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          toast.show(response?.data?.message);
          // console.log(
          //   'getSubscriptionPlans response ::::',
          //   JSON.stringify(response?.data),
          // );
          // dispatch(
          //   storeSubscriptionPlans(response?.data?.subscription_plans || []),
          // );
        } catch (error: any) {
          // console.log('getSubscriptionPlans error', error);
          if (error?.error?.data?.message) {
            showMessage({
              message: error.error.data.message,
              type: 'danger',
            });
          } else {
            showMessage({
              message: 'Something went wrong',
              type: 'danger',
            });
          }
        }
      },
    }),
    changeSubscription: build.mutation<any, any>({
      query: body => {
        return {
          url: `change-subscription`,
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          if (response.meta.response.status == 200) {
            toastSuccessMessage(response?.data?.message);
          }
        } catch (error: any) {
          // console.log('delete-card error ==>', error);
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
});

export const {
  useLazyGetSubscriptionPlansQuery,
  useLazyCancelSubscriptionQuery,
  useChangeSubscriptionMutation,
} = userApi;
