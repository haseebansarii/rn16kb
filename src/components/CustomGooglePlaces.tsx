import React, {useEffect, useState} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAP_API_KEY} from '../config';
import {useTheme} from '../hooks';
import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import fonts from '../theme/assets/Fonts';
type Props = {
  setFieldValue: CallableFunction;
  autoPlacesProps?: any;
  editable: boolean;
  customStyle?: object;
  textInputProps?: any;
  setPickup?: CallableFunction;
  value?: any;
  isCompleteAddres?: boolean;
  editProfile?: boolean;
};

const CustomGooglePlaces = ({
  value,
  setFieldValue,
  editable,
  customStyle,
  setPickup,
  autoPlacesProps,
  textInputProps,
  isCompleteAddres,
  editProfile,
}: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  const [location, setLocation] = useState('');

  const getShortAddress = addressComponents => {
    let locality = '';
    let sublocality = '';
    let country = '';

    addressComponents.forEach(component => {
      if (component.types.includes('locality')) {
        locality = component.long_name;
      } else if (
        component.types.includes('sublocality') ||
        component.types.includes('sublocality_level_1')
      ) {
        sublocality = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      }
    });

    // Construct the short address
    let shortAddress = '';
    if (sublocality) {
      shortAddress += `${sublocality}, `;
    }
    if (locality) {
      shortAddress += `${locality}, `;
    }
    if (country) {
      shortAddress += `${country}`;
    }

    // Remove trailing comma and space if present
    return shortAddress.trim().replace(/,\s*$/, '');
  };

  return (
    <View style={[customStyle]}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{flexGrow: 1}}> */}
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          console.log('>>>details 22 ', details);

          let location = getShortAddress(details?.address_components);
          setLocation(isCompleteAddres ? details?.formatted_address : location);
          setFieldValue({...details, shortLocation: location});
          if (typeof setPickup === 'function') {
            setPickup(isCompleteAddres ? details?.formatted_address : location);
          }
        }}
        {...autoPlacesProps}
        fetchDetails={true}
        minLength={2}
        debounce={400}
        enablePoweredByContainer={false}
        renderDescription={row => row.description}
        keyboardShouldPersistTaps="always"
        textInputProps={{
          value: value,
          onChange: t => setPickup(t.nativeEvent.text),
          editable: editable,
          returnKeyType: 'search',
          keyboardAppearance: 'default',
          autoFocus: false,
          autoCapitalize: 'none',
          autoComplete: 'off',
          defaultValue: location,
          autoCorrect: false,
          style: {
            width: '90%',
            height: 60,
            zIndex: 999,
            alignSelf: 'center',
            borderColor: Colors.gray_C9C9C9,
            color: editProfile ? Colors.black_232C28 : Colors.gray_707070,
            fontFamily: fonts.POPPINS_MEDIUM,
            fontSize: 16,
            flex: 1,
            marginRight: 5,
            marginLeft: editProfile ? 0 : 8,
          },
          ...textInputProps,
        }}
        styles={{
          textInputContainer: {
            width: '100%',
            alignItems: 'center',
            backgroundColor: Colors.light_grayF4F4F4,
            borderWidth: editProfile ? 0 : 1,
            borderRadius: 6,
            paddingLeft: 10,
            borderColor: Colors.gray_C9C9C9,
          },
          description: {
            fontWeight: '600',
          },
          predefinedPlacesDescription: {
            color: Colors.black,
          },
        }}
        renderRightButton={() =>
          !editProfile && (
            <Images.svg.LocationTransparent.default marginRight={'3%'} />
          )
        }
        renderLeftButton={() =>
          editProfile && (
            <Images.svg.location.default
              color={'red'}
              marginLeft={'2%'}
              marginRight={'3%'}
              height={23}
              width={23}
            />
          )
        }
        query={{
          key: GOOGLE_MAP_API_KEY,
          language: 'en',
          // type: 'address',
          type: 'geocode',
          components: 'country:nz',
          // components: 'country:nz|country:pk',
        }}
      />
      {/* </ScrollView>
      </KeyboardAvoidingView> */}
    </View>
  );
};

export default CustomGooglePlaces;
