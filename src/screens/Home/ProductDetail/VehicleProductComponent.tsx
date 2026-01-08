import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {useTheme} from '../../../hooks';
import {
  BidAndBuyDetail,
  BidHistory,
  MakeOffer,
  SellerAccount,
  ShippingAndPickup,
} from '.';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {useLazyGetSelectedProductDataQuery} from '../../../services/modules/Listings/getSelectedProductData';
import {useUpdateViewsMutation} from '../../../services/modules/Listings/getSingleListing';
import {useNavigation} from '@react-navigation/native';
import VehicleFeatures from './VehicleFeatures';
import {Colors} from '../../../theme/Variables';
import {showUserAlert} from '../../../utils/helpers';
import {
  dropdownCondition,
  dropdownPaymentOption,
} from '../../../utils/dummyData';
import {allMessages, setAllUserMessages} from '../../../store/chats/chats';
import AuctionWinnerDialog from './AuctionWinnerDialog';
import {sWidth} from '../../../utils/ScreenDimentions';
import AgentCard from './AgentCard';
import BrandCard from './BrandCard';
import {formatExternalLink} from './formatLink';
import {FinanceListing} from '../../../components';
import {useLazyGetFinanceByIdQuery} from '../../../services/accountSettings/financeService';

const SimpleProductComponent = () => {
  // Rename theme Colors to avoid shadowing imported Colors constant for stylesheet
  const {Layout, Colors: ThemeColors, Fonts, Gutters, Images} = useTheme();
  const [showFinance, setShowFinance] = useState(false);
  const [triggerFinanceById, financeByIdResult] = useLazyGetFinanceByIdQuery();
  const {data: financeByIdData, isFetching: financeLoading} = financeByIdResult;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selected_product = useSelector(
    (state: RootState) => state.product?.selected_product,
  );
  const user_data = useSelector((state: RootState) => state.auth?.user_data);
  const token = useSelector((state: RootState) => state.auth?.token);

  const [getSelectedProductData] = useLazyGetSelectedProductDataQuery();
  const [updateViews] = useUpdateViewsMutation();
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  let [retrievingProductData, setRetrievingProductData] = useState(true);
  const getData = useCallback(async () => {
    if (!selected_product?._id) return;
    await getSelectedProductData({product_id: selected_product._id});
    setRetrievingProductData(false);
  }, [getSelectedProductData, selected_product?._id]);

  useEffect(() => {
    getData();
  }, [getData]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (selected_product?._id) {
      updateViews(selected_product._id);
    }
  }, [selected_product?._id, updateViews]);

  useEffect(() => {
    const hasFinance = !!selectedProductData?.finance_id;
    const price = Number(selectedProductData?.buy_now_price);
    if (hasFinance && price > 2500) {
      setShowFinance(true);
      if (selectedProductData?.finance_id) {
        triggerFinanceById(selectedProductData.finance_id);
      }
    } else {
      setShowFinance(false);
    }
  }, [
    selectedProductData?.finance_id,
    selectedProductData?.buy_now_price,
    triggerFinanceById,
  ]);

  const mappedFinance = useMemo(() => {
    const f =
      financeByIdData?.data?.finance ||
      financeByIdData?.finance ||
      financeByIdData;
    if (!f) {
      return null;
    }
    return {
      name: f.name,
      email: f.email,
      image: f.image,
      website_link: f.website_link,
      description: f.description,
      estimated_interest_rate: f.estimated_interest_rate,
      maximum_yearly_terms: f.maximum_yearly_terms,
      minimum_deposit: f.minimum_deposit,
    };
  }, [financeByIdData]);

  const renderItemDetails = (title, value, long) => {
    if (long) {
      return (
        <View>
          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Gutters.xTinyVPadding,
            ]}>
            <Text style={[styles.subheading]}>{title}</Text>
          </View>
          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Gutters.xTinyVPadding,
            ]}>
            <Text style={[styles.description]}>{value ?? '-'}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Gutters.xTinyVPadding,
          ]}>
          <Text style={[styles.subheading, {textTransform: 'none'}]}>
            {title}
          </Text>
          <Text style={[styles.subheading, {maxWidth: '50%'}]}>
            {value ?? '-'}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={[Layout.fill]}>
      <ScrollView style={[Layout.fill]}>
        <Text
          style={[
            Gutters.smallLMargin,
            Fonts.poppinSemiBold12,
            {color: ThemeColors.dark_gray_676C6A, marginRight: 2},
          ]}>
          {selectedProductData.listing_views} views
        </Text>
        <BidAndBuyDetail />

        {selectedProductData?.make_an_offer &&
          selectedProductData?.status !== 'sold' && <MakeOffer />}

        {selectedProductData?.type === 'auction' &&
          selectedProductData?.status === 'sold' &&
          selectedProductData?.buyer?._id === user_data?._id && (
            <AuctionWinnerDialog />
          )}
        {selectedProductData?.type === 'auction' && <BidHistory />}

        {showFinance &&
          (mappedFinance ? (
            <View style={[Gutters.smallHPadding, Gutters.smallBMargin]}>
              <FinanceListing
                listingId={selectedProductData?._id}
                productOwnerId={selectedProductData?.user?._id}
                finance={mappedFinance}
                buyNowPrice={Number(selectedProductData?.buy_now_price) || 0}
              />
            </View>
          ) : financeLoading ? (
            <Text style={[Gutters.smallLMargin]}>Loading finance...</Text>
          ) : (
            <Text style={[Gutters.smallLMargin]}>
              Finance details unavailable.
            </Text>
          ))}

        {selectedProductData?.user?.branding?.link && (
          <View
            style={[
              Layout.screenWidth,
              Layout.selfCenter,
              Layout.justifyContentBetween,
              Gutters.tinyVMargin,
            ]}>
            <Text style={[Fonts.poppinMed18, Gutters.tinyBMargin]}>
              Website
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  formatExternalLink(selectedProductData?.user?.branding?.link),
                );
              }}>
              <Text style={[Fonts.poppinMed16]}>
                {selectedProductData?.user?.branding?.link}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <VehicleFeatures />

        {retrievingProductData === true ? (
          <></>
        ) : (
          <View
            style={[
              Layout.fullWidth,
              Gutters.borderBWidth,
              Gutters.mediumVPadding,
              {borderColor: Colors.gray_C9C9C9},
            ]}>
            <View style={[Layout.screenWidth, Layout.selfCenter]}>
              <Text
                style={[
                  Fonts.poppinSemiBold22,
                  Gutters.tinyBMargin,
                  {color: Colors.black_232C28},
                ]}>
                Background Check
              </Text>
              <View
                style={[
                  Gutters.tinyVPadding,
                  Gutters.xTinyHPadding,
                  Gutters.borderWidth,
                  Gutters.tinyRadius,
                ]}>
                <View
                  style={[
                    Layout.row,
                    Layout.center,
                    Layout.justifyContentBetween,
                  ]}>
                  <Text
                    style={[
                      Fonts.poppinSemiBold16,
                      {color: Colors.black_232C28},
                    ]}>
                    Stolen Vehicle
                  </Text>
                  {selectedProductData?.vehicle?.reported_stolen === false ? (
                    <View
                      style={[
                        Layout.row,
                        Layout.center,
                        Gutters.tinyVPadding,
                        Gutters.xTinyHPadding,
                        Gutters.tinyRadius,
                        {backgroundColor: Colors.lightGreen_DBF5EC},
                      ]}>
                      <Images.svg.TickRound.default
                        fill={Colors.primary}
                        width={24}
                        height={24}
                      />
                      <Text
                        style={[
                          Fonts.poppinSemiBold18,
                          Gutters.littleLMargin,
                          {color: Colors.primary},
                        ]}>
                        Passed
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        Layout.row,
                        Layout.center,
                        Gutters.tinyVPadding,
                        Gutters.xTinyHPadding,
                        Gutters.tinyRadius,
                        {backgroundColor: Colors.red_FFB1B1},
                      ]}>
                      <Images.svg.CrossRound.default
                        fill={Colors.red}
                        width={24}
                        height={24}
                      />
                      <Text
                        style={[
                          Fonts.poppinSemiBold18,
                          Gutters.littleLMargin,
                          {color: Colors.red},
                        ]}>
                        Failed
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View
                style={[
                  Gutters.tinyVPadding,
                  Gutters.xTinyHPadding,
                  Gutters.borderWidth,
                  Gutters.tinyRadius,
                  Gutters.xTinyTMargin,
                ]}>
                <View
                  style={[
                    Layout.row,
                    Layout.center,
                    Layout.justifyContentBetween,
                  ]}>
                  <Text
                    style={[
                      Fonts.poppinSemiBold16,
                      {color: Colors.black_232C28},
                    ]}>
                    Damaged import
                  </Text>
                  {selectedProductData?.vehicle?.imported_damaged === false ? (
                    <View
                      style={[
                        Layout.row,
                        Layout.center,
                        Gutters.tinyVPadding,
                        Gutters.xTinyHPadding,
                        Gutters.tinyRadius,
                        {backgroundColor: Colors.lightGreen_DBF5EC},
                      ]}>
                      <Images.svg.TickRound.default
                        fill={Colors.primary}
                        width={24}
                        height={24}
                      />
                      <Text
                        style={[
                          Fonts.poppinSemiBold18,
                          Gutters.littleLMargin,
                          {color: Colors.primary},
                        ]}>
                        Passed
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        Layout.row,
                        Layout.center,
                        Gutters.tinyVPadding,
                        Gutters.xTinyHPadding,
                        Gutters.tinyRadius,
                        {backgroundColor: Colors.red_FFB1B1},
                      ]}>
                      <Images.svg.CrossRound.default
                        fill={Colors.red}
                        width={24}
                        height={24}
                      />
                      <Text
                        style={[
                          Fonts.poppinSemiBold18,
                          Gutters.littleLMargin,
                          {color: Colors.red},
                        ]}>
                        Failed
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        <View
          style={[
            Layout.screenWidth,
            Gutters.xTinyTMargin,
            Layout.selfCenter,
            Gutters.tinyBMargin,
          ]}>
          <Text style={[Fonts.poppinSemiBold22, Gutters.tinyBMargin]}>
            Vehicle Information
          </Text>

          {renderItemDetails('Make', selectedProductData?.make)}
          {renderItemDetails('Model', selectedProductData.model)}
          {!!selectedProductData?.vehicle?.model_detail &&
            renderItemDetails(
              'Model details',
              selectedProductData?.vehicle?.model_detail,
              true,
            )}

          {!!selectedProductData?.vehicle?.import_history &&
            renderItemDetails(
              'Import history',
              selectedProductData?.vehicle?.import_history,
            )}
          {renderItemDetails('Body Style', selectedProductData?.vehicle?.body)}
          {!!selectedProductData?.vehicle?.no_of_seats &&
            renderItemDetails(
              'Seats',
              selectedProductData?.vehicle?.no_of_seats,
            )}
          {!!selectedProductData?.vehicle?.no_of_doors &&
            renderItemDetails(
              'Doors',
              selectedProductData?.vehicle?.no_of_doors,
            )}
          {!!selectedProductData?.vehicle?.previous_owners &&
            renderItemDetails(
              'Previous owners',
              selectedProductData?.vehicle?.previous_owners,
            )}
          {renderItemDetails('Year', selectedProductData?.vehicle?.year)}
          {selectedProductData?.vehicle?.kilometers ? (
            renderItemDetails(
              'Kilometers',
              selectedProductData?.vehicle?.kilometers,
            )
          ) : (
            <></>
          )}
          {!!selectedProductData?.vehicle?.color &&
            renderItemDetails('Colour', selectedProductData?.vehicle?.color)}
          {!!selectedProductData?.vehicle?.vin &&
            renderItemDetails('VIN Number', selectedProductData?.vehicle?.vin)}
          {renderItemDetails(
            'Condition',
            selectedProductData?.condition === dropdownCondition[0].value
              ? dropdownCondition[0].key
              : dropdownCondition[1].key,
          )}

          {renderItemDetails(
            'Description',
            selectedProductData?.description,
            true,
          )}
        </View>

        <View style={[Layout.screenWidth, Layout.selfCenter, {gap: 20}]}>
          {selectedProductData?.defaultAgents?.map(v => (
            <AgentCard
              agent={v}
              logo={selectedProductData?.user?.branding?.logo}
            />
          ))}
          {selectedProductData?.agents?.map(v => (
            <AgentCard
              agent={v}
              logo={selectedProductData?.user?.branding?.logo}
            />
          ))}
          {selectedProductData?.user?.branding?.name && (
            <BrandCard branding={selectedProductData.user.branding} />
          )}
        </View>

        <ShippingAndPickup />

        {selectedProductData?.listing_type !== 'property' && (
          <View
            style={[
              Layout.fullWidth,
              Gutters.xTinyTMargin,
              Gutters.smallTPadding,
              {borderColor: Colors.gray_C9C9C9},
            ]}>
            <View style={[Layout.screenWidth, Layout.selfCenter]}>
              <Text style={[Fonts.poppinSemiBold22]}>{'Payment Option'}</Text>
              <View
                style={[
                  Layout.row,
                  Layout.justifyContentBetween,
                  Gutters.xTinyVPadding,
                  Gutters.tinyTMargin,
                  Gutters.tinyHPadding,
                  {
                    backgroundColor: Colors.white,
                  },
                ]}>
                <Text style={[styles.subheading]}>
                  {selectedProductData?.payment_option ===
                  dropdownPaymentOption[0]?.value
                    ? dropdownPaymentOption[0]?.key
                    : selectedProductData?.payment_option ===
                      dropdownPaymentOption[1]?.value
                    ? dropdownPaymentOption[1]?.key
                    : selectedProductData?.payment_option ===
                      dropdownPaymentOption[2]?.value
                    ? dropdownPaymentOption[2]?.key
                    : ''}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View
          style={[
            Layout.screenWidth,
            Layout.selfCenter,
            Gutters.tinyTMargin,
            Gutters.largeBMargin,
          ]}>
          <Text
            style={[
              Fonts.poppinSemiBold20,
              Gutters.tinyBMargin,
              {color: Colors.black_232C28},
            ]}>
            Seller
          </Text>
          <SellerAccount />
        </View>
      </ScrollView>
      {selectedProductData?.user?._id !== user_data?._id ||
      selectedProductData?.status === 'sold' ? (
        <View
          style={[
            Layout.row,
            Layout.center,
            {
              height: 100,
              backgroundColor: Colors.black_232C28,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              if (token == null) {
                showUserAlert(navigation);
                return;
              }
              dispatch(setAllUserMessages([{}]));
              dispatch(allMessages([]));
              navigation.navigate('ChatDetail', {
                listing: selectedProductData,
                seller_id: selectedProductData?.user?._id,
                from_user:
                  selectedProductData?.user?._id != user_data?._id
                    ? selectedProductData?.user
                    : selectedProductData?.buyer,
              });
            }}
            style={[
              Gutters.smallHPadding,
              Layout.center,
              Gutters.tinyRadius,
              Layout.row,
              {
                height: 50,
                backgroundColor: Colors.white,
                width: sWidth(100) - 40,
              },
            ]}>
            <View style={[Gutters.littleRMargin, {opacity: 1}]}>
              <Images.svg.chatMessages.default
                // fill={Colors.black}
                height={25}
                width={25}
              />
            </View>
            <Text
              style={[Fonts.poppinSemiBold18, {color: Colors.black_232C28}]}>
              {selectedProductData?.user?._id !== user_data?._id
                ? 'Message Seller'
                : 'Message Buyer'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default SimpleProductComponent;
const styles = StyleSheet.create({
  subheading: {
    color: Colors.black_232C28,
    fontSize: 16,
    fontWeight: '500',
    // textTransform: 'capitalize',
  },
  description: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
});
