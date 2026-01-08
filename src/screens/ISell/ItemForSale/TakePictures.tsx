import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {CustomFastImage, TextSemiBold} from '../../../components';
import {useTheme} from '../../../hooks';
import {FlatList} from 'react-native-gesture-handler';
import {getURLPhoto} from '../../../utils/helpers';
import Sortable from 'react-native-sortables';

type Props = {
  setSelectedImage: CallableFunction;
  selected: Array<object>;
  style?: any;
};

const TakePictures = ({setSelectedImage, style, selected}: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  const [loading, setLoading] = useState(false);
  const isUploadingImages = useRef(false);
  const [selectedImages, setSelectedImagesIn] =
    useState<Array<object>>(selected);
  useEffect(() => {
    setSelectedImagesIn(selected);
  }, [selected]);

  const picturesAlertDialog = () => {
    Alert.alert(
      'Alert',
      'You can not select more than 20 images',
      [
        {
          text: 'OK',
          onPress: () => console.log('cancel'),
        },
      ],
      {
        cancelable: false,
      },
    );
  };
  const getPictures = async () => {
    if (isUploadingImages.current === false) {
      isUploadingImages.current = true;
      if (selectedImages?.length == 20) {
        picturesAlertDialog();
        isUploadingImages.current = false;
        return;
      }
      setLoading(true);
      const result = await ImagePicker.openPicker({
        multiple: true,
        compressImageQuality: 0.5,
        width: 1000,
        height: 1000,
        mediaType: 'photo',
        maxFiles: 20,
      })
        .then(async images => {
          isUploadingImages.current = false;
          const result = [];

          for await (const image of images) {
            result.push({
              name: image?.path?.split('/').pop(),
              type: image?.mime,
              uri: image?.path,
            });
          }
          let dataArrayTemp =
            selectedImages?.length > 0
              ? [...selectedImages, ...result]
              : result;
          if (dataArrayTemp?.length > 20) {
            picturesAlertDialog();
            return;
          }
          setSelectedImage(dataArrayTemp);
          return dataArrayTemp;
        })
        .catch(err => {
          isUploadingImages.current = false;
          setLoading(false);
        });
      setTimeout(() => {
        setLoading(false);

        isUploadingImages.current = false;
      }, 2000);
    }
  };

  const removeImage = name => {
    const filteredImages = selectedImages.filter(image => image.name !== name);
    setSelectedImage(filteredImages);
  };

  const shuffleImages = ({fromIndex, toIndex}) => {
    const newArray = [...selected];
    const [movedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, movedItem);
    setSelectedImage(newArray);
  };

  const renderItem = ({item, index}) => {
    return (
      <View key={index} style={[Gutters.littleMargin]}>
        {loading ? (
          <View
            style={[
              Layout.center,
              {
                width: 110,
                height: 100,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}>
            <ActivityIndicator color={Colors.primary} size={'small'} />
          </View>
        ) : (
          <View
            style={[Gutters.tinyTMargin, Gutters.tinyLMargin, {width: 120}]}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  borderRadius: 1000,
                  backgroundColor: 'black',
                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    height: 25,
                    width: 25,
                    textAlign: 'center',
                    paddingTop: 4,
                  }}>
                  {index + 1}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  marginRight: 5,
                }}
                onPress={() => {
                  removeImage(item.name);
                }}>
                <Images.svg.RedClose.default />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              // onPress={getPictures}
            >
              <Image
                source={{uri: item?.uri || getURLPhoto(item?.name)}}
                style={{width: 110, height: 100, borderRadius: 6}}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={getPictures}
      activeOpacity={selectedImages?.length < 1 ? 0.8 : 1}
      style={[
        Layout.fullWidth,
        {
          borderWidth: 1,
          borderColor: Colors.gray_C9C9C9,
          borderRadius: 6,
          backgroundColor: Colors.light_grayF4F4F4,
          paddingBottom: 20,
        },
        style,
      ]}>
      {selectedImages?.length > 0 || selected?.length > 0 ? (
        <Sortable.Grid
          data={
            selectedImages?.length > 0
              ? selectedImages
              : selected?.length > 0
              ? selected
              : []
          }
          keyExtractor={item => item.name}
          columns={2}
          columnGap={-60}
          onDragEnd={shuffleImages}
          renderItem={renderItem}
        />
      ) : (
        <View style={[Layout.fill, Layout.center, {height: 250}]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={getPictures}
            style={[Layout.center]}>
            <Images.svg.imagesIcon.default />
            <TextSemiBold
              text="Add Photos"
              textStyle={[
                Fonts.poppinSemiBold24,
                Gutters.smallVMargin,
                {color: Colors.black},
              ]}
            />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TakePictures;
