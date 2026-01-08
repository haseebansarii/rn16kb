import i18next from 'i18next';
import React, {ReactNode, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../hooks';
import {TextMedium, TextRegular} from '../../components';

type Props = {
  data: Array<Object>;
  setSelected: CallableFunction;
  headingTextStyle?: any;
  headingText: string;
  customStyle?: any;
  placeholder: string;
  itemStyle?: any;
  value: string;
  selectedTextStyle?: any;
  customListStyle?: any;
  leftIcon?: boolean;
  iconName?: string;
  isShipping?: boolean;
  children?: ReactNode;
  editable?: boolean;
};

const RadiusDropDown = ({
  data,
  value,
  children,
  isShipping = false,
  headingTextStyle,
  headingText,
  setSelected,
  placeholder,
  customStyle,
  selectedTextStyle,
  itemStyle,
  editable = true,
  customListStyle,
}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const [selectedText, setSelectedText] = useState(value);
  const [showMenu, setShowMenu] = useState(false);

  const memoizedCallBack = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={[Gutters.tinyPadding, itemStyle, {zIndex: 99}]}
        activeOpacity={0.8}
        onPress={() => {
          setSelected(isShipping ? item : item?.value);
          setSelectedText(isShipping ? item?.option_name : item?.key);
          setShowMenu(false);
        }}>
        <TextRegular
          text={isShipping ? item?.option_name : item?.key}
          textStyle={[Fonts.poppinReg16, {color: Colors.dark_gray_676C6A}]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={[Layout.row, Layout.fullWidth, Layout.alignItemsCenter]}>
        {headingText != '' && (
          <TextMedium
            text={headingText}
            textStyle={[
              Fonts.poppinMed14,
              Gutters.littleBMargin,
              Gutters.littleLMargin,
              {color: Colors.gray_C9C9C9},
              headingTextStyle,
            ]}
          />
        )}
        {children && <>{children}</>}
      </View>

      <TouchableOpacity
        disabled={!editable}
        activeOpacity={0.8}
        onPress={() => setShowMenu(!showMenu)}
        style={[
          Gutters.smallHPadding,
          Layout.fullWidth,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          {
            backgroundColor: Colors.gray_C9C9C9,
            borderRadius: 6,
            borderBottomLeftRadius: showMenu ? 0 : 6,
            borderBottomRightRadius: showMenu ? 0 : 6,
            height: 60,
          },
          customStyle,
        ]}>
        <View style={[Layout.row]}>
          {/* {leftIcon && <Images.svg.wallet.default fill={Colors.black_232C28} />} */}
          <TextMedium
            text={
              selectedText
                ? selectedText.includes('meter')
                  ? selectedText
                  : selectedText + ' Kilometers'
                : placeholder
            }
            textStyle={[
              Fonts.poppinMed16,
              Gutters.littleLMargin,
              {color: editable ? Colors.dark_gray_676C6A : Colors.gray_BAC4D1},
              selectedTextStyle,
            ]}
          />
        </View>
        <Images.svg.arrowDown.default
          style={{transform: [{rotate: showMenu ? '180deg' : '0deg'}]}}
          fill={Colors.dark_gray_676C6A}
        />
      </TouchableOpacity>
      {showMenu && (
        <View
          style={[
            {
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
              backgroundColor: Colors.gray_C9C9C9,
            },
            customListStyle,
          ]}>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={memoizedCallBack as any}
          />

          {/* {data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[Gutters.tinyPadding, itemStyle]}
              activeOpacity={0.8}
              onPress={() => {
                setSelected(item?.value);
                setSelectedText(item?.key);
                setShowMenu(false);
              }}>
              <TextRegular
                text={item?.key}
                textStyle={[
                  Fonts.poppinReg16,
                  {color: Colors.dark_gray_676C6A},
                ]}
              />
            </TouchableOpacity>
          ))} */}
        </View>
      )}
    </View>
  );
};

export default RadiusDropDown;
