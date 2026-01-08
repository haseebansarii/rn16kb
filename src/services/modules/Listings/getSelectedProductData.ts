// import { showMessage } from 'react-native-flash-message';
import {api} from '../../api';
import {setSelectedProductData} from '../../../store/Listings';

export const userApi: any = api.injectEndpoints({
  endpoints: build => ({
    getSelectedProductData: build.query<any, any>({
      query: payload => {
        return {
          url: `listing/${payload.product_id}`,
          method: 'GET',
        };
      },
      providesTags: ['getList'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          dispatch(setSelectedProductData(response?.data));
        } catch (error: any) {
          //  console.log('selected product data error', error);
          if (error?.error?.data?.message) {
            // showMessage({
            //   message: error.error.data.message,
            //   type: 'danger',
            // });
          } else {
            // showMessage({
            //   message: 'Something went wrong',
            //   type: 'danger',
            // });
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {useLazyGetSelectedProductDataQuery} = userApi;
