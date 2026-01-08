import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {TextSemiBold} from '../../../components';
import MediumText from '../../../components/MediumText';
import {useTheme} from '../../../hooks';
import {sWidth} from '../../../utils/ScreenDimentions';
import {RootState} from '../../../store/store';
import {setStep} from '../../../store/SignUp';
import {toastDangerMessage} from '../../../utils/helpers';

type Props = {};

const StepsSignUp = ({}: Props) => {
  const {Colors, Fonts, Images, Gutters, Layout} = useTheme();
  const step = useSelector((state: RootState) => state.signup.step.selectedTab);
  const stepObj = useSelector((state: RootState) => state.signup.step);
  const {signUpBasic, locationDropDownSelected} = useSelector(
    state => state.signup,
  );

  const dispatch = useDispatch();
  return (
    <View
      style={[
        Layout.selfCenter,
        Layout.row,
        Layout.overflow,
        Layout.justifyContentBetween,
        // Layout.alignItemsCenter,
        Gutters.smallTMargin,
        {
          // width: '90%',
        },
      ]}>
      <TouchableOpacity
        style={[Layout.center]}
        onPress={() => {
          if (step !== 1) {
            dispatch(setStep({selectedTab: 1}));
          }
        }}>
        <View
          style={[
            Layout.center,
            {
              width: 40,
              height: 40,
              borderRadius: 100,
              backgroundColor: step == 1 ? Colors.white : Colors.primary,
            },
          ]}>
          {step == 1 ? (
            <TextSemiBold
              text={'1'}
              textStyle={[
                Fonts.poppinSemiBold24,
                {
                  color: Colors.black_232C28,
                  // marginTop: 5
                },
              ]}
            />
          ) : (
            <Images.svg.tick.default width={20} height={20} />
          )}
        </View>
        <MediumText
          text={t('common:step_one')}
          textStyle={[
            Gutters.littleTMargin,
            Fonts.poppinMed18,
            {
              textAlign: 'center',
              color: step == 1 ? Colors.white : Colors.primary,
            },
          ]}
        />
      </TouchableOpacity>
      <View
        style={[
          // Gutters.largeBMargin,
          Gutters.smallTMargin,
          Gutters.tinyHMargin,
          {
            width: '15%',
            borderWidth: 0.8,
            borderStyle: step >= 2 ? 'solid' : 'dashed',
            borderColor: step >= 2 ? Colors.primary : Colors.dark_gray_676C6A,
            height: 0.1,
          },
        ]}
      />
      <TouchableOpacity
        style={[Layout.center]}
        onPress={() => {
          if (step !== 2) {
            toastDangerMessage("Press 'Continue' to proceed to the next step");
          }
        }}>
        <View
          style={[
            Layout.center,
            {
              width: 40,
              height: 40,
              borderRadius: 100,
              backgroundColor:
                step == 1
                  ? Colors.dark_gray_676C6A
                  : step == 2
                  ? Colors.white
                  : step == 3
                  ? Colors.primary
                  : Colors.dark_gray_676C6A,
            },
          ]}>
          {step == 1 ? (
            <TextSemiBold
              text={'2'}
              textStyle={[
                Fonts.poppinSemiBold24,
                {
                  // marginTop: 5,
                  textAlign: 'center',
                  color: Colors.black,
                },
              ]}
            />
          ) : step == 2 ? (
            <TextSemiBold
              text={'2'}
              textStyle={[
                Fonts.poppinSemiBold24,
                ,
                {
                  // marginTop: 5,
                  textAlign: 'center',
                  color: Colors.black,
                },
              ]}
            />
          ) : (
            <Images.svg.tick.default width={20} height={20} />
          )}
        </View>
        <MediumText
          text={t('common:step_two')}
          textStyle={[
            Gutters.littleTMargin,
            Fonts.poppinMed18,
            {
              textAlign: 'center',
              color:
                step == 1
                  ? Colors.dark_gray_676C6A
                  : step == 2
                  ? Colors.white
                  : step == 3
                  ? Colors.primary
                  : Colors.dark_gray_676C6A,
            },
          ]}
        />
      </TouchableOpacity>
      <View
        style={[
          Gutters.smallTMargin,
          Gutters.tinyHMargin,
          {
            width: '15%',
            borderWidth: 0.8,
            borderStyle: step >= 3 ? 'solid' : 'dashed',
            borderColor: step >= 3 ? Colors.primary : Colors.dark_gray_676C6A,
            height: 0.1,
          },
        ]}
      />
      <TouchableOpacity
        style={[Layout.center]}
        onPress={() => {
          if (step !== 3) {
            toastDangerMessage("Press 'Continue' to proceed to the next step");
          }
        }}>
        <View
          style={[
            Layout.center,
            {
              width: 40,
              height: 40,
              borderRadius: 100,
              backgroundColor:
                step == 1
                  ? Colors.dark_gray_676C6A
                  : step == 2
                  ? Colors.dark_gray_676C6A
                  : step == 3
                  ? Colors.white
                  : Colors.primary,
            },
          ]}>
          {step == 1 ? (
            <TextSemiBold
              text={'3'}
              textStyle={[
                Fonts.poppinSemiBold24,
                {
                  textAlign: 'center',
                  color: Colors.black,
                },
              ]}
            />
          ) : step == 2 ? (
            <TextSemiBold
              text={'3'}
              textStyle={[
                Fonts.poppinSemiBold24,
                {
                  textAlign: 'center',
                  color: Colors.black,
                },
              ]}
            />
          ) : (
            <TextSemiBold
              text={'3'}
              textStyle={[
                Fonts.poppinSemiBold24,
                {
                  textAlign: 'center',
                  color: Colors.black,
                },
              ]}
            />
          )}
        </View>
        <MediumText
          text={'Step 03'}
          textStyle={[
            Gutters.littleTMargin,
            Fonts.poppinMed18,
            {
              textAlign: 'center',
              color:
                step == 1
                  ? Colors.dark_gray_676C6A
                  : step == 2
                  ? Colors.dark_gray_676C6A
                  : step == 3
                  ? Colors.white
                  : Colors.primary,
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default StepsSignUp;
