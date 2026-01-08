import React, {ReactNode} from 'react';
import {Platform, ScrollView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../hooks';
type Props = {
  children: ReactNode;
  customStyle?: any;
};

const CustomScreenWrapper = ({children, customStyle}: Props) => {
  const {Layout, Colors, Gutters} = useTheme();
  return (
    <SafeAreaView style={[Layout.fill]} edges={['top']}>
      <KeyboardAwareScrollView
        showsHorizontalScrollIndicator={false}
        extraScrollHeight={Platform.OS === 'android' ? 60 : 100}
        contentContainerStyle={[
          Platform.OS === 'ios' && Layout.fill,
          {flexGrow: 1},
        ]}
        extraHeight={10}
        bounces={false}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        // enableAutomaticScroll={true}
        keyboardShouldPersistTaps="always">
        <ScrollView
          contentContainerStyle={[Layout.flexGrow]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={[
            Layout.fill,
            Layout.selfCenter,
            {backgroundColor: 'transparent', width: '94%'},
            customStyle,
          ]}>
          {children}
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CustomScreenWrapper;
