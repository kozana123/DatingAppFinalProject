import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function DeleteAccount() {

  const onDeletedUser = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account? This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: () => {
            console.log("delete this account");
            // const deleted = deleteUserById(user.user_id)
            // if(deleted){ router.push("/"); }
          }
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
    
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Remove Your Account</Text>
        <Text style={styles.cardSubtitle}>
          Deleting your account will remove all your data permanently. Make sure you really want to proceed.
        </Text>

       
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={onDeletedUser}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#19607E",
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#19607E",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#CBF7FF",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 15,
    padding: 5,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#CBF7FF",
    textAlign: "center",
        fontFamily: "Prompt-Thin",
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "#FF6868",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
