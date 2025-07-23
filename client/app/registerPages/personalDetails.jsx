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
} from "react-native";
import { ButtonGroup } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Calendar } from "react-native-calendars";

const STAGE_PROGRESS = 40;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function PersonalDetails() {
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
  const [selectedDate, setSelectedDate] = useState("1990-01-01");
  const [isCalendarVisible, setCalendarVisibility] = useState(false);
  const [genderIndex, setGenderIndex] = useState(null);

  const genders = ["Other", "Female", "Male"];

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    const [year, month, dayNum] = day.dateString.split("-");
    setBirthDate(new Date(year, month - 1, dayNum));
    setCalendarVisibility(false);
  };

  const handleNext = () => {
    if (birthDate && genderIndex !== null) {
      router.push("/registerPages/registerPassEmail");
    } else {
      alert("🛑 Please fill in all fields");
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
            <View
              style={[styles.progressBar, { width: `${STAGE_PROGRESS}%` }]}
            />
          </View>

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
                  style={styles.dateButton}
                  onPress={() => setCalendarVisibility((prev) => !prev)}
                >
                  <Text style={styles.dateButtonText}>
                    {birthDate.toLocaleDateString("en-US")}
                  </Text>
                </TouchableOpacity>

                {isCalendarVisible && (
                  <View style={styles.calendarWrapper}>
                    <Calendar
                      current={selectedDate}
                      onDayPress={onDayPress}
                      markedDates={{
                        [selectedDate]: {
                          selected: true,
                          selectedColor: "#cc66cc",
                        },
                      }}
                      theme={{
                        selectedDayBackgroundColor: "#cc66cc",
                        todayTextColor: "#cc66cc",
                        arrowColor: "#cc66cc",
                      }}
                      style={styles.calendar}
                    />
                  </View>
                )}

                <Text style={styles.label}>Gender</Text>
                <ButtonGroup
                  buttons={genders}
                  selectedIndex={genderIndex}
                  onPress={setGenderIndex}
                  containerStyle={styles.genderGroup}
                  buttonStyle={styles.genderButton}
                  selectedButtonStyle={styles.selectedGenderButton}
                  selectedTextStyle={styles.selectedText}
                  textStyle={styles.genderText}
                  innerBorderStyle={{ width: 1 }}
                />

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
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
  dateButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    direction: "ltr",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Prompt-Thin",
    textAlign: "left",
  },
  calendarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    direction: "ltr",
  },
  calendar: {
    width: SCREEN_WIDTH * 0.85,
    borderRadius: 12,
    direction: "ltr",
  },
  genderGroup: {
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: "transparent",
    
  },
  genderButton: {
    backgroundColor: "transparent",
    paddingVertical: 2,
  },
  selectedGenderButton: {
    backgroundColor: "#cc66cc",
    borderRadius: 12,
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
  nextButton: {
    backgroundColor: "#fff",
    paddingVertical: 4,
    borderRadius: 30,
    paddingHorizontal: 16,
   
  
    width: "100%",
    alignSelf: "center",
    marginTop: 10,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6a0dad",
    fontFamily: "Prompt-SemiBold",
    textAlign: "center",
  },
});
