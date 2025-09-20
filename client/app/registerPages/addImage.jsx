import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";

const STAGE_PROGRESS = 80;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function AddImage() {
  const params = useLocalSearchParams();
  const [newUser, setnewUser] = useState(params);

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions();

  const handleImageChoice = () => {
    Alert.alert(
      "Select Image",
      "Choose image source",
      [
        {
          text: "Camera",
          onPress: takePhoto,
        },
        {
          text: "Gallery",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    if (!status?.granted) await requestPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setnewUser({ ...newUser, image: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    if (!cameraStatus?.granted) await requestCameraPermission();
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setnewUser({ ...newUser, image: result.assets[0].uri });
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]} />
        </View>
        <SafeAreaView style={styles.safeArea}>

          <View style={styles.container}>
            <Text style={styles.title}>Upload Profile Picture</Text>
            <Text style={styles.subtitle}>
              Please upload a clear profile picture. Your profile picture helps us identify you and provide a personalized and secure experience in the app.
            </Text>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={handleImageChoice}
              activeOpacity={0.7}
            >
              {newUser.image ? (
                <Image source={{ uri: newUser.image }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderIcon}>⬆️</Text>
                  <Text style={styles.placeholderText}>Upload Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nextButton, !newUser.image && styles.nextButtonDisabled]}
              onPress={() => router.push({ pathname: "/registerPages/location", params: newUser })}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width,
    height,
    backgroundColor: "#19607E"
  },
  gradientOverlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
  progressContainer: {
    marginTop:40,
    marginHorizontal:40,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF6868",
    borderRadius: 4,
  },
  container: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    color: "#CBF7FF",
    marginBottom: 12,
    fontFamily: "Prompt-SemiBold",
  },
  subtitle: {
    fontSize: 14,
    color: "#CBF7FF",
    marginBottom: 30,
    fontFamily: "Prompt-Thin",
    textAlign: "left",
    lineHeight: 20,
  },
  imageContainer: {
    height: 200,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#CBF7FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 20,
    color: "#FF6868",
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 18,
    color: "#CBF7FF",
    fontFamily: "Prompt-Thin",
  },
  nextButton: {
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
    borderColor: "#CBF7FF",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
