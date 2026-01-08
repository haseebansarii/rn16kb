import {StyleSheet, Text, View} from 'react-native';
import React, {memo, useEffect} from 'react';
import {useTheme} from '../../hooks';
import i18next from 'i18next';
import {
  CustomStarRating,
  TextBold,
  TextMedium,
  TextRegular,
} from '../../components';
import {useLazyGetUserFeedBackDataQuery} from '../../services/modules/Feedback/getFeedbackData';
import {useSelector} from 'react-redux';
import Rating from './Rating';
import {formatNumberFloat} from '../../utils/helpers';

type Props = {data: any; seller: any};

const FeedBack = ({data, seller}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();

  const [getUserFeedBackData] = useLazyGetUserFeedBackDataQuery();
  const userFeedBackData = useSelector(
    (state: any) => state?.userFeedBackData?.userFeedBackData,
  );
  const FeedBackArray = [
    {
      text: t('common:positive_feedback_text'),
    },
    {
      text: t('common:neutral_feedback'),
    },
    {
      text: t('common:negative_feedback'),
    },
  ];

  const getData = async () => {
    await getUserFeedBackData({
      // pageName: 'isell',
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const renderItemRating = (data, isBuyer) => {
    return (
      <View style={[Gutters.smallTMargin]}>
        <TextBold
          text={`${t('common:feed_back_text')} ( ${
            isBuyer ? t('common:buyer') : t('common:seller')
          })`}
          textStyle={[{color: Colors.white}]}
        />
        <View
          style={[
            Gutters.littleTMargin,
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
          ]}>
          <TextBold
            text={data?.average ? formatNumberFloat(data?.average) : '0.00'}
            textStyle={[Fonts.poppinBold22, {color: Colors.white}]}
          />
          <TextRegular
            text={`(${data?.total || 0} ${
              data?.total == 1 ? t('common:review') : t('common:reviews')
            })`}
            textStyle={[Fonts.poppinReg16, {color: Colors.white}]}
          />
          <CustomStarRating
            rating={data?.average}
            starSize={20}
            starProps={{
              emptyStarColor: Colors.gray_C9C9C9,
            }}
            customStyle={[Gutters.littleLMargin]}
          />
        </View>
        <View style={[Layout.fullWidth]}>
          <Rating item={data} />
        </View>
        <View
          style={[
            Layout.fullWidth,
            Layout.overflow,
            Gutters.tinyTMargin,
            Gutters.tinyPadding,
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.justifyContentBetween,
            {backgroundColor: Colors.white, borderRadius: 6, height: 77},
          ]}>
          {FeedBackArray?.map((item, index) => {
            const {text} = item;
            return (
              <View
                key={index}
                style={[
                  Layout.center,
                  Layout.fill,

                  {
                    borderRightWidth: index == 0 || index == 1 ? 1 : 0,
                    borderColor: Colors.gray_C9C9C9,
                  },
                ]}>
                <TextBold
                  text={
                    index == 0
                      ? data?.positive || '0'
                      : index == 1
                      ? data?.neutral || '0'
                      : data?.negative || '0'
                  }
                  textStyle={[{color: Colors.black}]}
                />
                <View style={[{width: '60%'}]}>
                  <TextMedium
                    textProps={{
                      numberOfLines: 2,
                    }}
                    text={text}
                    textStyle={[
                      Fonts.poppinMed12,
                      Layout.textAlign,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View>
      {renderItemRating(
        seller
          ? data?.review_stats?.asBuyer
          : userFeedBackData?.review_stats?.asBuyer,
        true,
      )}
      {renderItemRating(
        seller
          ? data?.review_stats?.asSeller
          : userFeedBackData?.review_stats?.asSeller,
        false,
      )}
    </View>
  );
};

export default memo(FeedBack);
