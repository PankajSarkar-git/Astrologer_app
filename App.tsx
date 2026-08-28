import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store';
import { AppState, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import * as encoding from 'text-encoding';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/api/queryClient';
import AppNavigator from './src/routes/AppNavigator';
import { Provider } from 'react-redux';
import Toast from './src/components/common/toast';

import { navigationRef } from './src/hooks/navigation';
import { useEffect, useState } from 'react';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import Config from 'react-native-config';
import {
  clearPendingCall,
  getPendingCall,
  getPendingWaitingCall,
} from './src/services/pending-call';
import {
  CALL_NOTIFICATION_ACTION,
  CALL_NOTIFICATION_TYPE,
} from './src/services/call-notification';
import CallWaitingOverlay from './src/screens/call/call-waiting-overlay';
import { stopOutgoingRingtone, stopRingtone } from './src/services/ringtone';

Object.assign(globalThis, encoding);

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [waitingCallData, setWaitingCallData] = useState<any>({
    data: null,
    palySound: true,
  });

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

  const navigateToPendingCall = () => {
    const call = getPendingCall();

    if (!call) {
      return;
    }

    console.log('📞 Navigating to accepted call:', call);

    clearPendingCall();

    navigationRef.navigate('CallScreen', {
      callId: call.callId,
      roomId: call.roomId,

      callType: call.sessionType,

      user: {
        id: call?.callerId,
        name: call?.callerName,
        imageUri: call?.callerImage,
      },
      isAstrologer: true,
    });
  };

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(async event => {
      console.log('=================================');
      console.log('NOTIFEE EVENT FIRED');
      console.log('TYPE:', event.type);
      console.log('ACTION:', event.detail.pressAction?.id);
      console.log('NOTIFICATION ID:', event.detail.notification?.id);
      console.log('DATA:', event.detail.notification?.data);
      console.log('=================================');

      if (
        event.type !== EventType.ACTION_PRESS &&
        event.type !== EventType.PRESS
      ) {
        return;
      }

      const notificationId = event.detail.notification?.id;

      if (!notificationId) {
        console.log('❌ NO NOTIFICATION ID');
        return;
      }
      const actionId = event.detail.pressAction?.id;
      const data = event.detail.notification?.data;

      if (actionId === 'default') {
        const data = event.detail.notification?.data;
        await notifee.cancelNotification(notificationId);

        setWaitingCallData({ data: data, playSound: false });
        return;
      }

      await notifee.cancelNotification(notificationId);

      if (actionId === CALL_NOTIFICATION_ACTION.REJECT) {
        console.log('🗑️ Notification cancelled:', notificationId);
        await notifee.cancelNotification(notificationId);
        // TODO:
        // Call reject API using data?.callId

        return;
      }

      /* ================================
             ACCEPT CALL
        ================================= */

      if (actionId === CALL_NOTIFICATION_ACTION.ACCEPT) {
        console.log('✅ Accept pressed:', data?.callId);

        if (
          !data?.callId ||
          !data?.roomId ||
          !data?.callerId ||
          !data?.callerName ||
          !data?.sessionType
        ) {
          console.log('❌ Invalid call data:', data);
          return;
        }

        // Remove incoming-call notification
        await notifee.cancelNotification(notificationId);
        if (!navigationRef) return;
        navigationRef?.navigate('CallScreen', {
          callId: data?.callId,
          roomId: data?.roomId,

          callType: data.sessionType,

          user: {
            id: data?.callerId,
            name: data?.callerName,
            imageUri: data?.callerImage,
          },
          isAstrologer: true,
        });

        console.log('📞 Pending accepted call saved');

        return;
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const call = getPendingWaitingCall();
    if (call) {
      setWaitingCallData({ data: call, playSound: true });
    }
  }, []);

  const checkAvailableNotification = async () => {
    const displayed = await notifee.getDisplayedNotifications();
    const incomingCalls = displayed.filter(
      n => n.notification?.data?.type === CALL_NOTIFICATION_TYPE.INCOMING_CALL,
    );

    if (incomingCalls.length === 0) {
      return;
    }

    const latestCall = incomingCalls.reduce((latest, current) =>
      Number(current.date) > Number(latest.date) ? current : latest,
    );

    const notification = latestCall.notification!;
    const data = notification.data!;
    setWaitingCallData({ data: data, playSound: false });
  };

  useEffect(() => {
    checkAvailableNotification();
  }, []);

  // Call this once when app starts
  useEffect(() => {
    createNotificationChannel();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      console.log('AppState:', state);

      if (state === 'active' && navigationRef.isReady()) {
        navigateToPendingCall();
      }
    });

    return () => {
      subscription.remove();
    };
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
              <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                  console.log('🧭 Navigation ready');

                  navigateToPendingCall();
                }}
              >
                {/* <ZegoCallInvitationDialog /> */}
                <AppNavigator />
              </NavigationContainer>
              <CallWaitingOverlay
                visible={waitingCallData?.data != null}
                callerName={waitingCallData?.callerName}
                sessionType={waitingCallData?.sessionType}
                onAccept={() => {
                  navigationRef.navigate('CallScreen', {
                    callId: waitingCallData.callId,
                    roomId: waitingCallData.roomId,
                    callType: waitingCallData.sessionType,
                    user: {
                      id: waitingCallData.callerId,
                      name: waitingCallData.callerName,
                      imageUri: waitingCallData.callerImage,
                    },
                    isAstrologer: true,
                  });
                  stopOutgoingRingtone();
                  setWaitingCallData({ data: null, playSound: false });
                }}
                onReject={() => {
                  stopOutgoingRingtone();
                  setWaitingCallData({ data: null, playSound: false });
                }}
              />
              <Toast />
            </QueryClientProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
