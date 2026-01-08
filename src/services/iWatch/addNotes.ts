import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const offersApi = api.injectEndpoints({
  endpoints: build => ({
    addFavNotes: build.mutation<any, any>({
      query: payload => {
        return {
          url: `favourite-note`,
          method: 'PUT',
          body: payload.body,
        };
      },
      invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response.meta.response.status == 200) {
            if (arg?.deleteFlag) {
              toastSuccessMessage('Note deleted successfully');
            } else {
              toastSuccessMessage(response.data.message);
            }
          }
        } catch (error: any) {
          console.log('error in add notes   ==>', JSON.stringify(error));
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    updateFavNotes: build.mutation<any, any>({
      query: data => {
        return {
          url: `offer`,
          method: 'POST',
          body: data,
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          // if(response.data.)
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
    // removeFavourites: build.mutation<any, any>({
    //   query: data => {
    //     return {
    //       url: `favourite/${data}`,
    //       method: 'DELETE',
    //     };
    //   },

    //   async onQueryStarted(arg, {dispatch, queryFulfilled}) {
    //     try {
    //       //   const {navigation, onSuccess} = arg;
    //       // console.log('res in offers=======', arg);
    //       const response: any = await queryFulfilled;

    //       toastSuccessMessage(response.data.message);
    //     } catch (error: any) {
    //       console.log(
    //         'error in remove favourites Item  ==>',
    //         JSON.stringify(error),
    //       );
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

export const {useAddFavNotesMutation, useUpdateFavNotesMutation} = offersApi;
