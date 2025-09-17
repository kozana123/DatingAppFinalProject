import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { DataContext } from "./DataContextProvider";
import { getMessages, addMessage , listenToMessages} from "../fireBase";  

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function ChatScreen() {
  const route = useRoute();
  const {id, name, avatar, chatId } = route.params;
  const { user } = useContext(DataContext);

  const [messages, setMessages] = useState([]);
  
  const [text, setText] = useState("");

  const flatListRef = useRef(null);

  // מאזין להודעות בזמן אמת
  useEffect(() => {
    if (!chatId) return;
    console.log(chatId);

    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
      console.log(msgs);

    });
    
    // Cleanup listener when leaving screen
    return () => unsubscribe();

  }, [chatId]);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === user.user_id
          ? styles.myMessage
          : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const sendMessage = (chatId, senderId, text) =>{
    if(text != ""){
      addMessage(chatId, senderId, text)
      setText("")
    } 
  }

  return (
    <ImageBackground
      source={require("../assets/images/design.png")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(106,13,173,0.6)", "rgba(209,71,163,0.6)"]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <Image
              source={{ uri: avatar}}
              style={styles.avatar}
            />
            <Text style={styles.name}>{name}</Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.chatContent}
          />

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#ccc"
              style={styles.input}
              value={text}
              onChangeText={setText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(chatId , user.user_id ,text)}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  name: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  chatContent: { flexGrow: 1, paddingVertical: 10 },
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
  messageText: { color: "#fff", fontSize: 15 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: { flex: 1, color: "#fff", fontSize: 16, paddingHorizontal: 10 },
  sendButton: {
    backgroundColor: "#DA58B7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendText: { color: "#fff", fontWeight: "bold" },
});
