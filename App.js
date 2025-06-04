import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeSrceen';
import SettingsScreen from './screens/SettingScreen';
import PostScreen from './screens/PostScreen';
import NotificationScreen from './screens/NotificationScreen';
import PassResetScreen from './screens/PassReset';
import PasswordResetNoticeScreen from './screens/NotiReset';
import DiaryScreen from './screens/DiarySrceen';
import UpdateAccScreen from './screens/UpdateAccScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';  

// Khai báo Stack
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // Khai báo Tab
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Post') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#ffffff', 
    },
        tabBarActiveTintColor: '#007BFF', 
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
      <Tab.Screen name="Notification" options={{ headerShown: false }} component={NotificationScreen} />
      <Tab.Screen name="Post" options={{ headerShown: false }} component={PostScreen} />
      <Tab.Screen name="Setting" options={{ headerShown: false }} component={SettingsScreen} />

    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Menu" component={TabNavigator} />
        <Stack.Screen options={{ headerShown: false }} name="PassReset" component={PassResetScreen} />
        <Stack.Screen options={{ headerShown: false }} name="NotiReset" component={PasswordResetNoticeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Diary" component={DiaryScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Setting" component={SettingsScreen} />
        <Stack.Screen options={{ headerShown: false }} name="UpdateAcc" component={UpdateAccScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}