import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleNext = () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    router.push("registerPages/addImage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Your Account</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        textContentType="password"
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", 
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#bd513e",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    marginBottom: 20,
    textAlign: "left",
  },
  button: {
    backgroundColor: "#bd513e",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
