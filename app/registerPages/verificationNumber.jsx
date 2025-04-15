import { View, Text } from 'react-native';
// const textlink = require("textlink-sms")
import { DataContext } from "../DataContextProvider";
import { useFocusEffect } from 'expo-router';
import { Input, Button } from '@rneui/themed';
import { useState } from 'react';
import * as SMS from 'expo-sms';
import {getHash, startOtpListener, useOtpVerify,} from 'react-native-otp-verify';

// textlink.useKey("6Thz4V69FrD0sYzryZHbnQcM5P1sXPj7jdhqHGRqsNkGkBbdt9jJkdYEbx9xyFiS")


export default function VerificationNumber(props) {

    const { gotSms } = useContext(DataContext);
    
    const [code, setCode] = useState();
    const phoneNumber = "0507330077"

    useFocusEffect(
        React.useCallback(() => {
            
            // sendVerification(phoneNumber)
            return () => {
            
            };
        }, [])
      );

    // sendVerification = async (phoneNumber) => {
    //     if (gotSms == false){
    //         const result = await textlink.sendVerificationSMS(phoneNumber)
    //         gotSms = true;
        // }
    // }

//     btnCheckVerification = async () => {
//       const result = await textlink.verifyCode(phoneNumber, code)
//       if (result){
//         gotSms = false
//         router.navigate("/(tabs)/main")   
//       }
//       else{
//         console.log("The code is incorrect!")
//       }

//     } 

//     inputCode = (event) => {
//       setCode(event.target.value)
//     } 

    return (
    <View
        style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        }}
        >
        <Text>Verification Number</Text>

        <Input 
          placeholder='Email'
          errorStyle={{ color: 'red' }}
          errorMessage=''
          onChange={inputCode}
        />
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
                onPress={btnCheckVerification}
              />
        </View>
    )
}