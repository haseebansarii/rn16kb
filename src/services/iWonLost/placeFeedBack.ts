import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const offersApi = api.injectEndpoints({
  endpoints: build => ({
    placeFeedBack: build.mutation<any, any>({
      query: payload => {
        return {
          url: `review`,
          method: 'POST',
          body: payload,
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          //   const {navigation, onSuccess} = arg;

          const response: any = await queryFulfilled;
          if (response.meta.response.status == 200) {
            console.log(
              'response in Feedback apis===============',
              response.data,
            );
            // toastSuccessMessage(response.data.message);
          }
        } catch (error: any) {
          console.log('error in feedback APis  ==>', JSON.stringify(error));
          if (error?.error?.data?.message) {
            toastDangerMessage(
              error.error.data.message +
                ' ' +
                (error.error.data?.errors?.[0] || ''),
            );
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    // updateFavNotes: build.mutation<any, any>({
    //   query: data => {
    //     return {
    //       url: `offer`,
    //       method: 'POST',
    //       body: data,
    //     };
    //   },

    //   async onQueryStarted(arg, {dispatch, queryFulfilled}) {
    //     try {
    //       //   const {navigation, onSuccess} = arg;
    //       // console.log('res in offers=======', arg);
    //       const response: any = await queryFulfilled;
    //       console.log('res in counter offer view======', response.data);

    //       // dispatch(setProductOffer(response?.data));
    //     } catch (error: any) {
    //       console.log('error in counter Offers  ==>', JSON.stringify(error));
    //       if (error?.error?.data?.message) {
    //         toastDangerMessage(error.error.data.message);
    //       } else {
    //         toastDangerMessage('Something went wrong');
    //       }
    //     }
    //   },
    // }),
    // acceptOrRejectOffer: build.mutation<any, any>({
    //   query: data => {
    //     const {id, ...remainingData} = data;
    //     console.log('data=======', data);
    //     return {
    //       url: `offer/${id}`,
    //       method: 'PUT',
    //       body: remainingData,
    //     };
    //   },

    //   async onQueryStarted(arg, {dispatch, queryFulfilled}) {
    //     try {
    //       //   const {navigation, onSuccess} = arg;
    //       // console.log('res in offers=======', arg);
    //       const response: any = await queryFulfilled;

    //       toastSuccessMessage(response.data.message);
    //       // dispatch(setProductOffer(response?.data));
    //     } catch (error: any) {
    //       console.log('error in accept Offer  ==>', JSON.stringify(error));
    //       if (error?.error?.data?.message) {
    //         toastDangerMessage(error.error.data.message);
    //       } else {
    //         toastDangerMessage('Something went wrong');
    //       }
    //     }
    //   },
    // }),
  }),
  overrideExisting: true,
});

export const {usePlaceFeedBackMutation} = offersApi;
