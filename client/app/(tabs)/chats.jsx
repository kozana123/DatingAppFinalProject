import React from "react";
import { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DataContext } from "../DataContextProvider";
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get("window");

const messages = [
  {
    id: "1",
    name: "Anika",
    message: "Oh i don't like fish 🙈",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    unread: true,
  },
  {
    id: "2",
    name: "Shreya",
    message: "Can we go somewhere?",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    unread: true,
  },
  {
    id: "3",
    name: "Lilly",
    message: "You: If I were a stop light, I’d turn",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    unread: false,
  },
  {
    id: "4",
    name: "Mona",
    message: "See you soon 😉",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    unread: false,
  },
  {
    id: "5",
    name: "Sonia",
    message: "Are you serious?!",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    unread: true,
  },
  {
    id: "6",
    name: "Monika",
    message: "You: How about a movie and then...",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    favorite: true,
  },
  {
    id: "7",
    name: "Katrina",
    message: "OK",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: "8",
    name: "Kiran",
    message: "You: How are you?)",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
];

export default function Chats() {
  const navigation = useNavigation();

  const { user } = useContext(DataContext);
  const renderItem = ({ item }) => (
    <TouchableOpacity
    style={styles.chatItem}
    onPress={() =>
      navigation.navigate("ChatScreen", {
        name: item.name,
        avatar: item.avatar,
      })
    }
  >
    <Image source={{ uri: item.avatar }} style={styles.avatar} />
    <View style={styles.messageContainer}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
    {item.unread && <View style={styles.unreadDot} />}
    {item.favorite && <Text style={styles.favorite}>★</Text>}
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
        <View style={styles.header}>
          <Text style={styles.headerText}>Chat</Text>
         <Image
                   source={
                     user && user.profileImage
                       ? { uri: user.profileImage }
                       : {
                           uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                         }
                   }
                   style={styles.avatar}
                  />
                 
        </View>
        <View style={styles.separator} />

        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

        <View style={styles.navBar}>
          <TouchableOpacity>
            <Text style={styles.navIcon}>🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navIcon}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.navIcon, styles.activeNav]}>👤</Text>
          </TouchableOpacity>
        </View>
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
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  navIcon: {
    fontSize: 24,
    color: "#fff",
  },
  activeNav: {
    color: "#DA58B7",
  },
});
