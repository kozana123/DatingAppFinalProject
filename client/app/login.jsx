import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Platform,
  Button,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import SHA256 from "crypto-js/sha256";
import { DataContext } from "./DataContextProvider";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser, setUserPref } = useContext(DataContext);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "719538565443-ctovkc0i4kmt19n7l4pm7mqvhnshcnnr.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }, []);

  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();

    const userInfo = await GoogleSignin.signIn();
    console.log("Full userInfo:", userInfo);

    const user = userInfo.data.user;

    if (!user || !user.email) {
      throw new Error("No user info returned from Google Sign-In");
    }

    const email = user.email;
    const password = "goolePass";
    // const hashedPassword = SHA256(password).toString();

    const checkResponse = await fetch(
      `http://www.DatingServer.somee.com/api/users/login?email=${email}&password=${password}`
    );
    if (checkResponse.status === 200) {
      const existingUser = await checkResponse.json();
      console.log("Image page", existingUser);

      setUser(existingUser);
      getPreferences(existingUser.userId);
      router.push("/(tabs)/main");
    } else if (checkResponse.status === 404) {
      Alert.alert(
        "User Not Found",
        "This email is not registered in our system."
      );
      router.push("/");
    } else {
      const errorText = await checkResponse.text();
      console.warn("Unexpected error checking Google user:", errorText);
    }
  };

  const login = async () => {
    const hashedPassword = SHA256(password).toString();
    console.log(hashedPassword);

    try {
      const response = await fetch('http://10.0.0.20:3501/api/v1/userDetails/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password: hashedPassword,
        }),
      });

      if (response.status === 201) {
        const user = await response.json();
        setUser(user);
        getPreferences(user.user_id);
        console.log('Logged in:', user);
        router.navigate('/(tabs)/main');
      } else {
        console.warn('Login failed:', await response.text());
      }
    } catch (error) {
      console.error('Login request error:', error);
    }
  };

    // const login = async () => {
    //   const hashedPassword = SHA256(password).toString();
    //   const response = await fetch(
    //     `http://10.0.0.20:3501/userDetails/login?email=${userEmail}&password=${hashedPassword}`
    //   );

    //   if (response.status == 200) {
    //     const user = await response.json();
    //     setUser(user);
    //     getPreferences(user.userId);
    //     console.log("Logged in:", user);
    //     router.navigate("/(tabs)/main");
    //   } else {
    //     console.warn("Login failed:", await response.text());
    //   }
    // };

  const getPreferences = async (id) => {
    const response = await fetch(
      `http://10.0.0.20:3501/api/v1/userPreferences/getUserById/${id}`
    );

    if (response.status == 201) {
      const userPref = await response.json();
      setUserPref(userPref);
      console.log("got pref:", userPref);
    } else {
      console.warn("failed geting pref:", await response.text());
    }
  };

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
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="user"
                size={20}
                color="#dda0dd"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#e1bee7"
                value={userEmail}
                onChangeText={setUserEmail}
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
                autoCapitalize="none"
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
            onPress={login}
          >
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={signInWithGoogle}
            >
              <FontAwesome name="google" size={24} color="#ea4335" />
              <Text
                style={{ marginLeft: 10, color: "#000", fontWeight: "bold" }}
              >
                Sign in with Google
              </Text>
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
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
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
