import {
  buyingType,
  offeredProduct,
} from '../../store/productDetail/ProductDetailSlice';
import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    productApiOffer: build.mutation<any, any>({
      query: ({payload}) => {
        return {
          url: `offer`,
          method: 'POST',
          body: payload,
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        console.log(arg, 'arguments');
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            dispatch(buyingType(null));
            dispatch(offeredProduct(arg?.payload?.listing));
            toastSuccessMessage(response?.data?.message);
          }
        } catch (error: any) {
          // console.log('update offers error ==>', error);
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

export const {useProductApiOfferMutation} = userApi;
