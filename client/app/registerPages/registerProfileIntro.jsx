import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { registerUser } from "../../api";

export default function ProfileIntro() {
  const params = useLocalSearchParams();
  const [newUser, setnewUser] = useState(params);
  const [loading, setLoading] = useState(false);

  const saveUser = async () =>{
    setLoading(true)
    setLoading(await registerUser(newUser))
  }

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
          <View style={styles.card}>
            <View style={styles.logoContainer}>
              <View style={styles.headLeft} />
              <Image
                source={require("../../assets/images/AppLogo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View style={styles.headRight} />
            </View>

            <Text style={styles.header}>
              Complete your profile{"\n"}
              <Text style={{ color: "#CBF7FF" }}>to get better matches</Text>
              {"\n"}
              and unlock more features!
            </Text>

            <Text style={styles.subheader}>
              Create a profile that will increase your chances of finding your
              dream partner.
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => saveUser()}
            >
              <Text style={styles.continueButtonText}>Let's Do It</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#19607E"
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    width: "100%",
    maxWidth: 400,
  },
  logoContainer: {
    width: 130,
    height: 130,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logoImage: {
    width: "120%",
    height: "120%",
    marginTop: 30,
  },
  header: {
    fontSize: 24,
    color: "#CBF7FF",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
    lineHeight: 34,
    paddingHorizontal: 16,
  },
  subheader: {
    fontSize: 16,
    color: "#CBF7FF",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
    fontFamily: "Prompt-Thin",
  },
  continueButton: {
    backgroundColor: "#FF6868",
    height: 50,
    width: "80%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderColor: "#CBF7FF",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
