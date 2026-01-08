import {COMMON} from './common/types';
import {logout} from '@/store/auth/AuthSlice';
import {persistor} from '@/store/store';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {setLoading} from '../store/common';
import {API_URL} from '../config';
import {toastDangerMessage} from '../utils/helpers';

export const fileUploadHeaders = {
  'Content-Type': 'multipart/form-data',
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  // baseUrl: 'http://192.168.0.102:2005/api/v1/',
  prepareHeaders: (headers, {getState}) => {
    const {token, image_uploading} = (getState() as any).auth;
    if (token && !image_uploading) {
      headers.set('authorization', `Bearer ${token}`);
      headers.set('Content-Type', `application/json`);
    }
    if (image_uploading) {
      headers.set('Content-Type', 'multipart/form-data');
    }
    return headers;
  },
});
const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const {dispatch, endpoint, getState}: any = api;
  const {token} = (getState() as any).auth;

  console.log('📡 [API Request]', {
    endpoint,
    args,
    token,
  });

  let result = await baseQuery(args, api, extraOptions);

  // 🔵 Log the response
  if (result.data) {
    console.log('✅ [API Success]', {
      endpoint,
      response: result.data,
    });
  }

  if (result.error && result.error.status === 401 && !!token) {
    if (result?.error?.data?.key == 'logout_user') {
      dispatch({type: 'logout'});
      setTimeout(async () => {
        dispatch(logout()), await persistor.purge();
        await persistor.flush();
      }, 500);
      toastDangerMessage(result?.error?.data?.message);
    } else {
      dispatch({type: 'logout'});
      setTimeout(async () => {
        dispatch(logout()), await persistor.purge();
        await persistor.flush();
      }, 500);
    }
  }

  dispatch(setLoading(false));

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  tagTypes: [
    'User',
    'Listing',
    'getList',
    'getFeedBackData',
    'getPlans',
    'getReviewListingData',
    'notifications',
    'getUserDataProfile',
    'Branding',
    'Agents',
    'Offers',
    'Chat',
  ],
  endpoints: () => ({}),
});
