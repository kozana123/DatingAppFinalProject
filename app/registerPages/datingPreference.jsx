import { Text, View, Button } from "react-native";
import { router, Link } from 'expo-router';


export default function DatingPreference() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Dating Preference</Text>
      <Button title="Next" onPress={() => router.navigate("/registerPages/datingPreference")}/>

    </View>
  );
}