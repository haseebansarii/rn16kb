import {api, fileUploadHeaders} from '../api';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    uploadFile: build.mutation<any, any>({
      query: ({payload}) => {
        // console.log('payload=>', payload);
        return {
          url: `upload-image`,
          method: 'POST',
          body: payload,
          headers: fileUploadHeaders,
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const {navigation, onSuccess} = arg;
          const response: any = await queryFulfilled;
          // console.log('upload file response==>>', response);
        } catch (error: any) {
          // console.log('upload file error ==>', error);
          if (error?.error?.data?.message) {
            toast.show(error.error.data.message);
          } else {
            // console.log(
            //   'upload file response==>>',
            //   JSON.stringify(error?.error),
            // );
            toast.show('Something went wrong');
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {useUploadFileMutation} = userApi;
