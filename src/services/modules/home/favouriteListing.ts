import {toastDangerMessage, toastSuccessMessage} from '../../../utils/helpers';
import {api} from '../../api';

export const favouriteListingApi = api.injectEndpoints({
  endpoints: build => ({
    addFavouriteListing: build.mutation<any, any>({
      query: payload => {
        return {
          url: 'favourite',
          method: 'POST',
          body: payload,
        };
      },
      // invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, getState, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            console.log(
              'success response of add favoutite listing post api',
              response,
            );
            toastSuccessMessage(response?.data?.message);
          }
        } catch (error) {
          console.log('error====', error);
          toastDangerMessage('Sorry you are in guest mode');
        }
      },
    }),

    removeFavouriteListing: build.mutation<any, any>({
      query: payload => {
        return {
          url: 'favourite/' + payload,
          method: 'DELETE',
        };
      },
      // invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, getState, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            toastSuccessMessage(response.data.message);
            // console.log(
            //   'success response of remove favoutite listing delete api',
            // );
          }
        } catch (error) {
          console.log('error====', error);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddFavouriteListingMutation,
  useRemoveFavouriteListingMutation,
} = favouriteListingApi;
