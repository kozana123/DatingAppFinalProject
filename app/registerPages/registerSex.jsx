
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
        padding: 15, // קטן את המרווח הכללי
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
        Sexual Preference
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 15 }}>
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
              marginBottom: 10, // הקטנת המרווח בין הפריטים
              width: "80%", // הקטנתי את רוחב הכפתור
              padding: 12, // הקטנתי את הפדינג
              borderRadius: 8, // הקטנתי את הרדיוס
              borderWidth: 2,
              borderColor: preference === item ? "#bd513e" : "#ccc",
              backgroundColor: preference === item ? "#ffe8e5" : "#fff",
            }}
          >
            <View
              style={{
                height: 18,
                width: 18,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: preference === item ? "#bd513e" : "#ccc",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {preference === item && (
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    backgroundColor: "#bd513e",
                  }}
                />
              )}
            </View>
            <Text style={{ fontSize: 16 }}>{item}</Text> {/* הקטנתי את גודל הטקסט */}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleNext}
        style={{
          backgroundColor: "#bd513e",
          paddingVertical: 12,
          paddingHorizontal: 35,
          borderRadius: 8,
          marginTop: 25,
          width: "80%", // הקטנתי את רוחב הכפתור
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Next</Text> {/* הקטנתי את גודל הטקסט */}
      </TouchableOpacity>
    </View>

  );
}