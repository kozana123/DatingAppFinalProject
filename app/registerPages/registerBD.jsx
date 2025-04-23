
import { Text, View, TouchableOpacity } from "react-native";
import { router } from 'expo-router';
import { useState } from "react";
import { ButtonGroup } from "@rneui/themed";
import DateTimePickerModal from 'react-native-modal-datetime-picker';


export default function RegisterBD() {
    const [birthDate, setBirthDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [gender, setGender] = useState(null);


    const genders = ["Other", "Female", "Male"];
  
    const handleNext = () => {
      if (birthDate && genderIndex !== null) {
        router.navigate("/registerPages/addImage");
      } else {
        alert("Please fill in all fields");
      }
    };
  
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
  
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
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 40 }}>
            Personal Deatails
        </Text>
  
        <Text style={{ fontSize: 22, marginBottom: 10 }}>Your Date Of Birth</Text>
  
        <TouchableOpacity
          onPress={showDatePicker}
          style={{
            borderWidth: 2,
            borderColor: "#bd513e",
            paddingVertical: 20,
            paddingHorizontal: 30,
            borderRadius: 10,
            marginBottom: 40,
            width: "90%",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "#333" }}>
            {birthDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
  
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
  
    <Text style={{ fontSize: 22, marginBottom: 20 }}>What's is your gender?</Text>
      <View style={{ width: "100%", alignItems: "center" }}>
        {genders.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setGender(item)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
              width: "90%",
              padding: 15,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: gender === item ? "#bd513e" : "#ccc",
              backgroundColor: gender === item ? "#ffe8e5" : "#fff",
            }}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: gender === item ? "#bd513e" : "#ccc",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 15,
              }}
            >
              {gender === item && (
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: "#bd513e",
                  }}
                />
              )}
            </View>
            <Text style={{ fontSize: 18 }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

        <TouchableOpacity
          onPress={() => router.push("/registerPages/registerSex")}
          style={{
            backgroundColor: "#bd513e",
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 10,
            marginTop: 30,
            width: "90%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
