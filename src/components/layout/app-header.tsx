import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { scale, verticalScale } from '../../utils/sizer';
import { COLORS } from '../../constant/colors';

import MenuIcon from '../../assets/icons/menu-icon';
import NotificationIcon from '../../assets/icons/notification-icon';
import BackIcon from '../../assets/icon/back-icon';

interface AppHeaderProps {
  scrolled?: boolean;
  title?: string;
  initials?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onBackPress?: () => void;
  canGoBack?: boolean;
  rounded?: boolean;
  themeMode?: 'light' | 'dark';
}

const AppHeader = ({
  scrolled = true,
  title = '',
  initials = 'SK',
  onMenuPress,
  onNotificationPress,
  onProfilePress,
  onBackPress,
  canGoBack = false,
  rounded = false,
  themeMode = 'dark',
}: AppHeaderProps) => {
  const route = useRoute();
  const isLight = themeMode === 'light';
  const isHome = route.name === 'Home';

  const backgroundColor = scrolled
    ? isLight
      ? COLORS.theme.white
      : COLORS.theme.primary
    : 'transparent';

  const iconColor = isLight ? '#666' : COLORS.theme.white;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderBottomLeftRadius: rounded ? scale(16) : 0,
          borderBottomRightRadius: rounded ? scale(16) : 0,
          borderBottomWidth: isLight ? 1 : 0,
          borderBottomColor: isLight ? COLORS.theme.gray.light : 'transparent',
        },
      ]}
    >
      {/* LEFT */}
      <View style={styles.left}>
        <View style={styles.left}>
          {isHome ? (
            <TouchableOpacity onPress={onMenuPress}>
              <MenuIcon color={iconColor} />
            </TouchableOpacity>
          ) : canGoBack ? (
            <TouchableOpacity onPress={onBackPress}>
              <BackIcon color={iconColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onMenuPress}>
              <MenuIcon color={iconColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* TITLE */}
      {(canGoBack || !isHome) && (
        <View style={styles.center}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { color: isLight ? '#333' : COLORS.theme.white },
            ]}
          >
            {title}
          </Text>
        </View>
      )}

      {/* RIGHT */}
      <View style={styles.right}>
        {/* Notification */}
        <TouchableOpacity
          onPress={onNotificationPress}
          style={[
            styles.notification,
            {
              backgroundColor: isLight ? '#F2F2F2' : COLORS.theme.white,
            },
          ]}
        >
          <View style={styles.dot} />
          <NotificationIcon size={16} color={isLight ? '#444' : undefined} />
        </TouchableOpacity>

        {/* Profile */}
        {onProfilePress && (
          <Pressable onPress={onProfilePress}>
            <View
              style={[
                styles.profile,
                {
                  backgroundColor: COLORS.theme.white,
                  borderColor: isLight ? '#E0E0E0' : COLORS.theme.secondary,
                },
              ]}
            >
              <Text style={{ color: '#000' }}>{initials}</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default AppHeader;

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    height: verticalScale(80),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },

  left: {
    width: scale(40),
    alignItems: 'flex-start',
  },

  center: {
    position: 'absolute',
    left: scale(60),
    right: scale(60),
    alignItems: 'center',
  },

  title: {
    fontSize: scale(18),
    fontWeight: '600',
  },

  right: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },

  notification: {
    height: scale(36),
    width: scale(36),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    position: 'absolute',
    top: verticalScale(6),
    right: scale(6),
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.status.success.base,
    zIndex: 10,
  },

  profile: {
    height: scale(46),
    width: scale(46),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
});
