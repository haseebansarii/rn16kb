import React, {memo} from 'react';
import {View} from 'react-native';
import {
  CustomRadioButton,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';

const methodOfSaleSummary = {
  enquire: {
    title: 'Enquire',
    descriptions: ['Allow buyers to enquire'],
  },
  fixed_price: {
    title: 'Set an asking price',
    descriptions: [
      'Negotiate on price directly with buyers',
      'Ability to accept offers from buyers',
    ],
  },
  auction: {
    title: 'Run an auction',
    descriptions: [
      'Fastest way to sell your vehicle',
      'Get a fair market price',
      'Set a reserve price',
    ],
  },
} as const;

export const methodOfSaleConst = {
  enquire: 'enquire',
  fixed_price: 'fixed_price',
  auction: 'auction',
} as const;

export type MethodOfSaleType = keyof typeof methodOfSaleConst;

type Props = {
  selected: MethodOfSaleType;
  setSelected: CallableFunction;
};

const MethodOfSaleSelection = ({selected, setSelected}: Props) => {
  const {Colors, Fonts, Gutters, Layout} = useTheme();
  return (
    <View>
      <TextSemiBold
        text={'How would you like to sell your vehicle?'}
        textStyle={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}
      />
      <View style={[Gutters.smallTMargin]}>
        {Object.keys(methodOfSaleConst).map(method => {
          const methodKey = method as keyof typeof methodOfSaleSummary;
          return (
            <View
              key={method}
              style={[
                Gutters.xTinyPadding,
                Gutters.smallBMargin,
                {
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor:
                    selected === method ? Colors.primary : Colors.black_232C28,
                  backgroundColor:
                    selected === method
                      ? Colors.lightGreen_DBF5EC
                      : 'transparent',
                },
              ]}>
              <CustomRadioButton
                selected={selected}
                index={method}
                setSelected={setSelected}
                customStyle={[Layout.selfEnd, {marginBottom: 0}]}
                customRadioStyle={[
                  {
                    width: 24,
                    height: 24,
                    borderWidth: 2,
                    borderColor:
                      selected === method
                        ? Colors.primary
                        : Colors.dark_gray_676C6A,
                  },
                ]}
                innerCircle={[{width: 12, height: 12}]}
              />
              <View style={[Gutters.smallHPadding]}>
                <TextSemiBold
                  text={methodOfSaleSummary[methodKey].title}
                  textStyle={[
                    Fonts.poppinSemiBold24,
                    {color: Colors.black_232C28},
                  ]}
                />
                {methodOfSaleSummary[methodKey].descriptions.map(
                  description => {
                    return (
                      <View
                        key={description}
                        style={[
                          Layout.row,
                          Gutters.littleVMargin,
                          Layout.alignItemsCenter,
                        ]}>
                        <View
                          style={[
                            {
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: Colors.black_232C28,
                            },
                          ]}
                        />
                        <TextRegular
                          text={description}
                          textStyle={[
                            Fonts.poppinReg14,
                            Gutters.tinyLMargin,
                            {color: Colors.black_232C28},
                          ]}
                        />
                      </View>
                    );
                  },
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default memo(MethodOfSaleSelection);
