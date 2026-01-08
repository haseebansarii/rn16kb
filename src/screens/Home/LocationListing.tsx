import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import {useDispatch} from 'react-redux';
import {API_URL} from '../../config';
import {useTheme} from '../../hooks';
import {
  useAddFavouriteListingMutation,
  useRemoveFavouriteListingMutation,
} from '../../services/modules/home/favouriteListing';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {getStaticImage, getURLPhoto} from '../../utils/helpers';
import {setSelectedProductData} from '../../store/Listings';

type TLocationListing = {
  searchData: Array<object>;
};

const {width, height} = Dimensions.get('window');

const LocationListing = ({searchData}: TLocationListing) => {
  const {Layout, Gutters, Images, Colors, Fonts} = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [removeFavouriteListing] = useRemoveFavouriteListingMutation();
  const [addFavoriteListing] = useAddFavouriteListingMutation();

  const addRemoveFavourites = (id: string, is_favourite: boolean) => {
    if (!!is_favourite) {
      removeFavouriteListing(id);
    } else {
      addFavoriteListing({listing: id});
    }
  };
  // const memoizedCallback = useCallback((item: any) => {
  //   return <RenderItem {...item} />;
  // }, []);

  // const RenderItem = ({item, index}: any) => {
  //   return (
  //     <TouchableOpacity
  //       key={index}
  //       style={[
  //         Gutters.darkShadow,
  //         {
  //           width: width / 2,
  //           borderRadius: 10,
  //           marginBottom: 20,

  //           backgroundColor: Colors.white,
  //         },
  //       ]}
  //       onPress={() => {
  //         dispatch(fixBottomTab(false));
  //         dispatch(selectedProduct(item));
  //         dispatch(setSelectedProductData({}));
  //         navigation.navigate('ProductDetailContainer' as never);
  //       }}>
  //       <TouchableOpacity
  //         onPress={() => addRemoveFavourites(item?._id, item?.is_favourite)}
  //         style={{
  //           position: 'absolute',
  //           top: item?.is_favourite ? -1 : 0,
  //           right: 0,
  //           zIndex: 1,
  //         }}>
  //         {item?.is_favourite ? (
  //           <Images.svg.rectangleGroup.default />
  //         ) : (
  //           <Images.svg.EyeRectangle.default />
  //         )}
  //       </TouchableOpacity>
  //       <FastImage
  //         source={
  //           item?.images?.length > 0
  //             ? {
  //                 uri: getURLPhoto(item?.images && item?.images[0]?.name),
  //               }
  //             : getStaticImage(false)
  //         }
  //         style={{
  //           width: '100%',
  //           height: 120,
  //           borderTopLeftRadius: 10,
  //           borderTopRightRadius: 10,
  //         }}
  //       />
  //       <View
  //         style={[
  //           Layout.selfCenter,
  //           Layout.screenWidth,
  //           Gutters.littleTMargin,
  //           Layout.fill,
  //           Layout.overflow,
  //           Layout.justifyContentAround,
  //           {height: '50%'},
  //         ]}>
  //         <View
  //           style={[
  //             Layout.alignItemsEnd,
  //             Gutters.littleTMargin,
  //             Layout.row,
  //             Layout.justifyContentBetween,
  //             Layout.alignItemsCenter,
  //             {height: 25, width: '100%'},
  //           ]}>
  //           {item?.pickup_location ? (
  //             <View style={[Layout.row, Layout.alignItemsCenter]}>
  //               <Images.svg.LocationTransparent.default width={15} />
  //               <Text
  //                 style={[
  //                   Fonts.poppinReg12,
  //                   Gutters.littleLMargin,
  //                   {color: Colors.black_232C28},
  //                 ]}>
  //                 {item?.pickup_location?.length > 8 &&
  //                   item?.pickup_location.slice(0, 8) + '...'}
  //               </Text>
  //             </View>
  //           ) : (
  //             <View></View>
  //           )}
  //           {item?.end_date && (
  //             <View
  //               style={{
  //                 width: '50%',
  //                 alignItems: 'flex-end',
  //               }}>
  //               <View style={[Layout.row, Layout.alignItemsCenter]}>
  //                 <Images.svg.calendar.default width={15} />
  //                 <Text
  //                   style={[
  //                     Fonts.poppinReg12,
  //                     Gutters.littleLMargin,
  //                     {color: Colors.black_232C28},
  //                   ]}>
  //                   {moment(item?.end_date).format('ddd, DD MMM')}
  //                 </Text>
  //               </View>
  //             </View>
  //           )}
  //         </View>
  //         <View
  //           style={[
  //             Layout.row,
  //             Layout.justifyContentBetween,
  //             Gutters.tinyVMargin,
  //           ]}>
  //           <View style={[Layout.row, Layout.alignItemsCenter]}>
  //             <FastImage
  //               source={
  //                 item?.user?.photo?.name
  //                   ? {
  //                       uri: `${API_URL}get-uploaded-image/${item?.user?.photo?.name}`,
  //                     }
  //                   : require('../../theme/assets/images/user.png')
  //               }
  //               style={{
  //                 width: 28,
  //                 height: 28,
  //                 borderRadius: 28 / 2,
  //               }}
  //             />
  //             {item?.user?.avg_rating_as_seller && (
  //               <View style={[Gutters.littleLMargin]}>
  //                 <StarRating
  //                   disabled={true}
  //                   maxStars={5}
  //                   starSize={20}
  //                   rating={item?.user?.avg_rating_as_seller}
  //                   fullStarColor={Colors.primary}
  //                 />
  //               </View>
  //             )}
  //           </View>
  //         </View>
  //         <Text
  //           numberOfLines={1}
  //           style={[
  //             Fonts.poppinMed14,
  //             // Gutters.tinyTMargin,
  //             Gutters.littleBMargin,
  //             {
  //               fontWeight: '500',
  //               color: Colors.black_232C28,
  //             },
  //           ]}>
  //           {item?.title}
  //         </Text>
  //         <View
  //           style={[
  //             Layout.row,
  //             Layout.fullWidth,
  //             Layout.justifyContentBetween,
  //             Gutters.littleTMargin,
  //             Gutters.tinyBMargin,
  //             Layout.alignItemsCenter,
  //           ]}>
  //           {item?.make_an_offer && item?.type != 'auction' ? (
  //             <View style={[{width: '50%'}]}>
  //               <TouchableOpacity
  //                 onPress={() => {
  //                   dispatch(fixBottomTab(false));
  //                   dispatch(selectedProduct(item));
  //                   dispatch(setSelectedProductData({}));
  //                   navigation.navigate('ProductDetailContainer' as never);
  //                 }}
  //                 style={[
  //                   Gutters.tinyPadding,
  //                   {
  //                     backgroundColor: Colors.lightGreen_DBF5EC,
  //                     borderRadius: 6,
  //                   },
  //                 ]}>
  //                 <Text
  //                   style={[
  //                     Fonts.poppinReg9,
  //                     {color: Colors.black_232C28, textAlign: 'center'},
  //                   ]}>
  //                   Send an Offer
  //                 </Text>
  //               </TouchableOpacity>
  //             </View>
  //           ) : (
  //             <View style={[{width: '50%'}]}>
  //               <Text
  //                 style={[Fonts.poppinMed12, {color: Colors.dark_gray_676C6A}]}>
  //                 Starting:
  //               </Text>

  //               {/* {item?.fixed_price_offer > 4 ? (
  //                     <View>
  //                       <Text
  //                         numberOfLines={3}
  //                         style={[
  //                           Fonts.poppinSemiBold10,
  //                           Gutters.littleTMargin,
  //                           {color: Colors.black_232C28},
  //                         ]}>
  //                         NZ$
  //                       </Text>
  //                       <Text style={[Fonts.poppinSemiBold10]}>
  //                         {item?.type == 'auction'
  //                           ? item?.start_price
  //                           : item?.fixed_price_offer}
  //                       </Text>
  //                     </View>
  //                   ) : ( */}
  //               <View style={[{width: '100%'}]}>
  //                 <Text
  //                   numberOfLines={3}
  //                   ellipsizeMode="tail"
  //                   style={[Fonts.poppinBold12]}>
  //                   {item?.type == 'auction'
  //                     ? t('common:nz') + ' ' + item?.start_price
  //                     : t('common:nz') + ' ' + item?.fixed_price_offer}
  //                 </Text>
  //               </View>
  //               {/* )} */}
  //             </View>
  //           )}

  //           {!!item?.buy_now_price && (
  //             <View style={[{width: '50%'}]}>
  //               <Text
  //                 style={[
  //                   Fonts.poppinMed12,
  //                   {color: Colors.primary, textAlign: 'right'},
  //                 ]}>
  //                 {item?.listing_type == 'property'
  //                   ? item?.property?.for_sale
  //                     ? 'Asking Price:'
  //                     : 'Rental Price:'
  //                   : 'Buy Now:'}
  //               </Text>

  //               {/* {`${item?.buy_now_price}`?.length >= 4 ? (
  //                     <View style={[Layout.alignItemsEnd]}>
  //                       <Text
  //                         style={[
  //                           Fonts.poppinSemiBold10,
  //                           Gutters.littleTMargin,
  //                           Layout.selfEnd,
  //                           {color: Colors.primary},
  //                         ]}>
  //                         NZ$
  //                       </Text>
  //                       <Text
  //                         style={[
  //                           Fonts.poppinSemiBold10,
  //                           Layout.selfEnd,
  //                           {color: Colors.primary, textAlign: 'right'},
  //                         ]}>
  //                         {item?.buy_now_price}
  //                       </Text>
  //                     </View>
  //                   ) : ( */}
  //               <Text
  //                 style={[
  //                   Fonts.poppinBold12,
  //                   // Gutters.littleBMargin,
  //                   Layout.selfEnd,
  //                   {color: Colors.primary},
  //                 ]}>
  //                 {t('common:nz') + ' ' + item?.buy_now_price}
  //               </Text>
  //               {/* )} */}
  //             </View>
  //           )}
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <View style={[Layout.fill]}>
      {searchData?.length > 0 && (
        //   <ScrollView
        //     horizontal
        //     // style={[Layout.fill]}
        //     contentContainerStyle={[, Layout.flexGrow]}>
        //     {searchData?.map(item => (
        //       <RenderItem item={item} />
        //     ))}
        //   </ScrollView>
        <FlatList
          horizontal
          data={searchData || []}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item, index}) => {
            return <RenderItem item={item} />;
          }}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={[{marginHorizontal: 10}]} />
          )}
          ListEmptyComponent={() => (
            <View style={[Layout.fill, Layout.center]}>
              <Text
                style={[
                  Fonts.poppinMed16,
                  Gutters.smallTMargin,
                  {color: Colors.black_232C28},
                ]}>
                {t('common:no_data_found')}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default LocationListing;

const styles = StyleSheet.create({});
