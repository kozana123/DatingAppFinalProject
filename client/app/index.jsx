import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "Prompt-Thin": require("../assets/fonts/Prompt-Thin.ttf"),
    "Prompt-SemiBold": require("../assets/fonts/Prompt-SemiBold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("../assets/images/design.png")}
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
          <View style={styles.container}>
            <View style={styles.logoCircle}>
              <View style={styles.headLeft} />
              <View style={styles.headRight} />
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.appName}>Luvio</Text>

            <Text style={styles.headline}>
              Connect People{"\n"}
              Easily & Quickly
            </Text>

            <Text style={styles.description}>
              Join us to discover your ideal partner and ignite the sparks of
              romance in your journey.
            </Text>

            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>

              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Text style={styles.footerText}>Don’t have an account?</Text>

                <TouchableOpacity
                  onPress={() => router.push("registerPages/regesiterUserName")}
                  activeOpacity={0.7}
                  style={{ marginTop: 5 }}
                >
                  <Text style={styles.footerLink}>sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-around",
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#9b59b6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowOpacity: 0.6,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    position: "relative",
  },
  headLeft: {
    width: 30,
    height: 30,
    backgroundColor: "#ffffff",
    borderRadius: 100,
    position: "absolute",
    top: 27,
    left: 30,
  },
  headRight: {
    width: 25,
    height: 25,
    backgroundColor: "#ff69b4",
    borderRadius: 100,
    position: "absolute",
    top: 32,
    right: 38,
  },
  logoImage: {
    width: "180%",
    height: "180%",
  },
  appName: {
    fontSize: 30,
    color: "#ffe6ff",
    fontFamily: "Prompt-Thin",
    marginBottom: 1,
    marginTop: 0,
  },
  headline: {
    fontSize: 30,
    color: "#f8d7ff",
    fontFamily: "Prompt-SemiBold",
    lineHeight: 38,
    marginBottom: 15,
    textAlign: "left", // מיישר את הטקסט לשמאל
    direction: "ltr", // מיישר את כל ה־Text לשמאל במסך
  },
  description: {
    fontSize: 14,
    color: "#ffd1ff",
    fontFamily: "Prompt-Thin",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "#ffffff",
    height: 50,
    width: "250",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#cc6699",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 2,
    borderColor: "#cc6699",
  },

  signInText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6a0dad",
    fontFamily: "Prompt-SemiBold",
    letterSpacing: 1,
  },

  footerContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  signUpContainer: {
    flexDirection: "row", // שורה אחת לטקסט וכפתור
    alignItems: "center",
    marginTop: 8,
  },

  footerText: {
    fontSize: 16,
    color: "#ffe6ff",
    fontFamily: "Prompt-Thin",
  },

  footerLink: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Prompt-Thin",
    textDecorationLine: "underline",
    marginLeft: 4,
  },
});
