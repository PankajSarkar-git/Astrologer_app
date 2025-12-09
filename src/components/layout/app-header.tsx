import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { scale, verticalScale } from '../../utils/sizer';
import { COLORS } from '../../constant/colors';
import MenuIcon from '../../assets/icons/menu-icon';
import NotificationIcon from '../../assets/icons/notification-icon';

interface AppHeaderProps {
  scrolled?: boolean;
  initials?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  rounded?: boolean;
  themeMode?: 'light' | 'dark';
}
// home Booking post history call/chats
const AppHeader = ({
  scrolled = true,
  initials = 'SK',
  onMenuPress,
  onNotificationPress,
  onProfilePress,
  rounded = false,
  themeMode = 'dark',
}: AppHeaderProps) => {
  const isLight = themeMode === 'light';

  return (
    <View
      className="absolute left-0 right-0 top-0 z-[9999] w-full flex-row items-center justify-between px-5"
      style={{
        height: verticalScale(80),
        backgroundColor: scrolled
          ? isLight
            ? COLORS.theme.white
            : COLORS.theme.primary
          : 'transparent',
        borderBottomLeftRadius: rounded ? scale(16) : 0,
        borderBottomEndRadius: rounded ? scale(16) : 0,
      }}
    >
      {/* Menu Icon */}
      <TouchableOpacity
        onPress={onMenuPress}
        className="flex size-14 items-center justify-center"
      >
        <MenuIcon color={isLight ? '#666' : COLORS.theme.white} />
      </TouchableOpacity>

      {/* Right Section */}
      <View className="flex-row items-center" style={{ gap: scale(16) }}>
        {/* Notification Button */}
        <TouchableOpacity
          onPress={onNotificationPress}
          className="items-center justify-center rounded-full"
          style={{
            height: scale(36),
            width: scale(36),
            backgroundColor: isLight ? '#F2F2F2' : COLORS.theme.white,
          }}
        >
          <View
            className="absolute rounded-full"
            style={{
              height: 8,
              width: 8,
              top: verticalScale(6),
              right: scale(6),
              backgroundColor: COLORS.status.success.base,
            }}
          />

          <NotificationIcon size={16} color={isLight ? '#444' : undefined} />
        </TouchableOpacity>

        {/* Profile */}
        <Pressable onPress={onProfilePress}>
          <View
            className="items-center justify-center rounded-full border-2"
            style={{
              height: scale(50),
              width: scale(50),
              borderRadius: scale(30),
              backgroundColor: COLORS.theme.white,
              borderColor: isLight ? '#E0E0E0' : COLORS.theme.secondary,
            }}
          >
            <Text style={{ color: isLight ? '#333' : '#000' }}>{initials}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default AppHeader;
