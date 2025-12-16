// src/routes/AppNavigator.tsx

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { RootState } from '../store';
import Login from '../screens/auth/Login';
import BottomTabNavigator from '../components/layout/bottom-tabs';
import EditPost from '../screens/Post/EditPost';
import { RootStackParamList } from './types';
import useFcm from '../hooks/useFCM';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const token = useSelector((state: RootState) => state.auth.token);
  useFcm(!!token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="EditPost" component={EditPost} />
        </>
      )}
    </Stack.Navigator>
  );
}
