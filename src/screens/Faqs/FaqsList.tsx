import React, {useState, useRef, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {useTheme} from '../../hooks';
import i18next from 'i18next';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

type Props = {
  index: number;
  title: string;
  content: string;
};

const AccordionItem = ({
  index,
  title,
  content,
  selectedIndex,
  onSelect,
}: any) => {
  const isExpanded = index === selectedIndex;
  const [height, setHeight] = useState(isExpanded ? null : 0);
  const {Colors, Fonts, Gutters, Layout, Images} = useTheme();

  const handlePress = () => {
    onSelect(index);
  };

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
    setHeight(isExpanded ? null : 0);
  }, [isExpanded]);

  return (
    <View
      style={[
        index !== 0 && Gutters.xTinyTMargin,
        Layout.selfCenter,
        {
          backgroundColor:
            selectedIndex === index
              ? Colors.green_06975E
              : Colors.lightGreen_DBF5EC,
          borderRadius: 10,
          borderWidth: 1,

          borderColor: Colors.green_06975E,
          width: '93%',
        },
      ]}>
      <TouchableOpacity onPress={handlePress}>
        <View
          style={[
            Gutters.smallPadding,
            Gutters.xRegularRPadding,
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          ]}>
          <Text
            style={[
              Layout.fullWidth,
              selectedIndex === index
                ? Fonts.poppinSemiBold16
                : Fonts.poppinMed16,
              {
                color:
                  selectedIndex === index ? Colors.white : Colors.green_06975E,
              },
            ]}>
            {title.length > 30 ? title.slice(0, 30) + '...' : title}
          </Text>
          {selectedIndex === index ? (
            <Images.svg.plus_minus.default />
          ) : (
            <Images.svg.plus.default fill={Colors.green_06975E} />
          )}
        </View>
      </TouchableOpacity>
      <View style={[Layout.overflow, {height: height}]}>
        {isExpanded && (
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.xTinyPadding,
              {color: Colors.white},
            ]}>
            {content}
          </Text>
        )}
      </View>
    </View>
  );
};

const AccordionExample = ({index, title, content}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleSelect = index => {
    setSelectedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <View>
      <AccordionItem
        index={index}
        title={title}
        content={content}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      />
    </View>
  );
};

export default memo(AccordionExample);
