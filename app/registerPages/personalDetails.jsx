import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import { ButtonGroup } from "@rneui/themed";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';  // הוספנו את ה-LinearGradient

export default function PersonalDetails() {
  const [birthDate, setBirthDate] = useState(new Date(1980, 0, 1)); // ינואר 1, 1980
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [genderIndex, setGenderIndex] = useState(null);

  const genders = ["🌈 Other", "👩 Female", "👨 Male"];

  const handleNext = () => {
    if (birthDate && genderIndex !== null) {
      router.navigate("/registerPages/registerPassEmail");
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
    <LinearGradient
      colors={["#F7F3F2", "#8A2C2A"]} // הרקע הצבעוני
      style={styles.container}
    >
      <Text style={styles.title}>Enter Your Details</Text>

      <View style={styles.section}>
        <Text style={styles.label}>
          Birth Date: {birthDate.toLocaleDateString()}
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
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Choose Your Gender:</Text>
        <ButtonGroup
          buttons={genders}
          selectedIndex={genderIndex}
          onPress={setGenderIndex}
          containerStyle={styles.genderGroup}
          buttonStyle={styles.genderButton}
          selectedButtonStyle={styles.selectedGenderButton}
          selectedTextStyle={{ fontWeight: "bold", color: "#fff" }}
        />
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}> Next</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#000", // הצבע של הכותרת יהיה שחור
  },
  section: {
    width: "100%",
    marginBottom: 70,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000", // קו בין החלקים
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#000", // הצבע של כל הלייבלים יהיה שחור
  },
  dateButton: {
    backgroundColor: "#f0dada",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 18,
    color: "#333", // צבע הטקסט בכפתור יהיה כהה
  },
  genderGroup: {
    marginVertical: 10,
    width: "100%",
    borderRadius: 12,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  selectedGenderButton: {
    backgroundColor: "#BD513E",
  },
  nextButton: {
    backgroundColor: "#BD513E",
    paddingVertical: 17,
    paddingHorizontal: 30,
    borderRadius: 20,
    elevation: 40,
    marginTop: 100, // שיניתי את הערך כדי להוריד את הכפתור למטה
  },
  nextButtonText: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
