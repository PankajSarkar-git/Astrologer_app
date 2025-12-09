import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Home from '../../screens/home/home';
import { COLORS } from '../../constant/colors';
import Feed from '../../screens/feed/feed';
import Post from '../../screens/Post/post';
import Booking from '../../screens/booking/booking';
import Remedies from '../../screens/remedies';
import HomeIcon from '../../assets/svgs/home-icon';
import FeedIcon from '../../assets/svgs/feed-icon';
import AstrologerIcon from '../../assets/svgs/astrologer-icon';
import BookingIcon from '../../assets/svgs/booking-icon';
import RemediesIcon from '../../assets/svgs/remedies-icon';
import PlusIcon from '../../assets/icons/plus-icon';
import UserIcon from '../../assets/icons/user-icon';

const Tab = createBottomTabNavigator();

function DummyIcon({ focused }: any) {
  return (
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: focused ? COLORS.theme.secondary : COLORS.theme.white,
      }}
    />
  );
}

const getTabIcon = (routeName: string, focused: boolean, color: string) => {
  const size = focused ? 24 : 24; // slightly bigger when active

  switch (routeName) {
    case 'Home':
      return <HomeIcon size={size} color={color} />;

    case 'Feed':
      return <FeedIcon size={22} color={color} />;

    case 'Post':
      return <PlusIcon size={size} color={color} />;

    case 'Bookings':
      return <BookingIcon size={size} color={color} />;

    case 'User':
      return <UserIcon size={size} color={color} />;

    default:
      return null;
  }
};

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true, // show text
        tabBarActiveTintColor: COLORS.theme.secondary,
        tabBarInactiveTintColor: COLORS.theme.white,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: COLORS.theme.primary,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          //   borderTopLeftRadius: 16,
          //   borderTopRightRadius: 16,
          position: 'absolute',
        },

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },

        tabBarIcon: ({ focused, color }: any) =>
          getTabIcon(route.name, focused, color),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Post" component={Post} />
      <Tab.Screen name="Bookings" component={Booking} />
      <Tab.Screen name="User" component={Remedies} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
