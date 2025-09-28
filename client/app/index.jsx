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
  BackHandler
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "Prompt-Thin": require("../assets/fonts/Prompt-Thin.ttf"),
    "Prompt-SemiBold": require("../assets/fonts/Prompt-SemiBold.ttf"),
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Block back button completely
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  if (!fontsLoaded) return null;

  return (
    <View style={styles.backgroundImage}>
        <View style={styles.container}>
          <Image
            source={require("../assets/images/AppLogo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Luvio</Text>
          
          <Text style={styles.headline}>
            Find Love {"\n"}
            With Style
          </Text>

          <Text style={styles.description}>
            Discover meaningful connections, share your journey, and let love
            happen naturally.
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
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
 backgroundImage: {
    flex: 1,
    backgroundColor: "#19607E"
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "space-around",
  },
  logoImage: {
    width: 160,
    height: 160,
  },
  appName: {
    fontSize: 42,
    color: "#CBF7FF", // highlight (10%)
    fontFamily: "Prompt-SemiBold",
    letterSpacing: 2,
  },
  headline: {
    fontSize: 28,
    color: "#CBF7FF", // highlight (10%)
    fontFamily: "Prompt-SemiBold",
    lineHeight: 36,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#FFFFFF", // neutral readable text
    fontFamily: "Prompt-Thin",
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  signInButton: {
    backgroundColor: "#FF6868", // accent CTA (30%)
    height: 52,
    width: 280,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 3,
  },
  signInText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Prompt-SemiBold",
    letterSpacing: 1,
  },
  footerContainer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    color: "#CBF7FF", // highlight (10%)
    fontFamily: "Prompt-Thin",
  },
  footerLink: {
    fontSize: 16,
    color: "#FF6868", // accent (30%)
    fontFamily: "Prompt-SemiBold",
    textDecorationLine: "underline",
  },
});