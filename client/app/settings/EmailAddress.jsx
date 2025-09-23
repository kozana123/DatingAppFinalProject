import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { DataContext } from "../DataContextProvider";

export default function EmailAddress() {
  const { user, setUser } = useContext(DataContext);
  const [email, setEmail] = useState(user.userEmail);


  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Explanation Text */}
      <View style={styles.centeredContent}>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Email Address</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#FF6868" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
            />
          </View>
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#19607E",
    paddingHorizontal: 16,
    paddingTop: 100,
    // justifyContent: "center",
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
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
});
