import {EndpointBuilder} from '@reduxjs/toolkit/dist/query/endpointDefinitions';

export default (build: EndpointBuilder<any, any, any>) =>
  build.query<Response, any>({
    query: payload => ({
      url: 'apple-identity/' + payload,
      method: 'GET',
    }),
    async onQueryStarted(arg, {queryFulfilled}) {
      try {
        const response = await queryFulfilled;
        if (response?.meta?.response?.status === 200) {
          console.log('Success Apple Identity GET Api', response?.data);
        }
      } catch (error: any) {
        console.log('Err  ::: ', error);
      }
    },
  });
