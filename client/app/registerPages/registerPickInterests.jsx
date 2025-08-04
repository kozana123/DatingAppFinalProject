import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
  ImageBackground,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_SIZE = width / 4;

export default function BubbleInterests() {
  const params = useLocalSearchParams();
  const [userPreference, setUserPreference] = useState(params);
  const [selected, setSelected] = useState([]);

  const interests = [
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

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const apiUrl = "http://www.DatingServer.somee.com/api/userpreferences/userPreferences"

  const RegisterPreferences = async (prefs) => {
    // console.log(userPreference);
    console.log(userPreference);

    const preferences = {
      userId: userPreference.userId, // Replace with actual user ID
      preferredPartner: userPreference.genderPreference ,
      relationshipType: userPreference.interest,
      heightPreferences: "",
      religion: "",
      isSmoker: false,
      preferredDistanceKm: 30,
      minAgePreference: 25,
      maxAgePreference: 35,
      interests: prefs,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (response.status === 204) {
        console.log("Preferences updated successfully.");
      } else {
        const text = await response.text();
        console.warn("POST failed:",response.status, text);
      }
    } catch (error) {
      console.error("Error sending preferences:", error);
    }
  };

  const handleContinue = async () => {
    if (selected.length === 0) {
      Alert.alert("Please select at least one interest to continue.");
      return;
    }
    const updatedPrefs = selected.join(",")

    const success = await RegisterPreferences(updatedPrefs);
    console.log(success == true? "Preferences sent successfully." : "Failed to send preferences.");

    if (success) {
      router.push({pathname: "/registerPages/welcomePage",params: prefsToSend,});
    }
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
            <Text style={styles.header}>What are your interests?</Text>

            {interests.map((category, index) => (
              <View key={index} style={styles.categoryBlock}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <View style={styles.traitsContainer}>
                  {category.traits.map((item, idx) => {
                    const isSelected = Array.isArray(selected) && selected.includes(item.label);
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

            <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
              <Text style={styles.continueText}>Let's Do It</Text>
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
    // paddingTop: Platform.OS === "ios" ? 60 : 30,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    // paddingBottom: 60,
    alignItems: "center",
  },
  container: {
    // marginHorizontal: 20,
    margin: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    // padding: 5,
    alignItems: "center",
    // width: "90%",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#ffe6ff",
    fontFamily: "Prompt-SemiBold",
    textAlign: "center",
  },
  categoryBlock: {
    marginBottom: 24,
    width: "100%",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Prompt-Bold",
    marginBottom: 12,
  },
  traitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  traitButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  selectedTraitButton: {
    backgroundColor: "#fff",
  },
  traitIcon: {
    fontSize: 18,
    color: "#fff",
  },
  selectedTraitIcon: {
    color: "#6a0dad",
  },
  traitText: {
    fontSize: 11,
    color: "#fff",
    fontFamily: "Prompt-Regular",
    textAlign: "center",
  },
  selectedTraitText: {
    color: "#6a0dad",
    fontWeight: "700",
  },
  continueButton: {
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
  continueText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6a0dad",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
