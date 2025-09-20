import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable  } from "react-native";
export default {MatchAlert, CallEndAlert };

export const MatchAlert = ({ visible, onClose, onYes, onNo }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Match?</Text>
          <Text style={styles.message}>
            The other person liked you. Do you like them too?
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.noButton} onPress={onNo}>
              <Text style={styles.Text}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.yesButton} onPress={onYes}>
              <Text style={styles.Text}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const CallEndAlert  = ({ visible, onClose, title, message }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.noButton} onPress={onClose}>
            <Text style={styles.Text}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "#CBF7FF",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#19607E",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#19607E",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  noButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#19607E",
    borderRadius: 10,
    paddingVertical: 10,
  },
  yesButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#FF6868",
    borderRadius: 10,
    paddingVertical: 10,
  },
  Text: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
