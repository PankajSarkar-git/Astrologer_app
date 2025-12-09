import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const PlusIcon = ({ size = 24, color = '#ffffff', ...rest }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
    <Path
      d="M4 12H20M12 4V20"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlusIcon;
