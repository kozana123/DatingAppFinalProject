  import FontAwesome from '@expo/vector-icons/FontAwesome';
  import { TouchableOpacity } from 'react-native';
  import { Tabs } from 'expo-router';

  export default function TabLayout() {
    return (
      <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#CBF7FF", 
  
      tabBarInactiveTintColor: "#FF6868", 
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "rgba(40, 49, 63, 0.95)", 
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
        marginHorizontal: 10,
        height: 60,
        borderTopWidth: 0,
        
      },
      tabBarLabelStyle: {
        fontSize: 13,
        fontWeight: "00",
        // paddingBottom: 5,
        fontFamily: "Prompt-Thin"
      },
      tabBarItemStyle: {
        // paddingTop: 8,
      },
    }}
  >


        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="comments" color="#FF6868" />
            ),
            tabBarButton: (props) => <TouchableOpacity activeOpacity={1} {...props} />,
          }}
        />

    
  <Tabs.Screen
          name="main"
          options={{
            title: 'Live Chat',
            tabBarIcon: ({ color }) => {
              return <FontAwesome size={24} name="heart" color="#FF6868" />
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
              <FontAwesome size={24} name="user" color="#FF6868" />
            ),
            tabBarButton: (props) => <TouchableOpacity activeOpacity={1} {...props} />,
          }}
        />

      </Tabs>
    );
  }
