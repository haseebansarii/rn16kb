import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '../hooks';
import i18next from 'i18next';
import {TextBold, TextRegular, TextSemiBold} from '.';
import {G} from 'react-native-svg';

type Props = {
  index: number;
  description: string;
  title: string;
  price: string;
  selected?: any;
  onPressChangePlan?: CallableFunction;
};

const CustomSubscriptionCard = ({
  description,
  price,
  title,
  index,
  selected,
  onPressChangePlan,
}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const colorsStars = ['#F7BB16', '#14B6DD', '#E23F40', '#01FF85'];
  const colorsTick = [
    Colors.black_232C28,
    Colors.black_232C28,
    Colors.white,
    Colors.white,
  ];
  const colorsBackGround = [
    Colors.light_grayF4F4F4,
    Colors.gray_D9D9D9,
    Colors.black_303E37,
    Colors.green_06975E,
  ];
  const colorsTitle = [
    Colors.black_232C28,
    Colors.black_232C28,
    Colors.white,
    Colors.white,
  ];
  const colorsTitleDes = [
    Colors.dark_gray_676C6A,
    Colors.dark_gray_676C6A,
    Colors.white,
    Colors.white,
  ];
  const colorsButton = [
    Colors.gray_C9C9C9,
    Colors.dark_gray_676C6A,
    Colors.green_black_34594A,
    Colors.primary,
  ];

  return (
    <View
      style={[
        Gutters.smallPadding,
        Gutters.smallTMargin,
        {
          // height: 240,

          backgroundColor: colorsBackGround[index % colorsBackGround.length],
          borderRadius: 6,
        },
      ]}>
      <View
        style={[
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,
        ]}>
        <Images.svg.star.default
          fill={colorsStars[index % colorsStars.length]}
          width={56}
          height={56}
        />
        <View style={[Gutters.littleLPadding, {width: '70%'}]}>
          <TextSemiBold
            text={
              title
              // index == 0
              //   ? 'Entry'
              //   :  index == 1
              //   ? 'Basic'
              //   : index == 2
              //   ? 'Standard'
              //   : 'Business'
            }
            textStyle={[
              Fonts.poppinSemiBold24,
              {
                // textTransform: 'capitalize',
                color: colorsTitle[index % colorsTitle.length],
              },
            ]}
          />
          <View
            style={[
              Layout.alignItemsCenter,
              Gutters.tinyTMargin,
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            ]}>
            <Images.svg.checkCircle.default
              stroke={colorsTick[index % colorsTick.length]}
            />
            <TextRegular
              text={title}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.tinyLMargin,
                {
                  color: colorsTitle[index % colorsTitle.length],
                },
              ]}
            />
          </View>
        </View>
        <View
          style={[
            Layout.center,
            Gutters.largeBMargin,
            {
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: index ? Colors.white : Colors.dark_gray_676C6A,
            },
          ]}>
          <View
            style={[
              {
                width: 15,
                height: 15,
                borderRadius: 10,
                backgroundColor: index ? Colors.white : 'transparent',
              },
            ]}
          />
        </View>
      </View>

      <TextRegular
        text={description}
        textStyle={[
          Gutters.smallTMargin,
          Fonts.poppinReg14,
          Gutters.tinyLMargin,
          {
            color: colorsTitleDes[index % colorsTitleDes.length],
          },
        ]}
      />
      <View
        style={[
          Gutters.tinyHPadding,
          Gutters.smallVMargin,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          {
            zIndex: 1,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          // disabled
          onPress={() => {
            onPressChangePlan(selected);
            // console.log('continue');
          }}
          style={[
            Layout.center,
            {
              width: 133,
              height: 50,
              borderRadius: 6,
              backgroundColor: colorsButton[index % colorsButton.length],
            },
          ]}>
          <TextBold
            text={'Change Plan'}
            textStyle={[Fonts.poppinBold16, {color: Colors.white}]}
          />
        </TouchableOpacity>
        <View style={[Layout.row]}>
          <Text
            style={[
              Fonts.poppinSemiBold32,
              {
                color: colorsTitleDes[index % colorsTitleDes.length],
              },
            ]}>
            {/* {index == 0
              ? '$0.0'
              : index == 1
              ? '$9.0'
              : index == 2
              ? '$14.00'
              : '$149.00'} */}
            {t('common:nz')}{' '}
            {selected.plan?.category === 'free'
              ? '0'
              : selected?.selected == 0
              ? selected?.plan?.monthly_plan?.amount
              : selected?.plan?.yearly_plan?.amount}
          </Text>
          {selected.plan?.category === 'free' ? null : (
            <Text
              style={[
                Fonts.poppinMed16,
                {
                  color: colorsTitleDes[index % colorsTitleDes.length],
                  justifyContent: 'center',
                  marginTop: 8,
                },
              ]}>
              {`/${
                selected?.selected == 0
                  ? selected?.plan?.monthly_plan?.interval
                  : selected?.plan?.yearly_plan?.interval
              }`}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomSubscriptionCard;
