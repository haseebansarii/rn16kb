import i18next from 'i18next';
import React, {ReactNode} from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {Modal} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../hooks';
type Props = {
  visible: boolean;
  children: ReactNode;
  setShowBottomSheet?: CallableFunction;
  icon?: boolean;
  height?: string | number;
  statusBarTranslucent?: any;
};

const CustomBottomSheet = ({
  visible,
  icon = true,
  setShowBottomSheet,
  children,
  height,
  statusBarTranslucent,
}: Props) => {
  const {Layout, Gutters, Images, Colors} = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate proper height
  const screenHeight = Dimensions.get('window').height;
  const calculatedHeight =
    typeof height === 'string'
      ? screenHeight * (parseFloat(height.replace('%', '')) / 100)
      : height || screenHeight * 0.7;

  return (
    <Modal
      visible={visible}
      presentationStyle="overFullScreen"
      animationType="slide"
      backdropColor="rgba(0, 0, 0, 0.5)"
      statusBarTranslucent={statusBarTranslucent}
      onRequestClose={() => {
        console.log('>>> onRequestClose 11 ');
        setShowBottomSheet && setShowBottomSheet(false);
      }}>
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        activeOpacity={1}
        onPress={() => {
          console.log('>>> onBackdropPress 11 ');
          setShowBottomSheet && setShowBottomSheet(false);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}} // Prevent closing when tapping the content
          style={[
            Layout.overflow,
            {
              height: calculatedHeight,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: Colors.white,
            },
          ]}>
          <View
            style={[
              Layout.fill,
              {
                paddingBottom: insets.bottom,
              },
            ]}>
            <View
              style={[
                i18next.language == 'en' ? Layout.row : Layout.rowReverse,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                Gutters.smallHPadding,
                {height: 50},
              ]}>
              <View />
              <View
                style={[
                  Layout.row,
                  Layout.alignItemsCenter,
                  Layout.justifyContentCenter,
                ]}>
                <View
                  style={[
                    {
                      marginRight: 4,
                      borderWidth: 4,
                      borderRadius: 100,
                      borderColor: Colors.gray_C9C9C9,
                    },
                  ]}
                />
                <View
                  style={[
                    {
                      marginRight: 4,
                      borderWidth: 4,
                      borderRadius: 100,
                      borderColor: Colors.gray_C9C9C9,
                    },
                  ]}
                />
                <View
                  style={[
                    {
                      width: '50%',
                      borderWidth: 3,
                      borderBottomWidth: 3,
                      borderRadius: 100,
                      borderColor: Colors.gray_C9C9C9,
                    },
                  ]}
                />
              </View>
              <View>
                {icon && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[Layout.alignItemsEnd]}
                    onPress={() =>
                      setShowBottomSheet && setShowBottomSheet(false)
                    }>
                    <Images.svg.cross.default stroke={'black'} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView
              style={[Layout.fill]}
              contentContainerStyle={[Layout.flexGrow, Gutters.tinyHPadding]}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              bounces={true}
              scrollEventThrottle={16}>
              {children}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomBottomSheet;
