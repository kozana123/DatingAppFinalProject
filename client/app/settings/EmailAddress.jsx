import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { DataContext } from "../DataContextProvider";

export default function EmailAddress() {
  const { user, setUser } = useContext(DataContext);
  const [email, setEmail] = useState(user.userEmail);

  const handleSave = () => {
    setUser({ ...user, userEmail: email });
    Alert.alert("Success", "Email address saved!");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Explanation Text */}
      <View style={styles.centeredContent}>
        <Text style={styles.title}>Change Email Address</Text>
        <Text style={styles.description}>
          Update your email address below. This will be used for logging in and account notifications.
        </Text>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#FF6868" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          
        </View>
        
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#19607E",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 40,
    padding: 5,
  },
  centeredContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#CBF7FF",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: "Prompt-Thin"
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: "Prompt-Thin",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#FF6868",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 36,
    marginBottom: 12,
    alignItems: "center",

    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
