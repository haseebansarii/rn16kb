import {Platform} from 'react-native';
import {toastDangerMessage} from '../../utils/helpers';
import {api} from '../api';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    faqs: build.query<any, any>({
      query: () => {
        return {
          url: `faq?status=enabled&skip=0&limit=50&platform=${Platform.OS}`,
          method: 'GET',
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          //   toastSuccessMessage(response?.data?.message);
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

export const {useLazyFaqsQuery} = userApi;
