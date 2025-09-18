import React, { useState } from "react";
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

export default function PersonalDetails() {
  const params = useLocalSearchParams();
  const [newUser, setnewUser] = useState(params);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

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
        colors={["rgba(25,96,126,0.8)", "rgba(25,96,126,0.8)"]}
        style={styles.gradientOverlay}
      >
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]} />
        </View>
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
              <View style={styles.card}>
                <Text style={styles.title}>Your Personal Info</Text>

                <Text style={styles.label}>Birth Date</Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    showPicker && { borderColor: "#FF6868" },
                  ]}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={styles.inputText}>
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
                  containerStyle={styles.genderGroup}
                  buttonStyle={styles.genderButton}
                  selectedButtonStyle={styles.selectedGenderButton}
                  selectedTextStyle={styles.selectedText}
                  textStyle={styles.genderText}
                  innerBorderStyle={{
                    width: 2,
                    color: "rgba(255,255,255,0.1)",
                  }}
                />

                <TouchableOpacity style={styles.button} onPress={handleNext}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width, height: "100%" },
  gradientOverlay: { flex: 1 },
  safeArea: { flex: 1, justifyContent: "center" },
  progressContainer: {
    position: "absolute",
    top: 80,
    left: "10%",
    right: "10%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    zIndex: 10,
  },
  progressBar: { height: "100%", backgroundColor: "#FF6868", borderRadius: 4 },
  keyboardAvoidingView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", paddingBottom: 40 },
  card: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#CBF7FF",
    marginBottom: 6,
    fontFamily: "Prompt-SemiBold",
  },
  label: {
    fontSize: 15,
    color: "#CBF7FF",
    marginBottom: 10,
    fontFamily: "Prompt-Thin",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#CBF7FF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  inputText: {
    fontSize: 18,
    color: "#CBF7FF",
    fontFamily: "Prompt-Thin",
  },
  genderGroup: {
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "#CBF7FF",
  },
  genderButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "#FF6868",
  },
  selectedGenderButton: { borderColor: "#FF6868", backgroundColor: "#FF6868" },
  selectedText: {
    color: "#CBF7FF",
    fontWeight: "bold",
    fontFamily: "Prompt-Thin",
  },
  genderText: { color: "#CBF7FF", fontSize: 14, fontFamily: "Prompt-Thin" },

  button: {
    backgroundColor: "#FF6868",
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#CBF7FF",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
