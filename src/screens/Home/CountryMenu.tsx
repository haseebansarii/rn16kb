import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../hooks';
import {useDispatch} from 'react-redux';
import {setSelectedCountry} from '../../store/home/ListingSlice';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

type Props = {
  data?: Array<object>;
  setShowMenu: CallableFunction;
};
type DisplayCountryProps = {
  item: object;
  index: number;
};
const CountryMenu = ({data, setShowMenu}: Props) => {
  const {Images, Layout, Colors, Gutters, Fonts} = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const displayCountry = ({item, index}: DisplayCountryProps) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          dispatch(setSelectedCountry(item?.name));
          setShowMenu(false);
          navigation.navigate('IBuy' as never);
        }}
        style={[
          Layout.rowCenter,
          Layout.justifyContentBetween,
          Gutters.tinyPadding,
          Gutters.tinyHPadding,
        ]}>
        <Images.svg.LocationTransparent.default />
        <Text
          style={[
            Layout.screenWidth,
            Gutters.tinyLMargin,
            Fonts.poppinMed13,
            Layout.textTransform,
            {color: Colors.black_232C28},
          ]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        Layout.absolute,
        {
          top: 20,
          right: 0,
          width: '75%',
          height: 200,
          zIndex: -999,
          borderRadius: 4,
          elevation: 5,
          backgroundColor: Colors.white,
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(setSelectedCountry(''));
          setShowMenu(false);
          navigation.navigate('IBuy' as never);
        }}
        style={[
          Layout.rowCenter,
          Layout.justifyContentBetween,
          Gutters.tinyPadding,
          Gutters.tinyHPadding,
        ]}>
        <Images.svg.LocationTransparent.default />
        <Text
          style={[
            Layout.screenWidth,
            Gutters.tinyLMargin,
            Fonts.poppinMed13,
            {color: Colors.black_232C28},
          ]}>
          {t('common:see_ads_in_world')}
        </Text>
      </TouchableOpacity>
      <Text
        style={[
          Gutters.tinyPadding,
          Gutters.xTinyHPadding,
          Fonts.poppinMed13,
          {color: Colors.gray_D9D9D9},
        ]}>
        {t('common:choose_country')}
      </Text>

      <FlatList
        data={data}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        keyExtractor={(_, i) => i.toString()}
        renderItem={displayCountry}
      />
    </View>
  );
};

export default CountryMenu;
