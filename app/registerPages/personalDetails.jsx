import { Text, View, Button } from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import { ButtonGroup } from "@rneui/themed";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function PersonalDetails() {
  const [birthDate, setBirthDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [genderIndex, setGenderIndex] = useState(null);

  const genders = ["Other", "Female", "Male"];

  const handleNext = () => {
    if (birthDate && genderIndex !== null) {
      router.navigate("/registerPages/addImage");
    } else {
      alert("Please fill in all fields");
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 30 }}>Personal Details</Text>

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Birth Date: {birthDate.toLocaleDateString()}
      </Text>

      <Button title="Select Birth Date" onPress={showDatePicker} />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Text style={{ marginTop: 50, fontSize: 18 }}>Choose Your Gender:</Text>
      <ButtonGroup
        buttons={genders}
        selectedIndex={genderIndex}
        onPress={setGenderIndex}
        containerStyle={{ marginVertical: 20, width: "90%" }}
      />

      <Button title="Next" onPress={handleNext} color="#BD513E" />
    </View>
  );
}