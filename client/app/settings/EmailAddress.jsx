
import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { DataContext } from "../DataContextProvider";


export default function EmailAddress() {

  const { user, } = useContext(DataContext);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Email address</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputPlace}>
        <TextInput
          style={[styles.input, { color: "#000000a9" }]}
          value={user.userEmail}
          editable={false}
        />
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#19607E", // dominant background
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6868", // accent header (30%)
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 15,
    padding: 5,
  },
  inputPlace:{
    paddingTop: 40,
  },
  input: {
    backgroundColor: "#ffffffff",
    padding: 18,
    marginBottom: 12,
    textAlign: "left",
    direction: "ltr",
    fontFamily: "Prompt-Thin",
    fontSize: 16,
    fontWeight: "bold",
  },
});
