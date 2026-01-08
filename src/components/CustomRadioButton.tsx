import i18next from 'i18next';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {TextRegular} from '.';
import {useTheme} from '../hooks';

type Props = {
  text?: string;
  index?: number | string;
  selected: number | string;
  setSelected: CallableFunction;
  customRadioStyle?: any;
  innerCircle?: any;
  customStyle?: any;
  customTextStyle?: any;
};

const CustomRadioButton = ({
  text,
  setSelected,
  selected,
  customRadioStyle,
  index,
  innerCircle,
  customStyle,
  customTextStyle,
}: Props) => {
  const {Colors, Fonts, Gutters, Layout} = useTheme();
  const [isCheck, setIsCheck] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        setIsCheck(!isCheck);
        setSelected(index);
      }}
      style={[
        Gutters.tinyBMargin,
        Layout.alignItemsCenter,
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        customStyle,
      ]}>
      <View
        style={[
          Layout.center,
          {
            borderWidth: 1,
            borderColor: Colors.primary,
            width: 19,
            height: 19,
            borderRadius: 100,
          },
          customRadioStyle,
        ]}>
        {selected === index && (
          <View
            style={[
              {
                width: 10,
                height: 10,
                borderRadius: 100,
                backgroundColor: Colors.primary,
              },
              innerCircle,
            ]}
          />
        )}
      </View>
      {text && (
        <View>
          <TextRegular
            text={text}
            textStyle={[
              Fonts.poppinReg16,
              Gutters.tinyLMargin,
              Gutters.littleHPadding,
              {color: Colors.black_232C28},
              customTextStyle,
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomRadioButton;
