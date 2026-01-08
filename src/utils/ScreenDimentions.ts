import {Dimensions} from 'react-native';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const sHight = (val: number) => {
  return (val / 100) * windowHeight;
};

const sWidth = (val: number) => {
  return (val / 100) * windowWidth;
};

const screenHeightFunc = (val: number) => {
  return (val / 100) * screenHeight;
};

export {sHight, sWidth, screenWidth, screenHeight, screenHeightFunc};
