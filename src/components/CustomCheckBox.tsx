import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useTheme} from '../hooks';

type Props = {
  customStyle?: any;
  setSelected?: CallableFunction;
  index?: number;
  selected?: boolean;
  isCard?: boolean;
};

const CustomCheckBox = ({
  customStyle,
  index,
  setSelected,
  selected = false,
  isCard = false,
}: Props) => {
  const {Colors, Layout, Images} = useTheme();
  // const [check, setCheck] = useState(selected !== undefined ? selected : false);

  return (
    <TouchableOpacity
      activeOpacity={isCard && selected ? 1 : 0.8}
      key={index}
      style={[
        Layout.center,
        {
          width: 20,
          height: 20,
          borderRadius: 1.5,
          borderWidth: 1,
          borderColor: selected ? Colors.white : Colors.gray_C9C9C9,
          backgroundColor: selected ? Colors.primary : 'transparent',
        },
        customStyle,
      ]}
      onPress={() => {
        if (isCard && selected) {
          typeof setSelected === 'function' && setSelected(!selected);
        } else if (typeof setSelected === 'function') {
          setSelected(!selected);
        } else {
          setSelected && setSelected(index);
        }
      }}>
      {selected && <Images.svg.tick.default />}
    </TouchableOpacity>
  );
};

export default CustomCheckBox;
