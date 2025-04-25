import { Text, View, Button, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { router } from 'expo-router';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

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
    if (!status?.granted) requestPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!cameraStatus?.granted) requestCameraPermission();
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
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Profile Picture</Text>
      <View style={styles.separator}></View>

      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={styles.placeholderText}>No image selected</Text>
        )}
      </View>

      {!image ? (
        <TouchableOpacity style={styles.uploadButton} onPress={handleImageChoice}>
          <Text style={styles.uploadButtonText}>Choose Photo</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={handleImageChoice}>
          <Text style={styles.uploadButtonText}>Change Photo</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.nextButton, !image && styles.nextButtonDisabled]}
        onPress={() => router.navigate("/registerPages/location")}
        disabled={!image}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // מרכז את כל התוכן
    alignItems: 'center',
    backgroundColor: '#F7F3F2',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40, // מרווח בין הכותרת לריבוע
    color: '#333',
    textAlign: 'center',
    width: '100%',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#8A2C2A',
    marginVertical: 20,
  },
  imageContainer: {
    width: 350,
    height: 350,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8A2C2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF',
    overflow: 'hidden', // מגביל את התמונה לא להיחרג מהקווים
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#8A2C2A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 20,
  },
  uploadButtonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#BD513E',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 120,
  },
  nextButtonDisabled: {
    backgroundColor: '#8A2C2A',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
