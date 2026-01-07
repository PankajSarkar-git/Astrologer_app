// import React, { useState, ReactNode } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TextInputProps,
// } from 'react-native';
// import { COLORS } from '../../constant/colors';

// interface InputProps extends TextInputProps {
//   label?: string;
//   value?: string;
//   preText?: string;
//   onChangeText?: (text: string) => void;
//   placeholder?: string;
//   required?: boolean;
//   error?: string;
//   leftIcon?: ReactNode;
//   rightIcon?: ReactNode;
//   onRightIconPress?: () => void;

//   containerClass?: string;
//   labelClass?: string;
//   inputClass?: string;
//   errorClass?: string;
//   inputContainerClass?: string;

//   secureTextEntry?: boolean;
//   editable?: boolean;
//   multiline?: boolean;
// }

// const Input: React.FC<InputProps> = ({
//   label,
//   value,
//   preText,
//   onChangeText,
//   placeholder,
//   required = false,
//   error,
//   leftIcon,
//   rightIcon,
//   onRightIconPress,
//   containerClass = '',
//   labelClass = '',
//   inputClass = '',
//   errorClass = '',
//   inputContainerClass = '',
//   secureTextEntry = false,
//   editable = true,
//   multiline = false,
//   ...props
// }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   return (
//     <View className={`mb-5 ${containerClass}`}>
//       {label && (
//         <View className="mb-2">
//           <Text
//             className={`text-[14px] font-semibold ${labelClass}`}
//             style={{ color: COLORS.theme.primary }}
//           >
//             {label}
//             {required && (
//               <Text
//                 style={{ color: COLORS.status.error.base, fontWeight: '700' }}
//               >
//                 {' '}
//                 *
//               </Text>
//             )}
//           </Text>
//         </View>
//       )}

//       <View
//         className={`
//           min-h-12 flex-row items-center rounded-lg border-2 px-3
//           ${inputContainerClass}
//         `}
//         style={{
//           backgroundColor: editable
//             ? COLORS.theme.gray.light
//             : COLORS.theme.gray.text,
//           borderColor: error
//             ? COLORS.status.error.base
//             : isFocused
//             ? COLORS.theme.secondary
//             : 'transparent',
//         }}
//       >
//         {/* Left Icon */}
//         {leftIcon && <View className="mr-2">{leftIcon}</View>}

//         {/* Pre-text */}
//         {preText && (
//           <Text
//             style={{ color: COLORS.theme.secondary }}
//             className="mr-2 text-lg"
//           >
//             {preText}
//           </Text>
//         )}

//         {/* Input */}
//         <TextInput
//           className={`
//             flex-1 py-3 text-[16px]
//             ${multiline ? 'text-top min-h-[80px]' : ''}
//             ${inputClass}
//           `}
//           style={{
//             color: COLORS.theme.primary,
//           }}
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor={COLORS.theme.gray.text}
//           secureTextEntry={secureTextEntry}
//           editable={editable}
//           multiline={multiline}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           {...props}
//         />

//         {/* Right Icon */}
//         {rightIcon && (
//           <TouchableOpacity
//             onPress={onRightIconPress}
//             disabled={!onRightIconPress}
//             className="ml-2"
//           >
//             {rightIcon}
//           </TouchableOpacity>
//         )}
//       </View>

//       {error && (
//         <Text
//           className={`mt-1 text-[12px] ${errorClass}`}
//           style={{ color: COLORS.status.error.base }}
//         >
//           {error}
//         </Text>
//       )}
//     </View>
//   );
// };

// export default Input;

import React, { useState, ReactNode } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../constant/colors';

/* ================= SVG ICONS ================= */

const EyeIcon = ({ size = 22, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12C3.5 7.5 7.5 5 12 5s8.5 2.5 11 7c-2.5 4.5-6.5 7-11 7S3.5 16.5 1 12Z"
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

const EyeOffIcon = ({ size = 22, color = '#000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3l18 18" stroke={color} strokeWidth={2} />
    <Path
      d="M10.5 5.1A9.5 9.5 0 0 1 12 5c4.5 0 8.5 2.5 11 7a18.4 18.4 0 0 1-4.2 4.9"
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M6.2 6.2C4.2 7.6 2.6 9.6 1 12c2.5 4.5 6.5 7 11 7a9.6 9.6 0 0 0 4.1-.9"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

/* ================= TYPES ================= */

interface InputProps extends TextInputProps {
  label?: string;
  value?: string;
  preText?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  leftIcon?: ReactNode;

  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  inputContainerClass?: string;

  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
}

/* ================= COMPONENT ================= */

const Input: React.FC<InputProps> = ({
  label,
  value,
  preText,
  onChangeText,
  placeholder,
  required = false,
  error,
  leftIcon,
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
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = secureTextEntry === true;

  return (
    <View className={`mb-5 ${containerClass}`}>
      {label && (
        <Text
          className={`mb-2 text-[14px] font-semibold ${labelClass}`}
          style={{ color: COLORS.theme.primary }}
        >
          {label}
          {required && (
            <Text style={{ color: COLORS.status.error.base }}> *</Text>
          )}
        </Text>
      )}

      <View
        className={`min-h-12 flex-row items-center rounded-lg border-2 px-3 ${inputContainerClass}`}
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
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        {preText && (
          <Text
            className="mr-2 text-lg"
            style={{ color: COLORS.theme.secondary }}
          >
            {preText}
          </Text>
        )}

        <TextInput
          className={`flex-1 py-3 text-[16px] ${
            multiline ? 'min-h-[80px]' : ''
          } ${inputClass}`}
          style={{ color: COLORS.theme.primary }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.theme.gray.text}
          secureTextEntry={isPasswordField && !showPassword}
          editable={editable}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword(p => !p)}
            className="ml-2"
          >
            {showPassword ? (
              <EyeOffIcon size={22} color={COLORS.theme.secondary} />
            ) : (
              <EyeIcon size={22} color={COLORS.theme.secondary} />
            )}
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
