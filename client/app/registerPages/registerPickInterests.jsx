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
        headers: {
          "Content-Type": "application/json",
        },
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
      </LinearGradient>
    </ImageBackground>
  );
}
