// import { useEffect, useState, useRef } from 'react';
// import {
//   getMessaging,
//   requestPermission,
//   getToken,
//   onMessage,
//   onNotificationOpenedApp,
//   getInitialNotification,
//   AuthorizationStatus,
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
// // import Toast from 'react-native-toast-message';
// import { useAppDispatch } from './redux-hook';
// import { useDeviceToken } from '../api/hooks/useAuth';
// // import { registerDevice } from '../store/reducer/auth';

// export default function useFcm(isAuthenticated: boolean) {
//   const dispatch = useAppDispatch();
//   const [fcmToken, setFcmToken] = useState<string>();
//   const [registering, setRegistering] = useState(false);
//   const { mutate: sendDeviceToken } = useDeviceToken();
//   const onMessageUnsub = useRef<() => void>(() => {});
//   const onOpenedUnsub = useRef<() => void>(() => {});

//   useEffect(() => {
//     if (!isAuthenticated) return;

//     const messaging = getMessaging();
//     let mounted = true;

//     async function setup() {
//       try {
//         const authStatus = await requestPermission(messaging);
//         const enabled =
//           authStatus === AuthorizationStatus.AUTHORIZED ||
//           authStatus === AuthorizationStatus.PROVISIONAL;

//         if (!enabled) {
//           //   Toast.show({
//           //     type: 'info',
//           //     text1: 'Notifications permission not granted',
//           //   });
//         }

//         const token = await getToken(messaging);
//         console.log('token------------', token);
//         if (mounted) setFcmToken(token);
//         if (token) {
//           sendDeviceToken({ deviceToken: token });
//         }
//         // if (token) {
//         //   setRegistering(true);
//         //   try {
//         //     await dispatch(registerDevice({ deviceToken: token })).unwrap();
//         //   } finally {
//         //     setRegistering(false);
//         //   }
//         // }

//         // Foreground messages
//         onMessageUnsub.current = onMessage(
//           messaging,
//           async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//             console.log('Foreground message:', remoteMessage);
//             // Toast.show({
//             //   type: 'info',
//             //   text1: remoteMessage.notification?.title ?? 'New Message',
//             //   text2: remoteMessage.notification?.body ?? '',
//             // });
//           },
//         );

//         // App opened from background
//         onOpenedUnsub.current = onNotificationOpenedApp(
//           messaging,
//           remoteMessage => {
//             console.log('Opened from background:', remoteMessage?.notification);
//           },
//         );

//         // App opened from quit state
//         const initialMessage = await getInitialNotification(messaging);
//         if (initialMessage) {
//           console.log('Opened from quit state:', initialMessage.notification);
//         }
//       } catch (err) {
//         console.error('useFcm error:', err);
//       }
//     }

//     setup();

//     return () => {
//       mounted = false;
//       onMessageUnsub.current?.();
//       onOpenedUnsub.current?.();
//     };
//   }, [isAuthenticated, dispatch]);

//   return { fcmToken, registering };
// }

import { useEffect, useRef, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { useDeviceToken } from '../api/hooks/useAuth';

export default function useFcm(isAuthenticated: boolean) {
  const { mutate: sendDeviceToken } = useDeviceToken();
  const [fcmToken, setFcmToken] = useState<string | undefined>();

  const onMessageUnsub = useRef<() => void>(() => {});
  const onOpenedUnsub = useRef<() => void>(() => {});

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;

    async function setup() {
      try {
        // 1. Android 13+ notification permission
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }

        async function createNotificationChannel() {
          await notifee.createChannel({
            id: 'high_importance_channel',
            name: 'High Importance Notifications',
            importance: AndroidImportance.HIGH,
            sound: 'notification_sound',
            vibration: true,
          });
        }

        createNotificationChannel();

        // 2. Create notification channel (MANDATORY)
        // await notifee.createChannel({
        //   id: 'default',
        //   name: 'Default',
        //   importance: AndroidImportance.HIGH,
        // });

        // 3. Get FCM token
        const token = await messaging().getToken();
        console.log('FCM TOKEN:', token);

        if (mounted && token) {
          setFcmToken(token);
          sendDeviceToken({ deviceToken: token });
        }

        // 4. Foreground notifications (MANUAL DISPLAY)
        onMessageUnsub.current = messaging().onMessage(
          async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log('Foreground FCM:', remoteMessage);

            await notifee.displayNotification({
              title: remoteMessage.notification?.title || 'New notification',
              body: remoteMessage.notification?.body || '',
              android: {
                channelId: 'default',
                pressAction: {
                  id: 'default',
                },
              },
            });
          },
        );

        // 5. App opened from background
        onOpenedUnsub.current = messaging().onNotificationOpenedApp(
          remoteMessage => {
            console.log('Opened from background:', remoteMessage.notification);
          },
        );

        // 6. App opened from killed state
        const initialMessage = await messaging().getInitialNotification();
        if (initialMessage) {
          console.log('Opened from quit state:', initialMessage.notification);
        }
      } catch (err) {
        console.error('FCM setup failed:', err);
      }
    }

    setup();

    return () => {
      mounted = false;
      onMessageUnsub.current?.();
      onOpenedUnsub.current?.();
    };
  }, [isAuthenticated, sendDeviceToken]);

  return { fcmToken };
}
