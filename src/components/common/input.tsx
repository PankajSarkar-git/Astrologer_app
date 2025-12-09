import React, { useState, ReactNode } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { COLORS } from '../../constant/colors';

interface InputProps extends TextInputProps {
  label?: string;
  value?: string;
  preText?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;

  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  inputContainerClass?: string;

  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  preText,
  onChangeText,
  placeholder,
  required = false,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerClass = '',
  labelClass = '',
  inputClass = '',
  errorClass = '',
  inputContainerClass = '',
  secureTextEntry = false,
  editable = true,
  multiline = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`mb-5 ${containerClass}`}>
      {label && (
        <View className="mb-2">
          <Text
            className={`text-[14px] font-semibold ${labelClass}`}
            style={{ color: COLORS.theme.primary }}
          >
            {label}
            {required && (
              <Text
                style={{ color: COLORS.status.error.base, fontWeight: '700' }}
              >
                {' '}
                *
              </Text>
            )}
          </Text>
        </View>
      )}

      <View
        className={`
          min-h-12 flex-row items-center rounded-lg border-2 px-3
          ${inputContainerClass}
        `}
        style={{
          backgroundColor: editable
            ? COLORS.theme.gray.light
            : COLORS.theme.gray.text,
          borderColor: error
            ? COLORS.status.error.base
            : isFocused
            ? COLORS.theme.secondary
            : 'transparent',
        }}
      >
        {/* Left Icon */}
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        {/* Pre-text */}
        {preText && (
          <Text
            style={{ color: COLORS.theme.secondary }}
            className="mr-2 text-lg"
          >
            {preText}
          </Text>
        )}

        {/* Input */}
        <TextInput
          className={`
            flex-1 py-3 text-[16px]
            ${multiline ? 'text-top min-h-[80px]' : ''}
            ${inputClass}
          `}
          style={{
            color: COLORS.theme.primary,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.theme.gray.text}
          secureTextEntry={secureTextEntry}
          editable={editable}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            className="ml-2"
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          className={`mt-1 text-[12px] ${errorClass}`}
          style={{ color: COLORS.status.error.base }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
