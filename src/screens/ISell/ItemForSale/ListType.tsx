import i18next from 'i18next';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {CustomRadioButton, TextMedium} from '../../../components';
import {useTheme} from '../../../hooks';

type Props = {selected: string; setSelected: CallableFunction};

export const listTypeConst = {
  enquire: 'enquire',
  auction: 'auction',
  fixed_price: 'fixed_price',
} as const;

const listTypeLabel = {
  enquire: 'Enquire',
  auction: 'Auction Item',
  fixed_price: 'Fixed Price Offers',
} as const;

export type ListTypeType = keyof typeof listTypeConst;

const ListType = ({selected, setSelected}: Props) => {
  const {Colors, Fonts, Gutters, Layout} = useTheme();
  return (
    <View style={[Layout.fullWidth, Gutters.smallVMargin]}>
      {Object.keys(listTypeConst).map(type => {
        const key = type as keyof typeof listTypeConst;
        return (
          <TouchableOpacity
            onPress={() => setSelected(type)}
            style={[
              Layout.fullWidth,
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Gutters.tinyBMargin,
              Gutters.smallHPadding,
              {
                height: 80,
                backgroundColor:
                  selected === type ? Colors.lightGreen_DBF5EC : 'transparent',
                borderWidth: 1,
                borderColor:
                  selected === type ? Colors.primary : Colors.dark_gray_676C6A,
                borderRadius: 6,
              },
            ]}
            key={type}>
            <TextMedium
              text={listTypeLabel[key]}
              textStyle={[
                Fonts.poppinMed20,
                {
                  color:
                    selected === type
                      ? Colors.primary
                      : Colors.dark_gray_676C6A,
                },
              ]}
            />
            <View style={[Gutters.tinyTMargin]}>
              <CustomRadioButton
                index={type}
                selected={selected}
                setSelected={setSelected}
                customRadioStyle={[
                  {
                    width: 28,
                    height: 28,
                    borderWidth: 2,
                    borderColor:
                      selected === type
                        ? Colors.primary
                        : Colors.dark_gray_676C6A,
                  },
                ]}
                innerCircle={[{width: 14, height: 14}]}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ListType;
