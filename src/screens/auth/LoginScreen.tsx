import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AuthService } from '../../api/services/auth.service';
import { setUser, setAuthentication } from '../../store/reducer/auth';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await AuthService.login(email, password);
      console.log(res, 'login ------s');

      // Save user & token to Redux
      dispatch(setUser(res.user));
      dispatch(setAuthentication(true));

      navigation.navigate('Home' as never);
    } catch (err: any) {
      console.log(err, 'login error');

      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="mb-8 text-center text-3xl font-bold">Login</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        className="mb-4 rounded-xl border border-gray-300 px-4 py-3 text-black"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        className="mb-4 rounded-xl border border-gray-300 px-4 py-3 text-black"
        value={password}
        onChangeText={setPassword}
      />

      {/* Error Message */}
      {error !== '' && (
        <Text className="mb-3 text-center text-red-500">{error}</Text>
      )}

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="mt-2 rounded-xl bg-blue-600 py-3"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-lg font-semibold text-white">
            Login
          </Text>
        )}
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Register' as never)}
        className="mt-5"
      >
        <Text className="text-center text-blue-600">
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
