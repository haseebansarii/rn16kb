import {
  clearAllNotifications,
  setAllNotifications,
  setUnreadNotificationsCount,
} from '../../../store/notifications';
import {toastDangerMessage, toastSuccessMessage} from '../../../utils/helpers';
import {api} from './../../api';

export const offersApi = api.injectEndpoints({
  endpoints: build => ({
    getNotifications: build.query<any, any>({
      query: payload => {
        let url = `notification?skip=${payload.skip}&limit=20${
          payload?.unread ? '&seen=false' : ''
        }`;
        console.log('>>>payload ', payload);
        console.log('>>>url ', url);
        return {
          url: url,
          method: 'GET',
        };
      },
      providesTags: [{type: 'notifications', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled, getState}) {
        try {
          const response: any = await queryFulfilled;
          // console.log(response, 'all notification data');
          if (response?.meta?.response?.status == 200) {
            console.log('Succcessfully get all notifications ...');
            const currentNotifications =
              getState()?.notifications?.allNotifications?.notification;
            if (arg?.skip > 0) {
              // Append the new notifications to the existing ones
              const updatedNotifications = {
                notification: [
                  ...currentNotifications,
                  ...response?.data?.notification,
                ],
                pagination: response?.data?.pagination,
              };
              dispatch(setAllNotifications(updatedNotifications));
            } else {
              // If no existing data, simply add the new notifications
              dispatch(setAllNotifications(response?.data));
            }

            // dispatch(setAllNotifications(response?.data));
          }
        } catch (error: any) {
          //  console.log('all notifications error', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    getReadAllNotifications: build.query<any, any>({
      query: payload => {
        return {
          url: 'read-all-notifications',
          method: 'GET',
        };
      },
      providesTags: [{type: 'notifications', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          //  console.log(arg, 'arguments');
          if (response?.meta?.response?.status == 200) {
            dispatch(
              clearAllNotifications({emptyArray: [], getData: arg?.getData}),
            );
            // console.log('Success read all notifications api...');
          }
        } catch (error: any) {
          //  console.log('all read notifications error', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    getUnreadNotificationsCount: build.query<any, any>({
      query: payload => {
        return {
          url: 'unread-notifications-count',
          method: 'GET',
        };
      },
      providesTags: [{type: 'notifications', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            // console.log('Success unread notifications count api...');
            dispatch(
              setUnreadNotificationsCount(
                response?.data?.unread_notifications_count,
              ),
            );
          }
        } catch (error: any) {
          console.log('unread notifications count error', error);
          if (error?.error?.data?.message) {
            // toastDangerMessage(error.error.data.message);
          } else {
            // toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    readSingleNotification: build.mutation<any, any>({
      query: ({payload}) => {
        return {
          url: `notification/${payload?.id}`,
          method: 'PUT',
          body: {seen: true},
        };
      },
      invalidatesTags: [{type: 'notifications', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          //   toastSuccessMessage(response?.data?.message);
        } catch (error: any) {
          console.log('single notification read error ==>', error);
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

export const {
  useLazyGetNotificationsQuery,
  useLazyGetReadAllNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useLazyGetUnreadNotificationsCountQuery,
  useReadSingleNotificationMutation,
} = offersApi;
