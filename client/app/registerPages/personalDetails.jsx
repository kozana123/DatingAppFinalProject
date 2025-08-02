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
import { useLocalSearchParams } from 'expo-router';

const STAGE_PROGRESS = 40;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function PersonalDetails() {

  const params = useLocalSearchParams();
  const [newUser, setnewUser] = useState(params);
  console.log(`Date page`, newUser);


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
    setnewUser({ ...newUser, birthDate: day.dateString})
  };

  const onGenderPress = (value) => {
    setnewUser({ ...newUser, gender: genders[value]})
    setGenderIndex(value)
  };

  const handleNext = () => {
    if (newUser.birthDate && newUser.gender) {
      router.push({pathname:"/registerPages/registerPassEmail", params: newUser});
    } else {
      console.log("this run");
      
      router.push("/registerPages/registerPassEmail");
      // alert("🛑 Please fill in all fields");
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
                  onPress={onGenderPress}
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
    // paddingTop: Platform.OS === "ios" ? 60 : 30,
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
    // flexDirection: "row-reverse",
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
    justifyContent: "center", // הוספה חשובה
    paddingBottom: 40,
  },
  
  card: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 20,
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
  nextButton: {
    backgroundColor: "#ffffff",
    height: 50,
    // width: "300",
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
