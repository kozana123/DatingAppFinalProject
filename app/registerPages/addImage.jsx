import { Text, View, Button, StyleSheet } from "react-native";
import { router, Link } from 'expo-router';


export default function AddImage() {


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'videos'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };



  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Dating Preference</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Image source={{ uri: image }} style={styles.image} />

      <Button title="Next" onPress={() => router.navigate("/registerPages/location")}/>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 200,
      height: 200,
    },
  });