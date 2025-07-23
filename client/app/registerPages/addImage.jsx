import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
  Alert,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

const STAGE_PROGRESS = 80;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function AddImage() {
  const [image, setImage] = useState(null);

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
      setImage(result.assets[0].uri);
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
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(106,13,173,0.7)", "rgba(209,71,163,0.7)"]}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]} />
          </View>

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
              {image ? (
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderIcon}>⬆️</Text>
                  <Text style={styles.placeholderText}>Upload Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nextButton, !image && styles.nextButtonDisabled]}
              onPress={() => router.push("/registerPages/location")}
              disabled={!image}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Next</Text>
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
    paddingTop: Platform.OS === "ios" ? 60 : 30,
  },
  progressContainer: {
    height: 8,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 30,
    flexDirection: "row-reverse",
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
    padding: 24,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    color: "#ffe6ff",
    marginBottom: 12,
    fontFamily: "Prompt-SemiBold",
    textAlign: "left",
    direction: "ltr",
  },
  subtitle: {
    fontSize: 14,
    color: "#f0d9f5",
    marginBottom: 30,
    fontFamily: "Prompt-Thin",
    textAlign: "left",
    lineHeight: 20,
    direction: "ltr",

  },
  imageContainer: {
    height: 200,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#cc66cc",
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
    color: "#cc66cc",
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: "Prompt-Thin",
  },
  nextButton: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingVertical: 4,
    alignItems: "center",
    marginTop: 10,
  },

  nextButtonText: {
    color: "#6a0dad",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Prompt-SemiBold",
  },
});
