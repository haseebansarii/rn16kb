import React, {memo} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {useTheme} from '../../hooks';
import {TextSemiBold} from '../../components';
const {width} = Dimensions.get('screen');
type Props = {};
const GroupedBars = ({}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const barData = [
    {
      value: 40,
      label: 'Mon',
      spacing: 2,
      labelWidth: 50,
      labelTextStyle: {color: Colors.gray_606060},
      frontColor: Colors.lightGreen_DBF5EC,
    },
    {value: 80, frontColor: Colors.primary},
    {
      value: 50,
      label: 'Tue',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: Colors.gray_606060},
      frontColor: Colors.lightGreen_DBF5EC,
    },
    {value: 40, frontColor: Colors.primary},
    {
      value: 75,
      label: 'Wed',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: Colors.gray_606060},
      frontColor: Colors.lightGreen_DBF5EC,
    },
    {value: 25, frontColor: Colors.primary},
    {
      value: 30,
      label: 'Thu',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: Colors.gray_606060},
      frontColor: Colors.lightGreen_DBF5EC,
    },
    {value: 20, frontColor: Colors.primary},
    {
      value: 60,
      label: 'Fri',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: Colors.gray_606060},
      frontColor: Colors.lightGreen_DBF5EC,
    },
    {value: 40, frontColor: Colors.primary},
    {
      value: 65,
      label: 'Sat',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: Colors.gray_606060},
      frontColor: Colors.lightGreen_DBF5EC,
    },
    {value: 30, frontColor: Colors.primary},
    {
      value: 65,
      label: 'Sun',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: Colors.gray_606060},
      frontColor: Colors.lightGreen_DBF5EC,
    },
    {value: 30, frontColor: Colors.primary},
  ];

  return (
    <View
      style={[
        Layout.screenWidth,
        Layout.selfCenter,
        Layout.overflow,
        Gutters.smallPadding,
        {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          borderRadius: 8,
          backgroundColor: Colors.white,
        },
      ]}>
      <TextSemiBold
        text={t('common:sales_summary')}
        textStyle={[
          Fonts.poppinSemiBold24,
          Gutters.regularBMargin,
          {color: Colors.black_232C28},
        ]}
      />

      <BarChart
        autoShiftLabels={true}
        scrollAnimation={true}
        data={barData}
        barWidth={16}
        spacing={24}
        barBorderTopRightRadius={8}
        barBorderTopLeftRadius={8}
        horizontalRulesStyle={{width: '50%'}}
        width={width / 1.5}
        hideRules
        xAxisThickness={1}
        yAxisThickness={1}
        yAxisTextStyle={{color: Colors.gray_606060}}
        yAxisLabelSuffix={'k'}
        xAxisColor={Colors.gray_E2E2E2}
        yAxisColor={Colors.gray_E2E2E2}
        noOfSections={3}
        maxValue={75}
      />
    </View>
  );
};
export default memo(GroupedBars);
