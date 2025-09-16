import React, { useContext, useEffect, useState } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DataContext } from "../DataContextProvider";
import { useNavigation } from "@react-navigation/native";
import { fetchMatchedUsers, unMatchUser } from "../../api";
import { db } from "../../fireBase";  
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function Chats() {
  const navigation = useNavigation();
  const { user } = useContext(DataContext);

  const [chats, setChats] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  // const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!user?.user_id) return;

  //   const q = query(
  //     collection(db, "chats"),
  //     where("users", "array-contains", user.user_id),
  //     orderBy("lastMessageTimestamp", "desc")
  //   );

  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const chatData = snapshot.docs.map((doc) => {
  //       const data = doc.data();
  //       const otherUser =
  //         data.usersData?.find((u) => u.userId !== user.user_id) || {
  //           userName: "Unknown",
  //           profile_image: "https://via.placeholder.com/50",
  //         };
  //       return {
  //         id: doc.id,
  //         lastMessage: data.lastMessage || "Say hi 👋",
  //         lastMessageTimestamp: data.lastMessageTimestamp || null,
  //         usersData: data.usersData,
  //         otherUser,
  //       };
  //     });
  //     setChats(chatData);
  //   });

  //   return () => unsubscribe();
  // }, [user.user_id]);

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
    }, [user.matched_user_id]);

  const renderItem = ({ item }) => (
    
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("ChatScreen", {
          name: item.userName,
          avatar: item.profile_image,
        })
      }
      onLongPress={() => {
        setSelectedUser(item.matched_user_id);
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

  // const renderItem = ({ item }) => {
  //   const otherUser = item.otherUser;

  //   return (
  //     <TouchableOpacity
  //       style={styles.chatItem}
  //       onPress={() =>
  //         navigation.navigate("ChatScreen", {
  //           chatId: item.id,
  //           otherUser,
  //         })
  //       }
  //       onLongPress={() => {
  //         setSelectedChat(item.id);
  //         setMenuVisible(true);
  //       }}
  //     >
  //       <Image source={{ uri: otherUser.profile_image }} style={styles.avatar} />
  //       <View style={styles.messageContainer}>
  //         <Text style={styles.name}>{otherUser.userName}</Text>
  //         <Text style={styles.message}>{item.lastMessage}</Text>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

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
            onPressOut={() => setMenuVisible(false)}
          >
            <View style={styles.bottomSheet}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  console.log("Unmatch chat:", selectedChat);
                  // אפשר להוסיף מחיקה מ-Firestore כאן
                }}
              >
                <Text style={styles.menuText}>Unmatch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  console.log("Report chat:", selectedChat);
                  // אפשר לקרוא ל-API דיווח כאן
                }}
              >
                <Text style={[styles.menuText, { color: "red" }]}>Report</Text>
              </TouchableOpacity>
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
