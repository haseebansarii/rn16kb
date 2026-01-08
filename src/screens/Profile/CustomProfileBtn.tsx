import i18next from 'i18next';
import React, {memo} from 'react';
import {SectionList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {CustomButton, TextRegular, TextSemiBold} from '../../components';
import {useTheme} from '../../hooks';
import {RootState} from '../../store/store';
import {showUserAlert} from '../../utils/helpers';

type Props = {
  navigation: any;
};
const CustomProfileBtn = ({navigation}: Props) => {
  const {Colors, Fonts, Gutters, Layout, Images} = useTheme();
  const token = useSelector((state: RootState) => state?.auth?.token);

  const profileList = [
    {
      title: 'Selling',
      data: [
        {
          name: 'iSell',
          icon: <Images.svg.equal.default marginRight={15} />,
          navigation: 'ISellContainerCard',
        },
      ],
    },
    {
      title: 'Buying',
      data: [
        {
          name: 'iBuy',
          icon: <Images.svg.iBuyIcon.default marginRight={15} />,
          navigation: 'IBuy',
        },
        {
          name: 'iWatch',
          icon: <Images.svg.eyeOpen.default marginRight={15} />,
          navigation: 'IWatch',
        },
        // {
        //   name: 'Fixed Price Offers',
        //   icon: <Images.svg.fixed.default marginRight={15} />,
        //   navigation: 'FixedPriceOffer',
        // },
        {
          name: 'iWon / iLost',
          icon: <Images.svg.cup.default marginRight={15} />,
          navigation: 'IWon/ILost',
        },
        {
          name: 'iRate',
          icon: <Images.svg.iRate.default marginRight={15} />,
          navigation: 'RatingReviews',
        },
      ],
    },
    {
      title: 'Profile',
      data: [
        {
          name: 'iChat',
          icon: <Images.svg.message.default marginRight={15} />,
          navigation: 'IChat',
        },
        {
          name: 'Notifications',
          icon: <Images.svg.notification.default marginRight={15} />,
          navigation: 'Notification',
        },
        {
          name: 'Account Settings',
          icon: <Images.svg.setting.default marginRight={15} />,
          navigation: 'AccountSetting',
        },
        {
          name: 'Reports',
          icon: <Images.svg.report.default marginRight={15} />,
          navigation: 'ReportContainer',
        },
      ],
    },

    {
      title: 'Information',
      data: [
        {
          name: 'About Us',
          icon: <Images.svg.about.default marginRight={15} />,
          navigation: 'AboutUs',
        },
        {
          name: 'Faqs',
          icon: <Images.svg.faq.default marginRight={15} />,
          navigation: 'FaqsContainer',
        },
        {
          name: 'Privacy Policy',
          icon: <Images.svg.privacy.default marginRight={15} />,
          navigation: 'PrivacyPolicy',
        },
        {
          name: 'Terms & Condition',
          icon: <Images.svg.terms.default marginRight={15} />,
          navigation: 'TermsCondition',
        },
        {
          name: 'Contact Us',
          icon: <Images.svg.contact.default marginRight={10} />,
          navigation: 'ContactUs',
        },
      ],
    },
  ];

  const renderItem = ({item, index, section}) => {
    return (
      <>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            if (token == null) {
              showUserAlert(navigation);
              return;
            }
            navigation.navigate(item?.navigation);
          }}>
          <View style={styles.itemSubContainer}>
            {item?.icon}
            <TextRegular
              text={item?.name}
              textStyle={[
                Fonts.poppinReg18,
                {
                  textTransform: 'none',
                  color: Colors.black_232C28,
                  marginTop: 3,
                },
              ]}
            />
          </View>
          <Images.svg.rightArrow.default />
        </TouchableOpacity>
        {section.title === 'Selling' && (
          <CustomButton
            text={t('common:list_an_item')}
            btnStyle={[
              Layout.selfCenter,
              Gutters.tinyTMargin,
              {backgroundColor: Colors.primary, width: '90%'},
            ]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
            onPress={() => {
              if (token == null) {
                showUserAlert(navigation);
                return;
              } else {
                navigation.navigate('ISellContainer');
              }
            }}
          />
        )}
        {index == section.data.length - 1 && (
          <View
            style={{
              borderColor: Colors.gray_C9C9C9,
              borderWidth: index === 0 ? 0 : 1,
              marginVertical: '5%',
            }}
          />
        )}
      </>
    );
  };

  const renderSectionHeader = ({section: {title, data, index}}) => {
    return (
      <View
        style={[
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          Gutters.smallHPadding,
        ]}>
        <TextSemiBold
          text={title}
          textStyle={[Fonts.poppinSemiBold22, {color: Colors.black_232C28}]}
        />
      </View>
    );
  };

  return (
    <SectionList
      sections={profileList}
      keyExtractor={(item, index) => item + index}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
};

export default memo(CustomProfileBtn);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '6%',
    marginVertical: '2%',
    alignItems: 'center',
  },
  itemSubContainer: {flexDirection: 'row', alignItems: 'center'},
});
