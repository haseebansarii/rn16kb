import {imageUploadApi} from '../imageUploadApi';

export const imageUploadFormApi = imageUploadApi.injectEndpoints({
  endpoints: builder => ({
    uploadImages: builder.mutation({
      query: data => {
        console.log('>>> data 738737 ', data);
        return {
          url: `upload-image`,
          method: 'POST',
          body: data,
        };
      },
      async onQueryStarted(args, {dispatch, queryFulfilled, getState}) {
        // const {navigation} = args;
        try {
          const response = await queryFulfilled;
          console.log(response, 'response in api');
        } catch (e) {
          console.log('uploadImages error=======', JSON.stringify(e));
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {useUploadImagesMutation} = imageUploadFormApi;
