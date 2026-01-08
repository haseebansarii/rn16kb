import {api} from '../api';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    setDefaultCard: build.mutation<any, any>({
      query: id => {
        return {
          url: `set-default-card/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          toast.show(response?.data?.message);
        } catch (error: any) {
          // console.log('set-default-card error ==>', error);
          if (error?.error?.data?.message) {
            toast.show(error.error.data.message);
          } else {
            toast.show('Something went wrong');
          }
        }
      },
    }),
    deleteCard: build.mutation<any, any>({
      query: id => {
        return {
          url: `delete-card/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['getUserDataProfile'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          toast.show(response?.data?.message);
        } catch (error: any) {
          // console.log('delete-card error ==>', error);
          if (error?.error?.data?.message) {
            toast.show(error.error.data.message);
          } else {
            toast.show('Something went wrong');
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {useSetDefaultCardMutation, useDeleteCardMutation} = userApi;
