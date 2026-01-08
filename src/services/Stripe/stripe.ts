import {toastDangerMessage} from '../../utils/helpers';
import {api} from '../api';

export const userApi: any = api.injectEndpoints({
  endpoints: build => ({
    createStripeCard: build.mutation<any, any>({
      query: payload => {
        return {
          url: 'create-stripe-card',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          // console.log('stripe card created successfully... ', response);
        } catch (error: any) {
          // console.log('stripe card creation error', error);
          toastDangerMessage(error?.error?.data?.message);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {useCreateStripeCardMutation} = userApi;
