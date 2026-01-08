import {buyingType} from '../../store/productDetail/ProductDetailSlice';
import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    productBuyNowApi: build.mutation<any, any>({
      query: ({payload, productId}) => {
        // console.log('buy now payload :::: ', payload);
        // console.log('buy now productId :::: ', productId);
        return {
          url: `buy-now/${productId}`,
          method: 'Put',
          body: payload,
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response.meta.response.status == 200) {
            dispatch(buyingType(null));
          }

          toastSuccessMessage(response?.data?.message);
        } catch (error: any) {
          console.log('update offers error ==>', error);
          if (error?.error?.data?.message) {
            dispatch(buyingType(null));
            toastDangerMessage(error.error.data.message);
          } else {
            dispatch(buyingType(null));
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {useProductBuyNowApiMutation} = userApi;
