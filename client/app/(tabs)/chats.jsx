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
import { db } from "../fireBase";  
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function Chats() {
  const navigation = useNavigation();
  const { user } = useContext(DataContext);

  const [chats, setChats] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!user?.user_id) return;

    // מאזין לכל הצ’אטים שבהם המשתמש הנוכחי שותף
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", user.user_id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatData);
    });

    return () => unsubscribe();
  }, [user.user_id]);

  const renderItem = ({ item }) => {
    // למצוא את הצד השני של הצ'אט (לא המשתמש הנוכחי)
    const otherUser = item.usersData?.find((u) => u.userId !== user.user_id);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate("ChatScreen", {
            chatId: item.id,
            otherUser,
          })
        }
        onLongPress={() => {
          setSelectedChat(item.id);
          setMenuVisible(true);
        }}
      >
        <Image source={{ uri: otherUser?.profile_image }} style={styles.avatar} />
        <View style={styles.messageContainer}>
          <Text style={styles.name}>{otherUser?.userName}</Text>
          <Text style={styles.message}>
            {item.lastMessage || "Say hi 👋"}
          </Text>
        </View>
      </TouchableOpacity>
    );
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
                  // כאן אפשר להוסיף מחיקה מ-Firestore אם רוצים
                }}
              >
                <Text style={styles.menuText}>Unmatch</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  console.log("Report chat:", selectedChat);
                  // TODO: קריאה ל־API דיווח
                }}
              >
                <Text style={[styles.menuText, { color: "red" }]}>Report</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* כותרת */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
          <Image source={{ uri: user.profile_image }} style={styles.avatar} />
        </View>

        <View style={styles.separator} />

        {/* רשימת צ'אטים */}
        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  gradientOverlay: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  separator: {
    backgroundColor: "#ffffff33",
    marginVertical: 8,
    height: 4,
  },
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
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 1,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  messageContainer: { flex: 1 },
  name: { fontWeight: "bold", color: "#fff", fontSize: 16 },
  message: { color: "#eee", fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  bottomSheet: {
    backgroundColor: "white",
    paddingVertical: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { fontSize: 18, color: "#333", textAlign: "center" },
});
