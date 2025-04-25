import { Text, View, Button } from "react-native";
import { router, Link } from 'expo-router';



export default function Location() {


  


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Location page</Text>
      
      <Button title="Next" onPress={() => router.navigate("/registerPages/registerIntrest")}/>

    </View>
  );
}

