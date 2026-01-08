import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {
  CustomBottomSheet,
  CustomHeader,
  CustomList,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {WhatAreYouSelling} from '../../utils/dummyData';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {tabBarRef} from '../../navigators/TabNavigator';
import {setVehicalDataEpmty} from '../../store/Forms/vehicalForms';
import {setCarJam} from '../../store/Forms/Forms';

type Props = {
  navigation: any;
  route: any;
};

const ISellContainer = ({navigation, route}: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [showDialogShipping, setShowDialogShipping] = useState(false);

  // console.log(route?.params?.screen, 'screen is ');

  useEffect(() => {
    if (isFocused && route?.params?.screen == 'ISellContainer') {
      dispatch(fixBottomTab(true));
      tabBarRef?.current?.setVisible(true);
    }

    return () => {};
  }, [isFocused]);

  const shippingMethodsCheck = () => {
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Text style={[Fonts.poppinSemiBold25, {color: Colors.black_232C28}]}>
          {t('common:shipping_options_missing')}
        </Text>
        <Text
          style={[
            Fonts.poppinMed16,
            Gutters.tinyTMargin,
            {color: Colors.dark_gray_676C6A, textAlign: 'center'},
          ]}>
          {t(
            'common:please_navigate_to_the_payment_options_tab_in_your_settings_to_select_your_shipping_options',
          )}
        </Text>
        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setShowDialogShipping(false);
              navigation.navigate('AccountSetting');
            }}
            style={[
              Gutters.tinyPadding,
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: Colors.primary,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text style={[Fonts.poppinSemiBold14, {color: Colors.white}]}>
              {t('common:go_to_setting')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setShowDialogShipping(false);
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.dark_gray_676C6A,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text style={[Fonts.poppinSemiBold14, {color: Colors.white}]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    const {description, image, title} = item;

    const Icon = Images.svg[image].default;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={index}
        onPress={() => {
          // if (user_data?.shipping_methods?.length > 0) {
          if (index === 0) {
            navigation.navigate('ItemForSale', {isEdit: false, id: ''});
          } else if (index === 1) {
            dispatch(setVehicalDataEpmty({}));
            dispatch(setCarJam({}));
            navigation.navigate('VehicalForSale', {isEdit: false, id: ''});
          } else if (index === 2) {
            navigation.navigate('PropertyForSale');
          }
          // } else {
          //   setShowDialogShipping(true);
          // }
        }}
        style={[
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          Layout.alignItemsCenter,
          Layout.screenWidth,
          Gutters.tinyPadding,
          Layout.selfCenter,
          Gutters.smallBMargin,

          {
            height: 125,
            borderRadius: 10,
            backgroundColor: Colors.lightGreen_DBF5EC,
          },
        ]}>
        <View
          style={[
            Layout.center,
            {
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: Colors.primary,
            },
          ]}>
          <Icon />
        </View>
        <View
          style={[
            // i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Gutters.smallLPadding,

            Layout.wrap,
            Layout.fill,
          ]}>
          <View style={{width: '100%'}}>
            <TextSemiBold
              text={title}
              textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            />
            <TextRegular
              text={description}
              textProps={{
                // numberOfLines: 2,
                ellipsizeMode: 'tail',
              }}
              textStyle={[
                Fonts.poppinReg14,
                Layout.overflow,
                Gutters.littleTMargin,
                {
                  color: Colors.black_232C28,
                  width: '70%',
                  textTransform: 'none',
                },
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        navigation={navigation}
        title={t('common:what_are_you_selling')}
        rightIcon={true}
        screen={route?.params?.screen}
      />

      <View style={[Layout.fill, Gutters.smallTPadding]}>
        <FlatList
          data={WhatAreYouSelling}
          keyExtractor={(_, i) => i?.toString()}
          renderItem={renderItem}
        />
      </View>
      {/* <CustomBottomSheet
        visible={showDialogShipping}
        setShowBottomSheet={setShowDialogShipping}
        icon={false}
        height={'60%'}>
        {shippingMethodsCheck()}
      </CustomBottomSheet> */}
    </View>
  );
};

export default ISellContainer;
