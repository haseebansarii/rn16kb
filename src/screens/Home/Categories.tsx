import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTheme} from '../../hooks';

import {navigationRef} from '../../navigators/utils';
import {useCategoryListQuery} from '../../services/modules/home/categoryList';
import {CustomCategoriesList} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {useGetMobileSettingQuery} from '../../services/auth/signupApi';

const Categories = () => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();

  const category_list = useCategoryListQuery('yes');

  const homegetMobile = useGetMobileSettingQuery('');

  const navigation = useNavigation();
  return (
    <View style={[{zIndex: -100}]}>
      <View
        style={[
          Layout.row,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,
        ]}>
        <Text style={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}>
          Popular Categories
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Catagories' as never);
            // if (token) navigationRef.navigate('Catagories');
          }}
          style={[Layout.row, Layout.center]}>
          <Text
            style={[
              Fonts.poppinReg16,
              {color: Colors.dark_gray_676C6A, marginRight: 2},
            ]}>
            {t('common:see_more')}
          </Text>
          <View style={[Layout.rotate90Inverse]}>
            <Images.svg.DropDown.default width={12} height={12} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={[Gutters.xTinyTMargin]}>
        <CustomCategoriesList
          props={{
            horizontal: true,
          }}
          isCatagories={false}
          categories_list_data={category_list?.currentData?.categories}
        />
      </View>
    </View>
  );
};

export default Categories;
