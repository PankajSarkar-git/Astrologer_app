import React from 'react';
import Svg, { Circle } from 'react-native-svg';

export const ThreeDotIcon = ({ size = 22, color = '#666' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="5" r="2" fill={color} />
      <Circle cx="12" cy="12" r="2" fill={color} />
      <Circle cx="12" cy="19" r="2" fill={color} />
    </Svg>
  );
};

export default ThreeDotIcon;
