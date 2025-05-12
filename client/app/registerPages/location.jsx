import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { SimpleLineIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LocationScreen() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);


  const handleUseLocation = async () => {
    setLoading(true);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'You need to allow location access to autofill.');
      setLoading(false);
      return;
    }

    try {
      let loc = await Location.getCurrentPositionAsync({});
      let reverseGC = await Location.reverseGeocodeAsync(loc.coords);

      if (reverseGC && reverseGC.length > 0) {
        setCity(reverseGC[0].city || '');
        setCountry(reverseGC[0].country || '');
      } else {
        Alert.alert('Error', 'Could not determine location details.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch location.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!city || !country) {
      Alert.alert('Missing info', 'Please fill in both city and country.');
      return;
    }

    // ניתוב לעמוד הבא
    router.navigate("/registerPages/registerSex");
  };

  return (
    <LinearGradient
      colors={["#F7F3F2", "#8A2C2A"]}
      style={styles.container}
    >
      <Text style={styles.title}>Where do you live?</Text>

      <SimpleLineIcons name="location-pin" size={90} color="black" style={styles.icon} />

      <TextInput
        placeholder="Enter your city"
        value={city}
        onChangeText={setCity}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Enter your country"
        value={country}
        onChangeText={setCountry}
        style={styles.input}
        placeholderTextColor="#888"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginVertical: 20 }} />
      ) : (
        <TouchableOpacity style={styles.locationButton} onPress={handleUseLocation}>
          <Text style={styles.locationButtonText}>📍 Find my location</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  locationButton: {
    backgroundColor: "#f0dada",
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 30,
    alignItems: "center",
  },
  locationButtonText: {
    fontSize: 18,
    color: "#333",
  },
  nextButton: {
    backgroundColor: "#BD513E",
    paddingVertical: 17,
    borderRadius: 20,
    elevation: 40,
  },
  nextButtonText: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 40,
  },
});
