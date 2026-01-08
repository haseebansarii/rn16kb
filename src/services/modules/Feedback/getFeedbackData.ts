// import { showMessage } from 'react-native-flash-message';
import {api} from '../../api';
import {setUserFeedBackData} from '../../../store/Feedback';

export const userApi: any = api.injectEndpoints({
  endpoints: build => ({
    getUserFeedBackData: build.query<any, any>({
      query: payload => {
        console.log('payload for listing :::: ', payload);
        return {
          url: 'user-review-stats',
          method: 'GET',
        };
      },
      providesTags: ['getFeedBackData'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          //   console.log(
          //     'User feedback data response :::::::::',
          //     JSON.stringify(response),
          //   );

          dispatch(setUserFeedBackData(response?.data));
        } catch (error: any) {
          console.log('user feedback error', error);
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

export const {useLazyGetUserFeedBackDataQuery} = userApi;
