import { Text, View, Button, StyleSheet, Image, Alert } from "react-native";
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
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
        // No permissions request is necessary for launching the image library
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Dating Preference</Text>
      <Button title="Upload Photo" onPress={handleImageChoice} />
      <Image source={{ uri: image }} style={styles.image} />

      <Button title="Next" onPress={() => router.navigate("/registerPages/location")}/>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
    },
  });