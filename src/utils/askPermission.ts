import { Platform, Alert } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  requestMultiple,
  checkMultiple,
  openSettings,
} from 'react-native-permissions';

export const askCallPermissions = async () => {
  const permissions =
    Platform.OS === 'android'
      ? [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.RECORD_AUDIO]
      : [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];

  // 1️⃣ Check current status
  const statuses = await checkMultiple(permissions);

  // 2️⃣ If all granted, return true
  const allGranted = Object.values(statuses).every(
    status => status === RESULTS.GRANTED,
  );
  if (allGranted) return true;

  // 3️⃣ Request only missing/denied permissions
  const requestStatuses = await requestMultiple(permissions);

  const granted = Object.values(requestStatuses).every(
    status => status === RESULTS.GRANTED,
  );

  // 4️⃣ Handle "blocked" case (user selected "Don't ask again")
  if (!granted) {
    Alert.alert(
      'Permission required',
      'Camera and microphone permissions are required for calls.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openSettings() },
      ],
    );
  }

  return granted;
};
