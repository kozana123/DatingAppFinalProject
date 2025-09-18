import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function InterestsScreen() {
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState(null);
  const [userPreference, setUserPreference] = useState(params);

  const options = [
    {
      key: "love",
      icon: <Ionicons name="heart" size={30} color="#FF6868" />,
      title: "Find love",
      subtitle: "I want to find a relationship.",
    },
    {
      key: "chat",
      icon: <MaterialCommunityIcons name="chat" size={30} color="#FF6868" />,
      title: "Just chatting",
      subtitle: "Let’s start with chatting, then we’ll see.",
    },
    {
      key: "casual",
      icon: <FontAwesome5 name="glass-martini-alt" size={30} color="#FF6868" />,
      title: "Something casual",
      subtitle: "Just want to have some fun...",
    },
  ];

  const handleNext = () => {
    if (selected !== null) {
      const updatedPreference = { ...userPreference, interest: selected };
      setUserPreference(updatedPreference);
      router.push({
        pathname: "/registerPages/registerSex",
        params: updatedPreference,
      });
    } else {
      alert("Please select an option.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(25,96,126,0.8)", "rgba(25,96,126,0.8)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            <Text style={styles.title}>What interests you first?</Text>
            <Text style={styles.subtitle}>
              Tell others what you expect from online dating.{"\n"}
              You can always change your answer later.
            </Text>

            <View style={styles.options}>
              {options.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setSelected(item.key)}
                  style={[
                    styles.optionCard,
                    selected === item.key && styles.selectedOptionCard,
                  ]}
                >
                  <View style={styles.icon}>{item.icon}</View>
                  <View style={styles.textContainer}>
                    <Text style={styles.optionTitle}>{item.title}</Text>
                    <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.15)", // בהיר יותר, כמו במקור
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: "95%", // לא ממלא את כל המסך
    maxWidth: 360, // לא גדול מדי
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#CBF7FF",
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#CBF7FF",
    textAlign: "center",
    fontFamily: "Prompt-Thin",
    marginBottom: 30,
  },
  options: {
    width: "100%",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", // רקע בהיר יותר
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedOptionCard: {
    backgroundColor: "rgba(48, 55, 69, 0.19)", 
    borderColor: "#CBF7FF",
},

  icon: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingLeft: 15,
  },
  optionTitle: {
    color: "#333", // צבע כהה לקריאות
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  optionSubtitle: {
    color: "#555", // צבע כהה יותר לקריאות
    fontSize: 12,
    fontFamily: "Prompt-Regular",
  },
  nextBtn: {
    backgroundColor: "#FF6868",
    height: 50,
    width: "80%",
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
  nextText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Prompt-Black",
    letterSpacing: 1,
  },
});
