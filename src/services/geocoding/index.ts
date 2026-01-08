import {toastDangerMessage} from '../../utils/helpers';
import {api} from '../api';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    geoCoding: build.query<any, any>({
      query: payload => {
        return {
          url: `get-geocoded-address?key=address&value=${payload}`,
          method: 'GET',
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
        } catch (error: any) {
          // console.log('update offers error ==>', error);
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

export const {useLazyGeoCodingQuery} = userApi;
