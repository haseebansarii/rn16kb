import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from '../hooks';
import {extractObjects} from '../utils/helpers';

type Props = {
  plan: any;
  SubscriptionTime: any;

  titleColor?: string;
};

const SubscriptionPointsRender = ({
  plan,
  SubscriptionTime,
  titleColor,
}: Props) => {
  const {Fonts, Colors, Layout, Gutters, Images} = useTheme();
  const renderCheckIcon = () => {
    return <Images.svg.Check.default />;
  };

  return (
    <View
      style={[
        Layout.fill,
        Gutters.xTinyBMargin,

        {
          width: '90%',
          marginTop: 10,
        },
      ]}>
      {!plan.unlimited_selling &&
        (plan.category === 'free'
          ? plan.free_plan.no_of_sells_other
          : plan.monthly_plan.no_of_sells_other > 0) && (
          <View
            style={[
              Layout.row,
              Gutters.littleTMargin,
              Layout.alignItemsCenter,
            ]}>
            {renderCheckIcon()}
            <Text
              style={[
                Fonts.poppinReg14,
                Gutters.tinyLMargin,
                {
                  fontSize: 14,
                  color: titleColor ? titleColor : Colors.black_232C28,
                  fontWeight: '400',
                },
              ]}>
              {plan?.category === 'free'
                ? plan?.free_plan?.no_of_sells_other
                : SubscriptionTime !== 0
                ? plan?.yearly_plan?.no_of_sells_other
                : plan?.monthly_plan?.no_of_sells_other}{' '}
              General listings
            </Text>
          </View>
        )}
      {plan?.unlimited_selling && (
        <View
          style={[Layout.row, Gutters.littleTMargin, Layout.alignItemsCenter]}>
          {renderCheckIcon()}
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {
                fontSize: 14,
                color: titleColor ? titleColor : Colors.black_232C28,
                fontWeight: '400',
              },
            ]}>
            Unlimited General listings
          </Text>
        </View>
      )}
      {!plan.unlimited_selling &&
      (plan?.category === 'free'
        ? plan?.free_plan?.no_of_sells_automotive
        : plan?.monthly_plan?.no_of_sells_automotive > 0) ? (
        <View
          style={[Layout.row, Gutters.littleTMargin, Layout.alignItemsCenter]}>
          {renderCheckIcon()}
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {
                fontSize: 14,
                color: titleColor ? titleColor : Colors.black_232C28,
                fontWeight: '400',
              },
            ]}>
            {plan.category === 'free'
              ? plan?.free_plan?.no_of_sells_automotive
              : SubscriptionTime !== 0
              ? plan?.yearly_plan?.no_of_sells_automotive
              : plan?.monthly_plan?.no_of_sells_automotive}{' '}
            Automotive listings
          </Text>
        </View>
      ) : null}
      {plan?.unlimited_selling ? (
        <View
          style={[Layout.row, Gutters.littleTMargin, Layout.alignItemsCenter]}>
          {renderCheckIcon()}
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {
                fontSize: 14,
                color: titleColor ? titleColor : Colors.black_232C28,
                fontWeight: '400',
              },
            ]}>
            Unlimited Automotive listings
          </Text>
        </View>
      ) : null}
      {!plan?.unlimited_selling &&
      (plan?.category === 'free'
        ? plan?.free_plan?.no_of_sells_property
        : plan?.monthly_plan?.no_of_sells_property > 0) ? (
        <View
          style={[Layout.row, Gutters.littleTMargin, Layout.alignItemsCenter]}>
          {renderCheckIcon()}
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {
                fontSize: 14,
                color: titleColor ? titleColor : Colors.black_232C28,
                fontWeight: '400',
              },
            ]}>
            {plan?.category === 'free'
              ? plan?.free_plan?.no_of_sells_property
              : SubscriptionTime !== 0
              ? plan?.yearly_plan?.no_of_sells_property
              : plan?.monthly_plan?.no_of_sells_property}{' '}
            Property listings
          </Text>
        </View>
      ) : null}
      {plan?.unlimited_selling ? (
        <View
          style={[Layout.row, Gutters.littleTMargin, Layout.alignItemsCenter]}>
          {renderCheckIcon()}
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {
                fontSize: 14,
                color: titleColor ? titleColor : Colors.black_232C28,
                fontWeight: '400',
              },
            ]}>
            Unlimited Property listings
          </Text>
        </View>
      ) : null}
      {plan?.allow_ichat ? (
        <View
          style={[Layout.row, Gutters.littleTMargin, Layout.alignItemsCenter]}>
          {renderCheckIcon()}
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {
                fontSize: 14,
                color: titleColor ? titleColor : Colors.black_232C28,
                fontWeight: '400',
              },
            ]}>
            iChat
          </Text>
        </View>
      ) : null}
      {plan?.allow_irate ? (
        <View
          style={[Layout.row, Gutters.littleTMargin, Layout.alignItemsCenter]}>
          {renderCheckIcon()}
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {
                fontSize: 14,
                color: titleColor ? titleColor : Colors.black_232C28,
                fontWeight: '400',
              },
            ]}>
            iRate
          </Text>
        </View>
      ) : null}
      {plan?.allow_motorcentral_import ? (
        <View
          style={[Layout.row, Gutters.littleTMargin, Layout.alignItemsCenter]}>
          {renderCheckIcon()}
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {
                fontSize: 14,
                color: titleColor ? titleColor : Colors.black_232C28,
                fontWeight: '400',
              },
            ]}>
            {t('common:motorcentral_data_import')}
          </Text>
        </View>
      ) : null}

      <View
        style={[Layout.row, Gutters.littleTMargin, Layout.alignItemsCenter]}>
        {renderCheckIcon()}
        <Text
          style={[
            Fonts.poppinReg14,
            Gutters.tinyLMargin,
            {
              fontSize: 14,
              color: titleColor ? titleColor : Colors.black_232C28,
              fontWeight: '400',
            },
          ]}>
          {'Sales report'}
        </Text>
      </View>
    </View>
  );
};

export default SubscriptionPointsRender;
