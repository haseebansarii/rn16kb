import {setlistDataUser} from '../../store/Listings';
import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const ratingApi = api.injectEndpoints({
  endpoints: build => ({
    getRating: build.query<any, any>({
      query: payload => {
        return {
          url: `user-review-stats/${payload}`,
          method: 'GET',
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          //   const {navigation, onSuccess} = arg;

          const response: any = await queryFulfilled;
          if (response.meta.response.status == 200) {
            // console.log(
            //   'response in rating apis===============',
            //   response.data,
            // );
            // toastSuccessMessage(response.data.message);
          }
        } catch (error: any) {
          console.log('error in feedback APis 77  ==>', JSON.stringify(error));
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    getUserList: build.query<any, any>({
      query: payload => {
        let url = `listing?&user=${payload?.id}&pageName=home&skip=${
          payload?.skip ? payload?.skip : 0
        }&limit=${payload?.limit > 30 ? payload?.limit : 30}`;
        console.log('>>>getUserList url ', url);
        return {
          url: url,
          method: 'GET',
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled, getState}) {
        try {
          //   const {navigation, onSuccess} = arg;

          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
            console.log(
              `Successfully listing api called ${arg?.pageName} page ...`,
            );
            console.log('>>> response?.data ', JSON.stringify(response?.data));
            const currentListData = getState()?.list?.listDataUser?.items;
            if (arg?.skip > 0) {
              const mergedList = currentListData.concat(response?.data?.items); // More efficient than spread
              const updatedListData = {
                items: mergedList,
                pagination: response?.data?.pagination,
              };

              dispatch(setlistDataUser(updatedListData));
            } else {
              dispatch(setlistDataUser(response?.data));
            }
          }
        } catch (error: any) {
          console.log('error in feedback APis   99 ==>', JSON.stringify(error));
          if (error?.error?.data?.message) {
            toastDangerMessage(
              error.error.data.message +
                ' ' +
                (error.error.data?.errors[0] || ''),
            );
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {useLazyGetRatingQuery, useLazyGetUserListQuery} = ratingApi;
