import {StyleSheet} from 'react-native';
import {Gutters, ThemeVariables} from '../../@types/theme';
import {NativeModules} from 'react-native';
const {StatusBarManager} = NativeModules;

const StatusBarheight = StatusBarManager.HEIGHT;

/**
 * Generate Styles depending on MetricsSizes vars availabled at ./theme/Variables
 * Styles are like :
 * <size><direction><op>: {
 *    <op><direction>: <value>
 * }
 * where:
 * <size>: is the key of the variable included in MetricsSizes
 * <direction>: can be ['Bottom','Top','Right','Left','Horizontal','Vertical']
 * <op>: can be ['Margin', 'Padding']
 * <value>: is the value of the <size>
 */
export default function ({MetricsSizes}: ThemeVariables): Gutters {
  return StyleSheet.create(
    Object.entries(MetricsSizes).reduce(
      (acc, [key, value]) => ({
        ...acc,
        /* Margins */
        [`${key}Margin`]: {
          margin: value,
        },
        [`${key}BMargin`]: {
          marginBottom: value,
        },
        [`${key}TMargin`]: {
          marginTop: value,
        },
        [`${key}RMargin`]: {
          marginRight: value,
        },
        [`${key}LMargin`]: {
          marginLeft: value,
        },
        [`${key}VMargin`]: {
          marginVertical: value,
        },
        [`${key}HMargin`]: {
          marginHorizontal: value,
        },
        /* Paddings */
        [`${key}Padding`]: {
          padding: value,
        },
        [`${key}BPadding`]: {
          paddingBottom: value,
        },
        [`${key}TPadding`]: {
          paddingTop: value,
        },
        [`${key}RPadding`]: {
          paddingRight: value,
        },
        [`${key}LPadding`]: {
          paddingLeft: value,
        },
        [`${key}VPadding`]: {
          paddingVertical: value,
        },
        [`${key}HPadding`]: {
          paddingHorizontal: value,
        },
        [`${key}BLRadius`]: {
          borderBottomLeftRadius: value,
        },
        [`${key}BRRadius`]: {
          borderBottomRightRadius: value,
        },
        [`${key}TLRadius`]: {
          borderTopLeftRadius: value,
        },
        [`${key}TRRadius`]: {
          borderTopRightRadius: value,
        },
        [`${key}Radius`]: {
          borderRadius: value,
        },
        borderWidth: {
          borderWidth: 1,
        },
        borderBWidth: {
          borderBottomWidth: 1,
        },
        borderTWidth: {
          borderTopWidth: 1,
        },
        borderLWidth: {
          borderLeftWidth: 1,
        },
        borderRWidth: {
          borderRightWidth: 1,
        },
        statusBarHeight: {
          paddingTop: StatusBarheight,
        } as any,
        topHeaderHeight: {
          height: 90,
        },
        notificationCard: {width: 32, height: 29},
        lightShadow: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        },
        darkShadow: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 10,
        },
      }),
      {},
    ) as Gutters,
  );
}
