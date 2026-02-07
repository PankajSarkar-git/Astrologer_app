// // import { useEffect, useState, useRef } from 'react';
// // import {
// //   getMessaging,
// //   requestPermission,
// //   getToken,
// //   onMessage,
// //   onNotificationOpenedApp,
// //   getInitialNotification,
// //   AuthorizationStatus,
// //   FirebaseMessagingTypes,
// // } from '@react-native-firebase/messaging';
// // // import Toast from 'react-native-toast-message';
// // import { useAppDispatch } from './redux-hook';
// // import { useDeviceToken } from '../api/hooks/useAuth';
// // // import { registerDevice } from '../store/reducer/auth';

// // export default function useFcm(isAuthenticated: boolean) {
// //   const dispatch = useAppDispatch();
// //   const [fcmToken, setFcmToken] = useState<string>();
// //   const [registering, setRegistering] = useState(false);
// //   const { mutate: sendDeviceToken } = useDeviceToken();
// //   const onMessageUnsub = useRef<() => void>(() => {});
// //   const onOpenedUnsub = useRef<() => void>(() => {});

// //   useEffect(() => {
// //     if (!isAuthenticated) return;

// //     const messaging = getMessaging();
// //     let mounted = true;

// //     async function setup() {
// //       try {
// //         const authStatus = await requestPermission(messaging);
// //         const enabled =
// //           authStatus === AuthorizationStatus.AUTHORIZED ||
// //           authStatus === AuthorizationStatus.PROVISIONAL;

// //         if (!enabled) {
// //           //   Toast.show({
// //           //     type: 'info',
// //           //     text1: 'Notifications permission not granted',
// //           //   });
// //         }

// //         const token = await getToken(messaging);
// //         console.log('token------------', token);
// //         if (mounted) setFcmToken(token);
// //         if (token) {
// //           sendDeviceToken({ deviceToken: token });
// //         }
// //         // if (token) {
// //         //   setRegistering(true);
// //         //   try {
// //         //     await dispatch(registerDevice({ deviceToken: token })).unwrap();
// //         //   } finally {
// //         //     setRegistering(false);
// //         //   }
// //         // }

// //         // Foreground messages
// //         onMessageUnsub.current = onMessage(
// //           messaging,
// //           async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
// //             console.log('Foreground message:', remoteMessage);
// //             // Toast.show({
// //             //   type: 'info',
// //             //   text1: remoteMessage.notification?.title ?? 'New Message',
// //             //   text2: remoteMessage.notification?.body ?? '',
// //             // });
// //           },
// //         );

// //         // App opened from background
// //         onOpenedUnsub.current = onNotificationOpenedApp(
// //           messaging,
// //           remoteMessage => {
// //             console.log('Opened from background:', remoteMessage?.notification);
// //           },
// //         );

// //         // App opened from quit state
// //         const initialMessage = await getInitialNotification(messaging);
// //         if (initialMessage) {
// //           console.log('Opened from quit state:', initialMessage.notification);
// //         }
// //       } catch (err) {
// //         console.error('useFcm error:', err);
// //       }
// //     }

// //     setup();

// //     return () => {
// //       mounted = false;
// //       onMessageUnsub.current?.();
// //       onOpenedUnsub.current?.();
// //     };
// //   }, [isAuthenticated, dispatch]);

// //   return { fcmToken, registering };
// // }

// import { useEffect, useRef, useState } from 'react';
// import { Platform, PermissionsAndroid } from 'react-native';
// import messaging, {
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance } from '@notifee/react-native';
// import { useDeviceToken } from '../api/hooks/useAuth';

// export default function useFcm(isAuthenticated: boolean) {
//   const { mutate: sendDeviceToken } = useDeviceToken();
//   const [fcmToken, setFcmToken] = useState<string | undefined>();

//   const onMessageUnsub = useRef<() => void>(() => {});
//   const onOpenedUnsub = useRef<() => void>(() => {});

//   useEffect(() => {
//     if (!isAuthenticated) return;

//     let mounted = true;

//     async function setup() {
//       try {
//         // 1. Android 13+ notification permission
//         if (Platform.OS === 'android' && Platform.Version >= 33) {
//           await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//           );
//         }

//         async function createNotificationChannel() {
//           await notifee.createChannel({
//             id: 'high_importance_channel',
//             name: 'High Importance Notifications',
//             importance: AndroidImportance.HIGH,
//             sound: 'notification_sound',
//             vibration: true,
//           });
//         }

//         createNotificationChannel();

//         // 2. Create notification channel (MANDATORY)
//         // await notifee.createChannel({
//         //   id: 'default',
//         //   name: 'Default',
//         //   importance: AndroidImportance.HIGH,
//         // });

