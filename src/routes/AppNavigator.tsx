// src/routes/AppNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import HomeScreen from '../screens/home/home';
import ProfileScreen from '../screens/profile';
import { RootState } from '../store';
import Login from '../screens/auth/Login';
import BottomTabNavigator from '../components/layout/bottom-tabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useSelector((state: RootState) => state.auth.token);
  console.log(token);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={token ? 'MainTabs' : 'Login'}
    >
      {/* If not logged in — show Auth screens */}
      {!token ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
        </>
      ) : (
        <>
          {/* Logged in — show actual app screens */}
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
}
