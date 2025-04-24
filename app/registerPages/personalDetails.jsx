import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import { ButtonGroup } from "@rneui/themed";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function PersonalDetails() {
  const [birthDate, setBirthDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [genderIndex, setGenderIndex] = useState(null);

  const genders = ["🌈 Other", "👩 Female", "👨 Male"];

  const handleNext = () => {
    if (birthDate && genderIndex !== null) {
      router.navigate("/registerPages/addImage");
    } else {
      alert("🛑 Please fill in all fields");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setBirthDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Personal Details</Text>

      <Text style={styles.label}>
        🎂 Birth Date: {birthDate.toLocaleDateString()}
      </Text>

      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.dateButtonText}>📅 Select Birth Date</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />



      <Text style={styles.label}>⚧️ Choose Your Gender:</Text>
      <ButtonGroup
        buttons={genders}
        selectedIndex={genderIndex}
        onPress={setGenderIndex}
        containerStyle={styles.genderGroup}
        buttonStyle={styles.genderButton}
        selectedButtonStyle={styles.selectedGenderButton}
        selectedTextStyle={{ fontWeight: "bold", color: "#fff" }}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>➡️ Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9f4",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#f0dada",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  genderGroup: {
    marginVertical: 20,
    width: "90%",
    borderRadius: 12,
  },
  genderButton: {
    paddingVertical: 8,
  },
  selectedGenderButton: {
    backgroundColor: "#BD513E",
  },
  nextButton: {
    backgroundColor: "#BD513E",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 4,
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
