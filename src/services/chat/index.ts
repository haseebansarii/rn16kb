import {
  allMessages,
  setAllUserChats,
  setAllUserMessages,
} from '../../store/chats/chats';
import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    getAllUsersChat: build.query<any, any>({
      query: () => {
        return {
          url: `chat-list`,
          method: 'GET',
        };
      },
      providesTags: [{type: 'Chat', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response.meta.response.status == 200) {
            console.log('Successfully get all chats ...');

            dispatch(setAllUserChats(response.data.chats));
          }
        } catch (error: any) {
          // console.log('get All chat error ==>', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    getChatDetail: build.query<any, any>({
      query: data => {
        const {listing_id, seller_id, buyer_id} = data;
        return {
          url: `chat-details?listing_id=${listing_id}&seller_id=${seller_id}&buyer_id=${buyer_id}`,
          method: 'GET',
        };
      },
      providesTags: [{type: 'Chat', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          if (response.meta.response.status == 200) {
            // console.log(response?.data?.chat?.messages);
            dispatch(setAllUserMessages(response.data.chat));
            dispatch(allMessages(response?.data?.chat?.messages));
          }
        } catch (error: any) {
          console.log('get chat detail error ==>', error);
          if (error?.error?.data?.message) {
            if (error.error.data.message != 'Chat does not exist')
              toastSuccessMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    deleteChat: build.mutation<any, any>({
      query: payload => {
        return {
          url: `chat/${payload}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: [{type: 'Chat', id: 'LIST'}],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          if (response.meta.response.status == 200) {
            console.log('chat deleted successfully');
          }
        } catch (error: any) {
          console.log('get chat detail error ==>', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
    uploadFile: build.mutation<any, any>({
      query: data => {
        return {
          url: `upload-file`,
          method: 'POST',
          body: data,
        };
      },

      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          console.log('upload File========', response);
          if (response.meta.response.status == 200) {
            console.log('upload File========', response.data);
          }
        } catch (error: any) {
          console.log('get uploadfile error ==>', error);
          if (error?.error?.data?.message) {
            toastDangerMessage(error.error.data.message);
          } else {
            // console.log('get uploadfile error ==>', JSON.stringify(error));
            toastDangerMessage('Something went wrong');
          }
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetAllUsersChatQuery,
  useGetAllUsersChatQuery,
  useUploadFileMutation,
  useLazyGetChatDetailQuery,
  useGetChatDetailQuery,
  useDeleteChatMutation,
} = userApi;
