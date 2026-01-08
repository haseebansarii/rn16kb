import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../../hooks';
import {BidAndBuyDetail, Shipping} from '.';
import {CustomToggleButton} from '../../../../components';
import PaymentOption from '../PaymentOption';
import {useDispatch, useSelector} from 'react-redux';
import {useProductApiBiddingMutation} from '../../../../services/bidding/biddingApi';
import {toastDangerMessage} from '../../../../utils/helpers';
import {buyingType} from '../../../../store/productDetail/ProductDetailSlice';

const BiddingComponent = () => {
  const {Layout, Gutters, Colors, Fonts, Images} = useTheme();
  const [outBid, setOutBid] = useState(true);
  const [childValue, setChildValue] = useState(null);
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  const [productApiBidding, {isLoading}] = useProductApiBiddingMutation();

  const [bidShipping, setBidShipping] = useState({});
  const dispatch = useDispatch();
  const handleChildValue = (value: any) => {
    setChildValue(value);
  };

  const toggleHandler = (props: any) => {
    if (props?.flag == 'outbid') {
      setOutBid(props?.value);
    }
    // console.log('outBid ::::: ', outBid);
  };

  const placeBidFunc = () => {
    if (!bidShipping?.value) {
      toastDangerMessage('Please select shipping');
    } else if (childValue != null) {
      // console.log('placing bid');

      let reqObj = {
        outbid_email: outBid,
        amount: parseInt(childValue),
        listing: selectedProductData?._id,
        shipping: bidShipping,
      };

      productApiBidding({
        payload: reqObj,
      });
    } else {
      // console.log('input field is empty');
      toastDangerMessage('Please enter bidding amount');
    }
  };
  const cancelBiddingFunc = () => {
    dispatch(buyingType(null));
    // console.log('canceling bid');
  };
  return (
    <View style={[Layout.fill]}>
      <ScrollView style={[Layout.fill]}>
        <BidAndBuyDetail onValueChange={handleChildValue} />
        <Shipping bidShipping={bidShipping} setBidShipping={setBidShipping} />
        <View
          style={[
            Layout.fullWidth,
            Gutters.borderTWidth,
            Gutters.borderBWidth,
            Gutters.smallVPadding,
            Gutters.xTinyTMargin,
            {borderColor: Colors.gray_C9C9C9},
          ]}>
          <View
            style={[
              Layout.row,
              Layout.screenWidth,
              Layout.selfCenter,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,
            ]}>
            <View>
              <Text
                style={[
                  Fonts.poppinMed18,
                  {color: Colors.black_232C28, fontWeight: '600'},
                ]}>
                {t('common:outbid_heading')}
              </Text>
            </View>
            <View>
              <CustomToggleButton
                flag="outbid"
                value={outBid}
                toggleHandler={toggleHandler}
              />
            </View>
          </View>
        </View>
        <PaymentOption />
        <View
          style={[Layout.screenWidth, Layout.selfCenter, Gutters.smallTMargin]}>
          <TouchableOpacity
            onPress={placeBidFunc}
            style={[
              Layout.center,
              Layout.fullWidth,
              Gutters.tinyRadius,
              {
                height: 60,
                backgroundColor:
                  childValue != null ? Colors.primary : Colors.dark_gray_676C6A,
              },
            ]}>
            <Text
              style={[
                Fonts.poppinMed18,
                {fontWeight: '600', color: Colors.white},
              ]}>
              Place a Bid
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[Gutters.xTinyVMargin, Layout.screenWidth, Layout.selfCenter]}>
          <TouchableOpacity
            onPress={cancelBiddingFunc}
            style={[
              Layout.center,
              Layout.fullWidth,
              Gutters.tinyRadius,
              Gutters.borderWidth,
              Gutters.smallBMargin,
              {
                height: 60,
                backgroundColor: Colors.transparent,
                borderColor: Colors.dark_gray_676C6A,
              },
            ]}>
            <Text
              style={[
                Fonts.poppinMed18,
                {fontWeight: '600', color: Colors.dark_gray_676C6A},
              ]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default BiddingComponent;
