import React from 'react';
import {FlatList, ScrollView, View} from 'react-native';
import {CustomCategoriesList, CustomHeader} from '../../components';
import {useTheme} from '../../hooks';
import {
  useCategoryListQuery,
  useSubCategoryListQuery,
} from '../../services/modules/home/categoryList';

type Props = {
  navigation: any;
  route: any;
};

const CatagoriesContainer = ({navigation, route}: Props) => {
  const {Colors, Gutters, Images, Layout, Fonts} = useTheme();
  // const category_list = useCategoryListQuery('yes');
  const subCategory_list = useSubCategoryListQuery('yes');
  const selectedCat = route?.params?.selectedCat;
  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:catagories')}
        navigation={navigation}
        rightIcon={true}
        screen="Categories"
      />
      <ScrollView
        contentContainerStyle={[Layout.flexGrow]}
        showsVerticalScrollIndicator={false}
        style={[Layout.fill, Gutters.smallPadding]}>
        <View
          style={[
            Layout.row,
            Layout.wrap,
            Layout.fill,
            Layout.selfCenter,
            Layout.justifyContentBetween,
          ]}>
          <CustomCategoriesList
            props={{
              numColumns: 3,
            }}
            isCatagories={false}
            categories_list_data={subCategory_list?.currentData?.categories}
            selectedCat={selectedCat}
          />
        </View>
        {/* <View>
          <CustomCategoriesList
            props={{
              numColumns: 3,
            }}
            isCatagories={true}
            isSubCategory={true}
            categories_list_data={subCategory_list?.currentData?.categories}
          />
        </View> */}
      </ScrollView>
    </View>
  );
};

export default CatagoriesContainer;
