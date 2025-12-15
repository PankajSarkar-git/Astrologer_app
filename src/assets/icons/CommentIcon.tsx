import Svg, { Path } from 'react-native-svg';

export const CommentIcon = ({ size = 26, color = 'black' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 11.5c0 4.14-4.03 7.5-9 7.5-1.03 0-2.02-.13-2.94-.38L3 20l1.56-3.12C3.6 15.77 3 13.96 3 12c0-4.14 4.03-7.5 9-7.5s9 3.36 9 7.5z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
