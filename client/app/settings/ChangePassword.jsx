import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { DataContext } from "../DataContextProvider";
import SHA256 from "crypto-js/sha256";
import { changeUserPassword } from "../../api";

export default function ChangePassword() {
  const { user } = useContext(DataContext);

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const checkChangingPass = () => {
    const hashedPassword = SHA256(oldPassword).toString();

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    if (hashedPassword === user.user_password && password === confirmPassword) {
      changeUserPassword(user.user_id, hashedPassword)
      Alert.alert("Success", "Password changed successfully!");
    } else {
      Alert.alert("Error", "Passwords do not match or old password is incorrect.");
    }
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
        <Text style={styles.cardTitle}>Update Your Password</Text>
        <Text style={styles.cardSubtitle}>
          Enter your current password and choose a new one to update your account credentials.
        </Text>

        <TextInput
          placeholder="Current password"
          placeholderTextColor="#555"
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="New password"
          placeholderTextColor="#555"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm new password"
          placeholderTextColor="#555"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

   
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={checkChangingPass}>
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
    padding: 20,
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
    marginBottom: 20,
    fontFamily: "Prompt-Thin"
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: "Prompt-Thin"
  },
  saveButton: {
    backgroundColor: "#FF6868",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 36,
    marginBottom: 12,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
