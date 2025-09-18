import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import { RegisterPreferences } from '../../api';

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 60) / 3 - 4;
export default function BubbleInterests() {
  const params = useLocalSearchParams();
  const [userPreference, setUserPreference] = useState(params);
  const [selected, setSelected] = useState([]);

  const interests = [
    {
      title: "Personality",
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
      title: " Lifestyle",
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
      title: "Hobbies",
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

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = async () => {
    if (selected.length < 5) {
      Alert.alert("Please select at least 5 interests to continue.");
      return;
    }
    const updatedPrefs = selected.join(",");

    const success = await RegisterPreferences(updatedPrefs, userPreference);

    if (success) {
      router.push("/login");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.background}
    >
      <LinearGradient
        colors={["rgba(25,96,126,0.9)", "rgba(25,96,126,0.7)"]}
        style={styles.gradientOverlay}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>What are your interests?</Text>

            {interests.map((category, index) => (
              <View key={index} style={styles.categoryBlock}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <View style={styles.traitsContainer}>
                  {category.traits.map((item, idx) => {
                    const isSelected = selected.includes(item.label);
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => toggleInterest(item.label)}
                        style={[
                          styles.traitButton,
                          isSelected && styles.selectedTraitButton,
                        ]}
                      >
                        <Text
                          style={[
                            styles.traitIcon,
                            isSelected && styles.selectedTraitIcon,
                          ]}
                        >
                          {item.icon}
                        </Text>
                        <Text
                          style={[
                            styles.traitText,
                            isSelected && styles.selectedTraitText,
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={handleContinue}
              style={styles.continueButton}
            >
              <Text style={styles.continueText}>Let's Do It</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}const CARD_WIDTH = width - 40; 
const CARD_HEIGHT = 70; 

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  container: {
    margin: 20,
    backgroundColor: "rgba(203,247,255,0.15)",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
    color: "#CBF7FF",
    fontFamily: "Prompt-SemiBold",
    textAlign: "center",
  },
  categoryBlock: {
    marginBottom: 24,
    width: "100%",
  },
  categoryTitle: {
    fontSize: 20,
    
    color: "#CBF7FF",
    textAlign: "center",
    fontFamily: "Prompt-Black",
    marginBottom: 12,
  },
  traitsContainer: {
    flexDirection: "column", // סדר אנכי
    alignItems: "center",
  },
  traitButton: {
    backgroundColor: "#19607E",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginVertical: 6,
    borderRadius: 16,
    flexDirection: "row", 
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    
  },
  selectedTraitButton: {
    backgroundColor: "#FF6868",
    shadowColor: "#FF6868",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  traitIcon: {
    fontSize: 24,
    color: "#CBF7FF",
    marginRight: 15,
  },
  selectedTraitIcon: {
    color: "#ffffff",
  },
  traitText: {
    fontSize: 16,
    color: "#CBF7FF",
    fontFamily: "Prompt-Thin",
  },
  selectedTraitText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  continueButton: {
    backgroundColor: "#FF6868",
    height: 50,
    width: width - 80, 
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderColor: "#CBF7FF",
    marginTop: 20,
  },
  continueText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
