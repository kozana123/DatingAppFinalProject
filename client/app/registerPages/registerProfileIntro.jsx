import { View, Text, Image, Button , StyleSheet } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
export default function ProfileIntro({ navigation }) {
  return (
<LinearGradient
  colors={["#F7F3F2", "#8A2C2A"]}
  style={styles.container}>
      <Text style={styles.header}>Complete your profile by answering a few simple questions about yourself.</Text>
      <Text style={styles.subheader}>Create a profile that will increase your chances of finding your dream partner.</Text>

      {/* <Image
        source={require("../assets/couple.png")} // שים כאן את האיור שלך
        style={{ width: 200, height: 200, marginVertical: 30 }}
        resizeMode="contain"
      /> */}

      <View style={styles.button}>
        <Button title="Let's Do It" color="#000" onPress={() => router.navigate("/registerPages/registerPickInterests")} />
      </View>
</LinearGradient>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#b95b5b",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    header: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
      marginBottom: 30,
    },
    subheader: {
      fontSize: 17,
      color: "#ddd",
      textAlign: "center",
      marginBottom: 20,
    },
    button: {
      marginTop: 20,
      width: "80%",
      borderRadius: 30,
      overflow: "hidden",
      backgroundColor: "#f2ebeb",
     
    },
  });