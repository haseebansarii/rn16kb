import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useLazyGetNextAdvertisementQuery} from '../services/advertisements';
import {Image} from 'react-native';
import {getURLPhoto} from '../utils/helpers';

const Advertisement = () => {
  const [currentAdvertisement, setCurrentAdvertisement] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [triggerGetNextAd] = useLazyGetNextAdvertisementQuery();
  useEffect(() => {
    getNextAdvertisement();
  }, []);

  const getNextAdvertisement = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await triggerGetNextAd().unwrap();
      if (!response?.advertisement) {
        setLoading(false);
        return;
      }
      setCurrentAdvertisement(response.advertisement);
      scheduleNextAdvertisement(new Date(response.nextAdvertisementTime));
    } catch (error) {
      console.error('Failed to get advertisement:', error);
    }
  };

  const scheduleNextAdvertisement = (nextTime: Date) => {
    const delay = nextTime.getTime() - Date.now();
    setTimeout(() => {
      setLoading(false);
      getNextAdvertisement();
    }, Math.max(0, delay));
  };

  const handlePress = async () => {
    const url = currentAdvertisement?.link;
    if (url && (await Linking.canOpenURL(url))) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      {currentAdvertisement && (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          {currentAdvertisement?.image && (
            <Image
              source={{uri: getURLPhoto(currentAdvertisement.image)}}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },
  image: {
    width: screenWidth,
    height: screenWidth / 2.7,
  },
});

export default Advertisement;
