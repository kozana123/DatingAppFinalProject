import { Text, View, Dimensions } from "react-native";
import { router, Link } from 'expo-router';
import { Input, Button,  } from '@rneui/themed';
import { useState } from 'react';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



export default function RegisterUserName() {
    const [userName, setUserName] = useState({name: ""})

    return(
        <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingHorizontal: 30,
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
            Let's Get Started!
        </Text>
  
        <Text style={{ fontSize: 22, marginBottom: 30 }}>
          What's Your Name?
        </Text>
  
        <Input
           placeholder='Enter your name'
          value={userName.name}
          inputContainerStyle={{
            borderBottomWidth: 2,
            borderBottomColor: '#bd513e',
          }}
          inputStyle={{ fontSize: 18 }}
          onChangeText={(text) => setUserName({ ...userName, name: text })}
        />
  
        <Button
           title="Next"
          buttonStyle={{
            backgroundColor: 'rgb(189, 81, 62)',
            borderRadius: 10,
            paddingVertical: 12,
            marginTop: 40,
          }}
          titleStyle={{ fontSize: 18 }}
           onPress={() => router.push("/registerPages/registerBD")}
        />
      </View>
    )
}