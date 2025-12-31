/**
 * @format
 */

window.global = global;
import './src/polyfills';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import messaging from '@react-native-firebase/messaging';

ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
