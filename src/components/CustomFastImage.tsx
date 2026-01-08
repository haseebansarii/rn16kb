import {View, Image} from 'react-native';
import {useTheme} from '../hooks';
import {ReactNode} from 'react';
import {extractObjects} from '../utils/helpers';
import {SvgUri} from 'react-native-svg';

type Props = {
  customStyle?: any;
  url: string;
  resizeMode?: string;
  cutomViewStyle?: any;
  fastImageProps?: any;
  children?: ReactNode;
};

const CustomFastImage = ({
  customStyle = [],
  cutomViewStyle,
  resizeMode,
  url,
  children,
  fastImageProps,
}: Props) => {
  const {Layout} = useTheme();
  const height =
    extractObjects(customStyle).find(item => item.height)?.height || 60;
  const width =
    extractObjects(customStyle).find(item => item.width)?.width || 60;

  const borderRadius =
    extractObjects(customStyle).find(item => item.borderRadius)?.borderRadius ||
    0;

  return (
    <View
      style={[
        Layout.center,
        Layout.overflow,
        // {width: width, height: height, borderRadius: borderRadius},
        cutomViewStyle,
      ]}>
      {typeof url === 'string' && url.endsWith('.svg') ? (
        <View
          style={[
            Layout.alignItemsCenter,
            Layout.justifyContentCenter,
            {
              width: width,
              height: height,
              borderRadius: borderRadius,
              overflow: 'hidden',
            },
            ...extractObjects(customStyle),
          ]}>
          <SvgUri
            width={width}
            height={height}
            uri={url}
            style={[
              {
                width: height,
                height: width,
                borderRadius: borderRadius,
              },
              ...extractObjects(customStyle),
            ]}
          />
        </View>
      ) : (
        <Image
          style={[
            {
              width: width,
              height: height,
              borderRadius: borderRadius,
            },
            ...extractObjects(customStyle),
          ]}
          {...fastImageProps}
          source={
            url
              ? typeof url === 'string'
                ? {
                    uri: url,
                    headers: {Authorization: 'authToken'},
                  }
                : url
              : require('../theme/assets/svg/images-notFound.svg')
          }
          resizeMode={resizeMode ? resizeMode : 'contain'}
        />
      )}
      {children && <>{children}</>}
    </View>
  );
};

export default CustomFastImage;
