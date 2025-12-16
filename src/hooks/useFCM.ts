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
// import Toast from 'react-native-toast-message';
import { useAppDispatch } from './redux-hook';
// import { registerDevice } from '../store/reducer/auth';

export default function useFcm(isAuthenticated: boolean) {
  const dispatch = useAppDispatch();
  const [fcmToken, setFcmToken] = useState<string>();
  const [registering, setRegistering] = useState(false);

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
          //   Toast.show({
          //     type: 'info',
          //     text1: 'Notifications permission not granted',
          //   });
        }

        const token = await getToken(messaging);
        console.log('token------------', token);
        if (mounted) setFcmToken(token);

        // if (token) {
        //   setRegistering(true);
        //   try {
        //     await dispatch(registerDevice({ deviceToken: token })).unwrap();
        //   } finally {
        //     setRegistering(false);
        //   }
        // }

        // Foreground messages
        onMessageUnsub.current = onMessage(
          messaging,
          async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log('Foreground message:', remoteMessage);
            // Toast.show({
            //   type: 'info',
            //   text1: remoteMessage.notification?.title ?? 'New Message',
            //   text2: remoteMessage.notification?.body ?? '',
            // });
          },
        );

        // App opened from background
        onOpenedUnsub.current = onNotificationOpenedApp(
          messaging,
          remoteMessage => {
            console.log('Opened from background:', remoteMessage?.notification);
          },
        );

        // App opened from quit state
        const initialMessage = await getInitialNotification(messaging);
        if (initialMessage) {
          console.log('Opened from quit state:', initialMessage.notification);
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
