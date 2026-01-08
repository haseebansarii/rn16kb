import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {
  Image,
  Linking,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../hooks';
import {TextRegular, TextSemiBold, CustomInput, CustomButton} from '.';
import {useAddFavouriteListingMutation} from '../services/modules/home/favouriteListing';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {API_URL} from '../config';

export type FinanceListingProps = {
  finance: {
    name?: string;
    email?: string;
    image?: any;
    website_link?: string;
    description?: string;
    estimated_interest_rate?: string | number;
    maximum_yearly_terms?: string | number;
    minimum_deposit?: string | number;
  };
  buyNowPrice: number;
  uploadingImage?: string | null;
  style?: any;
  listingId?: string;
  productOwnerId?: string; // owner of the listing
  currentUserId?: string; // logged in user id (optional override; falls back to store)
  defaultExpanded?: boolean;
};

const styles = StyleSheet.create({
  animatedScroll: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

const repaymentPeriods = ['Weekly', 'Fortnightly', 'Monthly'] as const;

type Period = (typeof repaymentPeriods)[number];

const FinanceListing: React.FC<FinanceListingProps> = ({
  finance,
  buyNowPrice,
  uploadingImage = null,
  style,
  listingId,
  productOwnerId,
  currentUserId,
  defaultExpanded = false,
}) => {
  const {Colors, Gutters, Layout, Fonts, Images} = useTheme();
  const storeUserId = useSelector(
    (state: RootState) => state.auth?.user_data?._id,
  );
  const loggedInUserId = currentUserId || storeUserId;
  const [addFavouriteListing] = useAddFavouriteListingMutation();
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [selectedLoanTerm, setSelectedLoanTerm] = useState<number>(5);
  const [selectedRepayment, setSelectedRepayment] = useState<Period>('Weekly');
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const [didMeasure, setDidMeasure] = useState(false);

  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current; // 0 collapsed, 1 expanded

  const animate = useCallback(
    (to: number) => {
      Animated.parallel([
        Animated.timing(heightAnim, {
          toValue: to,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false, // height cannot use native driver
        }),
        Animated.timing(rotateAnim, {
          toValue: to === 0 ? 0 : 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    },
    [heightAnim, rotateAnim],
  );

  useEffect(() => {
    if (Number(finance?.maximum_yearly_terms) < selectedLoanTerm) {
      setSelectedLoanTerm(Number(finance?.maximum_yearly_terms));
    } else {
      setSelectedLoanTerm(5);
    }
  }, [finance?.maximum_yearly_terms]);

  useEffect(() => {
    if (didMeasure) {
      // If the measured content is taller than a max ratio of the screen,
      // animate to that capped height so the body becomes scrollable
      const maxBodyHeight = Dimensions.get('window').height * 0.6; // 60% of screen
      const visibleHeight = Math.min(measuredHeight, maxBodyHeight);
      animate(expanded ? visibleHeight : 0);
    }
  }, [expanded, measuredHeight, didMeasure, animate]);

  const maxTerms = useMemo(() => {
    const raw = parseInt(String(finance?.maximum_yearly_terms || '10'), 10);
    if (isNaN(raw) || raw <= 0) {
      return 10;
    }
    return raw;
  }, [finance?.maximum_yearly_terms]);

  const loanTermOptions = useMemo(
    () => Array.from({length: maxTerms}, (_, i) => i + 1),
    [maxTerms],
  );

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) {
      amount = 0;
    }
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const repaymentValue = useMemo(() => {
    const annualInterestRate = parseFloat(
      String(finance?.estimated_interest_rate || '0'),
    );
    const loanAmountLocal = buyNowPrice - (depositAmount ?? 0);
    let paymentsPerYear: number;
    switch (selectedRepayment) {
      case 'Weekly':
        paymentsPerYear = 52;
        break;
      case 'Fortnightly':
        paymentsPerYear = 26;
        break;
      case 'Monthly':
      default:
        paymentsPerYear = 12;
    }
    const totalPayments = selectedLoanTerm * paymentsPerYear;
    if (annualInterestRate === 0) {
      return loanAmountLocal / totalPayments;
    }
    const periodicRate = annualInterestRate / 100 / paymentsPerYear;
    return (
      loanAmountLocal *
      ((periodicRate * Math.pow(1 + periodicRate, totalPayments)) /
        (Math.pow(1 + periodicRate, totalPayments) - 1))
    );
  }, [
    finance,
    buyNowPrice,
    depositAmount,
    selectedLoanTerm,
    selectedRepayment,
  ]);

  const imageSource = useMemo(() => {
    if (uploadingImage) {
      return {uri: uploadingImage};
    }
    if (finance?.image?.name) {
      return {uri: `${API_URL}get-uploaded-image/${finance.image.name}`};
    }
    if (typeof finance?.image === 'string') {
      return {uri: `${API_URL}get-uploaded-image/${finance.image}`};
    }
    return null;
  }, [uploadingImage, finance?.image]);

  const loanAmount = buyNowPrice - (depositAmount || 0);

  const bodyContent = (
    <View style={[Gutters.regularPadding]}>
      {/* Deposit Amount */}
      <View style={[Gutters.smallBMargin]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextRegular
            text={'Deposit amount:'}
            textStyle={[Fonts.poppinReg14]}
          />
          <CustomInput
            inputProps={{
              value: String(depositAmount),
              keyboardType: 'numeric',
              onChangeText: txt => {
                const num = parseFloat(txt);
                if (!isNaN(num)) {
                  setDepositAmount(num);
                } else if (txt === '') {
                  setDepositAmount(0);
                }
              },
            }}
            showPassword={false}
          />
        </View>
      </View>

      {/* Loan Amount */}
      <View style={[Gutters.tinyBMargin, {flexDirection: 'row'}]}>
        <TextRegular
          text={'Loan amount:'}
          textStyle={[Fonts.poppinReg14, {marginRight: 8}]}
        />
        <TextSemiBold
          text={`$${formatCurrency(loanAmount)}`}
          textStyle={[Fonts.poppinSemiBold16, {color: Colors.green_0E9F4A}]}
        />
      </View>

      {/* Interest Rate */}
      <View style={[Gutters.smallBMargin, {flexDirection: 'row'}]}>
        <TextRegular
          text={'Interest rate of:'}
          textStyle={[Fonts.poppinReg14, {marginRight: 8}]}
        />
        <TextSemiBold
          text={`${finance?.estimated_interest_rate || 0}%`}
          textStyle={[Fonts.poppinSemiBold16, {color: Colors.green_0E9F4A}]}
        />
      </View>

      {/* Loan Term */}
      <View style={[Gutters.smallBMargin]}>
        <TextRegular
          text={'Loan term (years)'}
          textStyle={[Fonts.poppinReg14, Gutters.tinyBMargin]}
        />
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {loanTermOptions.map(year => {
            const active = selectedLoanTerm === year;
            return (
              <TouchableOpacity
                key={year}
                onPress={() => setSelectedLoanTerm(year)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: active ? Colors.primary : Colors.gray_606060,
                  backgroundColor: active ? Colors.primary : 'transparent',
                  marginRight: 8,
                  marginBottom: 8,
                }}>
                <TextRegular
                  text={`${year}`}
                  textStyle={[
                    Fonts.poppinReg14,
                    {color: active ? Colors.white : Colors.gray_606060},
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Repayments */}
      <View style={[Gutters.smallBMargin]}>
        <TextRegular
          text={'Repayments'}
          textStyle={[Fonts.poppinReg14, Gutters.tinyBMargin]}
        />
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {repaymentPeriods.map(period => {
            const active = selectedRepayment === period;
            return (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedRepayment(period)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: active ? Colors.primary : Colors.gray_606060,
                  backgroundColor: active ? Colors.primary : 'transparent',
                  marginRight: 8,
                  marginBottom: 8,
                }}>
                <TextRegular
                  text={period}
                  textStyle={[
                    Fonts.poppinReg14,
                    {color: active ? Colors.white : Colors.gray_606060},
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Calculated Repayment */}
      <View
        style={{
          backgroundColor: Colors.light_grayF4F4F4,
          padding: 12,
          borderRadius: 6,
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <TextSemiBold
          text={`$${formatCurrency(repaymentValue)}`}
          textStyle={[Fonts.poppinSemiBold24, {color: Colors.green_0E9F4A}]}
        />
      </View>

      {/* Description  */}
      {finance?.description && finance.description.trim().length > 0 && (
        <View style={{marginBottom: 12, alignItems: 'center'}}>
          <TextRegular
            text={finance?.description}
            textStyle={[
              Fonts.poppinReg14,
              {color: Colors.gray_606060, textAlign: 'center'},
            ]}
          />
        </View>
      )}

      {/* Apply Button */}
      {finance?.website_link ? (
        <CustomButton
          onPress={async () => {
            try {
              const shouldAddToFavourites =
                !!listingId &&
                !!loggedInUserId &&
                !!productOwnerId &&
                loggedInUserId !== productOwnerId; // not own listing

              if (shouldAddToFavourites) {
                // Fire & forget; errors handled by mutation's onQueryStarted
                await addFavouriteListing({listing: listingId});
              }
            } catch (e) {
              // swallow; toast already handled in mutation
            } finally {
              if (finance.website_link) {
                Linking.openURL(finance.website_link).catch(() => {});
              }
            }
          }}
          text={`Apply or enquire now with ${finance?.name || 'YOUR FINANCE'}`}
          btnStyle={{backgroundColor: Colors.primary}}
          textStyle={[Fonts.poppinSemiBold16, {color: Colors.white}]}
        />
      ) : null}
    </View>
  );

  // Measure body height once (after first layout)
  const onBodyLayout = useCallback(
    (e: any) => {
      if (!didMeasure) {
        const h = e.nativeEvent.layout.height;
        setMeasuredHeight(h);
        // Initialize animated values according to the desired expanded state
        // so we don't flash open while measuring. If the accordion should
        // start collapsed, set height to 0 and arrow to 0 (collapsed).
        const maxBodyHeight = Dimensions.get('window').height * 0.6;
        const visibleHeight = Math.min(h, maxBodyHeight);
        if (expanded) {
          heightAnim.setValue(visibleHeight);
          rotateAnim.setValue(1);
        } else {
          heightAnim.setValue(0);
          rotateAnim.setValue(0);
        }
        setDidMeasure(true);
      }
    },
    [didMeasure, heightAnim, rotateAnim, expanded],
  );

  return (
    <View
      style={[
        {
          backgroundColor: Colors.white,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: Colors.light_grayF4F4F4,
          overflow: 'hidden',
        },
        style,
      ]}>
      {/* Logo */}
      <View
        style={[
          Layout.center,
          Gutters.smallPadding,
          {backgroundColor: Colors.white},
        ]}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={{width: 200, height: 100, resizeMode: 'contain'}}
          />
        ) : (
          <TextSemiBold
            textStyle={[Fonts.poppinSemiBold16, {color: Colors.gray_606060}]}
            text={finance.name || 'YOUR LOGO HERE'}
          />
        )}
      </View>

      {/* Header */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpanded(e => !e)}
        style={{
          backgroundColor: Colors.light_grayF4F4F4,
          paddingVertical: 12,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TextSemiBold
          textStyle={[Fonts.poppinSemiBold20]}
          text={finance?.name || 'YOUR FINANCE'}
        />
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}>
          <Images.svg.arrowDown.default
            fill={Colors.gray_606060}
            width={20}
            height={20}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Hidden body for measuring (only until measured) */}
      {!didMeasure && (
        <View
          style={{position: 'absolute', opacity: 0}}
          onLayout={onBodyLayout}>
          {bodyContent}
        </View>
      )}

      {/* Animated body */}
      {didMeasure && (
        <Animated.View style={{height: heightAnim, overflow: 'hidden'}}>
          {/* Make content scrollable when it exceeds the visible/capped height */}
          <ScrollView
            style={styles.animatedScroll}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.contentContainer}>
            {bodyContent}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

export default FinanceListing;
