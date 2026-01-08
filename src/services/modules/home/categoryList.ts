import {api} from '../../api';

export const categoryListApi = api.injectEndpoints({
  endpoints: build => ({
    categoryList: build.query<any, any>({
      query: payload => {
        return {
          // url: 'category-list?only_parent=' + payload,
          url: 'category-list?',
          method: 'GET',
        };
      },
      async onQueryStarted(arg, {dispatch, getState, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            console.log('success response of get category list api');
          }
        } catch (error) {
          console.log('error in get category list api', error);
        }
      },
    }),
    subCategoryList: build.query<any, any>({
      query: payload => {
        return {
          url: 'category-list?only_child=' + payload,
          method: 'GET',
        };
      },
      async onQueryStarted(arg, {dispatch, getState, queryFulfilled}) {
        try {
          const response: any = await queryFulfilled;
          if (response?.meta?.response?.status === 200) {
            console.log('success response of get sub category list api');
          }
        } catch (error) {
          console.log('error in get sub category list api', error);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useCategoryListQuery,
  useLazyCategoryListQuery,
  useSubCategoryListQuery,
} = categoryListApi;
