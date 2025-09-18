import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Switch } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Settings() {
  const [toggleStates, setToggleStates] = useState({
    push_notifications: true,
    email_updates: false,
    match_alerts: true,
  });

  const handleToggle = (key, value) => {
    setToggleStates((prev) => ({ ...prev, [key]: value }));
  };

  const settingsSections = [
    {
      id: "1",
      title: "Account",
      icon: "person",
      items: [
        { id: "1-1", label: "Edit Profile", page: "/settings/EditProfile" },
        { id: "1-2", label: "Privacy Settings", page: "/settings/PrivacySettings" },
        { id: "1-3", label: "Verification", page: "/settings/Verification" },
      ],
    },
    {
      id: "2",
      title: "Notifications",
      icon: "notifications",
      items: [
        { id: "2-1", label: "Push Notifications", toggleKey: "push_notifications" },
        { id: "2-2", label: "Email Updates", toggleKey: "email_updates" },
        { id: "2-3", label: "Match Alerts", toggleKey: "match_alerts" },
      ],
    },
    {
      id: "3",
      title: "Dating Preferences",
      icon: "heart",
      items: [
        { id: "3-1", label: "Discovery Settings", page: "/settings/Discovery" },
        { id: "3-2", label: "Age Range", page: "/settings/AgeRange" },
        { id: "3-3", label: "Distance", page: "/settings/Distance" },
      ],
    },
    {
      id: "4",
      title: "Safety & Security",
      icon: "shield",
      items: [
        { id: "4-1", label: "Block & Report", page: "/settings/BlockReport" },
        { id: "4-2", label: "Safety Center", page: "/settings/SafetyCenter" },
        { id: "4-3", label: "Data & Privacy", page: "/settings/DataPrivacy" },
      ],
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => item.page && router.push(item.page)}
      activeOpacity={0.7}
    >
      <Text style={styles.optionText}>{item.label}</Text>
      {item.toggleKey && (
        <Switch
          value={toggleStates[item.toggleKey]}
          onValueChange={(val) => handleToggle(item.toggleKey, val)}
          thumbColor={toggleStates[item.toggleKey] ? "#FF6868" : "#ccc"}
          trackColor={{ false: "#555", true: "#FFB3B3" }}
        />
      )}
      {!item.toggleKey && item.page && (
        <Ionicons name="chevron-forward" size={20} color="#CBF7FF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={settingsSections}
        keyExtractor={(section) => section.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item: section }) => (
          <View style={styles.sectionCard}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <MaterialIcons name={section.icon} size={20} color="#fff" />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            {/* Section Items */}
            <FlatList
              data={section.items}
              keyExtractor={(i) => i.id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        )}
        ListFooterComponent={
          <View style={{ marginTop: 20 }}>
            {/* Help & Sign Out */}
            <TouchableOpacity style={styles.option}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="help-outline" size={20} color="#00BFFF" />
                <Text style={[styles.optionText, { marginLeft: 10 }]}>Help & Support</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.option} onPress={() => router.push("/")}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="logout" size={20} color="#FF6868" />
                <Text style={[styles.optionText, { color: "#FF6868", marginLeft: 10 }]}>
                  Sign Out
                </Text>
              </View>
            </TouchableOpacity>

           
           
          </View>
        }
      />
    </View>
  );
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
    backgroundColor: "#FF6868",
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
  sectionCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FF6868",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#CBF7FF",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#CBF7FF",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
  },
});
