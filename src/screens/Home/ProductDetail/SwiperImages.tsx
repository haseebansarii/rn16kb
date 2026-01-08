import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import {product_details} from '../../../utils/dummyData';
import {useTheme} from '../../../hooks';
import {useSelector} from 'react-redux';
import {API_URL} from '../../../config';
import {RootState} from '../../../store/store';
import CustomImageViewer from '../../../components/CustomImageViewer';
import {getPlaceHolderProduct, getURLPhoto} from '../../../utils/helpers';
import {SvgUri} from 'react-native-svg';

const SwiperImages = () => {
  const {Layout, Colors} = useTheme();
  const selected_product = useSelector(
    (state: RootState) => state.product?.selected_product,
  );

  const [isImage, setIsImage] = useState([]);

  const [isVisible, setIsVisible] = useState(false);
  return (
    <View style={{flex: 1}}>
      <Swiper
        dot={
          <View
            style={{
              backgroundColor: Colors.gray_C9C9C9,
              width: 10,
              height: 10,
              borderRadius: 5,
              marginLeft: 3,
              marginRight: 3,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: Colors.primary,
              width: 12,
              height: 12,
              borderRadius: 6,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
            }}
          />
        }
        paginationStyle={{
          bottom: 35,
        }}
        autoplay>
        {/* {product_details?.swiper_imgList?.map((item, index) => { */}

        {selected_product && selected_product?.images ? (
          selected_product?.images?.map((item: any, index: any) => {
            return (
              <View key={index} style={[Layout.fill, Layout.center]}>
                <TouchableOpacity
                  style={{height: '100%', width: '100%'}}
                  onPress={() => {
                    setIsImage([
                      {uri: `${API_URL}get-uploaded-image/${item?.name}`},
                    ]);
                    setIsVisible(true);
                  }}>
                  {item?.name?.endsWith('.svg') ? (
                    <View
                      style={[
                        Layout.alignItemsCenter,
                        Layout.justifyContentCenter,
                        {
                          height: '100%',
                        },
                      ]}>
                      <SvgUri
                        width="100"
                        height="100"
                        uri={getURLPhoto(item?.name)}
                        style={{height: '100%', width: '100%'}}
                      />
                    </View>
                  ) : (
                    <FastImage
                      // source={{uri: item}}
                      source={{
                        uri: `${API_URL}get-uploaded-image/${item?.name}`,
                      }}
                      resizeMode="contain"
                      style={{height: '100%', width: '100%'}}
                    />
                  )}
                </TouchableOpacity>
                <CustomImageViewer
                  images={isImage}
                  visible={isVisible}
                  setIsVisible={setIsVisible}
                />
              </View>
            );
          })
        ) : (
          <View style={[Layout.fill, Layout.center]}>
            <TouchableOpacity
              style={{height: '100%', width: '100%'}}
              onPress={() => {
                setIsImage([getPlaceHolderProduct()]);
                setIsVisible(true);
              }}>
              <FastImage
                // source={{uri: item}}
                source={getPlaceHolderProduct()}
                resizeMode="contain"
                style={{height: '100%', width: '100%'}}
              />
            </TouchableOpacity>
            <CustomImageViewer
              images={isImage}
              visible={isVisible}
              setIsVisible={setIsVisible}
            />
          </View>
        )}
      </Swiper>
    </View>
  );
};

export default SwiperImages;

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },

  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
