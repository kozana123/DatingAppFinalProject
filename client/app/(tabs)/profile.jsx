import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  I18nManager,
  ActivityIndicator,
  Image,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Avatar } from "@rneui/themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useFonts } from "expo-font";

I18nManager.forceRTL(true); // Forces RTL layout

export default function ProfileScreen() {
  const [ageRange, setAgeRange] = useState([22, 34]);
  const [distance, setDistance] = useState(50);

  const [fontsLoaded] = useFonts({
    "Prompt-Thin": require("../../assets/fonts/Prompt-Thin.ttf"),
    "Prompt-SemiBold": require("../../assets/fonts/Prompt-SemiBold.ttf"),
    "Prompt-Black": require("../../assets/fonts/Prompt-Black.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#DA58B7" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(106,13,173,0.7)", "rgba(209,71,163,0.7)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
  <FontAwesome name="gear" size={28} color="white" />

  <Text style={[styles.title, { fontFamily: "Prompt-SemiBold" }]}>Profile</Text>

  <View style={styles.logoContainer}>
    <Image
      source={require("../../assets/images/AppLogo.png")}
      style={styles.logoImage}
      resizeMode="contain"
    />
    <Text style={[styles.logo, { fontFamily: "Prompt-SemiBold" }]}>Luvio</Text>
  </View>
</View>

            <View style={styles.avatarContainer}>
              <Avatar
                size={100}
                rounded
                source={{
                  uri: "https://randomuser.me/api/portraits/women/57.jpg",
                }}
                containerStyle={{ backgroundColor: "#ccc" }}
              >
                <Avatar.Accessory
                  size={26}
                  style={{ backgroundColor: "#DA5837" }}
                  onPress={() => router.navigate("/connectedPages/editProfile")}
                />
              </Avatar>
              <Text style={[styles.name, { fontFamily: "Prompt-Thin" }]}>John, 26</Text>
            </View>

            <Text style={[styles.sectionTitle, { fontFamily: "Prompt-Thin" }]}>Account Settings</Text>
            <View style={[styles.inputBox, { fontFamily: "Prompt-Thin" }]}>
              <TextInput style={[styles.input, { fontFamily: "Prompt-Thin" }]} value="John" placeholder="Name" />
              <TextInput
                style={[styles.input, { fontFamily: "Prompt-Thin" }]}
                value="+91 9876543210"
                placeholder="Phone Number"
              />
              <TextInput
                style={[styles.input, { fontFamily: "Prompt-Thin" }]}
                value="02-05-1999"
                placeholder="Birthdate"
              />
              <TextInput
                style={[styles.input, { fontFamily: "Prompt-Thin" }]}
                value="abcqwertyu@gmail.com"
                placeholder="Email"
              />
            </View>

            <Text style={[styles.sectionTitle, { fontFamily: "Prompt-Thin" }]}>Discovery Settings</Text>
            <View style={[styles.inputBox, { fontFamily: "Prompt-Thin" }]}>
              <TouchableOpacity style={styles.option}>
                <Text style={[styles.optionText, { fontFamily: "Prompt-Thin" }]}>My Current Location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Text style={[styles.optionText, { fontFamily: "Prompt-Thin" }]}>Language: English</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option}>
                <Text style={[styles.optionText, { fontFamily: "Prompt-Thin" }]}>Looking for: Women</Text>
              </TouchableOpacity>

              <Text style={[styles.sliderLabel, { fontFamily: "Prompt-Thin" }]}>
                Age Range: {ageRange[0]} - {ageRange[1]}
              </Text>
              <MultiSlider
                values={[ageRange[0], ageRange[1]]}
                min={18}
                max={70}
                step={1}
                onValuesChange={(values) => setAgeRange(values)}
                selectedStyle={{ backgroundColor: "#DA58B7" }}
                markerStyle={{ backgroundColor: "#DA58B7" }}
                containerStyle={{ marginHorizontal: 10 }}
              />

              <Text style={[styles.sliderLabel, { fontFamily: "Prompt-Thin" }]}>
                Maximum Distance: {distance} km
              </Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={200}
                step={1}
                value={distance}
                onValueChange={(val) => setDistance(val)}
                minimumTrackTintColor="#DA58B7"
                maximumTrackTintColor="#999"
                thumbTintColor="#DA58B7"
              />
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                alert("Your account has been deleted.");
              }}
            >
              <Text style={[styles.deleteText, { fontFamily: "Prompt-Black" }]}> Delete Account 🗑️</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    padding: 16,
  },
  container: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "white",
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#DA58B7",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  name: {
    fontSize: 20,
    color: "white",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "right",
  },
  inputBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: "left",
    direction: "ltr",
  },
  option: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  optionText: {
    textAlign: "right",
    color: "#333",
  },
  sliderLabel: {
    fontSize: 16,
    color: "#fff",
    marginTop: 12,
    marginBottom: 4,
    textAlign: "right",
  },
  deleteBtn: {
    backgroundColor: "#ffffff",
    height: 50,
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
  deleteText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    letterSpacing: 1,
  },

  logoImage: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
    
});
