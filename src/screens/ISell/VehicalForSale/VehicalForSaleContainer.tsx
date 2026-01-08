import React, {useEffect} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {SearchNumberPlat, VehicalForm} from '.';
import {CustomHeader, ScreenWrapper} from '../../../components';
import {useTheme} from '../../../hooks';
import {useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {setSubCatagory} from '../../../store/catagories/Catagories';
import {useDispatch} from 'react-redux';
import {useLazyGetCatagoriesQuery} from '../../../services/catagories/catagory';

type Props = {
  navigation: any;
};

const VehicalForSaleContainer = ({navigation}: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  const {
    params: {isEdit, id, edit_single_listing_data, withdrawn},
  }: any = useRoute();
  const dispatch = useDispatch();

  const [getCatagories] = useLazyGetCatagoriesQuery();
  const getDataCat = () => {
    getCatagories('&type=vehicle').then((res: any) => {
      if (res?.data?.categories) {
        res?.data?.categories?.map(item => {
          if (data?.category) {
            if (item._id === data?.category) {
              dispatch(setSubCatagory(item.sub_categories));
            }
          }
        });
      }
    });
  };
  useEffect(() => {
    getDataCat();
  }, []);

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        navigation={navigation}
        title="Vehicle for sale"
        rightIcon={true}
        notification={5}
      />
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={[Layout.flexGrow, Gutters.tinyHPadding]}
        style={[Layout.fill]}
        extraScrollHeight={Platform.OS === 'android' ? 70 : 100}
        enableResetScrollToCoords={false}>
        <View style={[Layout.fill, Gutters.smallBMargin]}>
          <SearchNumberPlat />
          <VehicalForm
            // selected={selected}
            navigation={navigation}
            isEdit={isEdit}
            id={id}
            // setSelected={setSelected}
            edit_single_listing_data={edit_single_listing_data}
            withdrawn={withdrawn}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default VehicalForSaleContainer;
