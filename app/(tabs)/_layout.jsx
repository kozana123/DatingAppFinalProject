import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{  tabBarActiveTintColor: 'red' , headerShown: false }}>
      <Tabs.Screen
        name="main"
        options={{
          title: 'Live Chat',
          tabBarIcon: ({ color }) => {
            return <FontAwesome size={24} name="cog" color={color} />
          },
        }}
      />
      <Tabs.Screen
        name="prolife"
        options={{
          title: 'Prolife',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="plane" color={color} />,
        }}
      />
    </Tabs>
  );
}
