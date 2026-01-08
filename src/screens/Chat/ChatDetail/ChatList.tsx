import dayjs from 'dayjs';
import i18next from 'i18next';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import {
  CustomFastImage,
  CustomPageLoading,
  TextRegular,
} from '../../../components';
import {API_URL} from '../../../config';
import {useTheme} from '../../../hooks';
import {
  useGetChatDetailQuery,
  useLazyGetAllUsersChatQuery,
  useLazyGetChatDetailQuery,
  useUploadFileMutation,
} from '../../../services/chat';
import {RootState} from '../../../store/store';
import {selectFile, toastDangerMessage} from '../../../utils/helpers';
import SocketIOClient from 'socket.io-client';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {allMessages} from '../../../store/chats/chats';
import ImagePicker from 'react-native-image-crop-picker';
import {imageUploading} from '../../../store/auth/AuthSlice';
import {useUploadImagesMutation} from '../../../services/submitForms/forms';
import {axiosUploadImagesMutation} from '../../../services/submitForms/imageUploadFormAxios';

type TProps = {
  navigation: any;
  params: any;
};

const ChatList = ({navigation, params}: TProps) => {
  const {Layout, Fonts, Gutters, Colors, Images} = useTheme();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const flatListRef = useRef(null);
  const [uploadDocumentID, setUploadDocumentID] = useState(null);
  const all_messages = useSelector(
    (state: RootState) => state.chats?.all_messages,
  );
  const user_data = useSelector((state: RootState) => state.auth?.user_data);
  const token = useSelector((state: RootState) => state.auth?.token);

  const getChatDetailData = {
    listing_id: params?.listing?._id,
    seller_id: params?.seller_id,
    buyer_id:
      params?.seller_id != user_data?._id
        ? user_data?._id
        : params?.from_user?._id,
  };

  const [getMessages, {isLoading}] = useLazyGetChatDetailQuery();

  const [getAllUserChat] = useLazyGetAllUsersChatQuery();
  const gettingMessages = useGetChatDetailQuery(getChatDetailData, {
    pollingInterval: 2000,
  });

  const [uploadMedia] = useUploadFileMutation();
  const [uploadImg] = useUploadImagesMutation();
  const [inputText, setInputText] = useState('');

  const dispatch = useDispatch();

  const getAllMessages = async () => {
    // console.log(getChatDetailData);
    try {
      getMessages(getChatDetailData);
      // !!token && getAllUserChat('all-chats');
    } catch (error) {}
  };
  const getFileType = fileName => {
    const extension = fileName.split('.').pop().toLowerCase();

    const photoExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg'];
    const videoExtensions = [
      'mp4',
      'mov',
      'wmv',
      'avi',
      'mkv',
      'flv',
      'webm',
      'mpeg',
    ];
    const fileExtensions = [
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'txt',
      'zip',
      'rar',
    ];

    if (photoExtensions.includes(extension)) {
      return 'photo';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    } else if (fileExtensions.includes(extension)) {
      return 'file';
    } else {
      return 'Unknown';
    }
  };
  const getFileExtension = filename => {
    if (!filename) return 'Unknown';

    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : 'Unknown';
  };

  const socket = SocketIOClient(API_URL, {
    transports: ['websocket'],
    query: {
      user_id: user_data?._id,
    },
  });

  const seenMessage = (
    listing_id: string,
    seller_id: string,
    buyer_id: string,
  ) => {
    if (socket) {
      socket.emit('seen_message', {
        listing_id: listing_id,
        seller_id: seller_id,
        buyer_id: buyer_id,
        to_user_id: user_data?._id,
      });
    }
  };

  // useLayoutEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (flatListRef.current && all_messages && all_messages?.length > 0) {
  //       flatListRef.current.scrollToEnd({animated: true});
  //     }
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [all_messages]);

  useEffect(() => {
    getAllMessages();
    // if (flatListRef.current) {
    //   flatListRef.current.scrollToEnd({animated: true});
    // }
    socket.on('connect', () => {
      // console.log('Connected to the server');
      socketFunc();
    });

    return () => {
      setImage(null);
      setUploadDocumentID(null);
      dispatch(allMessages([]));
      // socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('update_sender_chat', ({chat_allowed, response_message}) => {
  //       console.log(chat_allowed, 'checking chat ', response_message);
  //       if (chat_allowed) {
  //         getAllMessages();
  //       } else {
  //         Alert.alert(response_message);
  //       }
  //     });
  //   } else {
  //     console.log('socket not exist ....');
  //   }

  //   return () => {};
  // }, [socket]);

  useEffect(() => {
    if (socket) {
      socketFunc();
    } else {
      console.log('socket not exist ....');
    }
  }, [socket]);

  const socketFunc = () => {
    seenMessage(
      params?.listing?._id,
      params?.seller_id,
      params?.seller_id != user_data?._id
        ? user_data?._id
        : params?.from_user?._id,
    );

    socket.on('reply_message', ({message, buyer_id, listing_id, seller_id}) => {
      getAllMessages();
      console.log(
        getChatDetailData.listing_id == listing_id &&
          getChatDetailData.seller_id == seller_id &&
          getChatDetailData.buyer_id == buyer_id,
      );
      if (
        getChatDetailData.listing_id == listing_id &&
        getChatDetailData.seller_id == seller_id &&
        getChatDetailData.buyer_id == buyer_id
      ) {
        console.log('seen message from reply message');
        seenMessage(
          listing_id,
          seller_id,
          buyer_id,
          params?.seller_id != user_data?._id
            ? user_data?._id
            : params?.from_user?._id,
        );
      }
    });

    socket.on('update_sender_chat', ({chat_allowed, response_message}) => {
      console.log(chat_allowed, 'checking chat ', response_message);
      if (chat_allowed) {
        getAllMessages();
      } else {
        Alert.alert(response_message);
      }
    });

    return () => {
      socket.off('reply_message');
      socket.off('update_sender_chat');
    };
  };

  const sendMessage = () => {
    // return console.log('started.....', params?.seller_id);
    let messagePayload: any = {
      listing_id: params?.listing?._id,
      from_user_id: user_data?._id,
      to_user_id:
        user_data?._id == params?.listing?.user?._id
          ? params?.from_user?._id
          : params?.listing?.user?._id,
      buyer_id:
        user_data?._id != params?.seller_id
          ? user_data?._id
          : params?.from_user?._id,
    };

    // return console.log(messagePayload);

    if (uploadDocumentID) {
      // messagePayload.message = inputText.trim()
      //   ? inputText
      //   : `${isImage(image?.name) ? 'Image:' : 'Link:'}`;

      messagePayload = {
        ...messagePayload,
        media: uploadDocumentID,
        message: getFileType(image?.filename) == 'photo' ? 'Image:' : 'Link:',
      };
    } else {
      messagePayload.message = inputText;
      messagePayload.media = null;
    }
    if (messagePayload.message.trim() || messagePayload?.media) {
      console.log('on socket almost start', messagePayload);
      socket.emit('send_message', messagePayload);
      setInputText('');
      setImage(null);
      setUploadDocumentID(null);
      getAllMessages();
    }
  };

  const imagePicker = async () => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      // cropping: true,
      compressImageQuality: Platform.OS === 'android' ? 0.3 : 0.4,
    })
      .then(result => {
        console.log(result, 'result response :::::::::::::');

        const photo: any = {
          // name:
          //   Platform.OS === 'ios'
          //     ? result?.filename
          //     : result?.path.split('/')[11],
          // type: result?.mime,
          // uri: Platform.OS == 'ios' ? result?.sourceURL : result?.path,
          name: result?.path?.split('/').pop(),
          type: result?.mime,
          uri: result?.path,
        };
        setImage({...result, filename: photo.name});
        uploadImages(photo);
      })
      .catch(error => {
        console.log('Image Picker Error :::::::::::::', error);

        if (error.code === 'E_PICKER_CANCELLED') {
          console.log('Image selection was cancelled');
        } else {
          console.log('Image Picker Error', error.message);
        }
      });
  };

  const uploadImages = async (temp: Object) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const formdata = new FormData();
    formdata.append('file', temp);
    formdata.append('folder', 'chat-files');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    // axiosUploadImagesMutation(formdata, myHeaders);
    fetch(`${API_URL}upload-file`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.document) {
          console.log('if statement');
          setUploadDocumentID(result?.document);
        } else {
          console.log('else');
        }
      })
      .catch(error => {
        toastDangerMessage('Please try again');
      });

    return;

    const form_data = new FormData();

    form_data.append('files', temp);
    // form_data.append('folder', 'chat-files');

    // dispatch(imageUploading(true));
    uploadImg(form_data).then(res => {
      return console.log(res);
      // if (res?.data?.document[0]) {
      //   let payload = {
      //     first_name: user_data?.first_name,
      //     last_name: user_data?.last_name,
      //     email: user_data?.email,
      //     username: user_data?.username,
      //     phone_number: user_data?.phone_number,
      //     date_of_birth: user_data?.date_of_birth,
      //     gender: user_data?.gender,
      //     address: user_data?.address,
      //     photo: res?.data?.document[0],
      //   };
      //   updateUser({
      //     payload: payload,
      //     _id: user_data?._id,
      //   }).then(res => {
      //     if (res?.data?.user) {
      //       setIsLoading(false);
      //       setEdit(false);
      //     }
      //   });
      // }
    });
  };

  const selectMedia = async () => {
    if (Platform.OS == 'android') {
      imagePicker();
    } else {
      const temp: any = await selectFile();

      let imageID;
      if (temp) {
        setImage(temp);
        const formData = new FormData();
        let image;
        formData.append('file', {
          // name:
          //   Platform.OS === 'ios' ? temp?.filename : temp?.path.split('/')[11],
          // type: temp?.mime,
          // uri: Platform.OS == 'ios' ? temp?.sourceURL : temp?.path,
          name: temp?.path?.split('/').pop(),
          type: temp?.mime,
          uri: temp?.path,
        });
        formData.append('folder', 'chat-files');

        imageID = await uploadMedia(formData);
      }

      if (imageID?.data?.document) {
        setUploadDocumentID(imageID?.data?.document);
      }
    }
  };

  const renderItem = ({item, index}: any) => {
    // console.log(item);
    return (
      <>
        {item?.sender && (
          <View key={index} style={[{}]}>
            <View
              style={[
                user_data?._id !== item?.sender
                  ? Layout.row
                  : Layout.rowReverse,
                Layout.justifyContentStart,
                Layout.selfCenter,

                Gutters.tinyTMargin,

                {
                  width: '95%',
                },
              ]}>
              {user_data?._id == item?.sender ? (
                <CustomFastImage
                  url={
                    user_data?.photo?.name
                      ? `${API_URL}get-uploaded-image/${user_data?.photo?.name}`
                      : require('../../../theme/assets/images/user.png')
                  }
                  resizeMode="cover"
                  customStyle={[{width: 30, height: 30, borderRadius: 50}]}
                />
              ) : (
                <CustomFastImage
                  url={
                    params?.from_user?.photo?.name
                      ? `${API_URL}get-uploaded-image/${params?.from_user?.photo?.name}`
                      : require('../../../theme/assets/images/user.png')
                  }
                  resizeMode="cover"
                  customStyle={[{width: 30, height: 30, borderRadius: 50}]}
                />
              )}
              <View style={[{}]}>
                <View
                  style={[
                    Gutters.littleTMargin,
                    user_data?._id === item?.sender
                      ? Gutters.tinyRMargin
                      : Gutters.tinyLMargin,
                    user_data?._id === item?.sender
                      ? Gutters.smallLMargin
                      : Gutters.smallRMargin,
                    Gutters.tinyPadding,
                    {
                      backgroundColor:
                        user_data?._id === item?.sender
                          ? Colors.black_232C28
                          : Colors.gray_C9C9C9,
                      borderBottomLeftRadius: 15,
                      borderBottomRightRadius: 15,
                      borderTopLeftRadius:
                        user_data?._id !== item?.sender ? 0 : 15,
                      borderTopRightRadius:
                        user_data?._id !== item?.sender ? 15 : 0,
                      overflow: 'hidden',
                      // width: '85%',
                    },
                  ]}>
                  {item?.media !== null ? (
                    <>
                      {/* <TextRegular
                    text={item?.text !== '' ? item?.text : 'Image'}
                  /> */}
                      {item?.text && (
                        <TextRegular
                          text={item?.text}
                          textStyle={[
                            Fonts.poppinReg16,
                            Gutters.littleBMargin,
                            {
                              textTransform: 'none',
                              color:
                                item?.sender !== user_data?._id
                                  ? Colors.black_343434
                                  : Colors.white,
                            },
                          ]}
                        />
                      )}
                      {getFileType(item?.media?.name) === 'photo' ? (
                        <CustomFastImage
                          url={`${API_URL}get-uploaded-file/chat-files/${item?.media?.name}`}
                          resizeMode="cover"
                          customStyle={[
                            {width: 150, height: 200, borderRadius: 10},
                          ]}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            Linking.openURL(
                              `${API_URL}get-uploaded-file/chat-files/${item?.media?.name}`,
                            );
                          }}>
                          <TextRegular
                            text={item?.media?.name}
                            textStyle={[
                              Fonts.poppinReg16,
                              Gutters.littleBMargin,
                              {
                                textTransform: 'none',
                                color: Colors.skyBlue_12B6DD,
                                // item?.sender !== user_data?._id
                                //   ? Colors.black_343434
                                //   : Colors.white,
                              },
                            ]}
                          />
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <TextRegular
                      // textProps={{}}
                      text={item?.text}
                      textStyle={[
                        Fonts.poppinReg16,
                        Gutters.tinyVMargin,
                        user_data?._id === item?.sender
                          ? Gutters.tinyLMargin
                          : Gutters.tinyRMargin,
                        {
                          textTransform: 'none',
                          color:
                            item?.sender !== user_data?._id
                              ? Colors.black_343434
                              : Colors.white,
                        },
                      ]}
                    />
                  )}
                </View>
                <TextRegular
                  text={moment(item?.sent_at).format('DD MMM YY hh:mm a')}
                  textStyle={[
                    Fonts.poppinReg10,
                    Gutters.littleVPadding,
                    item?.sender == user_data?._id
                      ? Layout.selfEnd
                      : Layout.selfStart,
                    item?.sender == user_data?._id
                      ? Gutters.tinyRMargin
                      : Gutters.tinyLMargin,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                />
              </View>
            </View>
          </View>
        )}
      </>
    );
  };
  return (
    <View style={[Layout.fill]}>
      <KeyboardAwareScrollView
        contentContainerStyle={[Layout.fill]}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="always"
        // scrollEnabled={false}
        // style={[Layout.fill]}
      >
        <View style={{flex: 1}}>
          <View style={[Layout.fill]}>
            {isLoading ? (
              <CustomPageLoading />
            ) : (
              <>
                {all_messages?.length > 0 && (
                  <FlatList
                    nestedScrollEnabled
                    ref={flatListRef}
                    data={all_messages}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'always'}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={[
                      Gutters.tinyMargin,
                      Gutters.regularBPadding,
                      Layout.overflow,
                    ]}
                    renderItem={renderItem}
                  />
                )}
              </>
            )}
          </View>
        </View>

        <View
          style={[
            Layout.screenWidth,
            Layout.selfCenter,
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            Gutters.mediumBMargin,
          ]}>
          <View
            style={[
              Layout.fill,
              Layout.alignItemsCenter,
              Layout.row,
              Gutters.tinyLPadding,
              Gutters.tinyRMargin,
              {
                height: 65,
                width: '80%',
                borderWidth: 1,
                borderRadius: 6,
                borderColor: Colors.dark_gray_676C6A,
              },
            ]}>
            <TextInput
              style={[Layout.fill, Fonts.poppinReg16]}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              editable={!image?.filename ? true : false}
              placeholder={
                image?.filename && uploadDocumentID
                  ? `file.${getFileExtension(image?.filename)}`
                  : t('common:type_something')
              }
              value={inputText}
              placeholderTextColor={Colors.dark_gray_676C6A}
              onChangeText={t => {
                if (!inputText) {
                  setUploadDocumentID(null);
                  setImage(null);
                }
                setInputText(t);
              }}
            />
            <View
              style={[
                Layout.row,
                Gutters.littleRMargin,
                Layout.alignItemsCenter,
                // Layout.justifyContentEnd,
                {
                  width: image ? '50%' : '22%',
                  justifyContent: 'flex-end',
                  // alignItems: 'center',
                },
              ]}>
              {image && uploadDocumentID && (
                <View
                  style={[
                    Layout.row,
                    Layout.center,
                    Gutters.littleHPadding,

                    {backgroundColor: Colors.gray_C9C9C9, borderRadius: 4},
                  ]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setUploadDocumentID(null);
                      setImage(null);
                    }}>
                    <Images.svg.cross.default
                      height={18}
                      width={18}
                      fill="red"
                      stroke={Colors.red}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <View style={[Layout.row, Layout.alignItemsEnd]}>
                <TouchableOpacity
                  style={[
                    Layout.center,
                    Gutters.littlePadding,
                    Gutters.smallHPadding,
                  ]}
                  activeOpacity={0.8}
                  onPress={selectMedia}>
                  <Images.svg.media.default />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[Layout.center, Gutters.littlePadding]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowEmojiPicker(showEmojiPicker ? false : true);
                  }}>
                  <Images.svg.emoji.default />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={inputText === '' && !uploadDocumentID ? true : false}
            style={[
              Layout.center,
              {
                height: 65,
                width: '16%',
                borderRadius: 6,
                backgroundColor: Colors.primary,
              },
            ]}
            onPress={sendMessage}>
            <Images.svg.send.default />
          </TouchableOpacity>
        </View>
        {showEmojiPicker && (
          <EmojiSelector
            onEmojiSelected={emoji => {
              setInputText(prevText => prevText + emoji);

              // setMessages(prevChatHistory => [...prevChatHistory, data]);
            }}
            showSearchBar={false}
            showSectionTitles={false}
            style={{height: Dimensions.get('window').height / 4}}
          />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ChatList;
