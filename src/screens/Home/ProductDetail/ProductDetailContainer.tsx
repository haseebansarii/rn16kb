import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {BottomScreenDetails} from '.';
import {useTheme} from '../../../hooks';
import {
  buyingType,
  selectedProduct,
} from '../../../store/productDetail/ProductDetailSlice';
import {fixBottomTab} from '../../../store/stack/StackSlice';
import {RootState} from '../../../store/store';
import {Colors} from '../../../theme/Variables';
import SwiperImages from './SwiperImages';
import {
  useAddFavouriteListingMutation,
  useRemoveFavouriteListingMutation,
} from '../../../services/modules/home/favouriteListing';
import {FE_URL} from '../../../config';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  getURLPhoto,
  showUserAlert,
  toastDangerMessage,
  toastSuccessMessage,
} from '../../../utils/helpers';
import {useLazyGetSelectedProductDataQuery} from '../../../services/modules/Listings/getSelectedProductData';
import {setlistData, setlistDataUser} from '../../../store/Listings';
import {CustomFastImage, CustomLoading} from '../../../components';

const ProductDetailContainer = () => {
  const {Layout, Gutters, Colors, Fonts, Images} = useTheme();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const buying_type = useSelector(
    (state: RootState) => state.product?.buying_type,
  );
  const [getSelectedProductData, {isLoading}] =
    useLazyGetSelectedProductDataQuery();
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  const {selected_product} = useSelector((state: RootState) => state.product);

  const listData = useSelector((state: any) => state?.list?.listData);
  const listDataUser = useSelector((state: any) => state?.list?.listDataUser);

  const guest = useSelector((state: RootState) => state.auth?.guest);
  const token = useSelector((state: RootState) => state.auth?.token);

  const [favourites, setFavourites] = useState(selected_product?.is_favourite);
  console.log('selected_product >>> ', selected_product);
  const getData = async () => {
    await getSelectedProductData({
      product_id: selected_product?._id,
    }).then(res => {
      console.log('>>> res 00 ', res);
      if (res?.data?._id) {
        dispatch(
          selectedProduct({
            ...selected_product,
            is_favourite: res?.data?.is_favourite,
          }),
        );
        setFavourites(res?.data?.is_favourite ? true : false);
      }
    });
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    if (selected_product?._id) {
      getData();
    }
  }, [isFocused]);

  const [removeFavouriteListing, {isLoading: isLoadingRemove}] =
    useRemoveFavouriteListingMutation();
  const [addFavoriteListing, {isLoading: isLoadingAdd}] =
    useAddFavouriteListingMutation();

  const getDataAfterAddtoFav = (index, is_favourite) => {
    let dataTemp = [...listData.items];
    let item = {...dataTemp[index]};
    item.is_favourite = is_favourite;
    dataTemp[index] = item;
    dispatch(
      setlistData({
        items: dataTemp,
        pagination: listData?.pagination,
      }),
    );
  };
  const getDataAfterAddtoFavUser = (index, is_favourite) => {
    let dataTemp = [...listDataUser.items];
    let item = {...dataTemp[index]};
    item.is_favourite = is_favourite;
    dataTemp[index] = item;
    dispatch(
      setlistDataUser({
        items: dataTemp,
        pagination: listDataUser?.pagination,
      }),
    );
  };

  const updateFavouriteStatusListing = (arr, id, newStatus) => {
    return arr.map(item => {
      if (item._id === id) {
        return {
          ...item,
          is_favourite: newStatus,
        };
      }
      return item;
    });
  };

  const addRemoveFavourites = (id: string, is_favourite: boolean) => {
    if (!!favourites) {
      removeFavouriteListing(id).then((res: any) => {
        res?.data?.message && setFavourites(false);
        if (selected_product?.index > -1) {
          if (selected_product?.isSeller) {
            getDataAfterAddtoFavUser(selected_product?.index, false);
            let body = {
              items:
                updateFavouriteStatusListing(listData?.items, id, false) || [],
              pagination: listData?.pagination,
            };
            dispatch(setlistData(body));
          } else {
            getDataAfterAddtoFav(selected_product?.index, false);
          }
        }
      });
    } else {
      addFavoriteListing({listing: id}).then((res: any) => {
        res?.data?.message && setFavourites(true);
        if (selected_product?.index > -1) {
          if (selected_product?.isSeller) {
            getDataAfterAddtoFavUser(selected_product?.index, true);
            let body = {
              items:
                updateFavouriteStatusListing(listData?.items, id, true) || [],
              pagination: listData?.pagination,
            };
            dispatch(setlistData(body));
          } else {
            getDataAfterAddtoFav(selected_product?.index, true);
          }
        }
      });
    }
  };

  // const getData = async () => {
  //   await getSelectedProductData({
  //     product_id: selected_product?._id,
  //   });
  // };
  // useEffect(() => {
  //   getData();
  // }, [selected_product]);
  useEffect(() => {
    setFavourites(selected_product?.is_favourite);
  }, [selected_product]);

  const backHandler = () => {
    if (!!buying_type) {
      dispatch(buyingType(null));
    } else {
      dispatch(fixBottomTab(true));
      navigation.goBack();
    }
  };

  const shareProduct = (product_id: any) => {
    let url =
      FE_URL + selected_product?.listing_type + '/' + product_id + '/detail';
    Clipboard.setString(url);
    toastSuccessMessage('Listing url copied');
  };

  useEffect(() => {
    return () => {
      dispatch(buyingType(null));
    };
  }, []);

  return (
    <View style={[Layout.fill]}>
      <View
        style={[
          Layout.selfCenter,
          Layout.row,
          Layout.justifyContentBetween,
          Layout.absolute,
          styles.absoluteStyle,
        ]}>
        <TouchableOpacity
          style={[
            [Layout.center, Gutters.littleHPadding, Gutters.littleVPadding],
          ]}
          onPress={() => backHandler()}>
          <Images.svg.back.default stroke={Colors.black_232C28} />
        </TouchableOpacity>
        <View style={[Layout.row]}>
          <TouchableOpacity
            style={[
              [Layout.center, Gutters.littleHPadding, Gutters.littleVPadding],
            ]}
            onPress={() => shareProduct(selected_product?._id)}>
            <Images.svg.Share.default
              stroke={Colors.black_232C28}
              height={32}
              width={32}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              [Layout.center, Gutters.littleHPadding, Gutters.littleVPadding],
            ]}
            onPress={() => {
              if (guest || !token) {
                // showUserAlert();
                showUserAlert(navigation);
              } else {
                addRemoveFavourites(selected_product?._id, favourites);
              }
            }}>
            {favourites ? (
              <Images.svg.TickIcon.default
                fill={Colors.primary}
                height={32}
                width={32}
              />
            ) : (
              <Images.svg.IWatchTab.default
                stroke={Colors.black_232C28}
                height={32}
                width={32}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={[Layout.fullWidth, {height: '35%'}]}>
        <SwiperImages />
      </View>

      {selected_product.user.branding?.banner?.name && (
        <View style={[Layout.fullWidth]}>
          <CustomFastImage
            resizeMode="cover"
            customStyle={[
              {
                width: '100%',
                height: 'auto',
                aspectRatio: '125/20',
              },
            ]}
            url={getURLPhoto(selected_product.user.branding?.banner?.name)}
          />
        </View>
      )}

      <View
        style={[
          buying_type == null && Layout.fill,
          buying_type != null && styles.biddingAndBuyingBottomSheetStyle,
          buying_type == null && styles.simpleBottomSheetStyle,
          Gutters.mediumTPadding,
        ]}>
        <BottomScreenDetails />
        <CustomLoading
          isLoading={isLoadingAdd || isLoadingRemove || isLoading}
        />
      </View>
    </View>
  );
};

export default ProductDetailContainer;

const styles = StyleSheet.create({
  absoluteStyle: {zIndex: 1, top: 15, width: '95%'},
  biddingAndBuyingBottomSheetStyle: {
    position: 'absolute',
    width: '100%',
    height: '92%',
    bottom: 0,
    backgroundColor: Colors.white,
  },
  simpleBottomSheetStyle: {
    backgroundColor: Colors.white,
  },
});
