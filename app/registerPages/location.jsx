import { Text, View, Button } from "react-native";
import { router, Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';


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
      
      <Button title="Next" onPress={() => router.navigate("/registerPages/datingPreference")}/>

    </View>
  );
}

