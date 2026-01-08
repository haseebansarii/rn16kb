import {TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import {useTheme} from '../hooks';

type Props = {
  value?: boolean;
  flag?: string;
  toggleHandler?: CallableFunction;
};

const CustomToggleButton: FC<Props> = (props: Props) => {
  const {Colors, Layout, darkMode} = useTheme();
  const [toggle, setToggle] = useState<boolean>(props?.value as boolean);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setToggle(!toggle);
          props?.toggleHandler &&
            props?.toggleHandler({value: !toggle, flag: props?.flag});
        }}
        style={[
          {
            width: 42,
            height: 22,
            backgroundColor: toggle === true ? Colors.primary : Colors.white,
            borderRadius: 10,
            justifyContent: 'center',
            borderWidth: toggle !== true ? 1 : 0,
            borderColor: Colors.dark_gray_676C6A,
          },
        ]}>
        {toggle !== true ? (
          <View
            style={[
              {
                backgroundColor: Colors.dark_gray_676C6A,
                width: 16,
                height: 16,
                borderRadius: 8,
                marginLeft: 2,
              },
            ]}
          />
        ) : (
          <View
            style={[
              {
                backgroundColor: Colors.white,
                width: 16,
                height: 16,
                borderRadius: 8,
                alignSelf: 'flex-end',
                marginRight: 2,
              },
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomToggleButton;
