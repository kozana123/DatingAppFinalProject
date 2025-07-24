import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";

export default function GenderPreferenceScreen() {
  const params = useLocalSearchParams();

  // התחלת הסטייט עם הפרמטרים שהתקבלו או אובייקט ריק
  const [userPreference, setUserPreference] = useState(params || {});
  const [selected, setSelected] = useState(userPreference.genderPreference || null);
  const [showOptions, setShowOptions] = useState(false);

  const options = ["Male", "Female", "Non-Binary", "All"];

  const onOptionPress = (option) => {
    const newPreference = { ...userPreference, genderPreference: option };
    setUserPreference(newPreference);
    setSelected(option);
    setShowOptions(false);
    console.log("Selected option:", option);
    console.log("Current userPreference:", newPreference);
  };
  

  const handleNext = () => {
    if (!selected) {
      alert("Please select a gender preference");
      return;
    }

    // שולח את כל האובייקט עם המידע הנוכחי לעמוד הבא
    router.push({
      pathname: "/registerPages/registerPickInterests",
      params: { ...userPreference, genderPreference: selected },
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.background}
    >
      <LinearGradient
        colors={["rgba(106,13,173,0.7)", "rgba(209,71,163,0.7)"]}
        style={styles.gradientOverlay}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>Choose your type</Text>

            <TouchableOpacity
              onPress={() => setShowOptions(!showOptions)}
              style={styles.grayCard}
              activeOpacity={0.7}
            >
              <Text style={styles.cardText}>
                {selected ? selected : "Tap to select gender preference"}
              </Text>
            </TouchableOpacity>

            {showOptions && (
              <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionCard,
                      selected === option && styles.selectedCard,
                    ]}
                    onPress={() => onOptionPress(option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              onPress={handleNext}
              style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
              disabled={!selected}
            >
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 30,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  container: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)", // כרטיסייה אפורה שקופה
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#ffe6ff",
    fontFamily: "Prompt-SemiBold",
    textAlign: "center",
    
  },
  grayCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 88,
    paddingHorizontal: 25,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cardText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Prompt-Thin",

    textAlign: "center",

  },
  optionsContainer: {
    width: "90%",
    alignItems: "center",
    marginBottom: 30,
  },
  optionCard: {
    width: "80%",
    backgroundColor: "rgba(245, 245, 245, 0.77)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ce93d8",
    alignItems: "center",

    
  },
  selectedCard: {
    backgroundColor: "#e1bee7",
    borderColor: "#ab47bc",
  },
  optionText: {
    fontSize: 16,
    color: "#4a148c",
    fontFamily: "Prompt-Black",
    fontWeight: "400",
  
  },
  nextButton: {
    backgroundColor: "#ffffff",
    height: 50,
    width: "300",
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

  nextText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
