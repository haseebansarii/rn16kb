import moment from 'moment';
import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {useTheme} from '../../hooks';
import {product_listing} from '../../utils/dummyData';
import {getStaticImage, getURLPhoto} from '../../utils/helpers';
import {TextSemiBold} from '../../components';
import {sHight} from '../../utils/ScreenDimentions';
import {SvgUri} from 'react-native-svg';

const Listing = ({
  filter,
  scrollEnabled,
}: {
  filter: boolean;
  scrollEnabled: boolean;
}) => {
  const {Layout, Gutters, Colors, Fonts} = useTheme();
  const listData = useSelector((state: any) => state?.list?.listData);

  const memoizedCallback = (item: any) => {
    return <RenderItem {...item} />;
  };

  const RenderItem = ({item, index}: any) => {
    console.log('>>>item?.images ', item?.images);

    return (
      <TouchableOpacity
        style={[
          Gutters.darkShadow,
          Gutters.tinyBMargin,
          product_listing.length - 1 == index && Gutters.xLargeBMargin,
          product_listing.length - 2 == index && Gutters.xLargeBMargin,

          {
            width: '48%',
            borderRadius: 10,
            backgroundColor: Colors.white,
          },
        ]}>
        {item?.images && item?.images[0]?.name?.endsWith('.svg') ? (
          <View
            style={[
              Layout.alignItemsCenter,
              Layout.justifyContentCenter,
              {
                height: 120,
              },
            ]}>
            <SvgUri
              width="100"
              height="100"
              uri={getURLPhoto(item?.images[0]?.name)}
              style={{
                width: '100%',
                height: 120,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
          </View>
        ) : (
          <FastImage
            source={
              item?.images && item?.images[0]?.name
                ? getURLPhoto(item?.images[0]?.name)
                : getStaticImage(false)
            }
            resizeMode="cover"
            style={{
              width: '100%',
              height: 120,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
        )}

        <View
          style={[
            Layout.selfCenter,
            Layout.screenWidth,
            Gutters.littleTMargin,
          ]}>
          <View style={[Layout.row, Layout.justifyContentBetween]}>
            <Text style={[Fonts.poppinMed12, {color: Colors.dark_gray_676C6A}]}>
              {'Closed on: ' +
                moment(
                  item?.status_changed_at
                    ? item?.status_changed_at
                    : item?.updated_at,
                ).format('DD MMM YYYY')}
            </Text>
          </View>
          <Text
            style={[
              Fonts.poppinMed12,
              Gutters.littleTMargin,
              {color: Colors.primary},
            ]}>
            {item?.pickup_location}
          </Text>
          <Text
            style={[
              Fonts.poppinMed12,
              Gutters.tinyTMargin,
              Gutters.littleBMargin,
            ]}>
            {item?.title}
          </Text>
          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Gutters.littleVMargin,
            ]}>
            <View>
              <Text
                style={[Fonts.poppinMed12, {color: Colors.dark_gray_676C6A}]}>
                Bought
              </Text>
              <View style={[Layout.row, Layout.alignItemsCenter]}>
                <Text
                  style={[
                    Fonts.poppinSemiBold14,
                    Gutters.tinyTMargin,
                    {color: Colors.black_232C28, fontWeight: '600'},
                  ]}>
                  {item?.bids}
                </Text>
                <Text
                  style={[
                    Fonts.poppinSemiBold12,
                    Gutters.tinyTMargin,
                    {color: Colors.dark_gray_676C6A},
                  ]}>
                  {'Bids'}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={[
                  Fonts.poppinSemiBold13,
                  Layout.alignItemsCenter,
                  Layout.selfEnd,
                ]}>
                {t('common:nz') + ' ' + item?.start_price}
              </Text>
              <Text
                style={[
                  Fonts.poppinSemiBold13,
                  Gutters.littleTMargin,
                  {color: Colors.black_232C28, textDecorationLine: 'underline'},
                ]}>
                {'Feedback Sent'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[Layout.fill]}>
      <View style={[Gutters.tinyTMargin, Layout.fill]}>
        <View style={[Layout.fill]}>
          <FlatList
            data={listData?.items}
            renderItem={memoizedCallback as any}
            columnWrapperStyle={[Layout.justifyContentBetween]}
            numColumns={2}
            scrollEnabled={scrollEnabled ? scrollEnabled : false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={[Layout.fill, Layout.center, {height: sHight(55)}]}>
                <TextSemiBold
                  text="No data found "
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    {color: Colors.black_232C28},
                  ]}
                />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default Listing;
