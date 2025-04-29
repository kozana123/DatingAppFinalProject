import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

export default function AutoLocationScreen() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [manualLocation, setManualLocation] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let reverseGC = await Location.reverseGeocodeAsync(location.coords);

        if (reverseGC && reverseGC.length > 0) {
          setLocation(location.coords);
          setCity(reverseGC[0].city);
          setCountry(reverseGC[0].country);
        }
      }

      if (!manualLocation) {
        getCurrentLocation();
      }
    }, [manualLocation])
  );

  return (
    <View style={styles.container}>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      {location ? (
        <>
          <Text>City: {city}</Text>
          <Text>Country: {country}</Text>
        </>
      ) : (
        <Text>Loading location...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
