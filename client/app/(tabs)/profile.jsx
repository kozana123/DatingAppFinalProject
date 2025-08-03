import React, { useState, useContext } from "react";
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
  FlatList,
  Switch 
} from "react-native";

import Slider from "@react-native-community/slider";
import { Avatar } from "@rneui/themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {DataContext} from "../DataContextProvider" 
import { ButtonGroup } from "@rneui/themed";
import RNPickerSelect from 'react-native-picker-select';
import { I18nManager } from "react-native";

if (I18nManager.isRTL) {
  I18nManager.forceRTL(false);
  // This requires a full app reload
}


export default function ProfileScreen() {
  const { user, userPref, setUserPref, setUser, handleImageChoice } = useContext(DataContext);
  const genders = ["Other", "Female", "Male"];

  const religions = [
  { label: "Atheist", value: "Atheist" },
  { label: "Spiritual", value: "Spiritual" },
  { label: "Jewish", value: "Jewish" },
  { label: "Christian", value: "Christian" },
  { label: "Muslim", value: "Muslim" },
  { label: "Hindu", value: "Hindu" },
  { label: "Buddhist", value: "Buddhist" },
  { label: "Other", value: "Other" },
];
  const heightOptions = Array.from({ length: 131 }, (_, i) => ({
    label: `${100 + i} cm`,
    value: 100 + i,
  }));

  const [ageRange, setAgeRange] = useState([userPref.minAgePreference, userPref.maxAgePreference]);
  const [distance, setDistance] = useState(userPref.preferredDistanceKm);
 
  const [genderIndex, setGenderIndex] = useState(genders.indexOf(userPref.preferredPartner));
  console.log("user pref:", userPref);
  console.log("user:", user);

  const [fontsLoaded] = useFonts({
    "Prompt-Thin": require("../../assets/fonts/Prompt-Thin.ttf"),
    "Prompt-SemiBold": require("../../assets/fonts/Prompt-SemiBold.ttf"),
    "Prompt-Black": require("../../assets/fonts/Prompt-Black.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#DA58B7" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }

  const getAge = (birthDateString) => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const onGenderPress = (value) => {
    setGenderIndex(value)
  };

  const saveSearchPref = () =>{
    setUserPref({...userPref, minAgePreference: ageRange[0], maxAgePreference: ageRange[1], preferredDistanceKm: distance,  preferredPartner: genders[genderIndex]})
  }

  const saveUser = () =>{
    
  }

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(106,13,173,0.7)", "rgba(209,71,163,0.7)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            {/* <Text style={styles.title}>Profile</Text> */}

            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/AppLogo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logo}>Luvio</Text>
            </View>
          </View>

          <View style={styles.avatarContainer} >
            <Avatar
              size={120}
              rounded
              source={user && user.profileImage ? { uri: user.profileImage} : {uri: "https://randomuser.me/api/portraits/women/57.jpg"}}
              onPress={handleImageChoice}
            >
              <Avatar.Accessory
                size={26}
                style={{ backgroundColor: "#DA58B7" }}
              />
            </Avatar>
            <Text style={[styles.name, { fontFamily: "Prompt-Thin" }]}>{user.userName} {getAge(user.birthDate)}</Text>
          </View>

          <Text style={[styles.sectionTitle, { fontFamily: "Prompt-Thin" }]}>Account Settings</Text>
          <View style={[styles.inputBox, { fontFamily: "Prompt-Thin" }]}>

            <Text style={styles.label}>Location:</Text>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {alert("Your discovery has been updated.");}}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={[styles.deleteText, { fontFamily: "Prompt-Black"}]}>{user.city}</Text>
                <MaterialIcons name="my-location" size={24} color="#6a0dad" />
              </View>
            </TouchableOpacity>

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={[styles.input, {color:"#9c9c9cff" }]}
              value = {user.userEmail}
              editable={false}
            />
            <Text style={styles.label}>Hieght:</Text>
     
            <RNPickerSelect
              onValueChange={(value) => setUserPref({...userPref, heightPreferences: value})}
              items={heightOptions}
              value={userPref.heightPreferences}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: 'Choose height', value: null }}
              style={{
                inputAndroid: styles.input,
                placeholder: { color: '#000000ff' },
              }}
            />

            
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10,}}>
              <Text style={[styles.label, { fontFamily: "Prompt-Thin" }]}>Smoking:</Text>
              <Switch
                value={userPref.isSmoker}
                onValueChange={(value) => setUserPref({...userPref, isSmoker: value})}
                thumbColor={userPref.isSmoker ? "#DA58B7" : "#ccc"}
                trackColor={{ true: "#f2add9", false: "#ccc" }}
                style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.2 }], marginRight:20,}}
              />
            </View>

            <Text style={styles.label}>Religion:</Text>
     
            <RNPickerSelect
              onValueChange={(value) => setUserPref({...userPref, religion: value})}
              items={religions}
              value={userPref.religion}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: 'Choose Religion', value: null }}
              style={{
                inputAndroid: styles.input,
                placeholder: { color: '#000000ff' },
              }}
            />

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={saveUser}
            >
              <Text style={styles.deleteText}> Save</Text>
            </TouchableOpacity>

          </View>

            <Text style={[styles.sectionTitle, { fontFamily: "Prompt-Thin" }]}>Discovery Settings</Text>
            <View style={[styles.inputBox, { fontFamily: "Prompt-Thin" }]}>
          
              <Text style={[styles.label, { fontFamily: "Prompt-Thin" }]}>Gender</Text>
                <ButtonGroup
                  buttons={genders}
                  selectedIndex={genderIndex}
                  onPress={onGenderPress}
                  containerStyle={styles.genderGroup}
                  buttonStyle={styles.genderButton}
                  selectedButtonStyle={styles.selectedGenderButton}
                  selectedTextStyle={styles.selectedText}
                  textStyle={styles.genderText}
                  innerBorderStyle={{ width: 1 }}
                />

              <Text style={styles.label}>
                Age Range: {ageRange[0]} - {ageRange[1]}
              </Text>
              <MultiSlider
                values={ageRange}
                max={70}
                min={18}
                step={1}
                onValuesChange={setAgeRange}
                selectedStyle={{ backgroundColor: "#DA58B7" }}
                markerStyle={{ backgroundColor: "#DA58B7" }}
                containerStyle={{ marginHorizontal: 10 , direction: "ltr"}}
              />

              <Text style={styles.label}>
                Maximum Distance: {distance} km
              </Text>
              
              <Slider
                style={{ width: "100%", height: 40}}
                minimumValue={1}
                maximumValue={200}
                step={1}
                value={distance}
                onValueChange={(val) => setDistance(val)}
                minimumTrackTintColor="#DA58B7"
                maximumTrackTintColor="#999"
                thumbTintColor="#DA58B7"
              />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={saveSearchPref}
              >
                <Text style={styles.deleteText}> Save</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => alert("Your account has been deleted.")}
            >
              <Text style={styles.deleteText}> Delete Account 🗑️</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    padding: 16,
  },
  container: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "white",
    fontFamily: "Prompt-SemiBold"
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#DA58B7",
    // fontFamily: "Prompt-SemiBold"
  },
  avatarContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    color: "white",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 24,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#ffffffff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: "left",
    direction: "ltr",
    fontFamily: "Prompt-Thin",
    fontSize: 14,
  },
  option: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  optionText: {
    textAlign: "right",
    color: "#333",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    fontFamily: "Prompt-Thin"
  },
  deleteBtn: {
    backgroundColor: "#ffffffff",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#cc6699",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    borderColor: "#cc6699",
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    letterSpacing: 1,
    // fontFamily: "Prompt-Black"
  },

  logoImage: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    // flexDirection: "column",
  },
  genderGroup: {
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: "transparent",
    
  },
  genderButton: {
    backgroundColor: "transparent",
    // paddingVertical: 2,
  },
  selectedGenderButton: {
    backgroundColor: "#cc66cc",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Prompt-Thin",
  },
  genderText: {
    color: "#eee",
    fontSize: 14,
    fontFamily: "Prompt-Thin",

  },
    
});
