import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    
    <Tabs screenOptions={{  tabBarActiveTintColor: 'red' , headerShown: false }}>
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => {
            return <FontAwesome size={30} name="comments" color={color} />
          },
        }}
      />
      <Tabs.Screen
        name="main"
        options={{
          title: 'Live Chat',
          tabBarIcon: ({ color }) => {
            return <FontAwesome size={30} name="heart" color={color} />
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => {
            return <FontAwesome size={30} name="user" color={color} />
          },
        }}
      />
    </Tabs>
  );
}
