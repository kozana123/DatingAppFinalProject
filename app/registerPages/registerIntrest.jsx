import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

export default function InterestsScreen() {
  const [selected, setSelected] = useState(null);

  const options = [
    {
      key: "love",
      icon: <Ionicons name="heart" size={30} color="#bd513e" />,
      title: "Find love",
      subtitle: "I want to find a relationship.",
    },
    {
      key: "chat",
      icon: <MaterialCommunityIcons name="chat" size={30} color="#bd513e" />,
      title: "Just chatting",
      subtitle: "Let’s start with chatting – then we’ll see.",
    },
    {
      key: "casual",
      icon: <FontAwesome5 name="glass-martini-alt" size={30} color="#bd513e" />,
      title: "Something casual",
      subtitle: "Just want to have some fun...",
    },
  ];

  const handleNext = () => {
    if (selected !== null) {
      router.navigate("/registerPages/registerProfileIntro");
    } else {
      alert("Please select an option.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={{ fontSize: 20 }}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>What interests you first?</Text>
      <View style={styles.separator} />

      <Text style={styles.subheader}>
        Tell others what you expect from online dating. 
         You can always change your answer if you change your mind.
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
            <View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 35,
    marginTop: 23,
  },
  subheader: {
    fontSize: 20,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  options: {
    flex: 1,
    gap: 35,
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderWidth: 4,
    borderColor: "#ccc",
  },
  selectedCard: {
    borderColor: "#bd513e",
    backgroundColor: "#ffe8e5",
  },
  icon: {
    width: 40,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#555",
  },
  nextBtn: {
    backgroundColor: "#bd513e",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 40,
  },
  nextText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 3,
    marginVertical: 10,
    width: '100%',
    alignSelf: 'center',
  },
});
