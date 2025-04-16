import { Text, View , Button} from "react-native";
import { router, Link } from 'expo-router';


export default function PersonalDetails() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Personal Details</Text>
      <Button title="Next" onPress={() => router.navigate("/registerPages/addImage")}/>
    </View>
  );
}