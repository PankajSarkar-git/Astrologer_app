import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';

type Props = {
  name: string;
  callType: 'audio' | 'video';
  onAccept: () => void;
  onReject: () => void;
};

export default function IncomingCallBanner({
  name,
  callType,
  onAccept,
  onReject,
}: Props) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }], opacity }]}
    >
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>

        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.sub}>Incoming {callType} call</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onReject} style={styles.reject}>
          <Text style={styles.icon}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onAccept} style={styles.accept}>
          <Text style={styles.icon}>✓</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    backgroundColor: '#1f1f1f',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  sub: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
  },

  accept: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
  },

  reject: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
