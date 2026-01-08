import React, {useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {CustomHeader, CustomInput, CustomList} from '../../components';
import {useTheme} from '../../hooks';
import {useLazyFaqsQuery} from '../../services/faqs';
import Accordion from './FaqsList';

type Props = {
  navigation: any;
};

const FaqsContainer = ({navigation}: Props) => {
  const {Colors, Fonts, Gutters, Layout, Images} = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [getFAQS] = useLazyFaqsQuery();
  const [faqs, setFaqs] = useState([]);
  const getData = useCallback(async () => {
    await getFAQS('').then(res => {
      setFaqs(res?.data?.items);
      // console.log('res========', res?.data?.items);
    });
  }, []);
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      let temp = [...faqs];
      const results = temp?.filter(faq =>
        faq?.question.toLowerCase().includes(searchTerm?.toLowerCase()),
      );

      setFilteredFaqs(results);
    } else {
      setFilteredFaqs([]);
    }
  }, [searchTerm]);

  const noDataFound = useCallback(() => {
    return (
      <View style={[Layout.fill, Layout.center]}>
        <Text style={[Fonts.poppinMed18, {color: Colors.black_232C28}]}>
          {t('common:no_data_found')}
        </Text>
      </View>
    );
  }, []);

  return (
    <View
      style={[
        Layout.fill,
        Layout.alignItemsCenter,
        {backgroundColor: Colors.white},
      ]}>
      <CustomHeader
        title={t('common:faqs')}
        navigation={navigation}
        rightIcon={true}
        notification={5}
      />

      <View style={[Layout.screenWidth, Layout.selfCenter]}>
        <CustomInput
          righticon={false}
          lefticon={true}
          headingText=""
          lefticonName="searchChat"
          placeholder={t('common:search_question')}
          inputProps={{
            onChangeText: t => setSearchTerm(t),
            placeholderTextColor: Colors.dark_gray_676C6A,
          }}
          inputStyle={[Layout.fullWidth, Fonts.poppinMed16]}
          backgroundStyle={{
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderRadius: 10,
            height: 60,
            borderColor: Colors.black_232C28,
          }}
        />
      </View>

      <View style={[Layout.fill, Gutters.smallTPadding]}>
        <CustomList
          data={searchTerm ? filteredFaqs : faqs}
          listProps={{
            ListEmptyComponent: () => noDataFound(),
          }}
          renderItem={({item, index}) => {
            const {question, answer} = item;
            return (
              <Accordion index={index} title={question} content={answer} />
            );
          }}
        />
      </View>
    </View>
  );
};

export default FaqsContainer;
