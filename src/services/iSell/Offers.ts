import {setProductOffer} from '../../store/iSell';
import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const offersApi = api.injectEndpoints({
  endpoints: build => ({
    productOffers: build.query<any, any>({
      query: id => {
        return {
          url: `offer?listing=${id}`,
          method: 'GET',
        };
      },
      providesTags: [{type: 'Offers', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          //   const {navigation, onSuccess} = arg;
          // console.log('res in offers=======', arg);
          const response: any = await queryFulfilled;
          // console.log('res in offers=======', response?.data?.offers);
          dispatch(setProductOffer(response?.data));
        } catch (error: any) {
          // console.log('error in get Offers  ==>', JSON.stringify(error));
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    counterOffer: build.mutation<any, any>({
      query: data => {
        return {
          url: `offer`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: [{type: 'Offers', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          //   const {navigation, onSuccess} = arg;
          // console.log('res in offers=======', arg);
          const response: any = await queryFulfilled;
          console.log('res in counter offer view======', response.data);

          // dispatch(setProductOffer(response?.data));
        } catch (error: any) {
          console.log('error in counter Offers  ==>', JSON.stringify(error));
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    acceptOrRejectOffer: build.mutation<any, any>({
      query: payload => {
        return {
          url: `offer/${payload?.id}`,
          method: 'PUT',
          body: payload?.data,
        };
      },
      invalidatesTags: [{type: 'Offers', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        console.log(arg, 'arguments');
        try {
          //   const {navigation, onSuccess} = arg;
          // console.log('res in offers=======', arg);
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            console.log('Accept / Reject api success...');
            toastSuccessMessage(response.data.message);
          }

          // dispatch(setProductOffer(response?.data));
        } catch (error: any) {
          console.log('error in accept/reject Offer  ==>', error);
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
  useLazyProductOffersQuery,
  useAcceptOrRejectOfferMutation,
  useCounterOfferMutation,
} = offersApi;
