import i18next from 'i18next';
import React, {ReactNode, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {TextMedium} from '.';
import {useTheme} from '../hooks';
import {sWidth} from '../utils/ScreenDimentions';

type Props = {
  value?: any;
  inputProps?: any;
  inputStyle?: any;
  showPassword?: boolean;
  placeholder: string;
  key?: number;
  icon?: boolean;
  headingText?: string;
  headingTextStyle?: any;
  lefticon?: boolean;
  righticon?: boolean;
  righticonName?: string;
  lefticonName?: string;
  backgroundStyle?: any;
  children?: ReactNode;
  childrenstyle?: any;
  editable?: boolean;
  keyboardType?: string;
  lefticonStyle?: any;
  righticonSearch?: boolean;
};

const CustomInput = ({
  keyboardType,
  inputProps,
  inputStyle,
  editable,
  lefticon,
  righticon,
  righticonSearch,
  righticonName,
  lefticonName,
  key,
  backgroundStyle,
  placeholder,
  showPassword,
  headingText,
  headingTextStyle,
  value,
  children,
  childrenstyle,
  lefticonStyle,
}: Props) => {
  const {Colors, Layout, Gutters, Images, Fonts} = useTheme();
  const [password, setShowPassword] = useState(showPassword ? true : false);

  const LIcon = lefticonName ? Images?.svg[lefticonName]?.default : null;
  const RIcon = righticonName ? Images?.svg[righticonName]?.default : null;

  return (
    <View
      style={[
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        Layout.fullWidth,
      ]}>
      <View style={[Layout.fullWidth]}>
        <View
          style={[Layout.fullWidth, Layout.wrap, Layout.row, childrenstyle]}>
          {typeof headingText === 'string' && headingText.trim().length > 0 && (
            <TextMedium
              text={`${headingText}`}
              textStyle={[
                Fonts.poppinMed14,
                Gutters.tinyBMargin,
                Gutters.littleLMargin,
                headingTextStyle,
              ]}
            />
          )}
          {children && <>{children}</>}
        </View>

        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Gutters.tinyHPadding,
            Layout.fullWidth,
            // Layout.alignItemsCenter,
            {
              height: 60,
              borderRadius: 6,
              backgroundColor: Colors.white,
              // backgroundColor: onFocus ? Colors.white : Colors.gray_C9C9C9,
            },
            backgroundStyle,
          ]}>
          {lefticon && (
            <View style={[Layout.center, {width: 40}]}>
              <LIcon {...lefticonStyle} />
            </View>
          )}
          <TextInput
            {...inputProps}
            editable={editable}
            key={key}
            value={value}
            placeholder={placeholder}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoComplete={'off'}
            secureTextEntry={password}
            placeholderTextColor={Colors.dark_gray_676C6A}
            style={[
              Layout.overflow,
              Gutters.tinyLPadding,
              Fonts.poppinMed16,
              Layout.fill,
              i18next.language === 'en'
                ? Layout.textAlignLeft
                : Layout.textAlignRight,
              inputStyle,
            ]}
            {...inputProps}
          />
          {righticon && (
            <View style={[Layout.center, Gutters.littleRPadding]}>
              {righticonSearch ? (
                <RIcon fill={!password ? Colors.primary : Colors.gray_C9C9C9} />
              ) : (
                <RIcon
                  stroke={!password ? Colors.primary : Colors.gray_C9C9C9}
                  fill={!password ? Colors.primary : Colors.gray_C9C9C9}
                />
              )}
            </View>
          )}
          {showPassword && (
            <TouchableOpacity
              style={[Layout.center, {width: '15%'}]}
              activeOpacity={0.8}
              onPress={() => setShowPassword(!password)}>
              <Images.svg.eyeOpen.default
                stroke={!password ? Colors.primary : Colors.gray_C9C9C9}
                fill={!password ? Colors.primary : Colors.gray_C9C9C9}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomInput;
