import { useAppDispatch } from '../hooks/redux-hook';
import { navigate } from './navigation';

export const handleNotificationNavigation = (data: any) => {
  if (!data) return;
  // const decodedData = JSON.parse(data);
  console.log(data.type, 'data.type-----');

  switch (data.type) {
    case 'BOOKING_APPROVED':
    case 'SESSION_CREATED':
      navigate('MainTabs', {
        screen: 'Home',
      });
      break;

    case 'POST_CREATED':
      navigate('MainTabs', {
        screen: 'Feed',
      });
      break;

    case 'CHAT_MESSAGE':
      console.log('CHAT_MESSAGE-----------------');
      navigate('ChatScreen');
      console.log('CHAT_MESSAGE navigated-----------------');
      break;

    default:
      navigate('Notification');
  }
};
