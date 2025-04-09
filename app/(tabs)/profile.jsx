import { View, Text, Button } from 'react-native';


export default function Main(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      >
        <Text>Profile</Text>
        <Button title="Edit" onPress={() => router.navigate("/(tabs)/main")}/>
      </View>
  )
}