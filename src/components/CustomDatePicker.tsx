import moment from 'moment';
import React, {ReactNode, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {TextMedium} from '.';
import {useTheme} from '../hooks';
type TProps = {
  customStyle?: any;
  headingText: string;
  setSelectedDate: CallableFunction;

  rightIcon?: boolean;
  rightIconName?: string;
  customBackgroundStyle?: any;
  customHeadingStyle?: any;
  leftIcon?: boolean;
  leftIconName?: string;
  mode?: string;
  dateProps?: any;
  placeholderText?: string;
  placeHolderStyle?: any;
  selectDate: any;
  children?: ReactNode;
  childrenStyle?: any;
  editable?: boolean;
  // value?: string;
  // maximumDate?: any;
  lefticonStyle?: any;
  isShowCross?: boolean;
};

const CustomDatePicker = ({
  customStyle,
  headingText,
  dateProps,
  children,
  childrenStyle,
  placeHolderStyle,
  placeholderText = t('common:select'),
  setSelectedDate,
  rightIcon,
  mode = 'date',
  // maximumDate,
  // value,
  leftIcon,
  selectDate,
  leftIconName,
  lefticonStyle,
  customHeadingStyle,
  customBackgroundStyle,
  rightIconName,
  editable = true,
  isShowCross = false,
}: TProps) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const RIcon = rightIconName ? Images.svg[rightIconName].default : null;
  const LIcon = leftIconName ? Images.svg[leftIconName].default : null;

  const showDatePicker = () => {
    Keyboard.dismiss();
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const isTimeString = str => {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] ?([APap][Mm])$/;
    return timeRegex.test(str);
  };
  const renderDateAndTimeShow = () => {
    if (
      selectDate &&
      selectDate !== '' &&
      selectDate !== undefined &&
      selectDate !== null
    ) {
      if (mode === 'time') {
        if (isTimeString(selectDate)) {
          return moment(selectDate, 'hh:mm A').format();
        } else {
          return moment(selectDate).format('hh:mm A');
        }
      } else {
        return moment(selectDate).format('DD/MM/YYYY');
      }
    } else {
      return new Date();
    }
  };

  const renderDateAndTime = () => {
    if (
      selectDate &&
      selectDate != '' &&
      selectDate != undefined &&
      selectDate != null &&
      selectDate != 'Invalid date'
    ) {
      if (mode === 'time') {
        if (isTimeString(selectDate)) {
          return moment(selectDate, 'hh:mm A').format();
        } else {
          return new Date(selectDate);
        }
      } else {
        return new Date(selectDate);
      }
    } else {
      return new Date();
    }
  };

  console.log('>>> renderDateAndTime() ', renderDateAndTime());
  console.log('>>> selectDate ', selectDate);
  console.log('>>>renderDateAndTimeShow() ', renderDateAndTimeShow());

  const handleConfirm = date => {
    setDatePickerVisibility(false);
    hideDatePicker();
    setSelectedDate(date);
  };
  const today = new Date();

  // Extract dates from props
  const {minimumDate: inputMinimumDate, maximumDate: inputMaximumDate} =
    dateProps || {minimumDate: null, maximumDate: null};

  // Sanitize dates
  const minimumDate = inputMinimumDate || new Date(1800, 0, 1); // Default minimum date
  const maximumDate =
    inputMaximumDate && inputMaximumDate < today ? today : inputMaximumDate;

  // Ensure maximumDate is after minimumDate
  const finalMaximumDate =
    maximumDate && maximumDate < minimumDate ? minimumDate : maximumDate;
  const clearDate = () => setSelectedDate(null);

  return (
    <View style={[Layout.fullWidth]}>
      <View style={[Layout.row, Layout.alignItemsCenter, childrenStyle]}>
        <TextMedium
          text={headingText}
          textStyle={[
            Fonts.poppinMed18,
            Gutters.littleBMargin,
            Gutters.littleLMargin,
            {color: Colors.black_232C28},
            customHeadingStyle,
          ]}
        />
        {children && <>{children}</>}
      </View>
      <Pressable
        disabled={!editable}
        activeOpacity={0.8}
        onPress={showDatePicker}
        style={[
          customStyle,
          Gutters.smallHPadding,
          Layout.fullWidth,
          Layout.row,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,

          {
            backgroundColor: Colors.gray_C9C9C9,
            borderRadius: 6,
            height: 60,
          },
          customBackgroundStyle,
        ]}>
        <View style={[Layout.row, Layout.alignItemsCenter]}>
          {leftIcon && <LIcon {...lefticonStyle} />}
          {selectDate &&
          selectDate != '' &&
          selectDate != undefined &&
          selectDate != null &&
          selectDate != 'Invalid date' ? (
            <TextMedium
              text={renderDateAndTimeShow()}
              // text={`${dayjs(selectDate).format(format)}`}
              textStyle={[
                Fonts.poppinMed16,
                leftIcon && Gutters.tinyLMargin,
                {
                  color: !editable
                    ? Colors.gray_BAC4D1
                    : Colors.dark_gray_676C6A,
                },
                placeHolderStyle,
              ]}
            />
          ) : (
            <TextMedium
              text={placeholderText}
              textStyle={[
                Fonts.poppinMed16,
                leftIcon && Gutters.tinyLMargin,
                {
                  color: !editable
                    ? Colors.gray_BAC4D1
                    : Colors.dark_gray_676C6A,
                },
              ]}
            />
          )}
        </View>

        <View style={[Layout.row, Layout.center]}>
          {isShowCross &&
            selectDate &&
            selectDate != '' &&
            selectDate != undefined &&
            selectDate != null &&
            selectDate != 'Invalid date' && (
              <TouchableOpacity
                onPress={clearDate}
                style={[
                  Layout.center,
                  Gutters.tinyRMargin,
                  Gutters.tinyRPadding,
                  Gutters.smallLPadding,
                  {
                    // backgroundColor: 'white',
                    // width: 30,
                    height: 50,
                  },
                ]}>
                <Images.svg.cross.default
                  stroke={Colors.gray_707070}
                  height={15}
                  width={15}
                />
              </TouchableOpacity>
            )}
          {rightIcon && <RIcon />}
        </View>
      </Pressable>
      <DateTimePickerModal
        // minimumDate={new Date(1800, 0, 1)}
        {...dateProps}
        minimumDate={minimumDate}
        maximumDate={finalMaximumDate}
        isVisible={isDatePickerVisible}
        mode={mode}
        date={renderDateAndTime()}
        // date={new Date(selectDate)}

        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default CustomDatePicker;
