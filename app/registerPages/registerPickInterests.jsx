import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

export default function BubbleInterests() {
  const interests = [
    { label: "Reading", icon: <FontAwesome5 name="book" size={24} color="white" /> },
    { label: "Photography", icon: <MaterialIcons name="camera-alt" size={24} color="white" /> },
    { label: "Gaming", icon: <Ionicons name="game-controller" size={24} color="white" /> },
    { label: "Music", icon: <Ionicons name="musical-notes" size={24} color="white" /> },
    { label: "Travel", icon: <FontAwesome5 name="plane" size={24} color="white" /> },
    { label: "Painting", icon: <MaterialIcons name="palette" size={24} color="white" /> },
    { label: "Politics", icon: <FontAwesome5 name="landmark" size={24} color="white" /> },
    { label: "Charity", icon: <FontAwesome5 name="hands-helping" size={24} color="white" /> },
    { label: "Cooking", icon: <Ionicons name="restaurant" size={24} color="white" /> },
    { label: "Pets", icon: <FontAwesome5 name="dog" size={24} color="white" /> },
    { label: "Sports", icon: <MaterialIcons name="sports-soccer" size={24} color="white" /> },
    { label: "Fashion", icon: <MaterialIcons name="checkroom" size={24} color="white" /> },
    { label: "Dancing", icon: <Ionicons name="body" size={24} color="white" /> },
    { label: "Yoga", icon: <FontAwesome5 name="om" size={24} color="white" /> },
    { label: "Movies", icon: <Entypo name="video" size={24} color="white" /> },
  ];

  const [selected, setSelected] = useState([]);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  return (
    <LinearGradient
      colors={["#F7F3F2", "#8A2C2A"]}
      style={{ flex: 1, paddingTop: 60 }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", margin: 20 }}>
        What are your interests?
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 10 }}>
        {interests.map((item, index) => {
          const isSelected = selected.includes(item.label);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => toggleInterest(item.label)}
              style={{
                backgroundColor: isSelected ? "#fff" : "#8A2C2A",
                padding: 12,
                margin: 8,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                width: width / 3.2,
                borderWidth: 2,
                borderColor: "#fff"
              }}
            >
              <View style={{ marginBottom: 6 }}>{item.icon}</View>
              <Text style={{ color: isSelected ? "#8A2C2A" : "#fff", fontWeight: "600" }}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
}