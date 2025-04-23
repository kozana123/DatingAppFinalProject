import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Button } from '@rneui/themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';




export default function Main(props) {
  return (
    <View
      style={{
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
      }}
      >
        <Text>Profile</Text>
        <View style={{flexDirection: 'row', justifyContent: "center", gap: "55%", marginTop: 20, marginBottom: 30 }}>
          <Text style={styles.title}>Dating App</Text>
          <FontAwesome size={30} name="gear" style={{marginRight: 10}}/> 
        </View>
        <View style={{ alignItems: "center",}}>
          <Avatar
            size={90}
            rounded
            source={{ uri: 'https://randomuser.me/api/portraits/women/57.jpg' }}
            title="Bj"
            containerStyle={{ backgroundColor: 'grey' }}
          >
          <Avatar.Accessory style={{backgroundColor:'rgba(218, 88, 55, 0.8)'}} size={30} />
          </Avatar>
        </View>

        <View style={{flexDirection: 'row',}}>
          <Text style={{ fontSize: 30, marginTop: 20}}>Dor</Text> 
          <Text style={{ fontSize: 30, marginTop: 20}}>Dor</Text> 
        </View>
        
      </View>
  )
}

const styles = StyleSheet.create({
 
  title: {
    fontSize: 20,
    color: 'rgb(0, 0, 0)',
  },
  avatarAndDetails:{
    alignItems: "center"
  }


});