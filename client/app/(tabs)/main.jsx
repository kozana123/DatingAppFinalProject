import { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");
import {DataContext} from "../DataContextProvider" 

export default function VideoCallStartScreen() {
  const navigation = useNavigation();
  const { user, userPref } = useContext(DataContext);
  console.log("user pref:", userPref);
  console.log("user:", user);

  

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(106,13,173,0.6)", "rgba(209,71,163,0.6)"]}
        style={styles.overlay}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate("profile")}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3524/3524659.png",
            }}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* תמונת פרופיל */}
        <Image
          source={user && user.profileImage ? { uri: user.profileImage} :{uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}}
          style={styles.avatar}
        />

        {/* כרטיס */}
        <View style={styles.card}>
          <Text style={styles.title}>Ready to Connect</Text>
          <Text style={styles.subtitle}>Tap to start your video chat</Text>

          {/* כפתור עגול עם אייקון מצלמה */}
          <TouchableOpacity style={styles.roundButton} onPress={() => router.navigate("/videoCall")}
            >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/727/727245.png",
              }}
              style={styles.cameraIcon}
              
            />
            
          </TouchableOpacity>

          <Text style={styles.startText}>Start</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  settingsBtn: {
    position: "absolute",
    top: 40,
    left: 20, // כאן הכפתור משמאל
    zIndex: 10,
  },
  icon: {
    width: 26,
    height: 26,
    tintColor: "#fff",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 26,
    color: "#ffe6ff",
    fontWeight: "bold",
    fontFamily: "Prompt-SemiBold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#f8d7ff",
    fontFamily: "Prompt-Thin",
    marginBottom: 30,
    textAlign: "center",
  },
  roundButton: {
    backgroundColor: "#fff",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#cc6699",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
  },
  cameraIcon: {
    width: 32,
    height: 32,
    tintColor: "#a02dab",
  },
  startText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
    fontFamily: "Prompt-Regular",
  },
});
