// /app/registerPages/RegisterUserName.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Platform,
} from "react-native";
import { Input, Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const STAGE_PROGRESS = 20;

export default function RegisterUserName() {
  const [userName, setUserName] = useState({ name: "" });
  const router = useRouter();

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
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]} />
          </View>

          <View style={styles.container}>
            <Text style={styles.title}>Let's Get Started!</Text>
            <Text style={styles.subtitle}>What's Your Name?</Text>

            <Input
              placeholder="Enter your name"
              placeholderTextColor="#e1bee7"
              value={userName.name}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              onChangeText={(text) => setUserName({ ...userName, name: text })}
              autoCapitalize="words"
              keyboardAppearance="dark"
            />

            <Button
              title="Next"
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={() => router.push("/registerPages/personalDetails")}
            />
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
    justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 30,
  },
  progressContainer: {
    height: 8,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 30,
    flexDirection: "row-reverse", // ← זה השינוי החשוב
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    direction: "ltr",
  },
  container: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffe6ff",
    marginBottom: 6,
    fontFamily: "Prompt-SemiBold",
  },
  subtitle: {
    fontSize: 20,
    color: "#f8d7ff",
    marginBottom: 28,
    fontFamily: "Prompt-Thin",
  },
  inputContainerStyle: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#cc66cc",
  },
  inputStyle: {
    fontSize: 18,
    color: "#ffe6ff",
    fontFamily: "Prompt-Thin",
  },
  buttonStyle: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingVertical: 4,
    marginTop: 20,
  },
  buttonTitleStyle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6a0dad",
    fontFamily: "Prompt-SemiBold",
  },
});
