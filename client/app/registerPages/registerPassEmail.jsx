import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import SHA256 from "crypto-js/sha256";
import { checkEmailExists } from "../../api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const STAGE_PROGRESS = 60;

export default function RegisterPage() {
  const params = useLocalSearchParams();
  const [newUser, setnewUser] = useState(params);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "719538565443-ctovkc0i4kmt19n7l4pm7mqvhnshcnnr.apps.googleusercontent.com",
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo || !userInfo.user) throw new Error("No user info returned");

      const user = userInfo.user;

      const updatedUser = {
        ...newUser,
        email: user.email,
        password: "googlePass",
      };

      setnewUser(updatedUser);
      router.push({ pathname: "/registerPages/addImage", params: updatedUser });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Google Sign-In Error", error.message);
    }
  };

  const handleNext = async () => {
    if (!newUser.email || !newUser.password || confirmPassword === "") {
      Alert.alert("Missing Field","Please fill all fields.");
      return;
    }

    if (!validateEmail(newUser.email)) {
      Alert.alert("Email Error","Invalid email format.");
      return;
    }

    if (newUser.password.length < 6) {
      Alert.alert("Passwords Error","Password must be at least 6 characters.");
      return;
    }

    if (newUser.password !== confirmPassword) {
      Alert.alert("Passwords Error","Passwords do not match",);
      return;
    }
    setLoading(true)
    try{
      const pass = await checkEmailExists(newUser.email);

      if (pass) {
        const hashedPassword = SHA256(newUser.password).toString();
        const updatedUser = { ...newUser, password: hashedPassword };
        router.push({ pathname: "/registerPages/addImage", params: updatedUser });
      }
    }
    catch (error){
      console.error('Login request error:', error);
    }
    finally {
      setLoading(false);
    }
    
  };

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {loading == true && (
        <View style={{flex:1, position: 'absolute', width:"100%",height:"100%", alignItems: "center", justifyContent: "center", backgroundColor: '#00000056',zIndex:10,}}>
          <ActivityIndicator size="large" color="#FF6868" />
        </View>
      )}  
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text style={styles.title}>Create Your Account</Text>

              <TextInput
                placeholder="Email"
                placeholderTextColor="#CBF7FF"
                style={styles.input}
                onChangeText={(email) =>
                  setnewUser({ ...newUser, email: email })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#CBF7FF"
                style={styles.input}
                onChangeText={(password) =>
                  setnewUser({ ...newUser, password: password })
                }
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
              />

              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#CBF7FF"
                style={styles.input}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                textContentType="password"
              />

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
                  <FontAwesome name="google" size={24} color="#ea4335" />
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width, height: "100%", backgroundColor: "#19607E"},
  safeArea: { flex: 1, justifyContent: "center" },
  progressContainer: {
    marginTop:40,
    marginHorizontal:40,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
  },
  progressBar: { height: "100%", backgroundColor: "#FF6868", borderRadius: 4 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", paddingBottom: 40 },
  card: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#CBF7FF",
    marginBottom: 30,
    fontFamily: "Prompt-SemiBold",
  },
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#CBF7FF",
    color: "#CBF7FF",
    fontSize: 18,
    paddingVertical: 10,
    marginBottom: 30,
    fontFamily: "Prompt-Thin",
  },
  button: {
    backgroundColor: "#FF6868",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffffff",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#CBF7FF",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#CBF7FF",
    fontSize: 14,
  },
  socialContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    marginLeft: 10,
    color: "#000",
    fontWeight: "bold",
  },
});
