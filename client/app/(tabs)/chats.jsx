import React, { useContext, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DataContext } from "../DataContextProvider";
import { useNavigation } from "@react-navigation/native";
import { fetchMatchedUsers, unMatchUser, addReport  } from "../../api";
import { deleteChat, getLastMessage} from "../../fireBase";  
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Chats() {

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { user } = useContext(DataContext);

  const [chats, setChats] = useState([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedChat, setSelectedChat] = useState(null);
  const [customReason, setCustomReason] = useState("");
  const [customMainReason, setCustomMainReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFocused) return;
    loadMatches();
  }, [user.matched_user_id, isFocused]);

  const loadMatches = async () => {
    try {
      const result = await fetchMatchedUsers(user.user_id);
      console.log(`this is the result: ${result}`);
      if(result != ""){
        const withLastMessage = await Promise.all(
          result.map(async (chat) => {
            const lastMessage = await getLastMessage(chat.ChatId);
            return {
              ...chat,
              lastMessage: lastMessage || { timeAgo: "", text: "" },
            };
        }))
        setChats(withLastMessage);
      }
      else{
        setChats([]);
      }
      
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("ChatScreen", {
          id: item.matched_user_id,
          name: item.userName,
          avatar: item.profile_image,
          chatId: item.ChatId
        })
      }
      onLongPress={() => {
        setSelectedChat([item.matched_user_id, item.ChatId]);
        setMenuVisible(true);
      }}>

      <Image source={{ uri: item.profile_image }} style={styles.avatar} />
      <View style={styles.messageContainer}>
        {/* Top row: name + time */}
        <View style={styles.topRow}>
          <Text style={styles.name}>{item.userName}</Text>
          <Text style={styles.timeAgo}>{item.lastMessage.timeAgo}</Text>
        </View>

        {/* Bottom row: last message */}
        <Text
          style={styles.message}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.lastMessage.text}
        </Text>
      </View>

    </TouchableOpacity>
  );

  const onUnmatch = (unMatchId, chatId) =>{
    Alert.alert(
      "Unmatch",
      "Are you sure you want to Unmatch with this user? This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => {
            console.log(unMatchId, chatId);
            unMatchUser(user.user_id, unMatchId);
            deleteChat(chatId)

            setChats((prevChats) =>
              prevChats.filter((c) => c.matched_user_id !== unMatchId)
            );
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
    await addReport(user.user_id, selectedChat[0], allReport, date)
  }

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.chatContainer} >
        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
        </View>

        {loading === true ? ( 
          <View style={{ flex: 1, alignItems: "center", paddingTop: 160}}>
            <ActivityIndicator size="large" color="#FF6868" />
          </View>
        ) : (
          <>
            {chats.length === 0 ? (
              <View style={{ flex: 1, alignItems: "center", paddingTop: 80, gap: 15 }}>
                <Image
                  source={require("../../assets/images/icon_camera.png")}
                  style={{ width: 80, height: 80, tintColor: "#CBF7FF" }} // כאן הצבע
                  resizeMode="contain"
                />
                <Text style={{ color: "#fff", fontSize: 22 }}>No chats yet</Text>
                <Text style={{ color: "#fff", fontSize: 18,textAlign: "center" }}>Start video chatting to make your first connection!</Text>
                  
              </View>
              ) : (
                <FlatList
                  data={chats}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.matched_user_id}
                  contentContainerStyle={{ paddingBottom: 80 }}
                />
            )}
          </> 
        )} 
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
                onUnmatch(selectedChat[0], selectedChat[1])
                setMenuVisible(false);
                console.log("Unmatch chat:", selectedChat);
                }}
              >
                <Text style={styles.menuText}>Unmatch</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setStep(2);
                  console.log("Report chat:", selectedChat);
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
            <View style={{ paddingHorizontal: 20, paddingBottom: 20, }}>
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
    width: "100%",
    height: 80,
    paddingLeft: 30,
    justifyContent: "center",
    alignItems: "flex-start",
    
  },
  headerText: {
    fontSize: 29, 
    fontWeight: "bold", 
    color: "#CBF7FF" 
  },
  chatItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 15, 
    paddingLeft: 15,
    borderBottomColor: "#cbf7ff6c", 
    borderBottomWidth: 1,
    backgroundColor:"#ffffff18"
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 40, 
    marginRight: 15 
  },
  messageContainer: { 
    flex: 1, // takes remaining space
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { 
    fontWeight: "bold", 
    color: "#fff", 
    fontSize: 20 
  },
  message: { color: "#ffffffe8", fontSize: 15, maxWidth: "70%", marginTop: 5, },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  bottomSheet: { backgroundColor: "white", paddingVertical: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  menuItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  menuText: { fontSize: 18, color: "#333", textAlign: "center" },
  chatContainer:{
    flex: 1,
    justifyContent: "center",
  },
  timeAgo:{
    justifyContent: "flex-end",
    color: "#eeeeeec0",
    fontSize: 14,
    paddingRight: 20,
  },

});
