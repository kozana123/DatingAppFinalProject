import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { ButtonGroup } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

const STAGE_PROGRESS = 40;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function PersonalDetails() {
  const params = useLocalSearchParams();
  const [newUser, setnewUser] = useState(params);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const initialBirthdate = newUser.birthDate
    ? new Date(newUser.birthDate)
    : eighteenYearsAgo;

  const [birthDate, setBirthDate] = useState(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(false);

  const [genderIndex, setGenderIndex] = useState(
    newUser.gender ? ["Other", "Female", "Male"].indexOf(newUser.gender) : null
  );

  const genders = ["Other", "Female", "Male"];


  const isAtLeast18 = (date) => {
    const now = new Date();
    const diff = now.getFullYear() - date.getFullYear();
    if (diff > 18) return true;
    if (diff === 18) {
      if (
        now.getMonth() > date.getMonth() ||
        (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate())
      )
        return true;
    }
    return false;
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      if (isAtLeast18(selectedDate)) {
        setBirthDate(selectedDate);
        setnewUser({ ...newUser, birthDate: selectedDate.toISOString() });
      } else {
        Alert.alert("Invalid Date", "You must be at least 18 years old.");
      }
    }
  };

  const onGenderPress = (value) => {
    setnewUser({ ...newUser, gender: genders[value] });
    setGenderIndex(value);
  };

  const handleNext = () => {
    if (newUser.birthDate && newUser.gender) {
      router.push({
        pathname: "/registerPages/registerPassEmail",
        params: newUser,
      });
    } else {
      Alert.alert("🛑 Please fill in all fields");
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.progressContainer}>
                <View
                  style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]}
                />
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>Your Personal Info</Text>

                <Text style={styles.label}>Birth Date</Text>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    showPicker && { borderColor: "#cc66cc" },
                  ]}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={styles.dateText}>
                    {birthDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>

                {showPicker && (
                  <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="spinner"
                    maximumDate={eighteenYearsAgo}
                    onChange={onDateChange}
                  />
                )}

                <Text style={styles.label}>Gender</Text>
                <ButtonGroup
                  buttons={genders}
                  selectedIndex={genderIndex}
                  onPress={onGenderPress}
                  containerStyle={[styles.genderGroup, styles.purpleBackground]}
                  buttonStyle={styles.genderButton}
                  selectedButtonStyle={styles.selectedGenderButton}
                  selectedTextStyle={styles.selectedText}
                  textStyle={styles.genderText}
                  innerBorderStyle={{ width: 1 }}
                />
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
    alignContent: "center",
    justifyContent: "center",
  },
  progressContainer: {
    height: 8,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 30,
    
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 4,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 20,
  },
  purpleBackground: {
    
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffe6ff",
    marginBottom: 20,
    fontFamily: "Prompt-Thin",
    textAlign: "left",
    direction: "ltr",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    fontFamily: "Prompt-Thin",
    textAlign: "left",
    direction: "ltr",
    
   
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#cc66cc",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  dateText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Prompt-Thin",
  },
  genderGroup: {
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: "transparent",
     borderColor: "#cc66cc"
    
  },
  genderButton: {
    backgroundColor: "transparent",
     borderColor: "#cc66cc",
  },
  selectedGenderButton: {
     borderColor: "#cc66cc",
    backgroundColor: "#cc66cc",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Prompt-Thin",
     borderColor: "#cc66cc"
  },
  genderText: {
    color: "#eee",
    fontSize: 14,
    fontFamily: "Prompt-Black",
     borderColor: "#cc66cc"
  },
  nextButton: {
    backgroundColor: "#ffffff",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#cc6699",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    borderColor: "#cc6699",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
