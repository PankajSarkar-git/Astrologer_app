import { View, Text, Image, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { scaleFont, verticalScale } from '../../utils/sizer';
import { COLORS } from '../../constant/colors';
import Input from '../../components/common/input';
import CustomButton from '../../components/common/custom-button';
import { useRegister } from '../../api/hooks/useAuth';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    mobile: '',
    password: '',
  });

  const registerMutation = useRegister();

  // VALIDATION
  const validate = () => {
    let valid = true;
    const newErrors: any = { fullName: '', mobile: '', password: '' };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name required';
      valid = false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter valid mobile number';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // SUBMIT HANDLER
  const handleRegister = () => {
    if (!validate()) return;

    registerMutation.mutate(
      {
        fullName: formData.fullName,
        number: formData.mobile,
        password: formData.password,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Account created successfully!');
          navigation.navigate('Login');
        },
        onError: (err: any) => {
          Alert.alert('Register Failed', err?.message || 'Try again');
        },
      },
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.theme.white }}>
      <Image
        source={require('../../assets/imgs/design-2.png')}
        className="absolute left-0 top-0"
      />

      {/* TOP TEXT */}
      <Text
        className="ml-5 mt-14"
        style={{ fontSize: scaleFont(16), color: COLORS.theme.white }}
      >
        Create Your Account
      </Text>

      <Text
        className="ml-5 font-medium"
        style={{ fontSize: scaleFont(32), color: COLORS.theme.white }}
      >
        Register
      </Text>

      {/* FORM */}
      <View className="px-5" style={{ marginTop: verticalScale(160) }}>
        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="Enter full name"
          value={formData.fullName}
          error={errors.fullName}
          onChangeText={t => handleInputChange('fullName', t)}
        />

        {/* Mobile */}
        <Input
          preText="+91"
          label="Mobile Number"
          placeholder="Enter mobile number"
          value={formData.mobile}
          error={errors.mobile}
          keyboardType="numeric"
          maxLength={10}
          onChangeText={t => handleInputChange('mobile', t)}
        />

        {/* Password */}
        <Input
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          value={formData.password}
          error={errors.password}
          onChangeText={t => handleInputChange('password', t)}
        />

        <CustomButton
          title={registerMutation.isPending ? 'Registering...' : 'Register'}
          className="mt-4"
          onPress={handleRegister}
          disabled={registerMutation.isPending}
        />
      </View>

      {/* FOOTER */}
      <View className="mt-5">
        <View className="mt-6 flex-row justify-center">
          <Text style={{ fontSize: scaleFont(14), color: COLORS.theme.black }}>
            Already have an account?
          </Text>

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text
              className="font-bold"
              style={{ fontSize: scaleFont(14), color: COLORS.theme.primary }}
            >
              {' '}
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
