import {
  clearAllListingData,
  setItemForSale,
} from '../../store/Forms/ItemForSale';
import {imageUploading} from '../../store/auth/AuthSlice';
import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api, fileUploadHeaders} from '../api';

export const FormApis = api.injectEndpoints({
  endpoints: builder => ({
    itemForSale: builder.mutation({
      query: data => {
        console.log('>>> data itemForSale  ', data);

        return {
          url: `listing`,
          method: 'POST',
          body: data,
        };
      },
      // transformResponse: result => result,
      invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        try {
          const response: any = await queryFulfilled;

          if (response.meta.response.status == 200) {
            // toastSuccessMessage(response.data.message);
            dispatch(clearAllListingData());
            // console.log('Successfully called listing api', response.data);
          }
        } catch (e: any) {
          console.log(e?.error?.data?.errors, 'error in listing');
          toastDangerMessage(
            e?.error?.data?.message +
              ' ' +
              (e?.error?.data?.errors?.[0] || '') || 'Something went wrong',
          );
          // console.log('error=======', JSON.stringify(e));
        }
      },
    }),
    getSingleProduct: builder.query({
      query: id => {
        return {
          url: `listing/${id}`,
          method: 'GET',
        };
      },
      // transformResponse: result => result,

      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        const {navigation, ...remain} = args;

        try {
          const response: any = await queryFulfilled;

          if (response.meta.response.status == 200) {
            dispatch(setItemForSale(response.data));
          }
        } catch (e: any) {
          // console.log(e, 'error in listing');
          toastDangerMessage(e.error.data.message);
          // console.log('error=======', JSON.stringify(e));
        }
      },
    }),

    uploadImages: builder.mutation({
      query: data => {
        return {
          url: `upload-image`,
          method: 'POST',
          body: data,
        };
      },

      transformResponse: result => result,
      // invalidatesTags: ['readUser'],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        // const {navigation} = args;

        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            //console.log('Successfully image uploaded....');
            dispatch(imageUploading(false));
          }
          //   console.log(response, 'response in api');
        } catch (e) {
          toastDangerMessage(e?.error?.data?.message || e?.error?.error);
          // console.log('uploadImages error=======', JSON.stringify(e));
          dispatch(imageUploading(false));
        }
      },
    }),
    updateItemForSale: builder.mutation({
      query: data => {
        const {id, merge} = data;
        return {
          url: `listing?${id}`,
          method: 'PUT',
          body: merge,
        };
      },

      transformResponse: result => result,
      invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        try {
          const {data} = await queryFulfilled;
          // console.log('update item for sale==========', JSON.stringify(data));
        } catch (e) {
          // console.log('uploadImages error=======', JSON.stringify(e));
        }
      },
    }),
    deleteItemForSale: builder.mutation({
      query: id => {
        // console.log('id=======', id);
        return {
          url: `listing/${id}`,
          method: 'DELETE',
        };
      },

      transformResponse: result => result,
      invalidatesTags: [{type: 'Listing', id: 'LIST'}],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        try {
          const response = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            toastSuccessMessage(response.data.message);
          }
        } catch (e) {
          // console.log('uploadImages error=======', JSON.stringify(e));
          if (e?.error?.data?.message) {
            toastDangerMessage(e?.error?.data?.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),

    vehicalForSale: builder.mutation({
      query: data => {
        console.log('?>>>> vehicalForSale ', data);

        return {
          url: `listing`,
          method: 'POST',
          body: data,
        };
      },

      transformResponse: result => result,
      invalidatesTags: ['Listing'],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        // const {navigation} = args;

        try {
          const {data} = await queryFulfilled;
          // console.log('data in vehical for sale===========', data);
          toastSuccessMessage(data.message);
        } catch (e) {
          // console.log('vehical for sale  error=======', JSON.stringify(e));
          toastDangerMessage(e.data.message);
        }
      },
    }),
    updateVehicalForSale: builder.mutation({
      query: data => {
        const {navigation, ...remainingData} = data;
        return {
          url: `upload-image`,
          method: 'POST',
          body: remainingData,
        };
      },

      transformResponse: result => result,
      // invalidatesTags: ['readUser'],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        // const {navigation} = args;

        try {
          const {data} = await queryFulfilled;
          // console.log('data in vehical for sale===========', data);
          toastSuccessMessage(data.message);
        } catch (e) {
          // console.log('vehical for sale  error=======', JSON.stringify(e));
          toastDangerMessage(e.data.message);
        }
      },
    }),
    propertyForSale: builder.mutation({
      query: data => {
        console.log('>>>propertyForSale data 888  ', data);

        return {
          url: `listing`,
          method: 'POST',
          body: data,
        };
      },

      transformResponse: result => result,
      // invalidatesTags: ['readUser'],
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        try {
          const {data} = await queryFulfilled;
          toastSuccessMessage(data.message);
        } catch (e) {
          console.log('property for sale  error======= 66 ', e);
          if (e?.error?.data?.message) {
            toastDangerMessage(
              `${e?.error?.data?.message} ${e?.error?.data?.errors?.[0] || ''}`,
            );
          } else {
            toastDangerMessage(
              e?.error?.data?.errors?.[0] || 'Something went wrong',
            );
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {
  useUploadImagesMutation,
  usePropertyForSaleMutation,
  useUpdateItemForSaleMutation,
  useItemForSaleMutation,
  useDeleteItemForSaleMutation,
  useVehicalForSaleMutation,
  useLazyGetSingleProductQuery,
} = FormApis;
