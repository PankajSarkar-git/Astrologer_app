import Svg, { Path } from 'react-native-svg';

export const LikeIcon = ({ size = 26, color = 'black' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.808 11.079C19.829 16.132 12 20.5 12 20.5s-7.829-4.368-8.808-9.421C2.227 6.1 5.066 3.5 8 3.5c1.738 0 3.154.84 4 2 .846-1.16 2.262-2 4-2 2.934 0 5.773 2.6 4.808 7.579Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LikeIconFilled = ({ size = 26, color = '#FF3040' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20.808 11.079C19.829 16.132 12 20.5 12 20.5s-7.829-4.368-8.808-9.421C2.227 6.1 5.066 3.5 8 3.5c1.738 0 3.154.84 4 2 .846-1.16 2.262-2 4-2 2.934 0 5.773 2.6 4.808 7.579Z" />
  </Svg>
);
