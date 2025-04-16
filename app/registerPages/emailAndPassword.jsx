import { Text, View, Dimensions } from "react-native";
import { router, Link } from 'expo-router';
import { Input, Button } from '@rneui/themed';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DetailsInput = (name, value) => {

  if(name === "email"){
  setConnection({...connection , email: value})
  }
  else if(name === "password"){
    setConnection({...connection , password: value})
  }
}

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
          onChangeText={(text) => DetailsInput("email", text)}
        />
        
        <Input 
          placeholder='Password'
          secureTextEntry={true}
          errorStyle={{ color: 'red' }}
          errorMessage=''
          onChangeText={(text) => DetailsInput("email", text)}
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
