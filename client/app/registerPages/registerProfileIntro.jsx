import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileIntro() {
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
            {/* לוגו עם ראשים */}
            <View style={styles.logoContainer}>
              <View style={styles.headLeft} />
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View style={styles.headRight} />
            </View>

            <Text style={styles.header}>
              Complete your profile{"\n"}
              <Text style={{ color: "#ff99cc" }}>to get better matches</Text>
              {"\n"}
              and unlock more features!
            </Text>

            <Text style={styles.subheader}>
              Create a profile that will increase your chances of finding your
              dream partner.
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push("/registerPages/registerIntrest")}
            >
              <Text style={styles.continueButtonText}>Let's Do It</Text>
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
    justifyContent: "center",
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  progressContainer: {
    height: 8,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginBottom: 30,
    flexDirection: "row-reverse",
    alignSelf: "center",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  logoContainer: {
    width: 130,
    height: 130,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headLeft: {
    width: 30,
    height: 30,
    backgroundColor: "#ffffff",
    borderRadius: 100,
    position: "absolute",
    top: 10,
    left: 12,
    zIndex: 1,
  },
  headRight: {
    width: 25,
    height: 25,
    backgroundColor: "#ff69b4",
    borderRadius: 100,
    position: "absolute",
    top: 14,
    right: 25,
    zIndex: 1,
  },
  logoImage: {
    width: "180%",
    height: "180%",
  },
  header: {
    fontSize: 24,
    color: "#ffe6ff",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
    lineHeight: 34,
    paddingHorizontal: 16,
  },

  subheader: {
    fontSize: 16,
    color: "#f0d9f5",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
    fontFamily: "Prompt-Thin",
  },
  continueButton: {
    backgroundColor: "#fff",
    paddingVertical: 4,
    borderRadius: 30,
    paddingHorizontal: 40,
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6a0dad",
    fontFamily: "Prompt-SemiBold",
    textAlign: "center",
  },
});
