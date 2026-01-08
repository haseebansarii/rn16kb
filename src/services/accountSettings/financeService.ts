import {toastSuccessMessage, toastDangerMessage} from '../../utils/helpers';
import {api} from '../api';

// Centralized helpers for extracting backend error messages
const extractErrorMessage = (error: any) => {
  return (
    error?.error?.data?.message ||
    error?.data?.message ||
    error?.message ||
    'Something went wrong'
  );
};

const handleErrorToast = (error: any) => {
  const msg = extractErrorMessage(error);
  // Avoid spamming identical generic messages multiple times rapidly
  toastDangerMessage(msg);
};

export const financeApi = api.injectEndpoints({
  endpoints: build => ({
    updateFinance: build.mutation<any, any>({
      query: ({_id, payload}) => ({
        url: 'finances',
        method: 'PUT',
        body: {
          _id,
          ...payload,
        },
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(arg, {queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            toastSuccessMessage('Finance updated');
          }
        } catch (error: any) {
          handleErrorToast(error);
        }
      },
    }),
    getFinance: build.query<any, any>({
      query: () => ({
        url: 'finances',
        method: 'GET',
      }),
      providesTags: ['User'],
      async onQueryStarted(arg, {queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          // response handling can be added if needed
        } catch (error: any) {
          // handleErrorToast(error);
        }
      },
    }),
    getGoodLending: build.query<any, any>({
      query: () => ({
        url: 'finances/good-lending',
        method: 'GET',
      }),
      providesTags: ['User'],
      async onQueryStarted(arg, {queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;

          console.log('getGoodLending response', response);
          // optional handling
        } catch (error: any) {
          handleErrorToast(error);
        }
      },
    }),
    getFinanceById: build.query<any, string | undefined>({
      query: id => ({
        url: `finance/${id}`,
        method: 'GET',
      }),
      async onQueryStarted(arg, {queryFulfilled}) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          handleErrorToast(error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateFinanceMutation,
  useLazyGetFinanceQuery,
  useGetFinanceQuery,
  useGetGoodLendingQuery,
  useLazyGetGoodLendingQuery,
  useGetFinanceByIdQuery,
  useLazyGetFinanceByIdQuery,
} = financeApi;
