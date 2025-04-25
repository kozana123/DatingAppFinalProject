import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function BubbleInterests() {
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
      ]
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
      ]
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
      ]
    },
  ];

  const [selected, setSelected] = useState([]);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    // הצגת תוצאה או שמירה
    Alert.alert("המשכתי עם הבחירות הבאות:", selected.join(", "));
    // כאן תוכל לשלוח את הנתונים לשרת או לעבור למסך הבא
  };

  return (
    <LinearGradient colors={["#F7F3F2", "#8A2C2A"]} style={{ flex: 1, paddingTop: 60 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", margin: 20 }}>
        What are your interests?
      </Text>

      <ScrollView>
        {interests.map((category, index) => (
          <View key={index} style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "#4B2C2A", textAlign: "center" }}>
              {category.title}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 10 }}>
              {category.traits.map((item, index) => {
                const isSelected = selected.includes(item.label);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleInterest(item.label)}
                    style={[styles.button, isSelected && styles.selectedButton]}
                  >
                    <Text style={[styles.icon, isSelected && styles.selectedIcon]}>{item.icon}</Text>
                    <Text style={[styles.text, isSelected && styles.selectedText]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ borderBottomWidth: 1, borderBottomColor: "#4B2C2A", marginVertical: 20 }} />
          </View>
        ))}
      </ScrollView>

      {/* כפתור המשך */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity
          onPress={handleContinue}
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E2D2C1", // צבע בהיר ונעים יותר
    paddingVertical: 6,        // גובה קטן יותר
    paddingHorizontal: 10,     // מרווח קטן יותר
    margin: 6,                // רווח קטן יותר בין הכפתורים
    borderRadius: 12,         // עגלגלות קלה
    alignItems: "center",
    justifyContent: "center",
    width: width / 5,         // גודל כפתור קטן יותר
    height: 60,               // גובה קטן יותר
    borderWidth: 0,           // ללא מסגרת שחורה
    elevation: 3,             // הצללה קלה
  },
  selectedButton: {
    backgroundColor: "#8A2C2A", // צבע רקע כשנבחר
    elevation: 6,     // הצללה יותר בולטת כשהכפתור נבחר
  },
  icon: {
    fontSize: 16,   // הקטנה של האימוג'י
    color: "#4B2C2A", // צבע ברירת מחדל לאימוג'י
  },
  selectedIcon: {
    color: "#fff", // צבע אימוג'י כשנבחר
  },
  text: {
    color: "#4B2C2A",
    fontWeight: "500", // הקטנה של הגודל
    marginTop: 2,     // הקטנה של המרווח בין האייקון לטקסט
    fontSize: 12,     // הקטנה של הגודל
  },
  selectedText: {
    color: "#fff", // צבע טקסט כשנבחר
  },
  continueButton: {
    backgroundColor: "#8A2C2A", 
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 4,     // הצללה לכפתור המשך
  },
  continueText: {
    color: "#fff",
    fontSize: 16,    // הקטנה של גודל הטקסט
    fontWeight: "bold",
  },
});
