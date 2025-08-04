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
  Alert,
} from "react-native";
import { Input, Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const STAGE_PROGRESS = 20;

export default function RegisterUserName() {

  const router = useRouter();
  const [newUser, setnewUser] = useState({name: ""});
  console.log(`name page`, newUser.name);
  
  const handleNext = () => {
    if(newUser.name != ""){
      router.push({pathname:"/registerPages/personalDetails", params: newUser})
    }
    else{
      alert("Please fill your name")
    }
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
        <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]} />
        </View>
        <SafeAreaView style={styles.safeArea}>
          

          <View style={styles.container}>
            <Text style={styles.title}>Let's Get Started!</Text>
            <Text style={styles.subtitle}>What's Your Name?</Text>

            <Input
              placeholder="Enter your name"
              placeholderTextColor="#e1bee7"
              value={newUser.name}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              onChangeText={(text) => setnewUser({ ...newUser, name: text })}
              autoCapitalize="words"
              keyboardAppearance="dark"
            />

            <Button
              title="Next"
              buttonStyle={styles.buttonStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={handleNext}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get('window');
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
    // paddingTop: Platform.OS === "ios" ? 60 : 30,
  },
  progressContainer: {
    position: "absolute",
    height: 8,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    alignSelf: "center",
    marginTop: 210,
   
    // flexDirection: "row-reverse", // ← זה השינוי החשוב
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    // direction: "rtl",
  },
  container: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffe6ff",
    marginBottom: 6,
    fontFamily: "Prompt-SemiBold",
    direction: "ltr",
  },
  subtitle: {
    fontSize: 15,
    color: "#f8d7ff",
    marginBottom: 28,
    fontFamily: "Prompt-Thin",
    textAlign: "left",
    direction: "ltr",
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
    height: 50,
    // height: height * 0.2,
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
  buttonTitleStyle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
