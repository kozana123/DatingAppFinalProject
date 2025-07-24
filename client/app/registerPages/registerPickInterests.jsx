import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function BubbleInterests() {
  // 1. קבלת פרמטרים מהדף הקודם
  const params = useLocalSearchParams();

  // 2. שמירת המידע שקיבלנו + העניין הנבחר
  const [userData, setUserData] = useState(params || {});

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

  // 3. שמירת המעניינים שנבחרו
  const [selected, setSelected] = useState([]);

  // 4. טוגל בחירה של עניין
  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  // 5. עדכון המידע עם המעניינים הנבחרים
  useEffect(() => {
    setUserData((prev) => ({ ...prev, interests: selected }));
  }, [selected]);

  // 6. כפתור המשך - שולח את כל המידע לדף הבא
  const handleContinue = () => {
    if (selected.length === 0) {
      Alert.alert("Please select at least one interest to continue.");
      return;
    }
    router.push({
      pathname: "/registerPages/welcomePage",
      params: userData,
    });
  };

  return (
    <LinearGradient colors={["#F7F3F2", "#8A2C2A"]} style={{ flex: 1, paddingTop: 60 }}>
      <Text style={styles.title}>What are your interests?</Text>

      <ScrollView>
        {interests.map((category, index) => (
          <View key={index} style={{ marginBottom: 30 }}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.traitsContainer}>
              {category.traits.map((item, idx) => {
                const isSelected = selected.includes(item.label);
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => toggleInterest(item.label)}
                    style={[styles.button, isSelected && styles.selectedButton]}
                  >
                    <Text style={[styles.icon, isSelected && styles.selectedIcon]}>{item.icon}</Text>
                    <Text style={[styles.text, isSelected && styles.selectedText]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.divider} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.continueContainer}>
        <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    margin: 20,
    fontFamily: "Prompt-Bold",
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B2C2A",
    textAlign: "center",
    fontFamily: "Prompt-Bold",
  },
  traitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#E2D2C1",
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: width / 5,
    height: 60,
    elevation: 3,
  },
  selectedButton: {
    backgroundColor: "#8A2C2A",
    elevation: 6,
  },
  icon: {
    fontSize: 16,
    color: "#4B2C2A",
  },
  selectedIcon: {
    color: "#fff",
  },
  text: {
    color: "#4B2C2A",
    fontWeight: "500",
    marginTop: 2,
    fontSize: 12,
  },
  selectedText: {
    color: "#fff",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#4B2C2A",
    marginVertical: 20,
  },
  continueContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#8A2C2A",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    elevation: 4,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
