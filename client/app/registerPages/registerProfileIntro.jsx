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
  alignItems: "center", 
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    paddingVertical: 40,       // יותר מרווח אנכי
    paddingHorizontal: 20,     // כמו בשאר
    width: "100%",             // תופס את כל הרוחב הנתון
    maxWidth: 400,             // כדי שלא יתפרש יותר מדי במסכים רחבים
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
    backgroundColor: "#ffffff",
    height: 50,
    width: "300",
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
