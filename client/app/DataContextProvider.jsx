import { useState } from "react";
import { createContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert,
  FlatList
} from "react-native";
import * as ImagePicker from "expo-image-picker";



// import uuid from 'react-native-uuid';

export const DataContext = createContext();

export default function DataContextProvider(props) {

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions();

  const [user, setUser] = useState();
  const [userPref, setUserPref] = useState();

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
      setUser({...user, profileImage: result.assets[0].uri})
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
      setUser({...user, profileImage: result.assets[0].uri})
    }
  };

  return (
    <DataContext.Provider value={{ setUser, setUserPref, handleImageChoice, user, userPref}}>
      {props.children}
    </DataContext.Provider>
  )
}