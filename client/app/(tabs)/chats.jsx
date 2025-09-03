import React from "react";
import { useContext , useEffect, useState} from "react";
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
const { width } = Dimensions.get("window");
import { fetchMatchedUsers, unMatchUser } from "../../api";

export default function Chats() {

  const navigation = useNavigation();
  const { user } = useContext(DataContext);
  // const matches = fetchMatchedUsers(user.userId)

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const result = await fetchMatchedUsers(user.user_id);
        setMatches(result || []);
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
    }}

  >
    <Image source={{ uri: item.profile_image }} style={styles.avatar} />
    <View style={styles.messageContainer}>
      <Text style={styles.name}>{item.userName}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
    {item.unread && <View style={styles.unreadDot} />}
    {/* {item.favorite && <Text style={styles.favorite}>★</Text>} */}
  </TouchableOpacity>
  
  );

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
            onPressOut={() => setMenuVisible(false)} // close when tap outside
          >
            <View style={styles.bottomSheet}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  console.log("Unmatch:", selectedUser);
                  unMatchUser( user.user_id,selectedUser)
                }}
              >
                <Text style={styles.menuText}>Unmatch</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  console.log("Report:", selectedUser);
                  // TODO: call report API
                }}
              >
                <Text style={[styles.menuText, { color: "red" }]}>Report</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.header}>
          <Text style={styles.headerText}>Chat</Text>
        <Image
          source={{ uri: user.profile_image }}
          style={styles.avatar}
        />
                 
        </View>
        <View style={styles.separator} />

        <FlatList
          data={matches}
          renderItem={renderItem}
          keyExtractor={(item) => item.matched_user_id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
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
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 9 },
    width: width -12,
    alignSelf: "center",
    position: "relative",
    zIndex: 1,

    marginBottom: 10, 
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  message: {
    color: "#eee",
    fontSize: 14,
  },
  unreadDot: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
    marginLeft: 10,
  },
  favorite: {
    color: "#66ccff",
    fontSize: 16,
    marginLeft: 10,
  },
  activeNav: {
    color: "#DA58B7",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "white",
    paddingVertical: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
});
