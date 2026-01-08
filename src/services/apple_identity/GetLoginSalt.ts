export default (build: any) =>
  build.query({
    query: () => ({
      url: `setting-by-key/login_salt`,
      method: 'GET',
    }),
    async onQueryStarted(arg, {dispatch, queryFulfilled}) {
      try {
        const response = await queryFulfilled;
        console.log('get login salt Res==>', response?.data?.user);
      } catch (err) {
        console.log('Get login salt error==>', err);
        toast.show(err?.error?.data?.message, 3000);
      }
    },
  });
