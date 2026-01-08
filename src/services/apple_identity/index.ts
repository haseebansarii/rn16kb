import {api} from '../api';
import appleIdentity from './appleIdentity';
import getAppleIdentity from './getAppleIdentity';
import GetLoginSalt from './GetLoginSalt';

export const userApi = api.injectEndpoints({
  endpoints: (build: any) => ({
    appleIdentitySaved: appleIdentity(build),
    getAppleIdentity: getAppleIdentity(build),
    GetLoginSalt: GetLoginSalt(build),
  }),
  overrideExisting: true,
});

export const {
  useAppleIdentitySavedMutation,
  useGetAppleIdentityQuery,
  useLazyGetAppleIdentityQuery,
  useLazyGetLoginSaltQuery,
} = userApi;
