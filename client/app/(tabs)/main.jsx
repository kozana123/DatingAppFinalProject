import { useContext, useState, useEffect, useCallback  } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { DataContext } from "../DataContextProvider";
import { Avatar } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import {CallEndAlert} from "../comp/CustomAlerts";


const { width } = Dimensions.get("window");

export default function Main() {

  const params = useLocalSearchParams();
  const { user } = useContext(DataContext);

  const route = useRoute();
  const [showEndAlert, setShowEndAlert] = useState(false);
  const [typeOfAlart, setTypeOfAlart] = useState(0);

  // const userInitial = user?.userName?.charAt(0).toUpperCase() || "F";

  const alarts = [
    {
      title: "Call Ended",
      message: "The other person has left the call, but new connections are just around the corner 💙"
    },
    {
      title: "Didn't Felt The Same",
      message: "Sometimes the spark just isn’t there, but don’t worry — your special connection is waiting for you ✨"
    },
    {
      title: "Its A Match!",
      message: "You both liked each other! Start chatting and see where it goes 💘"
    }
  ]

  useFocusEffect(
    useCallback(() => {

      if (params?.reason !== undefined) {
        setShowEndAlert(true);
        setTypeOfAlart(params.reason);
        params.reason = undefined
      }
    }, [route.params]) // only recreate the function if route.params changes
  );

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
        <Avatar size={70} rounded source={{ uri: user.profile_image }} />
        <View style={styles.onlineDot} />
      </View>

      {/* כותרת עליונה */}
      <View style={styles.header}>
        <Text style={styles.greet}>Hey {user?.userName || "Friend"} 👋</Text>
        <Text style={styles.subtitle}>Ready to make a connection?</Text>
      </View>

      {/* כרטיסיה עם גרדיאנט */}
      <LinearGradient
        colors={["#19607E", "#28313F", "#19607E"]} // ערבוב צבעים: אפור כהה, אדום, כחול
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Image
              source={require("../../assets/images/icon_camera.png")}
              style={{ width: 80, height: 80, tintColor: "#CBF7FF" }} // כאן הצבע
              resizeMode="contain"
            />
          </View>

          <Text style={styles.cardTitle}>Start Live Video Chat</Text>
          <Text style={styles.cardText}>
            Connect instantly with someone new and make meaningful connections
            through video
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              router.push("/videoCall")
            }}
          >
            <Text style={styles.btnText}>Find Someone Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <CallEndAlert
        visible={showEndAlert}
        onClose={() => setShowEndAlert(false)}
        title={alarts[typeOfAlart].title}
        message={alarts[typeOfAlart].message}
      />
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
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
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
    color: "#CBF7FF",
    fontFamily: "Prompt-Thin",
  },
  subtitle: {
    fontSize: 18,
    color: "#FF6868",
    marginTop: 6,
  },
  cardGradient: {
    borderRadius: 24,
    width: width * 0.85,
    alignItems: "center",
    shadowColor: "#19607E",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 40,
  },
  card: {
    width: "100%",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#CBF7FF",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Prompt-Thin",
  },
  cardText: {
    fontSize: 13,
    color: "#CBF7FF",
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
});
