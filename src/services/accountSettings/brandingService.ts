import {setBrandingData} from '../../store/Branding';
import {toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const brandingApi = api.injectEndpoints({
  endpoints: build => ({
    updateBranding: build.mutation<any, any>({
      query: ({payload}) => {
        return {
          url: 'branding',
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: ['Branding'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            dispatch(setBrandingData(response?.data?.branding));
            toastSuccessMessage(response?.data?.message);
          }
        } catch (error: any) {
          // console.log('update user error ==>', error);
          if (error?.error?.data?.message) {
            toast.show(error.error.data.message);
          } else {
            toast.show('Something went wrong');
          }
        }
      },
    }),
    getBrandingByToken: build.query<any, any>({
      query: payload => {
        return {
          url: 'branding',
          method: 'GET',
        };
      },
      providesTags: ['Branding'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          if (response?.meta?.response?.status == 200) {
            console.log('Successfully get user branding ...');
            dispatch(setBrandingData(response?.data?.branding));
          }
        } catch (error: any) {
          // console.log('update user error ==>', error);
          if (error?.error?.data?.message) {
            console.log('>> error >666 ', error.error.data.message);
          } else {
            console.log('>> error >666 BB  Something went wrong');
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {useUpdateBrandingMutation, useLazyGetBrandingByTokenQuery} =
  brandingApi;
