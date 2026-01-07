// import React, { useEffect } from 'react';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { CommonActions } from '@react-navigation/native';
// import { RootStackParamList } from '../../routes/types';
// import { ZegoUIKitPrebuiltCallInCallScreen } from '@zegocloud/zego-uikit-prebuilt-call-rn';

// type Props = NativeStackScreenProps<
//   RootStackParamList,
//   'ZegoUIKitPrebuiltCallInCallScreen'
// >;

// export default function ZegoInCallWrapper({ route, navigation }: Props) {
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

//   return <ZegoUIKitPrebuiltCallInCallScreen />;
// }
import React from 'react';
import { ZegoUIKitPrebuiltCallInCallScreen } from '@zegocloud/zego-uikit-prebuilt-call-rn';

export default function ZegoInCallWrapper(props: any) {
  console.log('[ZegoInCallWrapper] props:', props);
  console.log('[ZegoInCallWrapper] route:', props.route);
  console.log('[ZegoInCallWrapper] params:', props.route?.params);

  // Pass all props directly to the Zego component
  return <ZegoUIKitPrebuiltCallInCallScreen {...props} />;
}
