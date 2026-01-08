import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {CustomHeader, CustomMenu, TextMedium} from '../../components';
import {useTheme} from '../../hooks';
import List from './List';

type Props = {
  navigation: any;
  route?: any;
};

const IWatchContainer = ({navigation, route}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  const [column, setColumn] = useState(1);
  const [selectedBtn, setSelectedBtn] = useState(0);

  const IWonILostBtn = () => {
    return (
      <View
        style={[
          Layout.screenWidth,
          Layout.row,
          Layout.selfCenter,
          Gutters.tinyRadius,
          {backgroundColor: Colors.gray_C9C9C9},
        ]}>
        <TouchableOpacity
          onPress={() => setSelectedBtn(0)}
          style={[
            Layout.halfWidth,
            Layout.center,
            selectedBtn == 0 ? Gutters.tinyRadius : Gutters.tinyLRadius,
            {
              height: 60,
              backgroundColor:
                selectedBtn == 0 ? Colors.primary : Colors.transparent,
            },
          ]}>
          <Text style={[Fonts.poppinSemiBold20, {color: Colors.white}]}>
            IWon
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedBtn(1)}
          style={[
            Layout.halfWidth,
            Layout.center,
            selectedBtn == 1 ? Gutters.tinyRadius : Gutters.tinyLRadius,
            {
              height: 60,
              backgroundColor:
                selectedBtn == 1 ? Colors.primary : Colors.transparent,
            },
          ]}>
          <Text style={[Fonts.poppinSemiBold20, {color: Colors.white}]}>
            ILost
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:i_watch')}
        navigation={navigation}
        rightIcon={true}
      />
      <View style={[Layout.fill]}>
        {route?.params?.column == 2 && <IWonILostBtn />}
        {route?.params?.column == 2 && (
          <TouchableOpacity
            onPress={() => (column == 1 ? setColumn(2) : setColumn(1))}
            style={[
              Layout.screenWidth,
              Layout.selfCenter,
              Layout.alignItemsEnd,
              Gutters.tinyVMargin,
            ]}>
            <View style={[Layout.row, Layout.alignItemsCenter]}>
              <TextMedium
                text={t('common:list_style')}
                textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
              />

              <Images.svg.listStyleIcon.default
                style={[Gutters.tinyLMargin, Gutters.tinyTMargin]}
              />
            </View>
          </TouchableOpacity>
        )}

        {column == 1 && <List column={column} />}
      </View>
    </View>
  );
};

export default IWatchContainer;
