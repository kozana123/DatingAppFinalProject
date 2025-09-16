import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Settings() {
  const settingsOptions = [
    { id: "1", title: "Email address", page: "/settings/EmailAddress" },
    { id: "2", title: "Change password", page: "/settings/ChangePassword" },
    { id: "3", title: "Delete account", page: "/settings/DeleteAccount" },
    { id: "4", title: "Sign out", page: "/" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.option} onPress={() => router.push(item.page)}>
      <Text style={styles.optionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffffff" />
        </TouchableOpacity>
      </View>

      {/* Options List */}
      <FlatList
        style={styles.flatlist}
        data={settingsOptions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
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
  option: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)", // subtle contrast
  },
  optionText: {
    fontSize: 16,
    color: "#CBF7FF", // highlight (10%)
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#cbf7ffff", // light divider
  },
  flatlist:{
    paddingTop: 25,
  }
});