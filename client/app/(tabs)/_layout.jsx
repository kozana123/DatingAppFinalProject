import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View, Text, Modal, StyleSheet,TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    
    <Tabs screenOptions={{  tabBarActiveTintColor: "rgba(209, 71, 163, 1)", headerShown: false,  tabBarStyle: {elevation: 0, position: "absolute", backgroundColor:"rgba(34, 34, 34, 1)", borderTopWidth: 0,},}}>
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => {
            return <FontAwesome size={30} name="comments" color={color} />
          },tabBarButton: (props) => (
            <TouchableOpacity activeOpacity={1} {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="main"
        options={{
          title: 'Live Chat',
          tabBarIcon: ({ color }) => {
            return <FontAwesome size={30} name="heart" color={color} />
          },tabBarButton: (props) => (
            <TouchableOpacity activeOpacity={1} {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => {
            return <FontAwesome size={30} name="user" color={color} />
          },tabBarButton: (props) => (
            <TouchableOpacity activeOpacity={1} {...props} />
          ),
        }}
      />
    </Tabs>
  );
}
