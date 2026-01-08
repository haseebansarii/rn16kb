import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTheme} from '../../../../hooks';
import {product_details} from '../../../../utils/dummyData';

const DeliveryDetail = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();

  return (
    <View
      style={[
        // Gutters.tinyVMargin,
        // Gutters.borderTWidth,
        // Gutters.borderBWidth,
        {borderColor: Colors.gray_C9C9C9},
      ]}>
      <View
        style={[Layout.screenWidth, Layout.selfCenter, Gutters.smallVMargin]}>
        <Text style={[Fonts.poppinSemiBold20]}>Delivery Address</Text>
        <Text style={[Fonts.poppinMed16, Gutters.littleTMargin]}>
          {product_details.seller.name}
        </Text>
        <Text style={[Fonts.poppinReg14, {color: Colors.black_232C28}]}>
          {product_details.seller.address}
        </Text>
        <View
          style={[
            Layout.row,
            Layout.alignItemsCenter,
            Gutters.borderWidth,
            Gutters.littleRadius,
            Gutters.littleVPadding,
            Gutters.tinyTMargin,
            {borderColor: Colors.black_232C28},
          ]}>
          <View style={[Gutters.tinyHMargin]}>
            <Images.svg.phone.default
              fill={Colors.black_232C28}
              height={23}
              width={23}
            />
          </View>
          <View>
            <TouchableOpacity>
              <Text style={[Fonts.poppinReg14, {color: Colors.primary}]}>
                Delivery Instructions (optional)
              </Text>
            </TouchableOpacity>
            <View>
              <Text style={[Fonts.poppinReg14, {color: Colors.black_232C28}]}>
                Lorem Ipsum is simply dummy text
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            Layout.row,
            Layout.alignItemsCenter,
            Gutters.borderWidth,
            Gutters.littleRadius,
            Gutters.littleVPadding,
            Gutters.tinyTMargin,
            {borderColor: Colors.black_232C28},
          ]}>
          <View style={[Gutters.tinyHMargin]}>
            <Images.svg.DeliveryBox.default height={23} width={23} />
          </View>
          <View>
            <TouchableOpacity>
              <Text style={[Fonts.poppinReg14, {color: Colors.primary}]}>
                Phone Number (optional)
              </Text>
            </TouchableOpacity>
            <View>
              <Text style={[Fonts.poppinReg14, {color: Colors.black_232C28}]}>
                0987-654-321
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DeliveryDetail;
