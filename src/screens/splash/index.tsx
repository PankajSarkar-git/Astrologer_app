import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../hooks/redux-hook';
import { COLORS } from '../../constant/colors';

const { height, width } = Dimensions.get('window');

export default function SplashScreen({
  toggleLoading,
}: {
  toggleLoading: () => void;
}) {
  const navigation = useNavigation<any>();
  const opacity = useRef(new Animated.Value(1)).current;

  const token = useAppSelector(state => state.auth.token);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <StatusBar
        backgroundColor={COLORS.theme.primary}
        barStyle="dark-content"
      />

      <LottieView
        source={require('../../assets/animation/astro-animation.json')}
        autoPlay
        loop={false}
        style={{ height: height * 1.2, width }}
        onAnimationFinish={toggleLoading}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height,
    width,
    backgroundColor: COLORS.theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
