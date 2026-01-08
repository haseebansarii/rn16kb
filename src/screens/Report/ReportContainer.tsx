import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {Graph, ISellIBuy, TableView} from '.';
import {CustomHeader, TextRegular, TextSemiBold} from '../../components';
import {useTheme} from '../../hooks';
import {
  useLazyGetReportProductsQuery,
  useLazyGetReportsUserQuery,
} from '../../services/profileTab/reportsUser';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import i18next from 'i18next';
import {formatNumberFloat} from '../../utils/helpers';
import {RootState} from '../../store/store';
import {sHight} from '../../utils/ScreenDimentions';
import moment from 'moment';
type Props = {
  navigation: any;
};

const ReportContainer = ({navigation}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [getUserReports] = useLazyGetReportsUserQuery();
  const [getReportsProduct] = useLazyGetReportProductsQuery();

  const userReports = useSelector(
    (state: RootState) => state?.profileTab?.userReports,
  );
  const productsReport = useSelector(
    (state: RootState) => state?.profileTab?.productsReport,
  );

  useEffect(() => {
    getUserReports('');
  }, []);
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = sHight(40);

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const LoadMoreRandomData = () => {
    setIsLoadingBottom(true);

    let formattedFrom = fromDate && moment(fromDate).format('YYYY-MM-DD');
    let formattedTo = toDate && moment(toDate).format('YYYY-MM-DD');
    getReportsProduct({
      fromDate: formattedFrom,
      toDate: formattedTo,
      skip: productsReport?.items?.length || 0,
    }).finally(() => setIsLoadingBottom(false));
  };

  type PropsReportCard = {
    progress: string;
  };

  const ReportCard = ({progress}: PropsReportCard) => {
    return (
      <View style={[Gutters.smallPadding]}>
        <LinearGradient
          colors={['#2E453C', '#215F47', '#2B463C']}
          style={[
            Layout.center,
            Layout.fullWidth,
            {height: 184, borderRadius: 8},
          ]}>
          <View
            style={[
              Layout.center,
              Gutters.smallPadding,
              Layout.justifyContentBetween,
            ]}>
            <TextSemiBold
              text={t('common:all_listing')}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
            />
            <View style={[Layout.center, Gutters.smallTMargin]}>
              <TextSemiBold
                text={progress}
                textStyle={[Fonts.poppinBold60, {color: Colors.white}]}
              />
              <TextSemiBold
                text={t('common:item')}
                textStyle={[Fonts.poppinSemiBold20, {color: Colors.white}]}
              />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const RenderSeprator = () => (
    <View
      style={[
        Gutters.tinyVMargin,
        {backgroundColor: Colors.gray_161C24, height: 1},
      ]}
    />
  );

  const renderItemSalesSummary = (title, value, total) => {
    return (
      <View
        style={[
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,
        ]}>
        <TextRegular
          text={title}
          textStyle={[
            total ? Fonts.poppinSemiBold20 : Fonts.poppinSemiBold18,
            {
              textTransform: 'none',
              color: Colors.black_232C28,
            },
          ]}
        />
        <TextRegular
          text={`${t('common:nz')} ${formatNumberFloat(value)}`}
          textStyle={[
            total ? Fonts.poppinSemiBold20 : Fonts.poppinSemiBold18,
            {
              textTransform: 'none',
              color: Colors.black_232C28,
            },
          ]}
        />
      </View>
    );
  };

  const SalesSummaryRender = () => {
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
        <RenderSeprator />
        {renderItemSalesSummary(
          t('common:international_sale'),
          userReports?.international_sales,
        )}
        <RenderSeprator />
        {renderItemSalesSummary(
          t('common:local_sale'),
          userReports?.local_sales,
        )}
        <RenderSeprator />
        {renderItemSalesSummary(
          t('common:total_sales'),
          userReports?.total_sales,
          true,
        )}
      </View>
    );
  };
  type PropsBidsWonLoss = {
    data: string;
    title: string;
  };
  const BidsWonLoss = ({data, title}: PropsBidsWonLoss) => {
    return (
      <View style={[Gutters.smallHPadding, Gutters.littleTMargin]}>
        <View
          style={[
            Layout.fullWidth,
            Gutters.littleTMargin,

            {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              backgroundColor: Colors.white,
              elevation: 5,
              borderRadius: 8,
            },
          ]}>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Gutters.smallPadding,
            ]}>
            <TextSemiBold
              text={title}
              textStyle={[
                Fonts.poppinSemiBold20,
                {
                  textTransform: 'none',
                  color: Colors.black_232C28,
                },
              ]}
            />
            <TextSemiBold text={data} textStyle={[{color: Colors.primary}]} />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:report')}
        navigation={navigation}
        rightIcon={true}
      />
      <ScrollView
        contentContainerStyle={[Layout.flexGrow, Gutters.smallBPadding]}
        showsVerticalScrollIndicator={false}
        style={[Layout.fill, {backgroundColor: Colors.light_grayF4F4F4}]}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            if (
              productsReport?.items &&
              productsReport?.items?.length < productsReport?.pagination?.total
            ) {
              LoadMoreRandomData();
            }
          }
        }}
        scrollEventThrottle={16}>
        <ReportCard progress={userReports?.total} />
        <ISellIBuy isell={userReports?.isell} ibuy={userReports?.ibuy} />
        <SalesSummaryRender />
        {/* <Graph /> */}
        <BidsWonLoss
          title={t('common:sold_listings')}
          data={userReports?.sold}
        />
        <BidsWonLoss
          title={t('common:bids_iwon')}
          data={userReports?.bids_iwon}
        />
        <BidsWonLoss
          title={t('common:bids_ilost')}
          data={userReports?.bids_ilost}
        />
        <View style={[Layout.fill]}>
          <TableView setFromDateFunc={setFromDate} setToDateFunc={setToDate} />
        </View>
        <View>
          {isLoadingBottom ? (
            <View
              style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportContainer;
