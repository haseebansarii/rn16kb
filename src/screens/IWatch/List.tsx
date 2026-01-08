import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomBottomSheet,
  CustomButton,
  CustomInput,
  CustomLoading,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {useAddFavNotesMutation} from '../../services/iWatch/addNotes';
import {useLazyGetListDataQuery} from '../../services/modules/Listings/getList';
import {
  setAddNoteOfSelectedProduct,
  setSelectedProductData,
} from '../../store/Listings';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import CustomCard from './CustomCard';
import {useRemoveFavouriteListingMutation} from '../../services/modules/home/favouriteListing';
import {sHight} from '../../utils/ScreenDimentions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {
  column?: number;
  selected: number;
};

const List = ({column, selected}: any) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showUpdateNote, setShowUpdateNote] = useState(false);

  const [getListData, {isLoading}] = useLazyGetListDataQuery();
  const [addFavNotes, {isLoading: isLoadingAddFavNotes}] =
    useAddFavNotesMutation();

  const [removeFavouriteListing, {isLoading: isLoadingRemove}] =
    useRemoveFavouriteListingMutation();
  const [notes, setNotes] = useState<string>('');
  const [notesObj, setNotesobj] = useState({});
  const listData = useSelector((state: any) => state?.list?.listData);
  const addNoteOfSelectedProduct = useSelector(
    (state: any) => state?.list?.addNoteOfSelectedProduct,
  );

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const addNoteFunc = (deleteFlag?: Boolean) => {
    if (addNoteOfSelectedProduct?.id) {
      let data = {
        body: {
          listing: addNoteOfSelectedProduct?.id,
          note: deleteFlag ? '' : notes ? notes : null,
        },
        deleteFlag: deleteFlag,
      };

      try {
        addFavNotes(data).then(res => {
          if (res?.data?.message) {
            setShowAddNote(false);
            dispatch(setAddNoteOfSelectedProduct({}));
            // setShowUpdateNote(false);
            setNotes('');
            setNotesobj({});
          }
          getIWatchData();
        });
      } catch (error) {
        console.log('error in add notes=========', JSON.stringify(error));
      }
    }
  };
  const LoadMoreRandomData = () => {
    setIsLoadingBottom(true);
    getIWatchData(listData?.items?.length);
  };

  const getIWatchData = async (skip = 0, limit = 20) => {
    await getListData({
      pageName: 'iwatch',
      skip: skip,
      limit: limit,
    }).finally(() => {
      setRefreshing(false);
      setIsLoadingBottom(false);
    });
  };
  const getIWatchDataAfterRemove = () => {
    getIWatchData(0, listData?.items?.length);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getIWatchData();
  };

  useEffect(() => {
    getIWatchData();
  }, []);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     getIWatchDataAfterRemove();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Call your function if the screen is focused and the condition is true
      getIWatchDataAfterRemove();
    }
  }, [isFocused]);

  return (
    <View style={[Layout.fill, Gutters.smallBMargin]}>
      <FlatList
        extraData={listData?.items}
        data={listData?.items || []}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index?.toString()}
        contentContainerStyle={[Gutters.largeBPadding]}
        renderItem={item => {
          return (
            <CustomCard
              item={item?.item}
              column={column}
              note={item?.item?.note}
              id={item?.item?._id}
              key={item?.index}
              buy_now_price={item?.item?.buy_now_price}
              title={item?.item?.title}
              showTriangleImage={true}
              status={item?.item?.status}
              pickup_location={item?.item?.pickup_location}
              start_price={item?.item?.start_price}
              addNotes={showAddNote}
              image={item?.item?.images && item?.item?.images[0]?.name}
              addNotePress={() => setShowAddNote(true)}
              index={item?.index}
              sendOffer={() => {
                dispatch(selectedProduct(item?.item));
                dispatch(setSelectedProductData({}));
                navigation.navigate('ProductDetailContainer' as never);
              }}
              updateNotePress={() => {
                setNotes(item?.item?.note);
                setNotesobj(item?.item);
                setShowAddNote(true);
              }}
              getIWatchDataAfterRemove={getIWatchDataAfterRemove}
            />
          );
        }}
        numColumns={1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
        onEndReached={({distanceFromEnd}) => {
          if (!onEndReachedCalledDuringMomentum) {
            if (
              listData?.items &&
              listData?.items?.length < listData?.pagination?.total
            ) {
              LoadMoreRandomData();
            }
            setOnEndReachedCalledDuringMomentum(true);
          }
        }}
        onEndReachedThreshold={0.6}
        onMomentumScrollBegin={() => {
          setOnEndReachedCalledDuringMomentum(false);
        }}
        ListFooterComponent={() => {
          return (
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
          );
        }}
        ListEmptyComponent={() => (
          <View style={[Layout.fill, Layout.center, {height: sHight(55)}]}>
            <TextSemiBold
              text="No data found "
              textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            />
          </View>
        )}
      />

      <CustomBottomSheet
        height={'90%'}
        icon={true}
        setShowBottomSheet={() => {
          setShowAddNote(false);
          setShowUpdateNote(false);
          setNotes('');
          setNotesobj({});
          dispatch(setAddNoteOfSelectedProduct({}));
        }}
        visible={showAddNote}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={[Layout.fill]}
          activeOpacity={1}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}
            style={[Layout.selfCenter]}>
            <TextSemiBold
              text={t('common:add_notes')}
              textStyle={[
                Fonts.poppinSemiBold24,
                Layout.selfCenter,
                Layout.textTransfromNone,
                Layout.textAlign,
                Gutters.smallHPadding,
                Gutters.smallBMargin,
                {
                  color: Colors.black_232C28,
                },
              ]}
            />
            <View style={[Layout.fullWidth]}>
              <CustomCard
                onPress={() => {}}
                showTriangleImage={true}
                buy_now_price={addNoteOfSelectedProduct?.buy_now_price}
                title={addNoteOfSelectedProduct?.title}
                status={addNoteOfSelectedProduct?.status}
                pickup_location={addNoteOfSelectedProduct?.pickup_location}
                start_price={addNoteOfSelectedProduct?.start_price}
                image={addNoteOfSelectedProduct?.image}
                addNote={addNoteOfSelectedProduct?.addNote}
                addNotes={showAddNote}
                showButton={false}
                addNotePress={() => setShowAddNote(true)}
                index={0}
              />
            </View>
            <View style={[Gutters.tinyVMargin]}>
              <>
                <CustomInput
                  headingText={t('common:add__note')}
                  headingTextStyle={[
                    Fonts.poppinReg20,
                    Gutters.tinyLMargin,
                    {color: Colors.black_232C28},
                  ]}
                  placeholder={t('common:email_phone')}
                  inputStyle={[
                    Layout.alignItemsCenter,
                    {
                      height: 164,
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor: Colors.gray_C9C9C9,
                      backgroundColor: Colors.white,
                      textAlignVertical: 'top',
                      width: '100%',
                    },
                  ]}
                  backgroundStyle={[
                    {
                      backgroundColor: 'transparent',
                    },
                  ]}
                  inputProps={{
                    multiline: true,
                    onChangeText: v => setNotes(v),
                    value: notes,
                    maxLength: 512,
                  }}
                />

                <TextRegular
                  text={`${512 - (notes?.length || 0)} ${t(
                    'common:words_remaining',
                  )}`}
                  textStyle={[
                    Fonts.poppinReg14,
                    Gutters.tinyLMargin,
                    {
                      color: Colors.black_232C28,
                      marginTop: 110,
                    },
                  ]}
                />

                <View
                  style={[
                    Gutters.smallTMargin,
                    Layout.justifyContentEnd,
                    Layout.overflow,
                  ]}>
                  <CustomButton
                    onPress={() => addNoteFunc()}
                    btnStyle={[
                      Layout.selfCenter,

                      {
                        width: '95%',
                        backgroundColor: Colors.primary,
                      },
                    ]}
                    text={t('common:save')}
                    textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
                  />
                  {notesObj?.note?.length > 0 && (
                    <CustomButton
                      onPress={() => {
                        addNoteFunc(true);
                        // setShowAddNote(false);
                        // setShowUpdateNote(false);
                        // dispatch(setAddNoteOfSelectedProduct({}));
                      }}
                      btnStyle={[
                        Fonts.poppinSemiBold24,
                        Gutters.smallTMargin,
                        Layout.selfCenter,
                        {
                          width: '95%',
                        },
                      ]}
                      text={t('common:delete')}
                      textStyle={[
                        Fonts.poppinSemiBold24,
                        {color: Colors.white},
                      ]}
                    />
                  )}
                </View>
              </>
            </View>
          </KeyboardAwareScrollView>
        </TouchableOpacity>
      </CustomBottomSheet>
      <CustomLoading isLoading={isLoading || isLoadingAddFavNotes} />
    </View>
  );
};

export default List;
