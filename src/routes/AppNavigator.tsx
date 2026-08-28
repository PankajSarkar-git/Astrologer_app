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
import {
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoUIKitPrebuiltCallWaitingScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { useZegoAndFCM } from '../hooks/useZego';
import { useWebSocket } from '../hooks/use-socket-new';
import ChatHistory from '../screens/ChatHistory/ChatHistory';
import ChatScreen from '../screens/call&chat/chatScreen';
import { askCallPermissions } from '../utils/askPermission';
import Notification from '../screens/notification';
import CallScreen from '../screens/call';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { data, error, isError, isSuccess, isLoading } = useGetMe(!!token);
  const [loading, setLoading] = React.useState(isLoading);
  useFcm(isAuthenticated);
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
  const { user } = useSelector((state: RootState) => state.auth);
  useFcm(isAuthenticated);
  askCallPermissions();
  console.log(
    user?.mobile,
    user?.name?.slice(0, 20),
    'user?.mobile, user?.name',
  );

  // useZegoAndFCM(
  //   user?.mobile,
  //   user?.name?.slice(0, 20) || 'Guest',
  //   isAuthenticated,
  // );
  const { connect, isConnected, disconnect, send } = useWebSocket(user?.id);

  if (loading) {
    return <SplashScreen toggleLoading={() => setLoading(false)} />;
  }

  return (
    <Stack.Navigator
      initialRouteName={!token ? 'Login' : 'MainTabs'}
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      {!token ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="EditPost" component={EditPost} />
          <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
          <Stack.Screen name="about" component={About} />
          <Stack.Screen name="Wallet" component={AstrologerWallet} />
          <Stack.Screen name="History" component={ChatHistory} />
          {/* <Stack.Screen name="CallScreen" component={CallScreen} /> */}

          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="CallScreen" component={CallScreen} />
          {/* <Stack.Screen
            options={{ headerShown: false }}
            // DO NOT change the name
            name="ZegoUIKitPrebuiltCallWaitingScreen"
            component={ZegoUIKitPrebuiltCallWaitingScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            // DO NOT change the name
            name="ZegoUIKitPrebuiltCallInCallScreen"
            component={ZegoUIKitPrebuiltCallInCallScreen}
          /> */}
        </>
      )}
    </Stack.Navigator>
  );
}
