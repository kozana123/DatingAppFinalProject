  import FontAwesome from '@expo/vector-icons/FontAwesome';
  import { TouchableOpacity } from 'react-native';
  import { Tabs } from 'expo-router';

  export default function TabLayout() {
    return (
      <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#F4C2C2", 
  
      tabBarInactiveTintColor: "#aaa", 
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "rgba(58, 54, 54, 0.95)", 
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        elevation: 5, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        borderRadius: 20,
        height: 70,
        borderTopWidth: 0,
      },
      tabBarLabelStyle: {
        fontSize: 13,
        fontWeight: "600",
        paddingBottom: 5,
      },
      tabBarItemStyle: {
        paddingTop: 8,
      },
    }}
  >


        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="comments" color={color} />
            ),
            tabBarButton: (props) => <TouchableOpacity activeOpacity={1} {...props} />,
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
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="user" color={color} />
            ),
            tabBarButton: (props) => <TouchableOpacity activeOpacity={1} {...props} />,
          }}
        />

      </Tabs>
    );
  }
