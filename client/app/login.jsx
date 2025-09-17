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


  const SERVER_IP = '10.0.0.5';
  const LOGIN_URL = `http://${SERVER_IP}:3501/api/v1/userDetails/login`;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "719538565443-026nfp0528deipai06um0me1rvncabjd.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }, []);


  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
  
      const userInfo = await GoogleSignin.signIn();
      console.log("Full userInfo:", userInfo);
  
      const user = userInfo.data?.user;
      if (!user || !user.email) {
        throw new Error("No user info returned from Google Sign-In");
      }
  
      const email = user.email;
      const password = "goolePass"; 
  
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), 
      });
  
      if (response.status === 201) {
        const existingUser = await response.json();
        console.log("User found:", existingUser);
        setUser(existingUser);
        await getPreferences(existingUser.user_id);
        router.push("/(tabs)/main");
      } else if (response.status === 404) {
        Alert.alert(
          "User Not Found",
          "This email is not registered in our system."
        );
        router.push("/");
      } else {
        console.warn("Unexpected error checking Google user:", await response.text());
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };
  
  const login = async () => {
    const hashedPassword = SHA256(password).toString();
    console.log(userEmail, hashedPassword);
    
    try {
      const response = await fetch(LOGIN_URL, {
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
        await getPreferences(user.user_id);
        console.log('Logged in:', user);
        router.navigate('/(tabs)/main');
      } else {
        console.warn('Login failed:', await response.text());
      }
    } catch (error) {
      console.error('Login request error:', error);
    }
  };

  const getPreferences = async (id) => {
    const response = await fetch(
       `http://${SERVER_IP}:3501/api/v1/userPreferences/getUserById/${id}`
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
    
    <View style={styles.gradientOverlay}>
      <ImageBackground
        source={require("../assets/images/design.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
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
                placeholderTextColor="#CBF7FF"
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
                placeholderTextColor="#CBF7FF"
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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: "#19607E", // dominant background (60%)
  },
  container: {
    width: "100%",
    marginTop: Platform.OS === "ios" ? 60 : 30,
    backgroundColor: "rgba(0,0,0,0.2)",
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
    color: "#CBF7FF", // highlight (10%)
    marginBottom: 6,
    fontFamily: "Prompt-SemiBold",
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 28,
    fontFamily: "Prompt-Thin",
    textAlign: "center",
  },
  inputLabelContainer: {
    width: "100%",
    marginBottom: 18,
  },
  inputLabel: {
    color: "#CBF7FF",
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
    borderColor: "#CBF7FF", // highlight border
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "Prompt-Thin",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  inputIcon: {
    marginRight: 8,
    color: "#CBF7FF",
  },
  inputIconRight: {
    marginLeft: 8,
    color: "#CBF7FF",
  },
  forgotPassword: {
    marginTop: 4,
    alignSelf: "flex-end",
    marginRight: 4,
  },
  forgotPasswordText: {
    color: "#CBF7FF",
    fontSize: 13,
    fontFamily: "Prompt-Thin",
  },
  signInButton: {
    backgroundColor: "#FF6868", // accent (30%)
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Prompt-SemiBold",
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    width: "100%",
    alignSelf: "center",
  },
  divider: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#CBF7FF",
    opacity: 0.5,
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#CBF7FF",
    fontSize: 14,
    fontFamily: "Prompt-Thin",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  socialButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  borderColor: "#19607E", // tie into theme
  },
});
