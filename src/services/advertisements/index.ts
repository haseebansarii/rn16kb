import {toastDangerMessage} from '../../utils/helpers';
import {api} from '../api';

export const advertisementApi = api.injectEndpoints({
  endpoints: build => ({
    getNextAdvertisement: build.query<any, void>({
      query: () => {
        return {
          url: `advertisements/next`,
          method: 'GET',
        };
      },
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage(
              'Something went wrong while fetching advertisement',
            );
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {useLazyGetNextAdvertisementQuery, useGetNextAdvertisementQuery} =
  advertisementApi;
