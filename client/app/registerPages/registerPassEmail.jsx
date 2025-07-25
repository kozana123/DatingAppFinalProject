import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useLocalSearchParams } from 'expo-router';


const STAGE_PROGRESS = 60; 


export default function RegisterPage() {

  const params = useLocalSearchParams();
  const [newUser, setnewUser] = useState(params);
  console.log(`Email page`, newUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleNext = () => {
    // if (!newUser.email || !newUser.password || confirmPassword == "") {
    //   alert("Please fill all fields.");
    //   return;
    // }

    // if (!validateEmail(newUser.email)) {
    //   alert("Invalid email format.");
    //   return;
    // }

    // if (newUser.password.length < 6) {
    //   alert("Password must be at least 6 characters.");
    //   return;
    // }

    // if (newUser.password !== confirmPassword) {
    //   alert("Passwords do not match.");
    //   return;
    // }
    router.push({pathname:"/registerPages/addImage", params: newUser})
  };

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
            <Text style={styles.title}>Create Your Account</Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#d8b8e6"
              style={styles.input}
              onChangeText={(email) => setnewUser({ ...newUser, email: email})}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#d8b8e6"
              style={styles.input}
              onChangeText={(password) => setnewUser({ ...newUser, password: password})}
              secureTextEntry
              textContentType="newPassword"
            />

            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#d8b8e6"
              style={styles.input}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="password"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Next</Text>
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
    justifyContent: "center",
    // paddingTop: Platform.OS === "ios" ? 60 : 30,
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
  container: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffe6ff",
    marginBottom: 30,
    fontFamily: "Prompt-SemiBold",
    textAlign: "left",
    direction:"ltr",
  },
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#cc66cc",
    color: "#ffe6ff",
    fontSize: 18,
    paddingVertical: 10,
    marginBottom: 30,
    fontFamily: "Prompt-Thin",
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
