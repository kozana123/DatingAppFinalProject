import { Text, View, Button } from "react-native";
import { router, Link } from 'expo-router';


export default function EmailAndPassword() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Email and password</Text>
      <Button title="Next" onPress={() => router.navigate("/registerPages/personalDetails")}/>
    </View>
  );
}
