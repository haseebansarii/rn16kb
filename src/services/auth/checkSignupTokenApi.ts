import {toastDangerMessage, toastSuccessMessage} from '../../utils/helpers';

type TCheckSignupToken = {
  email: string;
  token: string;
};
export default (build: any) =>
  build.mutation({
    query: (payload: TCheckSignupToken) => {
      console.log('signup token payload data :::::: ', payload);
      return {
        url: 'check-token',
        method: 'POST',
        body: payload,
      };
    },

    async onQueryStarted(arg, {dispatch, queryFulfilled}) {
      try {
        const response = await queryFulfilled;
        if (response.meta.response.status == 200) {
          toastSuccessMessage(response.data.message);
        }
      } catch (err) {
        console.log('Signup Errr==>', err);
        toastDangerMessage(err.data.messag);
        // toast.show(err?.error?.data?.message, error_configuration);
      }
    },
  });
