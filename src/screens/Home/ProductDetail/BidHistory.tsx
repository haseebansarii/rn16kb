import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../hooks';
import {product_details} from '../../../utils/dummyData';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {Colors} from '../../../theme/Variables';

const BidHistory = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();
  const [isTrue, setIsTrue] = useState(false);

  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  const renderItem = ({item}: any) => (
    <View style={styles.row}>
      <Text
        style={[
          styles.cell,
          Fonts.poppinMed14,
          {color: Colors.dark_gray_676C6A, fontWeight: '400'},
        ]}>
        {item?.bidder?.first_name} {item?.bidder?.last_name}
      </Text>
      <Text
        style={[
          styles.cell,
          Fonts.poppinMed14,
          {color: Colors.dark_gray_676C6A, fontWeight: '400'},
        ]}>
        {item?.amount}
      </Text>
      <Text
        style={[
          styles.cell,
          Fonts.poppinMed14,
          {color: Colors.dark_gray_676C6A, fontWeight: '400'},
        ]}>
        {/* {item.created_at} */}
        {moment(item.created_at).format('DD MMM YYYY')}
      </Text>
    </View>
  );
  const toggleState = () => {
    setIsTrue(!isTrue);
  };

  return (
    <View style={[Layout.screenWidth, Layout.selfCenter, Gutters.smallVMargin]}>
      <View
        style={[
          Layout.row,
          Layout.fullWidth,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,
          Gutters.borderWidth,
          Gutters.tinyRadius,
          Gutters.xTinyHPadding,
          {
            borderColor: Colors.dark_gray_676C6A,
            height: 55,
            backgroundColor: Colors.light_grayF4F4F4,
          },
        ]}>
        <View style={[Layout.row]}>
          <Text style={[Fonts.poppinMed16, {fontWeight: '600'}]}>
            {selectedProductData?.auction_data?.bids_count + ' bids - '}
          </Text>
          <Text
            style={[
              Fonts.poppinMed14,
              {color: Colors.dark_gray_676C6A, fontWeight: '400'},
            ]}>
            {t('View Bid History')}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleState}>
          <Images.svg.plus.default fill={Colors.black_232C28} />
        </TouchableOpacity>
      </View>

      {isTrue && (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.headerCell, Fonts.poppinMed14]}>User</Text>
            <Text style={[styles.headerCell, Fonts.poppinMed14]}>Bid</Text>
            <Text style={[styles.headerCell, Fonts.poppinMed14]}>Date</Text>
          </View>
          <FlatList
            data={selectedProductData?.auction_data?.bids}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    paddingTop: 10,
    backgroundColor: Colors.light_grayF4F4F4,
  },
  header: {
    flexDirection: 'row',
    // marginBottom: 10,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    paddingVertical: 10,
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
  },
  row: {
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark_gray_676C6A,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default BidHistory;
