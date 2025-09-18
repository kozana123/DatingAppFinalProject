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
  TextInput
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DataContext } from "../DataContextProvider";
import { useNavigation } from "@react-navigation/native";
import { fetchMatchedUsers, unMatchUser, addReport  } from "../../api";
import { deleteChat} from "../../fireBase";  
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


  // const [matches, setMatches] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loadMatches = async () => {
        try {
          const result = await fetchMatchedUsers(user.user_id);
          setChats(result || []);
          
        } catch (error) {
          console.error("Failed to fetch matches:", error);
        } finally {
          setLoading(false);
        }
      };

      loadMatches();
    }, [user.matched_user_id, isFocused]);


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
        <Text style={styles.name}>{item.userName}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
      {/* {item.favorite && <Text style={styles.favorite}>★</Text>} */}
    </TouchableOpacity>
  );

  const onUnmatch = (unMatchId, chatId) =>{
    console.log(unMatchId, chatId);
    unMatchUser(user.user_id, unMatchId);
    deleteChat(chatId)

    setChats((prevChats) =>
      prevChats.filter((c) => c.matched_user_id !== unMatchId)
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
      <LinearGradient
        colors={["rgba(106,13,173,0.7)", "rgba(209,71,163,0.7)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientOverlay}
      >
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
                    { backgroundColor: "#6200ee", borderRadius: 8 },
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

        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
          <Image source={{ uri: user.profile_image }} style={styles.avatar} />
        </View>

        <View style={styles.separator} />

        {chats.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 16 }}>No chats yet 😢</Text>
          </View>
        ) : (
          <FlatList
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item) => item.matched_user_id}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  gradientOverlay: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  separator: { backgroundColor: "#ffffff33", marginVertical: 8, height: 4 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    width: width - 12,
    alignSelf: "center",
  },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  chatItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomColor: "rgba(255,255,255,0.1)", borderBottomWidth: 1 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  messageContainer: { flex: 1 },
  name: { fontWeight: "bold", color: "#fff", fontSize: 16 },
  message: { color: "#eee", fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  bottomSheet: { backgroundColor: "white", paddingVertical: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  menuItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  menuText: { fontSize: 18, color: "#333", textAlign: "center" },
});
