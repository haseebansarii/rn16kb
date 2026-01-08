import React, {ReactNode} from 'react';
import {ImageBackground} from 'react-native';
import {useTheme} from '../hooks';

type Props = {
  children: ReactNode;
};

const CustomBackGorundImage = ({children}: Props) => {
  const {Layout, Colors, Images} = useTheme();
  return (
    <ImageBackground
      style={[Layout.fill, {backgroundColor: Colors.black_232C28}]}
      resizeMode="contain"
      source={Images.png.BackGroundImage}>
      {children}
    </ImageBackground>
  );
};

export default CustomBackGorundImage;
