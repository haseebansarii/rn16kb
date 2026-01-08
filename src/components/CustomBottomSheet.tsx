import i18next from 'i18next';
import React, {ReactNode} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
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

  return (
    <Modal
      statusBarTranslucent={statusBarTranslucent}
      isVisible={visible}
      onBackdropPress={() => {
        console.log('>>> onBackdropPress 11 ');
        setShowBottomSheet && setShowBottomSheet(false);
      }}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        padding: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
      <View
        style={[
          Layout.overflow,
          {
            height: height,
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
                  style={[Layout.alignContentEnd]}
                  onPress={() => setShowBottomSheet(false)}>
                  <Images.svg.cross.default stroke={'black'} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={[Layout.fill, Gutters.tinyHPadding, Layout.overflow]}>
            {/* <ScrollView
          contentContainerStyle={[Layout.flexGrow, Layout.alignItemsCenter]}
          style={[Layout.fill, Layout.overflow]}> */}
            {children}
          </View>
          {/* </ScrollView> */}
        </View>
      </View>
    </Modal>
  );
};

export default CustomBottomSheet;
