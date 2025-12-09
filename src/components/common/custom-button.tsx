import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../constant/colors';

type CustomButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  loaderColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconClassName?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  className = '',
  textClassName = '',
  loaderColor = COLORS.theme.white,
  leftIcon,
  rightIcon,
  iconClassName = '',
}) => {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      activeOpacity={0.8}
      className={`
        flex min-h-12 flex-row items-center justify-center rounded-lg px-4
        ${className}
      `}
      style={{
        backgroundColor: disabled
          ? COLORS.theme.gray.light
          : COLORS.theme.primary,
      }}
    >
      {/* Spinner or Left Icon */}
      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} className="mr-2" />
      ) : (
        leftIcon && <View className={`mr-2 ${iconClassName}`}>{leftIcon}</View>
      )}

      {/* Title */}
      <Text
        className={`text-base font-semibold ${textClassName}`}
        style={{ color: COLORS.theme.white }}
      >
        {title}
      </Text>

      {/* Right Icon */}
      {rightIcon && (
        <View className={`ml-2 ${iconClassName}`}>{rightIcon}</View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
