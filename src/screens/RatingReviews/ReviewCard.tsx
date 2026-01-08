import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useState} from 'react';
import {useTheme} from '../../hooks';
import {
  CustomBottomSheet,
  CustomButton,
  CustomFastImage,
  CustomInput,
  CustomRadioButton,
  CustomStarRating,
  ScreenWrapper,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../components';
import i18next from 'i18next';
import dayjs from 'dayjs';
import {API_URL} from '../../config';
import {useSendReviewMutation} from '../../services/modules/ReviewListing/getReviewListingData';
import {toastDangerMessage} from '../../utils/helpers';

type Props = {
  id: number;
  productName: string;
  comment: string;
  created_at: Date;
  type: string;
  getReviewListingData: CallableFunction;
  rating: number;
  rating_label: string;
  from_user: object;
  report_status: string;
  itemReview: any;
};

const ReviewCard = ({
  id,
  type,
  from_user,
  rating,
  report_status,
  rating_label,
  getReviewListingData,
  created_at,
  productName,
  comment,
  itemReview,
}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const [reportReview, setReportReview] = useState(false);
  const [deniedReport, setDeniedReport] = useState(false);
  const [selectedOptionError, setSelectedOptionError] = useState('');
  const [reportReason, setReportReason] = useState(
    itemReview?.report_reason ? itemReview?.report_reason : '',
  );
  const [sendReviewApi] = useSendReviewMutation();
  const nameSplit = () => {
    let name = `${from_user?.first_name} ${from_user?.last_name}`;
    const temp = name?.split(' ');
    return `${temp[0].charAt(0)}${temp[1].charAt(0)}`;
  };
  const ReportOptions = [
    {
      title: t('common:the_review_is_for_different_business'),
      value: 'different_business',
    },
    {
      title: t('common:the_review_is_spam_or_scam'),
      value: 'spam_or_scam',
    },
    {
      title: t('common:the_review_is_defamation'),
      value: 'defamation',
    },
    {
      title: t('common:the_review_is_false_or_contains_false_information'),
      value: 'false_information',
    },
    {
      title: t('common:to_be_arranged'),
      value: 'other',
    },
  ];

  const getIndexByValue = value => {
    let index = ReportOptions.findIndex(option => option.value === value);
    return index;
  };
  const [selected, setSelected] = useState(
    itemReview?.report_reason_key
      ? getIndexByValue(itemReview?.report_reason_key)
      : null,
  );

  return (
    <View style={[{backgroundColor: Colors.white}]}>
      <View
        style={[
          Layout.fullWidth,
          Gutters.smallPadding,
          Layout.overflow,
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,

          {backgroundColor: Colors.light_grayF4F4F4},
        ]}>
        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
            Layout.fullWidth,
          ]}>
          <View
            style={[
              Layout.center,
              Layout.overflow,
              {
                width: 50,
                height: 50,
                borderWidth: 1,
                borderColor: Colors.gray_BAC4D1,
                borderRadius: 100,
              },
            ]}>
            {from_user?.photo?.name != null ? (
              <CustomFastImage
                url={`${API_URL}get-uploaded-image/${from_user?.photo?.name}`}
                resizeMode="cover"
                cutomViewStyle={[{backgroundColor: Colors.primary}]}
              />
            ) : (
              <TextRegular
                text={`${nameSplit()}`}
                textStyle={[
                  Fonts.poppinReg14,
                  Layout.textUpperCase,
                  {color: Colors.gray_BAC4D1},
                ]}
              />
            )}
          </View>
          <View
            style={[
              Gutters.tinyLMargin,
              Layout.column,
              Layout.fill,
              Layout.justifyContentBetween,
            ]}>
            <TextMedium
              text={`${from_user?.first_name} ${from_user?.last_name}`}
              textStyle={[Fonts.poppinMed15, {color: Colors.gray_1D232C}]}
            />
            <TextRegular
              text={`${dayjs(created_at).format('MMM DD, YYYY')}`}
              textStyle={[
                Fonts.poppinReg10,
                Gutters.littleVMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
            <TextMedium
              text={type === 'buyer_to_seller' ? 'Buyer' : 'Seller'}
              textStyle={[Fonts.poppinMed12, {color: Colors.primary}]}
            />
          </View>
          {report_status === 'pending' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                // setSelected(null);
                setSelectedOptionError('');
                setReportReason(
                  itemReview?.report_reason ? itemReview?.report_reason : '',
                );
                setReportReview(true);
              }}
              style={[
                Layout.center,
                i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              ]}>
              <Images.svg.warning.default fill={Colors.green_06975E} />
              <TextRegular
                text={t('common:report_sent')}
                textStyle={[
                  Fonts.poppinReg14,
                  Gutters.littleLMargin,
                  {color: Colors.green_06975E},
                ]}
              />
            </TouchableOpacity>
          ) : report_status == 'none' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setSelected(null);
                setSelectedOptionError('');
                setReportReview(true);
              }}
              style={[
                Layout.center,
                i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              ]}>
              <Images.svg.warning.default fill={Colors.dark_gray_676C6A} />
              <TextRegular
                text={t('common:report_reiew')}
                textStyle={[
                  Fonts.poppinReg14,
                  Gutters.littleLMargin,
                  {color: Colors.dark_gray_676C6A},
                ]}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setDeniedReport(true);
              }}
              style={[
                Layout.alignItemsStart,
                i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              ]}>
              <Images.svg.warning.default fill={Colors.red_E34040} />
              <View style={[Layout.fullHeight]}>
                <TextRegular
                  text={t('common:denied')}
                  textStyle={[
                    Fonts.poppinReg14,
                    Gutters.littleLMargin,
                    {color: Colors.red_E34040},
                  ]}
                />
                <TextRegular
                  text={t('common:view_message')}
                  textStyle={[
                    Fonts.poppinReg14,
                    Gutters.littleLMargin,
                    {
                      color: Colors.black_232C28,
                      textDecorationLine: 'underline',
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View>
        <View
          style={[
            Layout.fullWidth,
            Gutters.smallPadding,
            Layout.overflow,
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          ]}>
          <View>
            <TextSemiBold
              text={productName}
              textStyle={[Fonts.poppinSemiBold15, {color: Colors.black_232C28}]}
            />
            <View
              style={[
                Layout.alignItemsCenter,
                Gutters.littleVMargin,
                i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              ]}>
              <CustomStarRating
                rating={rating}
                starProps={{starSize: 10, emptyStarColor: Colors.gray_C9C9C9}}
                starSize={15}
              />
              <TextMedium
                text={rating_label}
                textStyle={[
                  Fonts.poppinMed10,
                  Gutters.smallLMargin,
                  {color: Colors.primary},
                ]}
              />
            </View>
            <TextRegular
              text={comment}
              textStyle={[
                Fonts.poppinReg12,
                Gutters.smallVMargin,
                {color: Colors.black},
              ]}
            />
          </View>
        </View>
      </View>

      <CustomBottomSheet
        height={'90%'}
        setShowBottomSheet={() => setReportReview(false)}
        visible={reportReview}>
        <ScreenWrapper>
          <View style={[Layout.fullWidth]}>
            <TextSemiBold
              text={t('common:report_review')}
              textStyle={[{color: Colors.black_232C28}]}
            />
            <TextMedium
              text={t('common:why_are_you_reporting_this_review')}
              textStyle={[Gutters.tinyVMargin, {color: Colors.black_232C28}]}
            />
            <View style={[Gutters.littleTMargin]}>
              {ReportOptions?.map((item, index) => {
                const {title} = item;
                // console.log(itemReview?.report_reason_key);
                return (
                  <CustomRadioButton
                    selected={selected}
                    setSelected={v => {
                      if (itemReview?.report_reason_key) {
                        setReportReview(false);
                        toastDangerMessage(t('common:report_sent_already'));
                      } else {
                        // console.log('value', v);
                        setSelected(v);
                        selectedOptionError && setSelectedOptionError('');
                      }
                    }}
                    text={title}
                    customStyle={[Layout.alignItemsStart]}
                    customRadioStyle={{marginTop: 3}}
                    // customTextStyle={[Layout.textTransfromNone]}
                    index={index}
                  />
                );
              })}
            </View>
            {selectedOptionError && (
              <TextMedium
                text={selectedOptionError}
                textStyle={[
                  Layout.textTransfromNone,
                  Gutters.smallBMargin,
                  {color: Colors.red},
                ]}
              />
            )}
            <View>
              <TextMedium
                text={t('common:tell_us_more')}
                textStyle={[
                  Fonts.poppinSemiBold15,
                  Layout.textTransfromNone,
                  Gutters.smallBMargin,
                  {color: Colors.black_232C28},
                ]}
              />
              <CustomInput
                headingText=""
                inputProps={{
                  editable: itemReview?.report_reason_key ? false : true,
                  value: reportReason,
                  multiline: true,
                  onChangeText: t => setReportReason(t),
                }}
                placeholder={''}
                backgroundStyle={[{height: 127}]}
                inputStyle={[
                  {
                    borderWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    borderRadius: 10,
                    textAlignVertical: 'top',
                    backgroundColor: Colors.white,
                  },
                ]}
              />
            </View>
            <View style={[Gutters.smallTMargin]}>
              <CustomButton
                text={t('common:submit_now')}
                btnStyle={[{backgroundColor: Colors.primary}]}
                textStyle={[Layout.textTransfromNone, {color: Colors.white}]}
                onPress={() => {
                  if (itemReview?.report_reason_key) {
                    setReportReview(false);
                    toastDangerMessage(t('common:report_sent_already'));
                    return;
                  }
                  if (selected != null) {
                    let body = {
                      id: id,
                      report_status: 'pending',
                      report_reason_key: ReportOptions[selected].value,
                      report_reason: reportReason,
                    };
                    sendReviewApi(body).then(() => getReviewListingData());
                    setSelectedOptionError('');
                    setReportReview(false);
                  } else {
                    setSelectedOptionError(t('common:please_select_an_option'));
                  }
                }}
              />
            </View>
          </View>
        </ScreenWrapper>
      </CustomBottomSheet>
      <CustomBottomSheet
        visible={deniedReport}
        height={'60%'}
        setShowBottomSheet={() => setDeniedReport(false)}>
        <ScreenWrapper>
          <View style={[Layout.fullWidth]}>
            <TextSemiBold
              text={t('common:denied_message')}
              textStyle={[
                Gutters.smallBMargin,
                {color: Colors.black_232C28, textAlign: 'center'},
              ]}
            />
            <CustomInput
              headingText=""
              inputProps={{
                value: itemReview?.admin_comment,
                editable: false,
                multiline: true,
                onChangeText: t => console.log(t, '>>> test 9922 '),
              }}
              placeholder={''}
              backgroundStyle={[{height: 127}]}
              inputStyle={[
                {
                  borderWidth: 1,
                  borderColor: Colors.gray_C9C9C9,
                  borderRadius: 10,
                  textAlignVertical: 'top',
                  backgroundColor: Colors.white,
                },
              ]}
            />
            <View style={[Gutters.xRegularTMargin]}>
              <CustomButton
                text={t('common:back')}
                btnStyle={[{backgroundColor: Colors.primary}]}
                textStyle={[{color: Colors.white}]}
                onPress={() => {
                  setDeniedReport(false);
                }}
              />
            </View>
          </View>
        </ScreenWrapper>
      </CustomBottomSheet>
    </View>
  );
};

export default ReviewCard;
