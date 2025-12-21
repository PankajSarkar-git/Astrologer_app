// src/routes/types.ts

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  History: undefined;
  ChatScreen: undefined;
  EditPost: {
    id: string;
  };
  ProfileEdit: {
    id: string;
  };
  about: undefined;
  Wallet: undefined;
  Splash: undefined;
  ZegoUIKitPrebuiltCallWaitingScreen: {
    roomID: string;
  };
  ZegoUIKitPrebuiltCallInCallScreen: {
    roomID: string;
  };
};
