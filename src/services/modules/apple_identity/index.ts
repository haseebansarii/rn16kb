import { api } from '../../api';
import appleIdentity from './appleIdentity';
import getAppleIdentity from './getAppleIdentity';
import postLogin from '../../auth/loginApi';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    // appleIdentitySaved: appleIdentity(build),
    // getAppleIdentity: getAppleIdentity(build),
    postLogin: postLogin(build),
  }),
  overrideExisting: true,
});

export const {
  // useAppleIdentitySavedMutation,
  // useGetAppleIdentityQuery,
  // useLazyGetAppleIdentityQuery,
  usePostLoginMutation,
} = userApi;
