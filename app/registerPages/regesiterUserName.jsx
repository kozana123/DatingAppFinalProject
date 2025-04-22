import { Text, View, Dimensions } from "react-native";
import { router, Link } from 'expo-router';
import { Input, Button } from '@rneui/themed';
import { useState } from 'react';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



export default function RegisterUserName() {
    const [userName, setUserName] = useState({name: ""})

    return(
        <View
        style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <Text>Register User Name</Text>

            <View style={{width: windowWidth * 0.8,}}>
                
                <Input 
                name = 'name'
                placeholder='User Name'
                errorStyle={{ color: 'red' }}
                errorMessage=''
                onChangeText={(text) => setUserName({...userName , name: text})}
                />
            </View>

            <Button
                title="Next"
                buttonStyle={{
                    backgroundColor: 'rgb(189, 81, 62)',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 5,
                    width: windowWidth * 0.8,
                    marginTop: 20,
                  }}
                onPress={() => router.push("/registerPages/personalDetails")}
            />
        </View>

    )
}