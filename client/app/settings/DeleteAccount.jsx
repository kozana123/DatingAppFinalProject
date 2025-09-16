import React, { useState, useEffect, useContext } from "react";
import {View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { deleteUserById } from "../../api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


export default function DeleteAccount() {

    const onDeletedUser = () => {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete this account?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              console.log("delete this account");
              // const deleted = deleteUserById(user.user_id)
              // if(deleted){
              //   router.navigate("/")
              // }   
            },
          },
        ],
        { cancelable: false }
      );
      
    }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delete account</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.btnView}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={onDeletedUser}
        >
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
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
  btnView:{
    elevation: 10,            // Android shadow
    borderRadius: 10,         // match button radius
    backgroundColor: "#ff0000", // button color
    overflow: "hidden",
    marginTop: 40,  
    marginHorizontal: 20,     // ensures ripple stays inside
  },
  deleteBtn: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffffff",
    letterSpacing: 1,
  },

});
