// import React, { useEffect } from 'react';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { CommonActions } from '@react-navigation/native';
// import { RootStackParamList } from '../../routes/types';
// import { ZegoUIKitPrebuiltCallWaitingScreen } from '@zegocloud/zego-uikit-prebuilt-call-rn';

// type Props = NativeStackScreenProps<
//   RootStackParamList,
//   'ZegoUIKitPrebuiltCallWaitingScreen'
// >;

// export default function ZegoWaitingWrapper({ route, navigation }: Props) {
//   const roomID = route?.params?.roomID;

//   useEffect(() => {
//     if (!roomID) {
//       if (navigation.canGoBack()) {
//         navigation.goBack();
//       } else {
//         navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [{ name: 'MainTabs' }],
//           }),
//         );
//       }
//     }
//   }, [roomID, navigation]);

//   if (!roomID) return null;

//   return <ZegoUIKitPrebuiltCallWaitingScreen />;
// }
// ZegoWaitingWrapper.tsx
import React from 'react';
import { ZegoUIKitPrebuiltCallWaitingScreen } from '@zegocloud/zego-uikit-prebuilt-call-rn';

export default function ZegoWaitingWrapper(props: any) {
  console.log('[ZegoWaitingWrapper] props:', props);
  console.log('[ZegoWaitingWrapper] route:', props.route);
  console.log('[ZegoWaitingWrapper] params:', props.route?.params);

  // Pass all props directly to the Zego component
  return <ZegoUIKitPrebuiltCallWaitingScreen {...props} />;
}