//         // 3. Get FCM token
//         const token = await messaging().getToken();
//         console.log('FCM TOKEN:', token);

//         if (mounted && token) {
//           setFcmToken(token);
//           sendDeviceToken({ deviceToken: token });
//         }

//         // 4. Foreground notifications (MANUAL DISPLAY)
//         onMessageUnsub.current = messaging().onMessage(
//           async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//             console.log('Foreground FCM:', remoteMessage);

//             await notifee.displayNotification({
//               title: remoteMessage.notification?.title || 'New notification',
//               body: remoteMessage.notification?.body || '',
//               android: {
//                 channelId: 'default',
//                 pressAction: {
//                   id: 'default',
//                 },
//               },
//             });
//           },
//         );

//         // 5. App opened from background
//         onOpenedUnsub.current = messaging().onNotificationOpenedApp(
//           remoteMessage => {
//             console.log('Opened from background:', remoteMessage.notification);
//           },
//         );

//         // 6. App opened from killed state
//         const initialMessage = await messaging().getInitialNotification();
//         if (initialMessage) {
//           console.log('Opened from quit state:', initialMessage.notification);
//         }
//       } catch (err) {
//         console.error('FCM setup failed:', err);
//       }
//     }

//     setup();

//     return () => {
//       mounted = false;
//       onMessageUnsub.current?.();
//       onOpenedUnsub.current?.();
//     };
//   }, [isAuthenticated, sendDeviceToken]);

//   return { fcmToken };
// }

// import { notifee } from '@notifee/react-native';
// import {useEffect, useState, useRef} from 'react';
// import messaging, {
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
// import Toast from 'react-native-toast-message';
// import {useAppDispatch} from '../hooks/redux-hook';
// import {registerDevice} from '../store/reducer/auth';
// import {getFcmToken} from '../utils/getFcmToken';

// /**
//  * useFcm
//  * - Call this from a top-level component (e.g. AppNavigator).
//  * - It will automatically register device token when authenticated.
//  *
//  * @param isAuthenticated when true the hook will attempt to register the device
//  * @returns { fcmToken?: string, registering: boolean }
//  */
// export default function useFcm(isAuthenticated: boolean) {
//   const dispatch = useAppDispatch();
//   const [fcmToken, setFcmToken] = useState<string | undefined>(undefined);
//   const [registering, setRegistering] = useState(false);
//   const onMessageUnsubRef = useRef<(() => void) | null>(null);
//   const onOpenedUnsubRef = useRef<(() => void) | null>(null);

//   useEffect(() => {
//     // Only run when auth state becomes true
//     if (!isAuthenticated) return;

//     let mounted = true;

//     async function setup() {
//       try {
//         // Request permission on platforms that need it (iOS)
//         const authStatus = await messaging().requestPermission();
//         const enabled =
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//         if (!enabled) {
//           // permission denied but we still try to obtain token (some platforms allow)
//           Toast.show({
//             type: 'info',
//             text1: 'Notifications permission not granted',
//             text2: 'You may miss push notifications.',
//           });
//         }

//         // get token using existing util - may use messaging().getToken() internally
//         const token = (await getFcmToken()) as string;
//         if (mounted) setFcmToken(token);

//         if (token) {
//           setRegistering(true);
//           try {
//             const payload = await dispatch(
//               // @ts-ignore - unwrap exists on thunk
//               registerDevice({deviceToken: token}),
//             ).unwrap();

//             if (payload?.success) {
//               //   Toast.show({
//               //     type: 'success',
//               //     text1: 'Device registered successfully',
//               //   });
//             } else {
//               //   Toast.show({
//               //     type: 'error',
//               //     text1: 'Device registration failed',
//               //     text2: payload?.message ?? '',
//               //   });
//             }
//           } catch (err) {
//             console.error('registerDevice error:', err);
//             Toast.show({
//               type: 'error',
//               text1: 'Device registration failed',
//             });
//           } finally {
//             setRegistering(false);
//           }
//         } else {
//           Toast.show({
//             type: 'info',
//             text1: 'No FCM token retrieved',
//           });
//         }

//         // Foreground messages
//         onMessageUnsubRef.current = messaging().onMessage(
//           async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//             console.log('Foreground Notification:', remoteMessage);
//             Toast.show({
//               type: 'info',
//               text1: remoteMessage.notification?.title ?? 'New Message',
//               text2: remoteMessage.notification?.body ?? '',
//             });
//           },
//         );

