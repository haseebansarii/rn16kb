import {setAgentsData} from '../../store/Agents';
import {setA} from '../../store/Branding';
import {toastSuccessMessage} from '../../utils/helpers';
import {api} from '../api';

export const agentsApi = api.injectEndpoints({
  endpoints: build => ({
    updateAgent: build.mutation<any, any>({
      query: ({payload, _id}) => {
        return {
          url: `agents/${_id}`,
          method: 'PUT',
          body: payload,
        };
      },
      invalidatesTags: ['Agents'],
      async onQueryStarted(arg, {queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
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
    deleteAgent: build.mutation<any, any>({
      query: ({payload, _id}) => {
        return {
          url: `agents/${_id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Agents'],
      async onQueryStarted(arg, {queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
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
    createAgent: build.mutation<any, any>({
      query: ({payload, _id}) => {
        return {
          url: 'agents',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['Agents'],
      async onQueryStarted(arg, {queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status == 200) {
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
    getAgentsByToken: build.query<any, any>({
      query: payload => {
        return {
          url: 'agents',
          method: 'GET',
        };
      },
      providesTags: ['Agents'],
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          if (response?.meta?.response?.status == 200) {
            console.log('Successfully get user agents ...');
            dispatch(setAgentsData(response?.data?.agents));
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
export const {
  useUpdateAgentMutation,
  useCreateAgentMutation,
  useDeleteAgentMutation,
  useLazyGetAgentsByTokenQuery,
} = agentsApi;
