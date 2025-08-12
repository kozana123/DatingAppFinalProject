import React, { useState, useEffect, useContext } from "react";
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
  Modal,
  FlatList,
  Switch,
} from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

import Slider from "@react-native-community/slider";
import { Avatar } from "@rneui/themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { DataContext } from "../DataContextProvider";
import { ButtonGroup } from "@rneui/themed";
import RNPickerSelect from "react-native-picker-select";
import { updateUserSearch, updateUserDetails, deleteUserById } from "../../api";

export default function ProfileScreen() {
  const { user, userPref, setUserPref, setUser, handleImageChoice, handleSearchLocation, handleUseCurrentLocation } = useContext(DataContext);
  const [modalVisibleRelationship, setModalVisibleRelationship] = useState(false);
  const [modalVisibleInterests, setModalVisibleInterests] = useState(false);
  const [modalVisibleLocation, setModalVisibleLocation] = useState(false);

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

  const RelaOptions = [
    {
      key: "love",
      icon: <Ionicons name="heart" size={30} color="#555" />,
      title: "Find love",
      subtitle: "I want to find a relationship.",
    },
    {
      key: "chat",
      icon: <MaterialCommunityIcons name="chat" size={30} color="#555" />,
      title: "Just chatting",
      subtitle: "Let’s start with chatting, then we’ll see.",
    },
    {
      key: "casual",
      icon: <FontAwesome5 name="glass-martini-alt" size={30} color="#555" />,
      title: "Something casual",
      subtitle: "Just want to have some fun...",
    },
  ];


  const interestsData = [
    {
      title: "🧠 Personality",
      traits: [
        { label: "Introvert", icon: "🙈" },
        { label: "Extrovert", icon: "📢" },
        { label: "Optimistic", icon: "😊" },
        { label: "Realistic", icon: "🧠" },
        { label: "Adventurous", icon: "🏞️" },
        { label: "Romantic", icon: "❤️" },
        { label: "Creative", icon: "🎨" },
        { label: "Empathetic", icon: "🤝" },
        { label: "Funny", icon: "😂" },
        { label: "Shy", icon: "😔" },
      ],
    },
    {
      title: "🌿 Lifestyle",
      traits: [
        { label: "Early Riser", icon: "🌅" },
        { label: "Night Owl", icon: "🌙" },
        { label: "Fitness Lover", icon: "💪" },
        { label: "Vegan", icon: "🌱" },
        { label: "Pet Lover", icon: "🐾" },
        { label: "Traveler", icon: "🌍" },
        { label: "Bookworm", icon: "📚" },
      ],
    },
    {
      title: "🎨 Hobbies",
      traits: [
        { label: "Painting", icon: "🎨" },
        { label: "Music", icon: "🎶" },
        { label: "Photography", icon: "📷" },
        { label: "Dancing", icon: "💃" },
        { label: "Cooking", icon: "🍳" },
        { label: "Reading", icon: "📖" },
        { label: "Gaming", icon: "🎮" },
        { label: "Traveling", icon: "✈️" },
        { label: "Yoga", icon: "🧘‍♀️" },
        { label: "Sports", icon: "⚽" },
      ],
    },
  ];

  const selectedInterests = userPref?.interests
    ? userPref.interests.split(",").map((s) => s.trim())
    : [];

  const [tempSelectedInterests, setTempSelectedInterests] =
    useState(selectedInterests);

  const toggleInterest = (interest) => {
    if (tempSelectedInterests.includes(interest)) {
      setTempSelectedInterests(
        tempSelectedInterests.filter((i) => i !== interest)
      );
    } else {
      setTempSelectedInterests([...tempSelectedInterests, interest]);
    }
  };

  const onCloseModal = () => {
    const interestsString = tempSelectedInterests.join(", ");
    setUserPref({ ...userPref, interests: interestsString });
    setModalVisibleInterests(false);
  };
  const heightOptions = Array.from({ length: 131 }, (_, i) => ({
    label: `${100 + i} cm`,
    value: 100 + i,
  }));

  const [ageRange, setAgeRange] = useState([userPref.minAgePreference, userPref.maxAgePreference,]);
  const [distance, setDistance] = useState(userPref.preferredDistanceKm);
  const [location, setLocation] = useState("");
  
  const [genderIndex, setGenderIndex] = useState(
    genders.indexOf(userPref.preferredPartner)
  );

  console.log("user pref:", userPref);
  console.log("user:", user);

  const [fontsLoaded] = useFonts({
    "Prompt-Thin": require("../../assets/fonts/Prompt-Thin.ttf"),
    "Prompt-SemiBold": require("../../assets/fonts/Prompt-SemiBold.ttf"),
    "Prompt-Black": require("../../assets/fonts/Prompt-Black.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <ActivityIndicator
        size="large"
        color="#DA58B7"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
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
    setGenderIndex(value);
    setUserPref({ ...userPref, preferredPartner: genders[value] });
  };

  const onDeletedUser = () => {
    const deleted = deleteUserById(user.userId)
    if(deleted){
      router.navigate("/")
    }
     
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
              <View style = {{alignItems:"center"}}>
                <View style={styles.logoCircle}>
                <Image
                  source={require("../../assets/images/AppLogo.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                </View>
                <Text style={styles.logo}>Luvio</Text>
              </View>
              
            </View>
            
            <View style={styles.avatarContainer}>
              <Avatar
                size={140}
                rounded
                source={ { uri: user.profile_image }}
                onPress={handleImageChoice}
              >
                <Avatar.Accessory
                  size={26}
                  style={{ backgroundColor: "#DA58B7" }}
                />
              </Avatar>
              <Text style={[styles.name, { fontFamily: "Prompt-SemiBold" }]}>
                {user.userName},{" "}
                <Text style={[styles.birthDate, { fontFamily: "Prompt-Thin" }]}>
                  {getAge(user.birth_date)}
                </Text>
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { fontFamily: "Prompt-Thin" }]}>
              Account Settings
            </Text>

            <View style={[styles.inputBox, { fontFamily: "Prompt-Thin" }]}>
              <Text style={styles.label}>Location:</Text>
              <TouchableOpacity style={styles.option} onPress={() => { setModalVisibleLocation(!modalVisibleLocation)}}>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between",}}>
                  <Text style={[styles.deleteText, { fontFamily: "Prompt-Black" }]}>
                    {user.city}
                  </Text>
                  <MaterialIcons name="my-location" size={24} color="#6a0dad" />
                </View>
              </TouchableOpacity>
              <Modal
                visible={modalVisibleLocation}
                transparent={true}
                onRequestClose={() => setModalVisibleLocation(!modalVisibleLocation)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Set Location</Text>
                    <TouchableOpacity style={styles.optionLocation} onPress={handleUseCurrentLocation}>
                      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between",}}>
                        <Text style={[styles.deleteText, { fontFamily: "Prompt-Black" }]}> Find My Location </Text>
                        <MaterialIcons name="my-location" size={24} color="#6a0dad" />
                      </View>
                    </TouchableOpacity>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between",backgroundColor: "#f1f1f1ff", borderRadius: 8,padding: 12, marginBottom: 12,}}>
                        <TextInput
                          value={location}
                          style={{ color: "#6a0dad" , width: "90%"}}
                          placeholder="Search City"
                          placeholderTextColor="#6a0dad7e"
                          onChangeText={setLocation}
                        />
                          <TouchableOpacity onPress={() => {handleSearchLocation(location)}}>
                            <MaterialIcons name="search" size={22} color="#6a0dad" />
                          </TouchableOpacity>
                      </View>
                    
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={() => setModalVisibleLocation(!modalVisibleLocation)}
                    >
                      <Text style={styles.saveBtnText}>Finish</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={[styles.input, { color: "#00000075" }]}
                value={user.userEmail}
                editable={false}
              />
              <Text style={styles.label}>Hieght:</Text>

              <RNPickerSelect
                onValueChange={(value) =>
                  setUserPref({ ...userPref, heightPreferences: String(value) })
                }
                items={heightOptions}
                value={userPref.heightPreferences}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: "Choose height", value: null }}
                style={{
                  inputAndroid: styles.input,
                  placeholder: { color: "#000000ff" },
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginVertical: 10,
                }}
              >
                <Text style={[styles.label, { fontFamily: "Prompt-Thin" }]}>
                  Smoking:
                </Text>
                <Switch
                  value={userPref.isSmoker}
                  onValueChange={(value) =>
                    setUserPref({ ...userPref, isSmoker: value })
                  }
                  thumbColor={userPref.isSmoker ? "#DA58B7" : "#ccc"}
                  trackColor={{ true: "#f2add9", false: "#ccc" }}
                  style={{
                    transform: [{ scaleX: 1.3 }, { scaleY: 1.2 }],
                    marginRight: 20,
                  }}
                />
              </View>

              <Text style={styles.label}>Religion:</Text>

              <RNPickerSelect
                onValueChange={(value) =>
                  setUserPref({ ...userPref, religion: value })
                }
                items={religions}
                value={userPref.religion}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: "Choose Religion", value: null }}
                style={{
                  inputAndroid: styles.input,
                  placeholder: { color: "#000000ff" },
                }}
              />

              <Text style={styles.label}>Relationship Type:</Text>
              <TouchableOpacity
                onPress={() => setModalVisibleRelationship(true)}
                style={styles.selectorContainer}
              >
                {(() => {
                  const selectedItem = RelaOptions.find(
                    (item) => item.key === userPref.relationshipType
                  );
                  return selectedItem ? (
                    <View style={styles.selectedItemContainer}>
                      <View style={{ marginLeft: 8 }}>{selectedItem.icon}</View>
                      <Text style={styles.selectedItemText}>
                        {selectedItem.title}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.placeholderText}>
                      Choose Relationship Type:
                    </Text>
                  );
                })()}
              </TouchableOpacity>

              <Modal
                visible={modalVisibleRelationship}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisibleRelationship(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                      Choose your relationship
                    </Text>
                    <FlatList
                      data={RelaOptions}
                      keyExtractor={(item) => item.key}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.optionItem,
                            item.key === userPref.relationshipType &&
                              styles.optionItemSelected,
                          ]}
                          onPress={() => {
                            setUserPref({
                              ...userPref,
                              relationshipType: item.key,
                            });
                            setModalVisibleRelationship(false);
                          }}
                        >
                          <View style={{ marginRight: 12 }}>{item.icon}</View>
                          <View>
                            <Text style={styles.optionTitle}>{item.title}</Text>
                            <Text style={styles.optionSubtitle}>
                              {item.subtitle}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </Modal>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={styles.label}>Selected Interests:</Text>
                <TouchableOpacity
                  onPress={() => setModalVisibleInterests(true)}
                  style={{ marginTop: 1 }}
                >
                  
                  <FontAwesome name="pencil" size={20} color="#ffffff" marginLeft={10} />
                </TouchableOpacity>
              </View>

              <View style={styles.selectedInterestsContainer}>
                {tempSelectedInterests.length < 5 ? (
                  <Text style={styles.placeholderText}>
                    Need atlist 5
                  </Text>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tempSelectedInterests.map((interest) => (
                      <View key={interest} style={styles.interestBox}>
                        <Text style={styles.interestText}>{interest}</Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
              <Modal
                visible={modalVisibleInterests}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisibleInterests(!modalVisibleInterests)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Choose Interests</Text>

                    <FlatList
                      style={{ maxHeight: 300 }}
                      data={interestsData.flatMap(
                        (category) => category.traits
                      )}
                      keyExtractor={(item) => item.label}
                      renderItem={({ item }) => {
                        const selected = tempSelectedInterests.includes(
                          item.label
                        );
                        return (
                          <TouchableOpacity
                            style={[
                              styles.traitButton,
                              selected && styles.traitButtonSelected,
                            ]}
                            onPress={() => toggleInterest(item.label)}
                          >
                            <Text style={styles.traitText}>
                              {item.icon} {item.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />

                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={onCloseModal}
                    >
                      <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => updateUserDetails(userPref, user.userId)}
              >
                <Text style={styles.deleteText}> Save</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.sectionTitle, { fontFamily: "Prompt-Thin" }]}>
              Discovery Settings
            </Text>
            <View style={[styles.inputBox, { fontFamily: "Prompt-Thin" }]}>
              <Text style={[styles.label, { fontFamily: "Prompt-Thin" }]}>
                Gender
              </Text>
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
                Age Range: {userPref.minAgePreference} -{" "}
                {userPref.maxAgePreference}
              </Text>
              <MultiSlider
                values={[userPref.minAgePreference, userPref.maxAgePreference]}
                max={70}
                min={18}
                step={1}
                onValuesChange={(val) =>
                  setUserPref({
                    ...userPref,
                    minAgePreference: val[0],
                    maxAgePreference: val[1],
                  })
                }
                selectedStyle={{ backgroundColor: "#DA58B7" }}
                markerStyle={{ backgroundColor: "#DA58B7" }}
                containerStyle={{ marginHorizontal: 10, direction: "ltr" }}
              />

              <Text style={styles.label}>
                Maximum Distance: {userPref.preferredDistanceKm} km
              </Text>

              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={200}
                step={1}
                value={userPref.preferredDistanceKm}
                onValueChange={(val) =>
                  setUserPref({ ...userPref, preferredDistanceKm: val })
                }
                minimumTrackTintColor="#DA58B7"
                maximumTrackTintColor="#999"
                thumbTintColor="#DA58B7"
              />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => updateUserSearch(userPref, user.userId)}
              >
                <Text style={styles.deleteText}> Save</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={onDeletedUser}
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
  },
  container: {
    paddingBottom: 80,
    padding: 16,

  },
  header: {
    // flexDirection: "row-reverse",
    // justifyContent: "",
    alignItems: "flex-start",
    // marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "white",
    fontFamily: "Prompt-SemiBold",
  },
  
  avatarContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 25,
    color: "white",
    marginTop: 8,
  },
  birthDate: {
    fontSize: 20,
    color: "white",
    fontFamily: "Prompt-Thin",
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

  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#DA58B7",
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
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    fontFamily: "Prompt-Thin",
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
  logo: {
    fontSize: 22,
    fontFamily: "Prompt-Thin",
    color: "#ffe6ff",
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.6,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    position: "relative",
  },
  logoImage: { 
    width: 40,
    height: 40,
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

  selectorContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  selectedItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    fontFamily: "Prompt-Thin",
  },

  placeholderText: {
    fontSize: 16,
    color: "#aaa",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    maxHeight: "70%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Prompt-Black",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionItemSelected: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    fontFamily: "Prompt-Thin",
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: "Prompt-Black",
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Prompt-Thin",
  },

  selectedInterestsContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  interestBox: {
    backgroundColor: "#ffff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  interestText: {
    color: "black",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "Prompt-Thin",
  },
  placeholderText: {
    color: "#aaa",
    fontStyle: "italic",
  },

  traitButton: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 15,
    backgroundColor: "#eee",
    alignItems: "center",
  
  },
  traitButtonSelected: {
    backgroundColor: "#DA58B7",
  },
  traitText: {
    fontSize: 16,
      fontFamily:"Prompt-Black"
  },

  saveBtn: {
    backgroundColor: "#DA58B7", 
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 25,
    alignItems: "center", 
    marginTop: 15, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  saveBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  optionLocation: {
    backgroundColor: "#f5d8f8ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
});