//         // App opened from background
//         onOpenedUnsubRef.current = messaging().onNotificationOpenedApp(
//           remoteMessage => {
//             console.log(
//               'App opened from background:',
//               remoteMessage.notification,
//             );
//             // TODO: add navigation handling as needed, e.g. navigate(remoteMessage.data.screen)
//           },
//         );

//         // App opened from quit state
//         messaging()
//           .getInitialNotification()
//           .then(remoteMessage => {
//             if (remoteMessage) {
//               console.log(
//                 'App opened from quit state:',
//                 remoteMessage.notification,
//               );
//               // TODO: add navigation handling as needed
//             }
//           })
//           .catch(e => console.error('getInitialNotification err', e));
//       } catch (err) {
//         console.error('useFcm setup error:', err);
//       }
//     }

//     setup();

//     return () => {
//       mounted = false;
//       if (onMessageUnsubRef.current) onMessageUnsubRef.current();
//       if (onOpenedUnsubRef.current) onOpenedUnsubRef.current();
//     };
//   }, [isAuthenticated, dispatch]);

//   return {fcmToken, registering};
// }

import { useEffect, useState, useRef } from 'react';
import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { useAppDispatch } from '../hooks/redux-hook';
import { handleNotificationNavigation } from './notification-handler';
import { markNotificationRead } from '../store/reducer/notifications';
import { setOtherUser, setSession } from '../store/reducer/session';
import { useDeviceToken } from '../api/hooks/useAuth';
import Toast, { showToast } from '../components/common/toast';
export default function useFcm(isAuthenticated: boolean) {
  const dispatch = useAppDispatch();
  const [fcmToken, setFcmToken] = useState<string>();
  const [registering, setRegistering] = useState(false);
  const { mutate: sendDeviceToken } = useDeviceToken();
  const onMessageUnsub = useRef<() => void>(() => {});
  const onOpenedUnsub = useRef<() => void>(() => {});

  useEffect(() => {
    if (!isAuthenticated) return;

    const messaging = getMessaging();
    let mounted = true;

    async function setup() {
      try {
        const authStatus = await requestPermission(messaging);
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          showToast({
            message: 'Notifications permission not granted',
            type: 'info',
          });
        }

        const token = await getToken(messaging);
        if (mounted) setFcmToken(token);

        if (token) {
          setRegistering(true);
          try {
            sendDeviceToken({ deviceToken: token });
          } finally {
            setRegistering(false);
          }
        }

        // Foreground messages
        onMessageUnsub.current = onMessage(
          messaging,
          async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log('Foreground message:', remoteMessage);
            showToast({
              message: remoteMessage.notification?.title ?? 'New Message',
              type: 'info',
            });
          },
        );

        // App opened from background
        // onOpenedUnsub.current = onNotificationOpenedApp(
        //   messaging,
        //   remoteMessage => {
        //     console.log('Opened from background:', remoteMessage?.notification);
        //   },
        // );
        onOpenedUnsub.current = onNotificationOpenedApp(
          messaging,
          (remoteMessage: any) => {
            if (remoteMessage?.data) {
              console.log(
                remoteMessage?.data,
                '----------------------------------------------------------------------------------------caht message',
              );
              if (remoteMessage?.data?.type === 'CHAT_MESSAGE') {
                const decodedData = JSON.parse(remoteMessage?.data?.session);
                dispatch(setOtherUser(decodedData.astrologer));
                dispatch(setSession(decodedData));
              }
              if (remoteMessage.data.type !== 'POST_CREATED') {
                handleNotificationNavigation(remoteMessage.data);
                dispatch(markNotificationRead(remoteMessage.data.id));
              }
            }
          },
        );

        // App opened from quit state
        // const initialMessage = await getInitialNotification(messaging);
        // if (initialMessage) {
        //   console.log('Opened from quit state:', initialMessage.notification);
        // }
        const initialMessage: any = await getInitialNotification(messaging);

        if (initialMessage?.data) {
          if (initialMessage?.data?.type === 'CHAT_MESSAGE') {
            const decodedData = JSON.parse(initialMessage?.data?.session);
            dispatch(setOtherUser(decodedData.astrologer));
            dispatch(setSession(decodedData));
          }
          handleNotificationNavigation(initialMessage.data);
          if (initialMessage.data.type !== 'POST_CREATED') {
            dispatch(markNotificationRead(initialMessage.data.id));
          }
        }
      } catch (err) {
        console.error('useFcm error:', err);
      }
    }

    setup();

    return () => {
      mounted = false;
      onMessageUnsub.current?.();
      onOpenedUnsub.current?.();
    };
  }, [isAuthenticated, dispatch]);

  return { fcmToken, registering };
}
