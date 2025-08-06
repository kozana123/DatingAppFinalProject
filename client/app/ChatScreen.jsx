import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const chatMessages = [
  { id: "1", sender: "them", text: "Hey! How’s your day going?" },
  { id: "2", sender: "me", text: "Pretty good! Just working on my app. You?" },
  { id: "3", sender: "them", text: "Same here! I’m loving your design work btw." },
  { id: "4", sender: "me", text: "Thanks! Wanna catch a coffee later?" },
  { id: "5", sender: "them", text: "Sure! That’d be nice ☕" },
];

export default function ChatScreen() {
  const route = useRoute();
  const { name, avatar } = route.params;

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "me" ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/images/design.png")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(106,13,173,0.6)", "rgba(209,71,163,0.6)"]}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.name}>{name}</Text>
        </View>

        <FlatList
          data={chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatContent}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="#ccc"
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  chatContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
  },
  myMessage: {
    backgroundColor: "#DA58B7",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: "#6A0DAD",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "#DA58B7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
