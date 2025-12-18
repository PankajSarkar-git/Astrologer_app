import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import Login from '../screens/auth/Login';
import BottomTabNavigator from '../components/layout/bottom-tabs';
import EditPost from '../screens/Post/EditPost';
import { RootStackParamList } from './types';

import { useGetMe } from '../api/hooks/useAstrologers';
import {
  logout,
  setAstroId,
  setAuthentication,
  setUser,
} from '../store/reducer/auth';
import useFcm from '../hooks/useFCM';
import ProfileEdit from '../screens/profile/pofile-edit';
import About from '../screens/about';
import AstrologerWallet from '../screens/wallet/wallet';
import SplashScreen from '../screens/splash';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  //  hook always called, API only runs when token exists
  const { data, error, isError, isSuccess } = useGetMe(!!token);

  // FCM should also depend on auth state
  useFcm(Boolean(token));

  /* ---------- HANDLE SUCCESS ---------- */
  useEffect(() => {
    if (!isSuccess || !data) return;

    const id = data.astrologer.id;
    dispatch(setAstroId(id));
    dispatch(setAuthentication(true));
    dispatch(setUser(data.astrologer.user));
  }, [isSuccess, data, dispatch]);

  /* ---------- HANDLE UNAUTHORIZED ---------- */
  useEffect(() => {
    if (!isError || !error) return;

    const status = (error as any)?.response?.status;
    if (status === 401 || status === 403) {
      dispatch(logout());
    }
  }, [isError, error, dispatch]);

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      {!token ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="EditPost" component={EditPost} />
          <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
          <Stack.Screen name="about" component={About} />
          <Stack.Screen name="Wallet" component={AstrologerWallet} />
        </>
      )}
    </Stack.Navigator>
  );
}
