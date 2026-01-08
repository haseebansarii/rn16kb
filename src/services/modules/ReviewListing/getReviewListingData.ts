import {setReviewListData} from '../../../store/ReviewListing';
import {toastDangerMessage, toastSuccessMessage} from '../../../utils/helpers';
import {api} from '../../api';

export const offersApi = api.injectEndpoints({
  endpoints: build => ({
    getReviewListingData: build.query<any, any>({
      query: payload => {
        // console.log('payload for review listing :::: ', payload);
        let url =
          !payload.reviewType && !payload?.id
            ? `review?`
            : payload?.id
            ? `review?user_id=${payload?.id}&key=seller-detail${
                payload?.reviewType ? `&type=${payload?.reviewType}` : ''
              }`
            : `review?&type=${payload.reviewType}`;
        url = url + `&skip=${payload?.skip ? payload?.skip : 0}&limit=10`;
        console.log('>>>url 44 ', url);

        return {
          url: url,
          method: 'GET',
        };
      },
      providesTags: ['getReviewListingData'],
      async onQueryStarted(arg, {dispatch, queryFulfilled, getState}) {
        try {
          const response: any = await queryFulfilled;
          const currentListData =
            getState()?.reviewListData?.reviewListData?.items;
          if (response?.meta?.response?.status == 200) {
            if (arg?.skip > 0) {
              // Append the new notifications to the existing ones
              const updatedListData = {
                items: [...currentListData, ...response?.data?.items],
                pagination: response?.data?.pagination,
              };
              // console.log('>>> data 33 ', updatedListData);
              dispatch(setReviewListData(updatedListData));
            } else {
              // If no existing data, simply add the new notifications
              dispatch(setReviewListData(response?.data));
            }
          }
        } catch (error: any) {
          //  console.log('user review data list error', error);
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

    sendReview: build.mutation<any, any>({
      query: payload => {
        //  console.log('payload for review listing :::: ', payload);
        const {id, ...remainingData} = payload;
        return {
          url: `review/${id}`,
          method: 'PUT',
          body: remainingData,
        };
      },
      // providesTags: ['getReviewListingData'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response.meta.response.status == 200) {
            toastSuccessMessage(response?.data?.message);
            // console.log(
            //   'User review  data response :::::::::',
            //   JSON.stringify(response),
            // );
          }
        } catch (error: any) {
          //   console.log('user review data list error', error);
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

export const {useLazyGetReviewListingDataQuery, useSendReviewMutation} =
  offersApi;
