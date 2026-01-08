import {View, Text} from 'react-native';
import React from 'react';
import ImageView from 'react-native-image-viewing';

interface Props {
  images?: [];
  visible: boolean;
  setIsVisible: any;
}

const CustomImageViewer = ({images, visible, setIsVisible}: Props) => {
  return (
    <ImageView
      images={images}
      visible={visible}
      onRequestClose={() => setIsVisible(false)}
    />
  );
};

export default CustomImageViewer;
