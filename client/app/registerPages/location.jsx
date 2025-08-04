import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Dimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";



const STAGE_PROGRESS = 100;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function LocationScreen() {

   const params = useLocalSearchParams();
    const [newUser, setnewUser] = useState(params);
    console.log(`Image page`, newUser);

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

      let address = await Location.reverseGeocodeAsync({latitude, longitude,});

      if (address.length > 0) {
        const place = address[0];    
        const formattedAddress = `${place.city || ""}`;

        setnewUser({...newUser, latitude: latitude, longitude: longitude, city: formattedAddress})
        setCurrentLocation(formattedAddress);
        alert(`Found your location at: ${formattedAddress}`)
      }
    }
    catch (error) {
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
        setnewUser({...newUser, latitude: latitude, longitude: longitude, city: formattedAddress})
        setCurrentLocation(formattedAddress);
        alert(`Found your location at:${formattedAddress}`)
      }
    } catch (error) {
      alert("Error searching for location: " + error.message);
    }
  };

  const handleContinue = () => {
    
    router.push({pathname:"registerPages/registerProfileIntro", params: newUser});
    // alert("Continue pressed");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(106,13,173,0.7)", "rgba(209,71,163,0.7)"]}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]}/>
          </View>
          <View style={styles.card}>
         
            {/* כותרת */}
            <Text style={styles.title}>Location</Text>
            <Text style={styles.subtitle}>
              Let the app locate you to provide best searched results around you
            </Text>

            <Text style={styles.label}>Current Location</Text>
            <View style={styles.currentLocationContainer}>
              <Text style={styles.currentLocationText} numberOfLines={1}>
                {currentLocation}
              </Text>
              <TouchableOpacity
                style={styles.locationIcon}
                onPress={handleUseCurrentLocation}
              >
                <MaterialIcons name="my-location" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search New Location"
                placeholderTextColor="#ffffff"
                style={styles.searchInput}
                value={searchLocation}
                onChangeText={setSearchLocation}
              />
              <TouchableOpacity onPress={handleSearchLocation}>
                <MaterialIcons
                  name="search"
                  size={22}
                  color="#cc66cc"
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>

            
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    // paddingTop: Platform.OS === "ios" ? 60 : 30,
    // paddingHorizontal: 25,
    justifyContent: "center",     // מרכז אנכי
    // alignItems: "center", 
  },
  progressContainer: {
    height: 8,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 30,
    // flexDirection: "row-reverse",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
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
    color: "#ffe6ff",
    textAlign: "center",
    marginBottom: 12,

    direction: "ltr",
    fontFamily: "Prompt-Thin",
  },
  subtitle: {
    color: "#f0d9f5",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Prompt-Thin",
    marginBottom: 40,
    lineHeight: 22,
  },
  label: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "left",
    direction: "ltr",
    fontFamily: "Prompt-Thin",
  },
  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ffffff",
    fontFamily: "Prompt-Thin",
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 20,
  },
  currentLocationText: {
    flex: 1,
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Prompt-Thin",
  },
  locationIcon: {
    color: "#ffffff",
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 40,
    fontFamily: "Prompt-Thin",
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#fffffff",
    fontFamily: "Prompt-Thin",
  },
  searchIcon: {
    marginLeft: 12,
    color: "#ffffff",
  },
  continueButton: {
    backgroundColor: "#ffffff",
    height: 50,
    // width: "300",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#cc6699",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    borderColor: "#cc6699",
  },
  // gradient: {
  //   paddingVertical: 16,
  //   borderRadius: 30,
  //   alignItems: "center",
  // },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
