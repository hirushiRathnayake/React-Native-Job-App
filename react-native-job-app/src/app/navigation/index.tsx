// src/app/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../../features/auth/screens/SplashScreen';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import MainScreen from '../../features/users/screens/MainScreen';
import AddUserScreen from '../../features/users/screens/AddUserScreen';
import AllUsersScreen from '../../features/users/screens/AllUsersScreen';



const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="AddUser" component={AddUserScreen} />
        <Stack.Screen name="AllUsers" component={AllUsersScreen} options={{ title: 'All Users' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
