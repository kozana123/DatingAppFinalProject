import { View, Text, Image, StyleSheet } from "react-native";
import { useContext } from "react";
import { DataContext } from "../DataContextProvider";

import { Users } from "react-feather";

export default function Welcome() {
  const { userDetails } = useContext(DataContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {users.name}!</Text>
      {userDetails.image && (
        <Image source={{ uri: userImg.image }} style={styles.image} />
      )}
      <Text style={styles.subText}>We're happy to have you. Let's get started!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3F2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#8A2C2A",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  subText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
});
