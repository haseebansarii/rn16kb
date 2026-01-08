import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {FeedBack, Rating, ReviewCard, UserProfile} from '.';
import {
  CustomHeader,
  CustomList,
  CustomLoading,
  CustomMenu,
  CustomPageLoading,
  CustomStarRating,
  TextBold,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {useLazyGetReviewListingDataQuery} from '../../services/modules/ReviewListing/getReviewListingData';
import {Listing, ProductListing} from '../Home';
import {RootState} from '../../store/store';
import {
  useLazyGetRatingQuery,
  useLazyGetUserListQuery,
} from '../../services/iRate';
import {sHight, sWidth} from '../../utils/ScreenDimentions';

type Props = {
  navigation: any;
  route: any;
};

const RatingReviewsContainer = ({navigation, route}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const [selected, setSelected] = useState(0);
  const [switchBottom, setSwitchBottom] = useState(true);
  // const [listingData, setLitingData] = useState({});
  // listDataUser
  const listDataUser = useSelector((state: any) => state?.list?.listDataUser);

  const header_text = route?.params?.header_text;

  const [getReviewListingData, {isLoading}] =
    useLazyGetReviewListingDataQuery();
  const [getReviewStats, {}] = useLazyGetRatingQuery();

  const [getUserListing] = useLazyGetUserListQuery();
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const reviewListData = useSelector(
    (state: any) => state?.reviewListData?.reviewListData,
  );

  const [userReviewStats, setUserReviewStats] = useState({});
  const getInitialDataSeller = async () => {
    if (route?.params?.id) {
      let data = await getReviewStats(route?.params?.id);
      setUserReviewStats(data?.data);
      await getUserListing({
        id: route?.params?.id,
        skip: 0,
        limit: 30,
      });
      // setLitingData(data2?.data || {});
    }
  };

  const getData = async (skip = 0) => {
    if (selected === 0) {
      await getReviewListingData({id: route?.params?.id, skip});
    } else if (selected === 1) {
      await getReviewListingData({
        reviewType: 'seller_to_buyer',
        id: route?.params?.id,
        skip: skip,
      });
    } else {
      await getReviewListingData({
        reviewType: 'buyer_to_seller',
        id: route?.params?.id,
        skip: skip,
      });
    }
    getInitialDataSeller();
    setTimeout(() => {
      setIsLoadingBottom(false);
    }, 1000);
  };

  useEffect(() => {
    getData();
  }, [selected]);

  const LoadMoreRandomData = async () => {
    if (switchBottom) {
      LoadMoreRandomDataSeller();
    } else {
      LoadMoreRandomDataReview();
    }
  };
  const LoadMoreRandomDataReview = async () => {
    console.log('>> LoadMoreRandomDataReview ');
    setIsLoadingBottom(true);
    getData(reviewListData?.items?.length);
  };
  const LoadMoreRandomDataSeller = async () => {
    console.log('>> LoadMoreRandomDataSeller ');

    setIsLoadingBottom(true);
    if (route?.params?.id) {
      //   // let data = await getReviewStats(route?.params?.id);
      //   // setUserReviewStats(data?.data);
      console.log(
        '>>>listDataUser?.pagination?.skip ',
        listDataUser?.pagination?.skip,
      );

      let res = await getUserListing({
        id: route?.params?.id,
        skip: listDataUser?.pagination?.skip + 30,
      }).finally(() => {
        setIsLoadingBottom(false);
      });
      // let updatedData = {
      //   items: [...listingData?.items, ...res?.data?.items],
      //   pagination: res?.data?.pagination,
      // };
      // setLitingData(updatedData || {});
    }
  };
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = sHight(60);

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  console.log('>> listDataUser?.items 11 ', listDataUser?.items?.length);

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={header_text ? header_text : t('common:rating_reviews')}
        rightIcon={true}
        navigation={navigation}
        notification={5}
        onPressRight={() => {
          // console.log('pressed');
        }}
      />
      <ScrollView
        style={{flex: 1}}
        // showsVerticalScrollIndicator={false}

        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            console.log('>>>switchBottom ', switchBottom);

            if (
              !switchBottom &&
              reviewListData?.items &&
              reviewListData?.items?.length < reviewListData?.pagination?.total
            ) {
              LoadMoreRandomDataReview();
            } else if (
              switchBottom &&
              listDataUser?.items &&
              listDataUser?.items?.length < listDataUser?.pagination?.total
            ) {
              LoadMoreRandomDataSeller();
            }
          }
        }}
        scrollEventThrottle={6}>
        <View
          style={[
            Layout.justifyContentBetween,
            Gutters.smallPadding,
            {backgroundColor: Colors.green_075838},
          ]}>
          <UserProfile seller={route?.params?.id ? true : false} />
          <FeedBack
            data={userReviewStats}
            seller={route?.params?.id ? true : false}
          />
          {route?.params?.id ? (
            <View style={[Layout.fullWidth, Layout.center]}>
              <TouchableOpacity
                style={[
                  Gutters.tinyVPadding,
                  Gutters.regularHPadding,
                  // Gutters.tinyRadius,
                  Gutters.smallTMargin,

                  {backgroundColor: Colors.primary, borderRadius: 8},
                ]}
                onPress={() => {
                  setSwitchBottom(!switchBottom);
                }}>
                <Text style={[Fonts.poppinSemiBold16, {color: Colors.white}]}>
                  {switchBottom ? 'View Reviews' : 'View Listings'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {!switchBottom && (
          <View style={[Layout.screenWidth, Layout.selfCenter]}>
            <CustomMenu
              data={[
                {key: t('common:all'), valaue: '0'},
                {key: t('common:buying'), valaue: '1'},
                {key: t('common:selling'), valaue: '2'},
              ]}
              cutomStyle={[
                Gutters.smallVMargin,
                {backgroundColor: Colors.gray_C9C9C9},
              ]}
              selected={selected}
              setSelected={setSelected}
            />
          </View>
        )}
        {switchBottom ? (
          <View style={[Layout.fill]}>
            <View
              style={[
                Gutters.smallTMargin,
                Layout.selfCenter,
                Gutters.littleBMargin,
                {width: '94%'},
              ]}>
              <Text style={[Fonts.poppinSemiBold20]}>Seller Listings</Text>
            </View>
            <View style={[Layout.fill]}>
              <ProductListing
                data={listDataUser?.items || []}
                loadMore={LoadMoreRandomData}
                isSeller={true}
                // getInitialDataSeller={getInitialDataSeller}
              />

              {/* <Listing
                data={listingData}
                screen="restinReview"
                filter={false}
              /> */}
            </View>
            {isLoadingBottom ? (
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // position: 'absolute',
                  // bottom: 0,
                  width: sWidth(100),
                  backgroundColor: Colors.white,
                }}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : null}
          </View>
        ) : (
          <View style={[Layout.fill]}>
            {reviewListData?.items?.length > 0 ? (
              <CustomList
                data={reviewListData?.items}
                renderItem={({item, index}) => {
                  const {
                    _id,
                    type,
                    comment,
                    rating,
                    report_status,
                    from_user,
                    listing,
                    rating_label,
                    created_at,
                  } = item;
                  return (
                    <ReviewCard
                      itemReview={item}
                      key={index}
                      id={_id}
                      type={type}
                      getReviewListingData={getData}
                      report_status={report_status}
                      created_at={created_at}
                      from_user={from_user}
                      rating_label={rating_label}
                      rating={rating}
                      productName={listing?.title}
                      comment={comment}
                    />
                  );
                }}
              />
            ) : (
              <View style={[Layout.fill, Layout.center]}>
                <TextSemiBold
                  text="No data found "
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    {color: Colors.black_232C28},
                  ]}
                />
              </View>
            )}
          </View>
        )}
        <CustomLoading isLoading={isLoading} />
      </ScrollView>
    </View>
  );
};

export default RatingReviewsContainer;
