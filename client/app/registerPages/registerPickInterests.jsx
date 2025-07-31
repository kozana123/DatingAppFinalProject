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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_SIZE = width / 4;

export default function BubbleInterests() {
  const params = useLocalSearchParams();
  const [userPreference, setUserPreference] = useState(params || {});
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

  useEffect(() => {
    setUserPreference((prev) => ({ ...prev, interests: selected }));
  }, [selected]);

  const updateUserPreferences = async (prefs) => {
    try {
      const response = await fetch(`http://YOUR_SERVER_IP/api/userpreferences/${prefs.UserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update preferences: ${errorText}`);
      }
      return true;
    } catch (error) {
      Alert.alert("Error", error.message);
      return false;
    }
  };

  const handleContinue = async () => {
    if (selected.length === 0) {
      Alert.alert("Please select at least one interest to continue.");
      return;
    }

    const prefsToSend = {
      ...userPreference,
      interests: selected.join(", "),
    };

    const success = await updateUserPreferences(prefsToSend);
    if (success) {
      router.push({
        pathname: "/registerPages/welcomePage",
        params: prefsToSend,
      });
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
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

              <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
                <Text style={styles.continueText}>Let's Do It</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 30 : 60,
    paddingBottom: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  container: {
    width: "90%",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  categoryBlock: {
    width: "100%",
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 8,
  },
  traitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  traitButton: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: CARD_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
  },
  selectedTraitButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderColor: "#fff",
  },
  traitIcon: {
    fontSize: 22,
    color: "#fff",
  },
  selectedTraitIcon: {
    fontWeight: "bold",
    color: "#fff",
  },
  traitText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  selectedTraitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 6,
  },
  continueText: {
    color: "#6A0DAD",
    fontWeight: "bold",
    fontSize: 16,
  },
});
