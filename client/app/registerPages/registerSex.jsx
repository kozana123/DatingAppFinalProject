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
  const [userPreference, setUserPreference] = useState(params || {});
  const [selected, setSelected] = useState(userPreference.genderPreference || null);
  const [showOptions, setShowOptions] = useState(false);

  const options = ["Male", "Female", "Non-Binary", "All"];

  const onOptionPress = (option) => {
    const newPreference = { ...userPreference, genderPreference: option };
    setUserPreference(newPreference);
    setSelected(option);
    setShowOptions(false);
  };

  const handleNext = () => {
    if (!selected) {
      alert("Please select a gender preference");
      return;
    }

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.header}>Choose your type</Text>

          <TouchableOpacity
            onPress={() => setShowOptions(!showOptions)}
            style={styles.grayCard}
            activeOpacity={0.8}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#19607E"
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "rgba(203,247,255,0.2)", // #CBF7FF שקוף
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    marginHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#CBF7FF",
    textAlign: "center",
    fontFamily: "Prompt-SemiBold",
  },
  grayCard: {
    backgroundColor: "rgba(25,96,126,0.2)", // #19607E שקוף
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(203,247,255,0.4)",
  },
  cardText: {
    fontSize: 16,
    color: "#CBF7FF",
    fontFamily: "Prompt-SemiBold",
    textAlign: "center",
  },
  optionsContainer: {
    width: "90%",
    alignItems: "center",
    marginBottom: 30,
  },
  optionCard: {
    width: "80%",
    backgroundColor: "rgba(25,96,126,0.8)", // #19607E כהה יותר
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",

  },
  selectedCard: {
    backgroundColor: "#FF6868", // צבע הבחירה
    borderColor: "#CBF7FF",
  },
  optionText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Prompt-Thin",
  },
  nextButton: {
    backgroundColor: "#FF6868",
    height: 50,
    width: "80%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,

    
  },

  nextText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
