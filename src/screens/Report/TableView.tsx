import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  Row,
  Rows,
  Cell,
  TableWrapper,
  Table,
} from 'react-native-table-component';
import {CustomButton, CustomDatePicker, TextSemiBold} from '../../components';
import {useTheme} from '../../hooks';
import {Colors} from '../../theme/Variables';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {useLazyGetReportProductsQuery} from '../../services/profileTab/reportsUser';
import {sWidth} from '../../utils/ScreenDimentions';
import {formatNumberFloat} from '../../utils/helpers';

type Props = {
  setFromDateFunc: CallableFunction;
  setToDateFunc: CallableFunction;
};

const TableView = ({setFromDateFunc, setToDateFunc}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  const [getReportsProduct] = useLazyGetReportProductsQuery();

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [tableHead, setTableHead] = useState([
    'Product Title',
    'Buyer',
    'Address',
    'Date',
    'Amount',
  ]);
  const [widthArr, setWidthArr] = useState([180, 200, 250, 150, 120]);
  const productsReport = useSelector(
    (state: RootState) => state?.profileTab?.productsReport,
  );

  useEffect(() => {
    let formattedFrom = fromDate && moment(fromDate).format('YYYY-MM-DD');
    let formattedTo = toDate && moment(toDate).format('YYYY-MM-DD');
    getReportsProduct({fromDate: formattedFrom, toDate: formattedTo, skip: 0});
    // getReportsProduct(url, {pollingInterval: 3000});
  }, [fromDate, toDate]);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = sHight(40);

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const LoadMoreRandomData = () => {
    setIsLoadingBottom(true);

    let formattedFrom = fromDate && moment(fromDate).format('YYYY-MM-DD');
    let formattedTo = toDate && moment(toDate).format('YYYY-MM-DD');
    getReportsProduct({
      fromDate: formattedFrom,
      toDate: formattedTo,
      skip: productsReport?.items?.length || 0,
    });
  };

  const tableData =
    productsReport?.items &&
    productsReport?.items?.map(item => {
      return [
        item?.title,
        `${item?.buyer?.first_name} ${item?.buyer?.last_name}`,
        item?.buyer?.address,
        `${moment(
          item?.status_changed_at ? item?.status_changed_at : item?.updated_at,
        ).format('DD-MM-YYYY')}`,
        `${t('common:nz')} ${formatNumberFloat(item?.sold_at_price_total)}`,
      ];
    });
  return (
    <View style={[Layout.screenWidth, Layout.selfCenter, Gutters.smallTMargin]}>
      <TextSemiBold
        text="Sales Details"
        textStyle={[Gutters.smallTMargin, {color: Colors.black_232C28}]}
      />

      <View
        style={[
          Gutters.tinyTMargin,
          Layout.row,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,
        ]}>
        <View style={[Layout.wrap, {width: '45%'}]}>
          <CustomDatePicker
            setSelectedDate={date => {
              const formated = moment(date).format('YYYY-MM-DD');
              setFromDate(date);
              setFromDateFunc(date);
            }}
            headingText={t('common:from')}
            customHeadingStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28, textTransform: 'capitalize'},
            ]}
            selectDate={fromDate}
            leftIcon={false}
            rightIcon={true}
            rightIconName="calendar"
            customBackgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
          />
        </View>
        <View style={[Layout.wrap, {width: '45%'}]}>
          <CustomDatePicker
            setSelectedDate={date => {
              const formated = moment(date).format('YYYY-MM-DD');
              setToDate(date);
              setToDateFunc(date);
            }}
            headingText={t('common:to')}
            customHeadingStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28, textTransform: 'capitalize'},
            ]}
            selectDate={toDate}
            leftIcon={false}
            rightIcon={true}
            rightIconName="calendar"
            customBackgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
          />
        </View>
      </View>
      <View style={[Layout.alignItemsEnd, Gutters.tinyTMargin, {}]}>
        <CustomButton
          text={t('common:clear')}
          btnStyle={[
            {backgroundColor: Colors.primary, width: sWidth(20), height: 40},
          ]}
          textStyle={[Fonts.poppinSemiBold16, {color: Colors.white}]}
          onPress={() => {
            setFromDate('');
            setToDate('');
            setFromDateFunc('');
            setToDateFunc('');
          }}
        />
      </View>
      <TextSemiBold
        text="Swipe left or right  to explore all the content. Keep swiping to see more details."
        textStyle={[
          Gutters.smallTMargin,
          Fonts.poppinSemiBold16,
          {color: Colors.black_232C28},
        ]}
      />
      <ScrollView
        style={{flex: 1}}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            if (
              productsReport?.items &&
              productsReport?.items?.length < productsReport?.pagination?.total
            ) {
              LoadMoreRandomData();
            }
          }
        }}
        scrollEventThrottle={16}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[Layout.flexGrow]}
          style={[Gutters.smallVMargin, Layout.fill]}>
          <Table
          // borderStyle={{
          //   borderBottomWidth: 1,
          //   borderColor: Colors.gray_C9C9C9,
          // }}
          >
            <Row
              data={tableHead}
              style={[
                Layout.selfCenter,
                {borderBottomWidth: 1, borderColor: Colors.gray_C9C9C9},
              ]}
              widthArr={widthArr}
              textStyle={[styles.textHeading]}
            />
            {tableData ? (
              <Rows
                data={tableData}
                widthArr={widthArr}
                textStyle={styles.text}
              />
            ) : (
              <View style={[Layout.fill, Layout.center]}>
                <Text style={[Fonts.poppinMed16, {color: Colors.black_232C28}]}>
                  {t('common:no_data_found')}
                </Text>
              </View>
            )}
          </Table>
        </ScrollView>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    margin: 6,
    fontSize: 16,
    fontWeight: '500',
    color: '#676C6A',
    marginVertical: 15,
    // textTransform: 'capitalize',
  },
  textHeading: {
    margin: 6,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black_232C28,
    marginVertical: 15,
  },
});

export default TableView;
