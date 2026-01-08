import {Alert, Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {io} from 'socket.io-client';
import {setGuest} from '../store/auth/AuthSlice';

import DocumentPicker from 'react-native-document-picker';
import {API_URL} from '../config';
import {navigationRef} from '../navigators/utils';
const getImages = () => {
  return ImagePicker.openPicker({
    mediaType: 'any',
    smartAlbums: [
      'PhotoStream',
      'Generic',
      'Panoramas',
      'Videos',
      'Favorites',
      'Timelapses',
      'AllHidden',
      'RecentlyAdded',
      'Bursts',
      'SlomoVideos',
      'UserLibrary',
      'SelfPortraits',
      'Screenshots',
      'DepthEffect',
      'LivePhotos',
      'Animated',
      'LongExposure',
    ],
    width: 1000,
    height: 1000,
    cropping: true,
    // multiple: true,
    compressImageQuality: 0.5,
  }).then(image => {
    let temp = {};
    // temp.uri = Platform.OS == 'ios' ? image?.sourceURL : image?.path;
    // temp.name =
    //   Platform.OS === 'ios' ? image?.filename : image?.path.split('/')[11];
    // temp.type = image?.mime;
    temp.name = image?.path?.split('/').pop();
    temp.type = image?.mime;
    temp.uri = image?.path;

    return temp;
  });
};

const toastSuccessMessage = (message: string) => {
  toast.show(message, {
    type: 'success',
    placement: 'bottom',
    duration: 4000,
    offset: 30,
    animationType: 'slide-in ',
  });
};
const toastDangerMessage = (message: string) => {
  toast.show(message, {
    type: 'danger',
    placement: 'bottom',
    duration: 4000,
    offset: 30,
    animationType: 'slide-in ',
  });
};

const showUserAlert = navigation => {
  Alert.alert(
    'Alert',
    'You are in guest mode please sign in first',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'OK',
        onPress: () => {
          if (navigation) {
            navigation.reset({
              index: 0,
              routes: [{name: 'EmailContainer'}],
            });
          } else {
            navigationRef.navigate('EmailContainer');
          }
        },
        // onPress: () => dispatch(setGuest(false)),
      },
    ],
    {cancelable: false},
  );
};

const selectFile = async () => {
  try {
    const res = await ImagePicker.openPicker({
      width: 200,
      height: 200,
      // cropping: true,
      compressImageQuality: Platform.OS === 'android' ? 0.5 : 0.3,
    });
    return res;
    // setSelectedFile(res);
  } catch (err) {}
};

const socket = io.connect(API_URL);

const getURLPhoto = prop => {
  if (prop) {
    return `${API_URL}get-uploaded-image/${prop}`;
  }
};
const getStaticImage = (flag: boolean) => {
  if (flag) {
    return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  } else {
    return 'https://cdn.pixabay.com/photo/2022/07/13/10/14/image-7318993_1280.png';
  }
};
const getPlaceHolderProduct = () => {
  return require('../theme/assets/images/placeholderProduct.jpg');
};

const extractObjects = arr => {
  let result = [];
  if (Array.isArray(arr)) {
    arr.forEach(item => {
      if (Array.isArray(item)) {
        result = result.concat(extractObjects(item));
      } else if (typeof item === 'object' && item !== null) {
        result.push(item);
      }
    });
  } else {
    result = typeof arr === 'object' ? [arr] : [];
  }

  return result;
};

const getCategoryListParam = ({
  onlyParent = false,
  all = false,
  type = 'all',
}) => {
  let filter = '';
  if (onlyParent) {
    filter = filter + 'only_parent=yes';
  }
  if (all) {
    filter = filter + '&all=yes';
  }
  if (type) {
    filter = filter + `&type=${type}`;
  }
  // let url = onlyParent || all ? `category-list?${filter}` : `category-list`
  // return `category-list?${filter}`;
  return `${filter}`;
};

const formatNumberFloat = value => {
  if (typeof value !== 'number') {
    value = parseFloat(value);
  }
  if (isNaN(value)) {
    return '0.00';
  }
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
function formatNumberInt(value) {
  if (typeof value !== 'number') {
    value = parseFloat(value);
  }
  if (isNaN(value)) {
    return '0';
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function customSplitArray(arr, limit = 40) {
  // Check if the array has more than 40 items
  // if (arr.length <= 40) {
  //     return [arr, []]; // If less than or equal to 40 items, return the whole array and an empty array
  // }

  // Slice the array into two parts
  const firstPart = arr.slice(0, limit); // First 40 items
  const secondPart = arr.slice(limit); // Remaining items

  // Return the two arrays
  return [firstPart, secondPart];
}

export {
  getImages,
  getStaticImage,
  getURLPhoto,
  selectFile,
  showUserAlert,
  socket,
  toastDangerMessage,
  toastSuccessMessage,
  extractObjects,
  getCategoryListParam,
  formatNumberFloat,
  formatNumberInt,
  customSplitArray,
  getPlaceHolderProduct,
};
