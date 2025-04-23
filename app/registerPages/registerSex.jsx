import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function SexualPreferences() {
  const [preference, setPreference] = useState(null);

  const preferences = [
    "Straight (Heterosexual)",
    "Gay",
    "Lesbian",
    "Bisexual",
    "Pansexual",
    "Asexual",
    "Queer",
    "Questioning",
    "Other"
  ];

  const handleNext = () => {
    if (preference !== null) {
      router.navigate("/registerPages/registerIntrest");
    } else {
      alert("Please select your sexual preference");
    }
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
        Sexual Preference
      </Text>

      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        How do you identify?
      </Text>

      <View style={{ width: "100%", alignItems: "center" }}>
        {preferences.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setPreference(item)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
              width: "90%",
              padding: 15,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: preference === item ? "#bd513e" : "#ccc",
              backgroundColor: preference === item ? "#ffe8e5" : "#fff",
            }}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: preference === item ? "#bd513e" : "#ccc",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 15,
              }}
            >
              {preference === item && (
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
        onPress={handleNext}
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
