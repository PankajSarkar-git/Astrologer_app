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

/* ---------- SVG ICONS ---------- */

const EyeIcon = ({ color = '#000', size = 22 }) => (
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

const EyeOffIcon = ({ color = '#000', size = 22 }) => (
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
