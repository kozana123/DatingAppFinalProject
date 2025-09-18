import { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { DataContext } from "../DataContextProvider";
import { Avatar } from "@rneui/themed";

const { width } = Dimensions.get("window");

export default function VideoCallStartScreen() {
  const { user } = useContext(DataContext);
  const userInitial = user?.userName?.charAt(0).toUpperCase() || "F";

  return (
    <ImageBackground
      source={require("../../assets/images/design.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* לוגו קטן שמאל עליון */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/AppLogo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        
      </View>

      {/* עיגול מצב בפינה הימנית עליונה */}
      <View style={styles.statusCircle}>
        <Avatar
          size={50}
          rounded
          source={{ uri: user.profile_image }}
        >
        </Avatar>
        <View style={styles.onlineDot} />
      </View>

      {/* כותרת עליונה */}
      <View style={styles.header}>
        <Text style={styles.greet}>
          Hey {user?.userName || "Friend"} 👋
        </Text>
        <Text style={styles.subtitle}>
          Ready to make a connection?
        </Text>
      </View>

      {/* כרטיס מרכזי */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Image
            source={require("../../assets/images/icon_camera.png")}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.cardTitle}>Start Live Video Chat</Text>
        <Text style={styles.cardText}>
          Connect instantly with someone new and make meaningful connections through video
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/videoCall")}
        >
          <Text style={styles.btnText}>Find Someone Now</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#19607E",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  logoContainer: {
    position: "absolute",
    top: 20,      
    left: 20,
    width: 45,     
    height: 45,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  statusCircle: {
    position: "absolute",
    top: 50,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  statusInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: "#19607E",
  },
  onlineDot: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  header: {
    alignSelf: "flex-start",
    marginBottom: 40,
    paddingLeft: 30,
    
  },
  greet: {
    fontSize: 26,
    // fontWeight: "700",
    color: "#CBF7FF",
    fontFamily: "Prompt-Thin"
  },
  subtitle: {
    fontSize: 18,
    color: "#FF6868",
    marginTop: 6,
    
  },
  card: {
    backgroundColor: "#CBF7FF",
    borderRadius: 24,
    width: width * 0.85,
    padding: 24,
    alignItems: "center",
    shadowColor: "#19607E",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
  },
  iconCircle: {
    borderRadius: 60,
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000ff",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Prompt-Thin"
  },
  cardText: {
    fontSize: 13,
    color: "#000000ff",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
    
  },
  primaryBtn: {
    backgroundColor: "#FF6868",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 36,
    marginBottom: 12,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  onlineText: {
    fontSize: 13,
    color: "#19607E",
  },
});
