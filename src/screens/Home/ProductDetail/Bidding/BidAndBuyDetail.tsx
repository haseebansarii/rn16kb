import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../../hooks';
import moment from 'moment';
import {product_details} from '../../../../utils/dummyData';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {buyingType} from '../../../../store/productDetail/ProductDetailSlice';
import {CustomToggleButton} from '../../../../components';
import {formatNumberFloat, toastDangerMessage} from '../../../../utils/helpers';

const BidAndBuyDetail = ({onValueChange}: any) => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  const [biddingForm, setBiddingForm] = useState({
    bid_amount: '',
    autoBid: false,
  });
  const [showInput, setShowInput] = useState(true);

  const toggleHandler = (props: any) => {
    if (props?.flag == 'auto_bid') {
      setBiddingForm({...biddingForm, autoBid: props?.value});
    }
    // console.log('bidding form :::: ', biddingForm);
  };

  const newBiddingAmountfunc = () => {
    if (biddingForm?.bid_amount.length <= 0) {
      setShowInput(true);
      toastDangerMessage('input field is empty');
    } else {
      setShowInput(false);
      onValueChange(biddingForm?.bid_amount);
    }
  };

  return (
    <View style={[Layout.screenWidth, Layout.selfCenter, Gutters.tinyTMargin]}>
      <View style={[Gutters.tinyTMargin, Gutters.tinyBPadding]}>
        <Text
          style={[
            Fonts.poppinSemiBold24,
            Gutters.tinyBMargin,
            Gutters.littleTMargin,
          ]}>
          Place a bid
        </Text>
        <Text style={[Fonts.poppinMed16]}>{selectedProductData.title}</Text>
      </View>
      <View
        style={[
          Gutters.borderWidth,
          Gutters.tinyHPadding,
          Gutters.smallVPadding,
          Gutters.tinyVMargin,
          Gutters.tinyRadius,
          {
            backgroundColor: Colors.lightGreen_DBF5EC,
            borderColor: Colors.primary,
          },
        ]}>
        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
          ]}>
          <View>
            <Text
              style={[
                Fonts.poppinMed16,
                {color: Colors.black_232C28, fontWeight: '500'},
              ]}>
              Current Bid:
            </Text>
          </View>
          <View>
            <Text style={[Fonts.poppinMed20, {color: Colors.black_232C28}]}>
              {t('common:nz') +
                ' ' +
                formatNumberFloat(
                  selectedProductData?.auction_data?.current_bid,
                )}
            </Text>
          </View>
        </View>

        {showInput === true ? (
          <View style={[Layout.row, Gutters.xTinyVMargin]}>
            <TextInput
              value={biddingForm.bid_amount}
              placeholder={`Enter Bid Amount ${t('common:nz')} ${
                selectedProductData?.auction_data?.current_bid
              }`}
              placeholderTextColor={Colors.dark_gray_676C6A}
              style={[
                Layout.fill,
                Gutters.tinyLPadding,
                Gutters.tinyTLRadius,
                Gutters.tinyBLRadius,
                Fonts.poppinReg14,
                {
                  backgroundColor: Colors.white,
                  height: 60,
                  borderWidth: 1,
                  borderColor: Colors.gray_C9C9C9,
                  fontWeight: '500',
                },
              ]}
              onChangeText={bid_amount =>
                setBiddingForm({...biddingForm, bid_amount})
              }
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={newBiddingAmountfunc}
              style={[
                Layout.center,
                Gutters.tinyTRRadius,
                Gutters.tinyBRRadius,
                {
                  width: 100,
                  backgroundColor:
                    biddingForm?.bid_amount.length >= 1
                      ? Colors.primary
                      : Colors.dark_gray_676C6A,
                },
              ]}>
              <Text
                style={[
                  Fonts.poppinReg16,
                  {fontWeight: '600', color: Colors.white},
                ]}>
                Bid
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,
            ]}>
            <View>
              <Text
                style={[
                  Fonts.poppinMed16,
                  {color: Colors.black_232C28, fontWeight: '500'},
                ]}>
                Your Bid:
              </Text>
            </View>
            <View>
              <Text
                style={[
                  Fonts.poppinMed20,
                  {color: Colors.black_232C28, fontWeight: '600'},
                ]}>
                {t('common:nz') + ' ' + biddingForm.bid_amount}
              </Text>
            </View>
          </View>
        )}
        {/* <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
            Gutters.tinyBMargin,
          ]}>
          <View>
            <Text
              style={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28, fontWeight: '600'},
              ]}>
              Auto Bid
            </Text>
          </View>
          <View>
            <CustomToggleButton
              flag="auto_bid"
              value={biddingForm.autoBid}
              toggleHandler={toggleHandler}
            />
          </View>
        </View>
        <View>
          <Text style={[Fonts.poppinMed10, {color: Colors.dark_gray_676C6A}]}>
            {product_details.auto_bid_text}
          </Text>
        </View> */}
      </View>
    </View>
  );
};

export default BidAndBuyDetail;
