import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";

const STAGE_PROGRESS = 100;

export default function LocationScreen() {
  const params = useLocalSearchParams();
  const [newUser, setnewUser] = useState(params);

  const [currentLocation, setCurrentLocation] = useState(
    "Choose your current location or search for a new one"
  );
  const [searchLocation, setSearchLocation] = useState("");

  const handleUseCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let address = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (address.length > 0) {
        const place = address[0];
        const formattedAddress = `${place.city || ""}`;

        setnewUser({ ...newUser, latitude, longitude, city: formattedAddress });
        setCurrentLocation(formattedAddress);
        alert(`Found your location at: ${formattedAddress}`);
      }
    } catch (error) {
      alert("Error getting location: " + error.message);
    }
  };

  const handleSearchLocation = async () => {
    if (!searchLocation.trim()) {
      alert("Please enter a city name.");
      return;
    }

    try {
      const results = await Location.geocodeAsync(searchLocation);

      if (results.length === 0) {
        alert(`City "${searchLocation}" not found.`);
        return;
      }

      const { latitude, longitude } = results[0];
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (address.length > 0) {
        const place = address[0];
        const formattedAddress = `${place.city}`;
        setnewUser({ ...newUser, latitude, longitude, city: formattedAddress });
        setCurrentLocation(formattedAddress);
        alert(`Found your location at: ${formattedAddress}`);
      }
    } catch (error) {
      alert("Error searching for location: " + error.message);
    }
  };

  const handleContinue = () => {
    router.push({ pathname: "registerPages/registerProfileIntro", params: newUser });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(25,96,126,0.8)", "rgba(25,96,126,0.8)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]} />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Location</Text>
            <Text style={styles.subtitle}>
              Let the app locate you to provide best searched results around you
            </Text>

            <Text style={styles.label}>Current Location</Text>
            <View style={styles.currentLocationContainer}>
              <Text style={styles.currentLocationText} numberOfLines={1}>
                {currentLocation}
              </Text>
              <TouchableOpacity style={styles.locationIcon} onPress={handleUseCurrentLocation}>
                <MaterialIcons name="my-location" size={24} color="#CBF7FF" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search New Location"
                placeholderTextColor="#CBF7FF"
                style={styles.searchInput}
                value={searchLocation}
                onChangeText={setSearchLocation}
              />
              <TouchableOpacity onPress={handleSearchLocation}>
                <MaterialIcons
                  name="search"
                  size={22}
                  color="#FF6868"
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width,
    height,
  },
  gradientOverlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
  progressContainer: {
    height: 8,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 30,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF6868",
    borderRadius: 4,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "700",
    color: "#CBF7FF",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Prompt-Thin",
  },
  subtitle: {
    color: "#CBF7FF",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Prompt-Thin",
    marginBottom: 40,
    lineHeight: 22,
  },
  label: {
    color: "#CBF7FF",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "left",
    fontFamily: "Prompt-Thin",
  },
  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CBF7FF",
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 20,
  },
  currentLocationText: {
    flex: 1,
    color: "#CBF7FF",
    fontSize: 12,
    fontFamily: "Prompt-Thin",
  },
  locationIcon: {
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CBF7FF",
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#CBF7FF",
    fontFamily: "Prompt-Thin",
  },
  searchIcon: {
    marginLeft: 12,
  },
  continueButton: {
    backgroundColor: "#FF6868",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderColor: "#CBF7FF",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
