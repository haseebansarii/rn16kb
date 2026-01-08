/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

import {ThemeNavigationColors} from '../../@types/theme';

/**
 * Colors
 */
export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  primary: '#09C47A',
  green_075838: '#075838',

  green_06975E: '#06975E',
  lightGreen_DBF5EC: '#DBF5EC',
  star_yello: '#ED8A19',
  red_CB1A1A: '#CB1A1A',
  white: '#ffffff',
  bg_white_F4F4F4: '#F4F4F4',
  black: '#000000',
  red: '#F14F21',
  // red: '#EE1111',
  red_C31E1E: '#C31E1E',
  gray_shadow: '#e6e6e6',
  grey_F4: '#F4F4F4',
  light_grey: 'lightgrey',
  black_34: '#343434',
  blue_ED: '#EDF5FF',
  blue_C6: '#C6CFDB',
  green_B1: '#B1FFB1',
  green_8E: '#8ED18E',
  green_40AC20: '#40AC20',
  green_4FDE24: '#4FDE24',
  black_343434: '#343434',
  red_FFB1B1: '#FFB1B1',
  red_D18E8E: '#D18E8E',
  dark_gray_676C6A: '#676C6A',
  gray_C9C9C9: '#C9C9C9',
  black_232C28: '#232C28',
  light_grayF4F4F4: '#F4F4F4',
  gray_D9D9D9: '#D9D9D9',
  black_303E37: '#303E37',
  skyBlue_12B6DD: '#12B6DD',
  yellow_starF7BC14: '#F7BC14',
  yellow_F8BC02: '#F8BC02',
  red_E34040: '#E34040',
  green_00FF85: '#00FF85',
  green_black_34594A: '#34594A',
  gray_161C24: '#161C24',
  black_323D38: '#323D38',
  background: '#F4F4F4',
  gray_A4A4A4: '#A4A4A4',
  gray_dark_666C7E: '#666C7E',
  gray_767676: '#767676',
  gray_BAC4D1: '#BAC4D1',
  gray_1D232C: '#1D232C',
  gray_606060: '#606060',
  gray_E2E2E2: '#E2E2E2',
  gray_707070: '#707070',
  red_FF0505F7: '#FF0505F7',
  gray_F1F1F1: '#F1F1F1',
  gray_F0F0F0: '#F0F0F0',
  red_F73838: '#F73838',
  red_FFEBEA: '##FFEBEA',
  gray_adb5bd: '#adb5bd',
  gray_868e96: '#868e96',
  gray_d3d3d3: '#d3d3d3',
};

export const NavigationColors: Partial<ThemeNavigationColors> = {
  // primary: Colors.purple_5B127E,
  background: '#EFEFEF',
  card: '#EFEFEF',
};

/**
 * FontSize
 */
export const FontSize = {
  tiny: 14,
  small: 16,
  regular: 20,
  large: 40,
};

/**
 * Metrics Sizes
 */
const little = 5;
const tiny = 10;
const xxtiny = 13;
const xTiny = 15;
const small = tiny * 2; // 20
const medium = 25;
const regular = tiny * 3; // 30
const sRegular = 35;
const xRegular = 40;
const xxRegular = 50;
const large = regular * 2; // 60
const xLarge = xRegular * 2; // 60
export const MetricsSizes = {
  little,
  tiny,
  xxtiny,
  xTiny,
  small,
  medium,
  regular,
  sRegular,
  xRegular,
  xxRegular,
  large,
  xLarge,
};

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
};
