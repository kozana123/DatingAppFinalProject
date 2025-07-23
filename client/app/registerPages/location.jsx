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

export default function LocationScreen() {
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

      
      let address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const place = address[0];
        const formattedAddress = `${place.name || ""} ${place.street || ""}, ${place.city || ""}, ${place.region || ""}, ${place.country || ""}`;
        setCurrentLocation(formattedAddress);
      } else {
        setCurrentLocation(`Lat: ${latitude.toFixed(3)}, Lon: ${longitude.toFixed(3)}`);
      }
    } catch (error) {
      alert("Error getting location: " + error.message);
    }
  };

  const handleContinue = () => {
    alert("Continue pressed");
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
              <MaterialIcons
                name="search"
                size={22}
                color="#cc66cc"
                style={styles.searchIcon}
              />
            </View>

            {/* כפתור המשך */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
     
            
                <Text style={styles.continueButtonText}>Continue</Text>
       
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
    paddingTop: Platform.OS === "ios" ? 60 : 30,
    paddingHorizontal: 25,
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 20,
    paddingVertical: 90,
    paddingHorizontal: 18,
    marginHorizontal: 8,
    marginBottom: 20,
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
    backgroundColor: "#fff",
    paddingVertical: 4,
    borderRadius: 30,
    paddingHorizontal: 16,

   
  },
  // gradient: {
  //   paddingVertical: 16,
  //   borderRadius: 30,
  //   alignItems: "center",
  // },
  continueButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6a0dad",
    fontFamily: "Prompt-SemiBold",
    textAlign: "center",
  },
});
