import { useState } from "react";
import { createContext } from "react";
import {
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateProfileImage, updateUserLocation } from "../api";
import * as Location from "expo-location";



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
      setUser({...user, profile_image: result.assets[0].uri})
      updateProfileImage(user.user_id, result.assets[0].uri)
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
      setUser({...user, profile_image: result.assets[0].uri})
      updateProfileImage(user.user_id, result.assets[0].uri)
    }
  };

  const handleUseCurrentLocation = async () => {
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let address = await Location.reverseGeocodeAsync({latitude, longitude,});

      if (address.length > 0) {
        const place = address[0];    
        const formattedAddress = `${place.city || ""}`;

        setUser({...user, latitude: latitude, longitude: longitude, city: formattedAddress})
        alert(`Found your location at: ${formattedAddress}`)
        updateUserLocation(user.user_id, formattedAddress, latitude, longitude)
      }
    }
    catch (error) {
      alert("Error getting location: " + error.message);
    }
  };

  const handleSearchLocation = async (cityName) => {
    if (!cityName.trim()) {
      alert("Please enter a city name.");
      return;
    }
    console.log("location search");

    try {
      const results = await Location.geocodeAsync(cityName);
      
      if (results.length === 0) {
        alert(`City "${cityName}" not found.`);
        return;
      }

      const { latitude, longitude } = results[0];
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (address.length > 0) {
        const place = address[0];
        const formattedAddress = `${place.city}`;
        setUser({...user, latitude: latitude, longitude: longitude, city: formattedAddress})
        alert(`Found your location at:${formattedAddress}`)
        updateUserLocation(user.user_id, formattedAddress, latitude, longitude)
      }
    } catch (error) {
      alert("Error searching for location: " + error.message);
    }
  };

  return (
    <DataContext.Provider value={{ setUser, setUserPref, handleImageChoice, handleSearchLocation, handleUseCurrentLocation, user, userPref}}>
      {props.children}
    </DataContext.Provider>
  )
}