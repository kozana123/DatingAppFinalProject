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
  Modal,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { DataContext } from "./DataContextProvider";
import { addMessage , listenToMessages, deleteChat} from "../fireBase";
import { unMatchUser, addReport  } from "../api";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";



export default function ChatScreen() {
  const route = useRoute();
  const {id, name, avatar, chatId } = route.params;
  const { user } = useContext(DataContext);

  const [messages, setMessages] = useState([]);
  
  const [text, setText] = useState("");

  const [menuVisible, setMenuVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [customReason, setCustomReason] = useState("");
  const [customMainReason, setCustomMainReason] = useState("");

  const flatListRef = useRef(null);

  // מאזין להודעות בזמן אמת
  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
      console.log(msgs);

    });

    // Cleanup listener when leaving screen
    return () => unsubscribe();


  }, [chatId,]);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.senderId === user.user_id
          ? styles.myMessage
          : styles.theirMessage,
      ]}
    >
      <Text style={[
        item.senderId === user.user_id
          ? styles.myMessageText
          : styles.theirMessageText,
      ]}>{item.text}</Text>
    </View>
  );

  const onUnmatch = () =>{

    Alert.alert(
      "Unmatch",
      "Are you sure you want to Unmatch with this user? This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => {
            console.log(id, chatId);
            unMatchUser(user.user_id, id);
            deleteChat(chatId)
            router.back()
          }
        },
      ],
      { cancelable: false }
    );
  }

  const report = async (reportReason) =>{
    const allReport = customMainReason + reportReason
    const date = new Date().toISOString();
    console.log("Got Reported: " + allReport);
    await addReport(user.user_id, id, allReport, date)
  }
  

  const sendMessage = (chatId, senderId, text) =>{
    if(text != ""){
      addMessage(chatId, senderId, text)
      setText("")
    } 
  }

  return (
    <ImageBackground
      // source={require("../assets/images/design.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.header}>
          <View style={styles.topRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={27} color="#ffffffff" />
          </TouchableOpacity>

          <Image source={{ uri: avatar }} style={styles.avatar} />

          <SimpleLineIcons
            style={styles.actionsIcon}
            name="options-vertical"
            size={27}
            color="#ffffffff"
            onPress={() => setMenuVisible(true)}
          />
        </View>

        {/* Bottom row: name */}
        <Text style={styles.name}>{name}</Text>
      </View>
      
      <View style={styles.messageContain}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false} 
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={renderItem}
          style={{ flex: 1 }}
        />
      </View>

      
      <View style={styles.inputBorder}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="#ccc"
            style={styles.input}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={1000} // optional, limit characters
            textAlignVertical="top"
            scrollEnabled={true}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(chatId , user.user_id ,text)}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Modal
        transparent
        visible={menuVisible}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => {
            setMenuVisible(false)
            setStep(1)}}
        >
        <View style={styles.bottomSheet}>
          {step == 1 && ( 
            <View>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                onUnmatch()
                setMenuVisible(false);
                }}
              >
                <Text style={styles.menuText}>Unmatch</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setStep(2);
                  // אפשר לקרוא ל-API דיווח כאן
                }}
              >
                <Text style={[styles.menuText, { color: "red" }]}>Report</Text>
              </TouchableOpacity>
            </View>
          )}
          {step == 2 && ( 
            <>
              <Ionicons style={{alignSelf: "flex-start", paddingLeft:20,}} name="chevron-back" size={30} color="#000000ff" onPress={() => setStep(1)}/>
              <Text style={[styles.menuText, { fontWeight: "bold", marginBottom: 10 }]}>
                Choose reason:
              </Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setCustomMainReason("Reported as Spam - ");
                  setStep(3); // reset for next time
                }}
              >
                <Text style={styles.menuText}>Spam</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setCustomMainReason("Reported as Harassment - ");
                  setStep(3);
                }}
              >
                <Text style={styles.menuText}>Harassment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setCustomMainReason("Reported as Fake Account - ");
                  setStep(3);
                }}
              >
                <Text style={styles.menuText}>Fake Account</Text>
              </TouchableOpacity>
            </>
          )}
          {step == 3 && (
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
              <Ionicons
                style={{ alignSelf: "flex-start", paddingBottom: 10 }}
                name="chevron-back"
                size={30}
                color="#000000ff"
                onPress={() => setStep(2)}
              />

              <Text style={[styles.menuText, { fontWeight: "bold", marginBottom: 10 }]}>
                Write your reason:
              </Text>

              <TextInput
                style={{
                  height: 120,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 10,
                  textAlignVertical: "top", // makes text start from top-left
                  marginBottom: 15,
                }}
                placeholder="Type your report here..."
                multiline
                value={customReason}
                onChangeText={setCustomReason}
              />

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { backgroundColor: "#FF6868", borderRadius: 8 },
                ]}
                onPress={() => {
                  report(customReason);
                  setCustomReason("");
                  setMenuVisible(false);
                  setStep(1);
                }}
              >
                <Text style={[styles.menuText, { color: "#fff" }]}>Send</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#19607E",
  },
  header: { 
    paddingTop: 20,
    backgroundColor: "#2f728fff",
    borderBottomWidth: 2,
    borderBottomColor: "#cbf7ff6c",
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  actionsIcon: { 
    padding: 5,
  },
  avatar: { width: 45, height: 45, borderRadius: 30, },
  name: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#ffffffff",
    paddingBottom: 10
  },
  chatContent: { flexGrow: 1, paddingVertical: 10 },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
  },
  myMessage: {
    backgroundColor: "#FF6868",
    alignSelf: "flex-end",
    borderBottomEndRadius: 0,
  },
  theirMessage: {
    backgroundColor: "#CBF7FF",
    alignSelf: "flex-start",
    borderBottomStartRadius: 0,
  },
  myMessageText: { 
    color: "#000000ff", 
    fontSize: 15 
  },
  theirMessageText: { 
    color: "#000000ff", 
    fontSize: 15 
  },
  messageContain:{
    flex: 1,
    paddingHorizontal:20
  },
  inputBorder:{

    // backgroundColor: "#2f728fff",
    // paddingHorizontal: 10,
    padding:10,
    // borderTopWidth: 1,
    // borderTopColor: "#cbf7ff6c",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    // marginHorizontal:10,

  },
  input: { 
    flex: 1, 
    color: "#fff", 
    fontSize: 16, 
    paddingHorizontal: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#FF6868",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  bottomSheet: { backgroundColor: "white", paddingVertical: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  menuItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  menuText: { fontSize: 18, color: "#333", textAlign: "center" },
});
