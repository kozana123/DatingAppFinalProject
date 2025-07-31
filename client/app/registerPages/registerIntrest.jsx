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
  
  console.log(`params:`, params);
  console.log(`Intrest page:`, userPreference);


  useEffect(() => {
    console.log("Selected interest changed:", selected);
  }, [selected]);

  const options = [
    {
      key: "love",
      icon: <Ionicons name="heart" size={30} color="#555" />,
      title: "Find love",
      subtitle: "I want to find a relationship.",
    },
    {
      key: "chat",
      icon: (
        <MaterialCommunityIcons
          name="chat"
          size={30}
          color="#555"
        />
      ),
      title: "Just chatting",
      subtitle: "Let’s start with chatting, then we’ll see.",
    },
    {
      key: "casual",
      icon: (
        <FontAwesome5
          name="glass-martini-alt"
          size={30}
          color="#555"
        />
      ),
      title: "Something casual",
      subtitle: "Just want to have some fun...",
    },
  ];

  const handleNext = () => {
    if (selected !== null) {
      const updatedPreference = { ...userPreference, interest: selected };
      setUserPreference(updatedPreference);

      console.log("selected interest on Next:", selected);
      console.log("updated userPreference on Next:", updatedPreference);

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
        colors={["rgba(106,13,173,0.7)", "rgba(209,71,163,0.7)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
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
                    styles.card,
                    selected === item.key && styles.selectedCard,
                  ]}
                >
                  <View style={styles.icon}>{item.icon}</View>

                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
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
    paddingTop: Platform.OS === "ios" ? 60 : 30,
  },
  container: {
    marginHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 24,
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffe6ff",
    marginBottom: 10,
    fontFamily: "Prompt-SemiBold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#f8d7ff",
    marginBottom: 30,
    fontFamily: "Prompt-Thin",
    textAlign: "center",
  },
  options: {
    gap: 10,
    flex: 1,
  },
  card: {
    backgroundColor: "#f2f2f2",
    width: "100%",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#ccc",
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    borderRadius: 15,
    direction: "ltr",
    // no fixed height here!
  },
  selectedCard: {
    borderColor: "#d18bcf",
    backgroundColor: "#f3d7f0",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  cardTextContainer: {
    flex: 1,
    paddingLeft: 15,
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Prompt-Thin",
    flexShrink: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Prompt-Light",
    flexShrink: 1,
  },
  nextBtn: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 20,
    alignItems: "center",
  },
  nextText: {
    color: "#6a0dad",
    fontWeight: "700",
    fontFamily: "Prompt-SemiBold",
  },
});
