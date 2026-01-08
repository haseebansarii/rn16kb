import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {BuyingDetail, DeliveryDetail, ShippingDetail, Summary} from '.';
import {useTheme} from '../../../../hooks';
import PaymentOption from '../PaymentOption';
import {CustomButton} from '../../../../components';
import {Colors} from '../../../../theme/Variables';
import {useDispatch, useSelector} from 'react-redux';
import {useProductBuyNowApiMutation} from '../../../../services/BuyNow/buyNowApi';
import {t} from 'i18next';
import {buyingType} from '../../../../store/productDetail/ProductDetailSlice';
import {toastDangerMessage} from '../../../../utils/helpers';

const BuyingComponent = () => {
  const {Layout, Gutters, Colors, Fonts, Images} = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useDispatch();
  const [pickUpAddress, setPickUpAddress] = useState('');
  const [totalSum, setTotalSum] = useState(0);
  // const [selected, setSelected] = useState({});
  const [productBuyNowApi, {isLoading}] = useProductBuyNowApiMutation();
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  const user_data = useSelector(state => state.auth?.user_data);
  const [buyNowShipping, setBuyNowShipping] = useState({});

  const handleSubmit = () => {
    // console.log('pressed');
    if (!buyNowShipping?.value) {
      toastDangerMessage('Please select shipping');
    } else {
      let reqObj = {
        buy_now_delivery_address: selectedProductData?.user?.address,
        buy_now_instructions: pickUpAddress,
        buy_now_phone: phoneNumber,
        buy_now_shipping: buyNowShipping?.value,
      };

      productBuyNowApi({
        payload: reqObj,
        productId: selectedProductData?._id,
      });
    }
  };

  const shippingCostAddFunc = (item, index) => {
    // setSelected(index);
    setBuyNowShipping(item);
    // if (selectedProductData?.pickup_available === true) {
    //   setSelected(index);
    //   setBuyNowShipping(item);
    // } else {
    //   if (selected === null) {
    //     setSelected(index);
    //     setBuyNowShipping(item);
    //   } else {
    //     setSelected(null);
    //   }
    // }
  };

  const pickupOwnFunc = item => {
    // setSelected(null);
    setBuyNowShipping({option_name: 'Pickup', value: 'pickup', amount: null});
  };

  const cancelFunc = () => {
    dispatch(buyingType(null));
  };

  useEffect(() => {
    setTotalSum(
      parseFloat(selectedProductData?.buy_now_price) +
        parseFloat(
          buyNowShipping?.value
            ? buyNowShipping?.value == 'specify_costs'
              ? buyNowShipping?.amount
              : 0
            : 0,
        ),
    );
  }, [buyNowShipping]);

  console.log('selectedProductData :::: ', selectedProductData);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={[Layout.fill]}>
      <BuyingDetail />

      <View style={[Layout.fullWidth, Gutters.tinyVMargin]}>
        <View style={[Layout.screenWidth, Layout.selfCenter]}>
          <Text style={[Fonts.poppinSemiBold20]}>{t('shipping')}</Text>
          <FlatList
            data={selectedProductData?.shipping_methods}
            renderItem={({item, index}) => {
              return (
                <View style={[Gutters.xTinyTMargin, Layout.overflow]}>
                  <TouchableOpacity
                    onPress={() => shippingCostAddFunc(item, index)}
                    style={[
                      Layout.center,
                      Layout.fullWidth,
                      Gutters.tinyRadius,
                      Gutters.borderWidth,
                      Gutters.tinyRadius,
                      {
                        height: 80,
                        backgroundColor:
                          buyNowShipping?.value == item.value
                            ? Colors.lightGreen_DBF5EC
                            : Colors.white,
                        borderColor: Colors.primary,
                      },
                    ]}>
                    <View
                      style={[
                        Layout.screenWidth,
                        Layout.selfCenter,
                        Layout.row,
                        Layout.alignItemsCenter,
                      ]}>
                      <View
                        style={[
                          Gutters.tinyRMargin,
                          Layout.center,
                          {
                            height: 20,
                            width: 20,
                            borderWidth:
                              buyNowShipping?.value == item.value ? 1 : 1,
                            borderColor:
                              buyNowShipping?.value == item.value
                                ? Colors.primary
                                : Colors.primary,

                            backgroundColor: Colors.transparent,
                            borderRadius: 20 / 2,
                          },
                        ]}>
                        {buyNowShipping?.value == item.value ? (
                          <View
                            style={[
                              {
                                backgroundColor: Colors.primary,
                                width: 10,
                                height: 10,
                                borderRadius: 20 / 2,
                              },
                            ]}
                          />
                        ) : null}
                      </View>
                      <View
                        style={[
                          Layout.row,
                          Layout.alignItemsCenter,
                          Layout.fill,
                        ]}>
                        <Text
                          style={[
                            Fonts.poppinMed14,
                            {fontWeight: '600', color: Colors.dark_gray_676C6A},
                          ]}>
                          {item?.option_name}
                        </Text>
                        <Text
                          style={[
                            Fonts.poppinMed14,
                            {fontWeight: '600', color: Colors.dark_gray_676C6A},
                          ]}>
                          {item?.amount &&
                            ` - ${t('common:nz')} ${item?.amount}`}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          {selectedProductData?.pickup_available === true &&
          !selectedProductData?.shipping_methods.some(
            option => option.value === 'pickup',
          ) ? (
            <View style={[Gutters.xTinyTMargin]}>
              <TouchableOpacity
                onPress={pickupOwnFunc}
                style={[
                  Layout.center,
                  Layout.fullWidth,
                  Gutters.tinyRadius,
                  Gutters.borderWidth,
                  Gutters.tinyRadius,
                  {
                    height: 80,
                    backgroundColor:
                      buyNowShipping?.value == 'pickup'
                        ? Colors.lightGreen_DBF5EC
                        : Colors.white,

                    borderColor: Colors.primary,
                  },
                ]}>
                <View
                  style={[
                    Layout.screenWidth,
                    Layout.selfCenter,
                    Layout.row,
                    Layout.alignItemsCenter,
                  ]}>
                  <View
                    style={[
                      Gutters.tinyRMargin,
                      Layout.center,
                      {
                        height: 20,
                        width: 20,
                        borderWidth: 1,
                        borderColor: Colors.primary,

                        backgroundColor: Colors.transparent,
                        borderRadius: 20 / 2,
                      },
                    ]}>
                    {buyNowShipping?.value == 'pickup' ? (
                      <View
                        style={[
                          {
                            backgroundColor: Colors.primary,
                            width: 10,
                            height: 10,
                            borderRadius: 20 / 2,
                          },
                        ]}
                      />
                    ) : null}
                  </View>

                  <View style={{width: '90%'}}>
                    <Text
                      style={[
                        Fonts.poppinMed16,
                        {fontWeight: '600', color: Colors.dark_gray_676C6A},
                      ]}>
                      I intend to pick-up
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          {buyNowShipping?.value && buyNowShipping?.value !== 'dont_know' ? (
            <View style={[Gutters.xTinyTMargin]}>
              {((buyNowShipping?.value === 'specify_costs' ||
                buyNowShipping?.value === 'free_shipping') &&
                user_data?.address) ||
              buyNowShipping?.value === 'pickup' ? (
                <View>
                  <Text style={[Fonts.poppinSemiBold20, Gutters.xTinyBMargin]}>
                    {buyNowShipping?.value === 'pickup'
                      ? 'Pickup address'
                      : 'Delivery Address'}
                  </Text>
                  <TouchableOpacity
                    disabled={true}
                    // onPress={() => setSelected(0)}
                    style={[
                      Layout.center,
                      Layout.fullWidth,
                      Gutters.tinyRadius,
                      Gutters.borderWidth,
                      Gutters.tinyRadius,
                      {
                        height: 100,
                        backgroundColor: Colors.lightGreen_DBF5EC,
                        borderColor: Colors.primary,
                      },
                    ]}>
                    <View
                      style={[
                        Layout.screenWidth,
                        Layout.selfCenter,
                        Layout.row,
                        Layout.alignItemsCenter,
                      ]}>
                      <View
                        style={[
                          Gutters.tinyRMargin,
                          Layout.center,
                          {
                            height: 20,
                            width: 20,
                            borderWidth: 1,
                            borderColor: Colors.primary,
                            backgroundColor: Colors.white,
                            borderRadius: 20 / 2,
                          },
                        ]}>
                        <View
                          style={[
                            {
                              backgroundColor: Colors.primary,
                              width: 10,
                              height: 10,
                              borderRadius: 20 / 2,
                            },
                          ]}
                        />
                      </View>
                      {buyNowShipping?.value === 'pickup' ? (
                        <Text
                          numberOfLines={2}
                          style={[
                            Fonts.poppinMed16,
                            Gutters.tinyRMargin,
                            {color: Colors.dark_gray_676C6A},
                          ]}>
                          {`Listing is located at ` +
                            selectedProductData?.pickup_location}
                        </Text>
                      ) : buyNowShipping?.value === 'specify_costs' ||
                        buyNowShipping?.value === 'free_shipping' ? (
                        <View style={[{flex: 1}]}>
                          <Text
                            numberOfLines={1}
                            style={[
                              Fonts.poppinMed16,
                              {color: Colors.dark_gray_676C6A},
                            ]}>
                            {user_data?.first_name} {user_data?.last_name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={[
                              Fonts.poppinMed16,
                              Gutters.tinyVMargin,
                              {
                                fontWeight: '600',
                                color: Colors.dark_gray_676C6A,
                              },
                            ]}>
                            {user_data?.address}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {/* <ShippingDetail /> */}
      {/* <DeliveryDetail /> */}
      <View
        style={[Layout.screenWidth, Layout.selfCenter, Gutters.tinyTMargin]}>
        <View>
          <Text style={[Fonts.poppinSemiBold18]}>Phone number (optional)</Text>
          <TextInput
            value={phoneNumber}
            placeholder={`Enter phone number`}
            placeholderTextColor={Colors.dark_gray_676C6A}
            style={[
              Layout.fill,
              Gutters.tinyTMargin,
              Gutters.tinyLPadding,
              Gutters.tinyRadius,
              Fonts.poppinReg16,
              {
                backgroundColor: Colors.white,
                height: 60,
                borderWidth: 1,
                borderColor: Colors.gray_C9C9C9,
                fontWeight: '700',
              },
            ]}
            onChangeText={ph => setPhoneNumber(ph)}
            keyboardType="numeric"
          />
        </View>
        <View style={[Gutters.tinyTMargin]}>
          <Text style={[Fonts.poppinSemiBold18]}>
            Pick-Up Instructions (optional)
          </Text>
          <TextInput
            value={pickUpAddress}
            placeholder={`e.g. Please come around to the back door.`}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor={Colors.dark_gray_676C6A}
            style={[
              Gutters.tinyTMargin,
              Gutters.tinyLPadding,
              Gutters.tinyRadius,
              Fonts.poppinReg16,
              {
                backgroundColor: Colors.white,
                height: 130,
                textAlignVertical: 'top',
                borderWidth: 1,
                borderColor: Colors.gray_C9C9C9,
                fontWeight: '700',
                // minHeight: 100,
              },
            ]}
            onChangeText={address => setPickUpAddress(address)}
          />
        </View>
      </View>

      <PaymentOption />
      {/* <Summary /> */}
      <View
        style={[Layout.screenWidth, Layout.selfCenter, Gutters.smallVMargin]}>
        <Text style={[Fonts.poppinSemiBold22, Gutters.tinyBMargin]}>
          Order Summary
        </Text>
        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Gutters.xTinyVPadding,
            Gutters.tinyHPadding,
            {backgroundColor: Colors.light_grayF4F4F4},
          ]}>
          <Text style={[styles.subheading]}>Item Price</Text>
          <Text style={[styles.subheading]}>
            {t('common:nz') + ' ' + selectedProductData?.buy_now_price}
          </Text>
        </View>
        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Gutters.xTinyVPadding,
            Gutters.tinyHPadding,
          ]}>
          <Text style={[styles.subheading]}>{'Specify Shipping Costs'}</Text>
          <Text style={[styles.subheading]}>
            {t('common:nz')}{' '}
            {buyNowShipping?.value
              ? buyNowShipping?.value == 'specify_costs'
                ? buyNowShipping?.amount
                : 0
              : 0}
          </Text>
        </View>

        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Gutters.xTinyVPadding,
            Gutters.tinyHPadding,
            {backgroundColor: Colors.light_grayF4F4F4},
          ]}>
          <Text style={[styles.subheading]}>Grand Total</Text>
          <View style={[Layout.row]}>
            <Text style={[styles.subheading]}>{t('common:nz')} </Text>
            <Text style={[styles.subheading]}>{' ' + totalSum}</Text>
          </View>
        </View>
      </View>
      <View
        style={[
          Layout.screenWidth,
          Layout.selfCenter,
          Gutters.tinyTMargin,
          Gutters.largeBMargin,
        ]}>
        <View>
          <View
            style={[
              Layout.screenWidth,
              Layout.selfCenter,
              Gutters.smallTMargin,
            ]}>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[
                Layout.center,
                Layout.fullWidth,
                Gutters.tinyRadius,
                {
                  height: 60,
                  backgroundColor: Colors.primary,
                },
              ]}>
              <Text
                style={[
                  Fonts.poppinMed18,
                  {fontWeight: '600', color: Colors.white},
                ]}>
                Buy Now
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              Gutters.xTinyVMargin,
              Layout.screenWidth,
              Layout.selfCenter,
            ]}>
            <TouchableOpacity
              onPress={cancelFunc}
              style={[
                Layout.center,
                Layout.fullWidth,
                Gutters.tinyRadius,
                Gutters.borderWidth,
                Gutters.smallBMargin,
                {
                  height: 60,
                  backgroundColor: Colors.dark_gray_676C6A,
                  borderColor: Colors.dark_gray_676C6A,
                },
              ]}>
              <Text
                style={[
                  Fonts.poppinMed18,
                  {fontWeight: '600', color: Colors.white},
                ]}>
                Go back to listing
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  subheading: {color: Colors.black_232C28, fontSize: 16, fontWeight: '500'},
  description: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
});

export default BuyingComponent;
