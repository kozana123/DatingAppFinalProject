import { Text, View, Dimensions } from "react-native";
import { router, Link } from 'expo-router';
import { Input } from '@rneui/themed';
import { Button } from '@rneui/themed';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


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
      <View style={{width: windowWidth * 0.8,}}>
        
        <Input 
          placeholder='Email'
          errorStyle={{ color: 'red' }}
          errorMessage=''
        />
        
        <Input 
          placeholder='Password'
          secureTextEntry={true}
          errorStyle={{ color: 'red' }}
          errorMessage=''
        />
      </View>
      <Button
        title="Next"
        buttonStyle={{
          backgroundColor: 'rgb(189, 81, 62)',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 30,
        }}
        containerStyle={{
          width: 100,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        titleStyle={{ fontWeight: 'bold' }}
        onPress={() => router.navigate("/registerPages/personalDetails")}
      />
    
    </View>
  );
}
