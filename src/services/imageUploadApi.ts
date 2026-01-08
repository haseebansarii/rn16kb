import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {setLoading} from '../store/common';
import {API_URL} from '../config';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, {getState}) => {
    headers.set('Content-Type', 'multipart/form-data');
    return headers;
  },
});
const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const {dispatch, endpoint, getState}: any = api;
  let result = await baseQuery(args, api, extraOptions);

  dispatch(setLoading(false));

  return result;
};

export const imageUploadApi = createApi({
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});
