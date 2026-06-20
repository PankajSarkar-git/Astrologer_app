import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import * as encoding from 'text-encoding';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/api/queryClient';
import AppNavigator from './src/routes/AppNavigator';
import { Provider } from 'react-redux';
import Toast from './src/components/common/toast';
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { navigationRef } from './src/hooks/navigation';
import { useEffect } from 'react';
import notifee, { AndroidImportance } from '@notifee/react-native';
import Config from 'react-native-config';

Object.assign(globalThis, encoding);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  async function createNotificationChannel() {
    await notifee.createChannel({
      id: 'high_importance_channel',
      name: 'High Importance Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'notification_sound',
      vibration: true,
    });
  }

  async function createZegoChannel() {
    await notifee.createChannel({
      id: Config.ZEGO_CHANNEl_ID!,
      name: Config.ZEGO_CHANNEl_NAME!,
      importance: AndroidImportance.HIGH,
      sound: 'zego_incoming', // without .mp3
    });
  }

  // Call this once when app starts
  useEffect(() => {
    createZegoChannel();
    createNotificationChannel();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <QueryClientProvider client={queryClient}>
              <NavigationContainer ref={navigationRef}>
                <ZegoCallInvitationDialog />
                <AppNavigator />
              </NavigationContainer>
              <Toast />
            </QueryClientProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
