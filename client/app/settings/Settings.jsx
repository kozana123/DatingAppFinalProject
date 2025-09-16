import React, { useState, useEffect, useContext } from "react";
import {View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


export default function Settings() {

  const settingsOptions = [
    { id: "1", title: "Email address" },
    { id: "2", title: "Change password" },
    { id: "3", title: "Delete account" },
    { id: "4", title: "Sign out" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.option} onPress={() => router.push("/settings/Settings")}>
    <Text style={styles.optionText}>{item.title}</Text>
    </TouchableOpacity>
  );      

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Options List */}
      <FlatList
        data={settingsOptions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#19607E",
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    backgroundColor: "#FF6868",
    borderBottomColor: "#FF6868",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 15,
  },
  option: {
    padding: 16,
  },
  optionText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },

});
