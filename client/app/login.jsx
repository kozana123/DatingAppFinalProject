import { Text, View, Pressable, Dimensions } from "react-native";
import { router, Link } from 'expo-router';
import { Input, Button, Icon,  } from '@rneui/themed';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';



export default function Login() {

  const [connection, setConnection] = useState({email: "", password: ""})

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const connectionInput = (name, value) => {

    if(name === "email"){
    setConnection({...connection , email: value})
    }
    else if(name === "password"){
      setConnection({...connection , password: value})
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Login page</Text>

      <View style={{width: windowWidth * 0.8,}}>
              
        <Input 
          name = 'email'
          placeholder='Email'
          errorStyle={{ color: 'red' }}
          errorMessage=''
          onChangeText={(text) => connectionInput("email", text)}
        />
        
        <Input 
          name = 'password'
          placeholder='Password'
          secureTextEntry={true}
          errorStyle={{ color: 'red' }}
          errorMessage=''
          onChangeText={(text) => connectionInput("password", text)}
        />
      </View>

      <Button
        title="Connect"
        buttonStyle={{
          backgroundColor: 'rgb(189, 81, 62)',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 30,
        }}
        containerStyle={{
          width: 150,
          marginHorizontal: 50,
          marginBottom: 20
        }}
        titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
        onPress={() => router.navigate("/(tabs)/main")}  
      />

      <Button title="chrome"
        buttonStyle={{
          backgroundColor: 'rgb(255, 255, 255)',
          borderWidth: 2,
          borderColor: 'rgb(0, 0, 0)',
          borderRadius: 30,
          
        }}
        containerStyle={{
          width: 230,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        titleStyle={{ fontWeight: 'bold', color: "black" }}
        onPress={() => router.navigate("/(tabs)/main")}  >
          
          <FontAwesome size={24} name="chrome" style={{marginRight: 10}}/> 
          Continue with Google
        </Button>

        <Button title="Phone"
        buttonStyle={{
          backgroundColor: 'rgb(162, 255, 144)',
          borderWidth: 2,
          borderColor: 'rgb(0, 0, 0)',
          borderRadius: 30,
          
        }}
        containerStyle={{
          width: 230,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        titleStyle={{ fontWeight: 'bold', color: "black" }}
        onPress={() => router.navigate("/(tabs)/main")}  >
          
          <FontAwesome size={24} name="phone" style={{marginRight: 10}}/> 
          Continue with Phone
        </Button>

      {/* <Pressable >Continue with Google</Pressable> */}

    </View>
  );
}