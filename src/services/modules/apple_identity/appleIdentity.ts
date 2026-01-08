import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<Response, any>({
    query: payload => ({
      url: 'apple-identity',
      method: 'POST',
      body: payload,
    }),
    async onQueryStarted(arg, { queryFulfilled }) {
      try {
        const response = await queryFulfilled;
        if (response?.meta?.response?.status === 200) {
          console.log('Success Apple Identity POST Api', response?.data);
        }
      } catch (error: any) {
        console.log('Err  ::: ', error?.error?.data?.errors);
      }
    },
  });
