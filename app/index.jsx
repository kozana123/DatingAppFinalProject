import { Text, View, Button} from "react-native";
import { router, Link } from 'expo-router';

export default function Index() {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome page</Text>

      <Button title="Register" onPress={() => router.navigate("/registerPages/emailAndPassword")}/>
      <Button title="Sign In" onPress={() => router.navigate("/login")}/>

    </View>
  );
}
