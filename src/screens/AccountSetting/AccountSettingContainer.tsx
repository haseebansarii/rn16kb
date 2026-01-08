import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {Selling, Subscription, UserProfile, Branding} from '.';
import {CustomHeader, CustomMenu} from '../../components';
import {useTheme} from '../../hooks';
import {useLazyGetSubscriptionPlansQuery} from '../../services/auth/signupApi';
import {useLazyGetUserDataByTokenQuery} from '../../services/accountSettings/userProfileService';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {useLazyGetBrandingByTokenQuery} from '../../services/accountSettings/brandingService';
import {useLazyGetAgentsByTokenQuery} from '../../services/accountSettings/agentsService';
import {t} from 'i18next';
import Finance from './Finance';

type Props = {
  navigation: any;
};

const AccountSettingContainer = ({navigation}: Props) => {
  const {Colors, Fonts, Gutters, Layout} = useTheme();
  const [selected, setSelected] = useState(0);
  const [getSubscriptionPlans] = useLazyGetSubscriptionPlansQuery();
  const [getUserData] = useLazyGetUserDataByTokenQuery();
  const [getBranding] = useLazyGetBrandingByTokenQuery();
  const [getAgents] = useLazyGetAgentsByTokenQuery();

  const token = useSelector((state: RootState) => state?.auth?.token);
  const user_data = useSelector((state: RootState) => state?.auth?.user_data);
  const subscriptionPlans = useSelector(
    (state: RootState) => state?.signup?.subscription_plans,
  );

  const menuOptions = [
    {key: t('common:general'), valaue: '0'},
    {key: t('common:payment_option'), valaue: '1'},
  ];

  menuOptions.push({key: t('common:subscription'), valaue: '2'});

  if (user_data.subscription) {
    const matchingSubscription = subscriptionPlans.find(
      s => s.name === user_data.subscription.plan_name,
    );

    if (!matchingSubscription || matchingSubscription.allow_branding) {
      menuOptions.push({key: t('common:branding'), valaue: '3'});
    }
  }

  if (user_data?.subscription?.finance_enabled) {
    menuOptions.push({key: 'Finance', valaue: '4'});
  }

  useEffect(() => {
    getSubscriptionPlans('');
    if (!!token) {
      getUserData('');
      getBranding('');
      getAgents('');
    }
  }, []);

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:account_setting')}
        navigation={navigation}
      />
      <View style={[Gutters.smallHPadding, Layout.selfCenter]}>
        {Platform.OS == 'ios' ? (
          <CustomMenu
            data={menuOptions}
            cutomStyle={[
              Gutters.smallVMargin,
              {backgroundColor: Colors.gray_C9C9C9},
            ]}
            textStyle={[
              Fonts.poppinMed12,
              {
                textAlign: 'center',
                color: Colors.white,
              },
            ]}
            selected={selected}
            setSelected={setSelected}
          />
        ) : (
          <CustomMenu
            data={menuOptions}
            cutomStyle={[
              Gutters.smallVMargin,
              {backgroundColor: Colors.gray_C9C9C9},
            ]}
            textStyle={[
              Fonts.poppinMed12,
              {
                textAlign: 'center',
                color: Colors.white,
              },
            ]}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </View>

      {/* <ScrollView
        keyboardShouldPersistTaps="always"
        style={[Layout.fill]}
        // contentContainerStyle={[Layout.fill, Layout.flexGrow]}
        showsVerticalScrollIndicator={false}> */}

      {selected === 0 && <UserProfile navigation={navigation} />}
      {selected === 1 && <Selling />}
      {selected === 2 && <Subscription />}
      {selected === 3 && <Branding />}
      {selected === 4 && <Finance />}

      {/* </ScrollView> */}
    </View>
  );
};

export default AccountSettingContainer;
