import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from '../hooks';
import {
  setSearchCatagories,
  setSearchSubCatagory,
} from '../store/home/ListingSlice';
import {Colors} from '../theme/Variables';
import {useNavigation} from '@react-navigation/native';
import {screenWidth, sHight} from '../utils/ScreenDimentions';

const CategoriesList = ({
  categories_list_data,
  isCatagories,
  selectedCat,
  props,
}: any) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [slectedCategory, setSlectedCategory] = useState(selectedCat || {});

  const RenderItemCategories = ({item, index}: any) => {
    const categoryIconMap = {
      'MARKET HUB': 'markethub',
      AUTOMOTIVE: 'automitive',
      'FARMING & MACHINERY': 'farming',
      'PROPERTY ': 'property',
      'SERVICES & ADVERTISEMENTS': 'servicesAndAdvertisements',
      'OCCUPATIONS ': 'occupations',
    };
    const Icon =
      Images.svg[categoryIconMap[item.name]]?.default ||
      Images.svg.markethub.default;
    return (
      <View
        key={index}
        style={[
          Gutters.tinyRMargin,
          {
            width: isCatagories ? screenWidth * 0.28 : 'auto',
            alignItems: 'flex-end',
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            setSlectedCategory(item);

            if (!isCatagories) {
              dispatch(setSearchCatagories(item?._id));
              navigation.navigate('IBuy' as never);
            }
          }}
          activeOpacity={0.8}
          style={[
            styles.box,
            Gutters.smallPadding,
            Layout.center,
            {
              height: isCatagories ? screenWidth * 0.28 : screenWidth * 0.22,
              width: isCatagories ? screenWidth * 0.28 : screenWidth * 0.22,
              borderRadius: 5,
              backgroundColor: Colors.primary,
            },
          ]}>
          <View
            style={[
              Layout.center,
              {
                height: isCatagories ? screenWidth * 0.26 : screenWidth * 0.2,
                width: isCatagories ? screenWidth * 0.26 : screenWidth * 0.2,
                borderRadius: 5,
                backgroundColor:
                  slectedCategory?._id === item?._id && isCatagories
                    ? Colors.primary
                    : Colors.primary,
              },
            ]}>
            <Icon />
          </View>
        </TouchableOpacity>
        <View
          style={[
            Layout.alignItemsCenter,
            Gutters.littleTMargin,
            {
              width: isCatagories ? '100%' : screenWidth * 0.22,
              marginBottom: 20,
              alignSelf: 'center',
            },
          ]}>
          <Text
            numberOfLines={isCatagories ? undefined : 1}
            style={[
              isCatagories ? Fonts.poppinMed14 : Fonts.poppinMed15,
              Layout.alignSelfCenter,
              {textAlign: 'center'},
            ]}>
            {item?.name}
          </Text>
        </View>
      </View>
    );
  };

  const RenderSubCategory = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (isCatagories) {
            dispatch(setSearchSubCatagory(item?._id));
            navigation.navigate('IBuy' as never);
          }
        }}
        style={[Layout.row, Layout.alignItemsCenter, Gutters.tinyTMargin]}>
        <View style={[Layout.invertedX]}>
          <Images.svg.GoBack.default
            stroke={Colors.black_232C28}
            height={16}
            width={16}
          />
        </View>
        <Text style={[Fonts.poppinMed16, Gutters.littleLMargin]}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[Layout.fill]}>
      {categories_list_data?.length > 0 && (
        <View style={[Layout.center]}>
          <FlatList
            {...props}
            showsHorizontalScrollIndicator={false}
            data={categories_list_data}
            renderItem={RenderItemCategories as any}
            style={{maxHeight: sHight(45)}}
          />
        </View>
      )}
      {isCatagories && (
        <>
          {slectedCategory?._id && (
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={slectedCategory?.sub_categories}
              renderItem={RenderSubCategory as any}
            />
          )}
          <View style={{height: sHight(10)}}></View>
        </>
      )}
    </View>
  );
};

export default CategoriesList;

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.primary,
  },
  image: {
    height: '70%',
    width: '70%',
  },
});
