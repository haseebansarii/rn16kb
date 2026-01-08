/**
 * This file contains all application's style relative to fonts
 */
import {Dimensions, StyleSheet} from 'react-native';
import {ThemeVariables} from '../../@types/theme';
import Fonts from './assets/Fonts';
import {sHight} from '@/utils/ScreenDimentions';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';

export default function ({FontSize, Colors}: ThemeVariables) {
  const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
  // const isLandscape = () => {
  //   return screenWidth > screenHeight;
  // };
  // const handleOrientationChange = () => {
  //   const {width, height} = Dimensions.get('window');
  //   setOrientation(width > height ? 'landscape' : 'portrait');
  // };
  // const [orientation, setOrientation] = useState(
  //   isLandscape() ? 'landscape' : 'portrait',
  // );
  const [isTablet, setIsTablet] = useState(DeviceInfo.isTablet());

  // useEffect(() => {
  //   const handleOrientationChange = () => {
  //     const {width, height} = Dimensions.get('window');
  //     setOrientation(width > height ? 'landscape' : 'portrait');
  //   };

  //   // Add an event listener for orientation changes
  //   const subscription = Dimensions.addEventListener(
  //     'change',
  //     handleOrientationChange,
  //   );

  //   return () => {
  //     subscription?.remove(); // Clean up the event listener
  //   };
  // }, []);
  const responsiveFontSize = size => {
    let calculatedFontSize = RFValue(size, screenHeight);

    // If it's a tablet and in landscape mode, reduce font size
    // if (isTablet && orientation === 'landscape') {
    if (isTablet) {
      calculatedFontSize *= 0.75; // Reduce font size by 20% on tablets in landscape
    }

    return calculatedFontSize;
  };

  return StyleSheet.create({
    poppinReg8: {
      fontSize: responsiveFontSize(9, sHight(100)),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: responsiveFontSize(10, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinReg9: {
      fontSize: sHight(1),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: sHight(1.4),
      color: Colors.black_232C28,
    },
    poppinReg10: {
      fontSize: responsiveFontSize(10, sHight(100)),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: responsiveFontSize(12.1, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinReg12: {
      fontSize: sHight(1.3),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: sHight(1.73),
      color: Colors.black_232C28,
    },
    poppinReg14: {
      fontSize: responsiveFontSize(14, sHight(100)),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: responsiveFontSize(22, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinReg16: {
      fontSize: responsiveFontSize(16, sHight(100)),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: responsiveFontSize(23, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinReg18: {
      fontSize: responsiveFontSize(18, sHight(100)),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: responsiveFontSize(30, sHight(100)),
      color: Colors.black_232C28,
    },

    poppinReg20: {
      fontSize: responsiveFontSize(20, sHight(100)),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: responsiveFontSize(30, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinReg22: {
      fontSize: responsiveFontSize(22, sHight(100)),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: responsiveFontSize(30, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinReg24: {
      fontSize: responsiveFontSize(24, sHight(100)),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: responsiveFontSize(28, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinReg25: {
      fontSize: sHight(2.7),
      fontFamily: Fonts.POPPINS_REGULAR,
      lineHeight: sHight(4),
      color: Colors.black_232C28,
    },
    poppinMed8: {
      fontSize: responsiveFontSize(8, sHight(100)),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: responsiveFontSize(14, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinMed10: {
      fontSize: responsiveFontSize(10, sHight(100)),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: responsiveFontSize(14, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinMed12: {
      fontSize: responsiveFontSize(12, sHight(100)),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: responsiveFontSize(15, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinMed13: {
      fontSize: responsiveFontSize(13, sHight(100)),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: responsiveFontSize(19.3, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinMed14: {
      fontSize: responsiveFontSize(14, sHight(100)),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: responsiveFontSize(21, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinMed15: {
      fontSize: responsiveFontSize(15, sHight(100)),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: responsiveFontSize(22, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinMed16: {
      fontSize: responsiveFontSize(16, sHight(100)),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: responsiveFontSize(22, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinMed18: {
      fontSize: responsiveFontSize(18, sHight(100)),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: responsiveFontSize(28, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinMed20: {
      fontSize: responsiveFontSize(20, sHight(100)),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: responsiveFontSize(30, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinMed30: {
      fontSize: sHight(3.3),
      fontFamily: Fonts.POPPINS_MEDIUM,
      lineHeight: sHight(4.8),
      color: Colors.black_232C28,
    },

    poppinSemiBold8: {
      fontSize: 8,
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      color: Colors.black_232C28,
    },

    poppinSemiBold10: {
      fontSize: sHight(1.15),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      color: Colors.black_232C28,
    },
    poppinSemiBold12: {
      fontSize: 12,
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      color: Colors.black_232C28,
    },

    poppinSemiBold13: {
      fontSize: 13,
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      color: Colors.black_232C28,
    },
    poppinSemiBold14: {
      fontSize: responsiveFontSize(14, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(22, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinSemiBold15: {
      fontSize: responsiveFontSize(15, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(24, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinSemiBold16: {
      fontSize: responsiveFontSize(16, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(22, sHight(100)),
      color: Colors.black_232C28,
    },

    poppinSemiBold18: {
      fontSize: responsiveFontSize(18, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(24, sHight(100)),
      color: Colors.black_232C28,
      // fontSize: responsiveFontSize(18, sHight(100)),
      // fontFamily: Fonts.POPPINS_SUMIBOLD,
      // lineHeight: responsiveFontSize(24, sHight(100)),
      // color: Colors.black_232C28,
    },
    poppinSemiBold20: {
      fontSize: responsiveFontSize(20, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(28, sHight(100)),
      color: Colors.black_232C28,
      // fontSize: responsiveFontSize(20, sHight(100)),
      // fontFamily: Fonts.POPPINS_SUMIBOLD,
      // lineHeight: responsiveFontSize(28, sHight(100)),
      // color: Colors.black_232C28,
    },
    poppinSemiBold22: {
      fontSize: responsiveFontSize(22, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(24, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinSemiBold24: {
      fontSize: responsiveFontSize(24, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(28, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinSemiBold25: {
      fontSize: responsiveFontSize(25, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(40, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinSemiBold28: {
      fontSize: responsiveFontSize(28, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(40, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinSemiBold30: {
      fontSize: responsiveFontSize(30, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(38, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinSemiBold32: {
      fontSize: responsiveFontSize(32, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(40, sHight(100)),
      color: Colors.black_232C28,
    },

    poppinSemiBold35: {
      fontSize: sHight(3.65),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: sHight(4.85),
      color: Colors.black_232C28,
    },
    poppinSemiBold38: {
      fontSize: responsiveFontSize(38, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(45, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinSemiBold40: {
      fontSize: responsiveFontSize(40, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(48, sHight(100)),
      color: Colors.black_232C28,
      paddingTop: 5,
    },
    poppinSemiBold50: {
      fontSize: responsiveFontSize(50, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(60, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinSemiBold56: {
      fontSize: responsiveFontSize(56, sHight(100)),
      fontFamily: Fonts.POPPINS_SUMIBOLD,
      lineHeight: responsiveFontSize(66, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold10: {
      fontSize: responsiveFontSize(10, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(10, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold11: {
      fontSize: responsiveFontSize(11, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(21, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold12: {
      fontSize: responsiveFontSize(12, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(22, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold13: {
      fontSize: responsiveFontSize(13, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(22, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold14: {
      fontSize: responsiveFontSize(14, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(22, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold16: {
      fontSize: responsiveFontSize(16, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(22, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold18: {
      fontSize: responsiveFontSize(18, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(28, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold22: {
      fontSize: responsiveFontSize(22, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(28, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold24: {
      fontSize: responsiveFontSize(24, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(32, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold32: {
      fontSize: responsiveFontSize(32, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(32, sHight(100)),
      color: Colors.black_232C28,
    },
    poppinBold60: {
      fontSize: responsiveFontSize(60, sHight(100)),
      fontFamily: Fonts.POPPINS_BOLD,
      lineHeight: responsiveFontSize(76, sHight(100)),
      color: Colors.black_232C28,
    },

    textSmall: {
      fontSize: FontSize.small,
      color: Colors.textGray400,
    },
    textRegular: {
      fontSize: FontSize.regular,
      color: Colors.textGray400,
    },
    textLarge: {
      fontSize: FontSize.large,
      color: Colors.textGray400,
    },
    textBold: {
      fontWeight: 'bold',
    },
    textCapitalize: {
      textTransform: 'capitalize',
    },
    textUppercase: {
      textTransform: 'uppercase',
    },
    titleSmall: {
      fontSize: FontSize.small * 1.5,
      fontWeight: 'bold',
      color: Colors.textGray800,
    },
    titleRegular: {
      fontSize: FontSize.regular * 2,
      fontWeight: 'bold',
      color: Colors.textGray800,
    },
    titleLarge: {
      fontSize: FontSize.large * 2,
      fontWeight: 'bold',
      color: Colors.textGray800,
    },
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    textError: {
      color: Colors.error,
    },
    textSuccess: {
      color: Colors.success,
    },
    textPrimary: {
      color: Colors.primary,
    },
    textLight: {
      color: Colors.textGray200,
    },
    textLobster: {
      fontFamily: 'lobster',
      fontWeight: 'normal',
    },
  });
}
