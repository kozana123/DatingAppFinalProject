import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

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
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Nice to see you again, we missed you
          </Text>

          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="user"
                size={20}
                color="#dda0dd"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#e1bee7"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                textAlign="left"
              />
            </View>
          </View>

          <View style={styles.inputLabelContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="key"
                size={20}
                color="#dda0dd"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#e1bee7"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textAlign="left"
              />
              <FontAwesome
                name="eye-slash"
                size={20}
                color="#dda0dd"
                style={styles.inputIconRight}
              />
            </View>
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signInButton}
            activeOpacity={0.85}
            onPress={() => router.navigate("/(tabs)/main")}
          >
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={24} color="#ea4335" />
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
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    alignSelf: "center",
    marginTop: Platform.OS === "ios" ? 60 : 30,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffe6ff",
    marginBottom: 6,
    fontFamily: "Prompt-SemiBold",
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#f8d7ff",
    marginBottom: 28,
    fontFamily: "Prompt-Thin",
    textAlign: "left",
    direction: "ltr",
  },
  inputLabelContainer: {
    width: "100%",
    marginBottom: 18,
    direction: "ltr",
    alignItems: "flex-start", // אם את רוצה את Forgot Password בצד שמאל
  },
  inputLabel: {
    color: "#f8d7ff",
    fontSize: 15,
    marginBottom: 6,
    fontFamily: "Prompt-SemiBold",
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cc66cc",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    color: "#ffe6ff",
    fontSize: 17,
    fontFamily: "Prompt-Thin",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputIconRight: {
    marginLeft: 8,
  },
  forgotPassword: {
    marginTop: 4,
    alignSelf: "flex-end",
    marginRight: 4,
  },
  forgotPasswordText: {
    color: "#f8d7ff",
    fontSize: 13,
    fontFamily: "Prompt-Thin",
    direction: "ltr",
  },
  signInButton: {
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
  signInText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
    alignSelf: "center",
  },
  divider: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#cc66cc",
    opacity: 0.5,
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#f8d7ff",
    fontSize: 15,
    fontFamily: "Prompt-Thin",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  socialButton: {
    backgroundColor: "rgba(255, 255, 255, 0.89)",
    borderRadius: 36,
    padding: 10,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#cc66cc",
    alignItems: "center",
    justifyContent: "center",
  },
});

