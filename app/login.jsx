import { Text, View, Button} from "react-native";
import { router, Link } from 'expo-router';
import { Input } from '@rneui/themed';

export default function Login() {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Login page</Text>

      <Button title="Sign In" onPress={() => router.navigate("/(tabs)/main")}/>
    </View>
  );
}