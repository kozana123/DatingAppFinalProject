import React, { useState, useEffect, useContext } from "react";
import {View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { DataContext } from "../DataContextProvider";
import SHA256 from "crypto-js/sha256";



export default function ChangePassword() {

	const { user, } = useContext(DataContext);

	const [oldPassword, setOldPassword] = useState("");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");


	const checkChangingPass = () =>{
		const hashedPassword = SHA256(oldPassword).toString();

		if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

		if(hashedPassword == user.user_password && password == confirmPassword){
			console.log("changed Password");
			
		}
		else{
				alert("Passwords do not match or password not correct.");
				console.log(hashedPassword + " " + user.user_password);
				
      	return;
		}
	}
	  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Change password</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffffff" />
        </TouchableOpacity>
      </View>
			<View style={styles.inputPlace}>
				<TextInput
					placeholder="Your password"
					placeholderTextColor="#000000ff"
					style={styles.input}
					onChangeText={(password) =>
						setOldPassword(password)
					}
					secureTextEntry
					autoCapitalize="none"
					textContentType="newPassword"
				/>
			</View>

			<View style={styles.inputPlace}>
				<TextInput
				placeholder="New password"
				placeholderTextColor="#000000ff"
				style={styles.input}
				onChangeText={(password) =>
					setPassword(password)
				}
				secureTextEntry
				autoCapitalize="none"
				textContentType="newPassword"
				/>

				<TextInput
					placeholder="Confirm password"
					placeholderTextColor="#000000ff"
					style={styles.input}
					onChangeText={setConfirmPassword}
					secureTextEntry
					autoCapitalize="none"
					textContentType="password"
				/>
			</View>

			<TouchableOpacity
					style={styles.signInButton}
					activeOpacity={0.85}
					onPress={checkChangingPass}
				>
					<Text style={styles.signInText}>Save</Text>
				</TouchableOpacity>

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
  },
	signInButton: {
    backgroundColor: "#FF6868", // accent (30%)
    height: 50,
    borderRadius: 20,
		marginTop: 30,
		marginHorizontal: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: "Prompt-SemiBold",
    letterSpacing: 1,
  },

});
