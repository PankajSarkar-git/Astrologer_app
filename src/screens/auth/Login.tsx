// import { View, Text, Image, Pressable } from 'react-native';
// import React, { useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { scale, scaleFont, verticalScale } from '../../utils/sizer';
// import { COLORS } from '../../constant/colors';
// import Input from '../../components/common/input';
// import CustomButton from '../../components/common/custom-button';

// const Login = () => {
//   const navigation = useNavigation<any>();

//   const [formData, setFormData] = useState({
//     phone: '',
//     password: '',
//   });

//   const [errors, setErrors] = useState({
//     phone: '',
//     password: '',
//   });

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     setErrors(prev => ({ ...prev, [field]: '' }));
//   };

//   return (
//     <View className="flex-1" style={{ backgroundColor: COLORS.theme.white }}>
//       <Image
//         className="absolute left-0 top-0"
//         source={require('../../assets/imgs/design-2.png')}
//       />

//       {/* Welcome Text */}
//       <Text
//         className="ml-5 mt-14"
//         style={{
//           fontSize: scaleFont(16),
//           color: COLORS.theme.white,
//         }}
//       >
//         Welcome To
//       </Text>

//       <Text
//         className="ml-5 font-medium"
//         style={{
//           fontSize: scaleFont(32),
//           color: COLORS.theme.white,
//         }}
//       >
//         Astroseva
//       </Text>

//       {/* Form */}
//       <View className="px-5" style={{ marginTop: verticalScale(160) }}>
//         <Input
//           preText="+91"
//           label="Phone Number"
//           placeholder="Enter phone number"
//           onChangeText={(t: string) => handleInputChange('phone', t)}
//           value={formData.phone}
//           keyboardType="numeric"
//           maxLength={10}
//           error={errors.phone}
//         />

//         <Input
//           label="Password"
//           placeholder="Enter password"
//           onChangeText={(t: string) => handleInputChange('password', t)}
//           value={formData.password}
//           secureTextEntry
//           error={errors.password}
//         />

//         <CustomButton
//           title="Login"
//           onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
//           className="mt-4"
//         />
//       </View>

//       {/* Footer */}
//       <View className="mt-5">
//         <View className="mt-6 flex-row justify-center">
//           <Text
//             style={{
//               fontSize: scaleFont(14),
//               color: COLORS.theme.black,
//             }}
//           >
//             Don't have an account?
//           </Text>

//           <Pressable onPress={() => navigation.navigate('Register')}>
//             <Text
//               className="font-bold"
//               style={{
//                 fontSize: scaleFont(14),
//                 color: COLORS.theme.primary,
//               }}
//             >
//               {' '}
//               Register
//             </Text>
//           </Pressable>
//         </View>

//         <View className="mt-6 flex-row justify-center">
//           <Text
//             style={{
//               fontSize: scaleFont(14),
//               color: COLORS.theme.black,
//             }}
//           >
//             Forgot Password?
//           </Text>

//           <Pressable onPress={() => navigation.navigate('HomeNew')}>
//             <Text
//               className="font-bold"
//               style={{
//                 fontSize: scaleFont(14),
//                 color: COLORS.theme.primary,
//               }}
//             >
//               {' '}
//               Need Help
//             </Text>
//           </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Login;
import { View, Text, Image, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { scaleFont, verticalScale } from '../../utils/sizer';
import { COLORS } from '../../constant/colors';
import Input from '../../components/common/input';
import CustomButton from '../../components/common/custom-button';
import { useLogin } from '../../api/hooks/useAuth';
import { showToast } from '../../components/common/toast';

const Login = () => {
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    phone: '',
    password: '',
  });

  // REACT QUERY LOGIN HOOK
  const loginMutation = useLogin();

  // VALIDATION
  const validate = () => {
    let valid = true;
    const newErrors = { phone: '', password: '' };

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
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
  const handleLogin = () => {
    if (!validate()) return;

    loginMutation.mutate(
      {
        // Your useLogin expects email → so we pass phone as email
        number: formData.phone,
        password: formData.password,
      },
      {
        onSuccess: () => {
          console.log('Login successful');

          navigation.navigate('MainTabs', { screen: 'Home' });
        },
        onError: (err: any) => {
          console.log(err.message);
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
        Welcome To
      </Text>

      <Text
        className="ml-5 font-medium"
        style={{ fontSize: scaleFont(32), color: COLORS.theme.white }}
      >
        Astrosevaa
      </Text>

      {/* FORM */}
      <View className="px-5" style={{ marginTop: verticalScale(160) }}>
        <Input
          preText="+91"
          label="Phone Number"
          placeholder="Enter phone number"
          value={formData.phone}
          error={errors.phone}
          keyboardType="numeric"
          maxLength={10}
          onChangeText={t => handleInputChange('phone', t)}
        />

        <Input
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          value={formData.password}
          error={errors.password}
          onChangeText={t => handleInputChange('password', t)}
        />

        <CustomButton
          title={loginMutation.isPending ? 'Logging in...' : 'Login'}
          className="mt-4"
          onPress={handleLogin}
          disabled={loginMutation.isPending}
        />
      </View>

      {/* FOOTER */}
      <View className="mt-5">
        {/* <View className="mt-6 flex-row justify-center">
          <Text style={{ fontSize: scaleFont(14), color: COLORS.theme.black }}>
            Don't have an account?
          </Text>

          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text
              className="font-bold"
              style={{ fontSize: scaleFont(14), color: COLORS.theme.primary }}
            >
              {' '}
              Register
            </Text>
          </Pressable>
        </View> */}

        <View className="mt-6 flex-row justify-center">
          <Text style={{ fontSize: scaleFont(14), color: COLORS.theme.black }}>
            Forgot Password?
          </Text>

          <Pressable onPress={() => navigation.navigate('HomeNew')}>
            <Text
              className="font-bold"
              style={{ fontSize: scaleFont(14), color: COLORS.theme.primary }}
            >
              {' '}
              Need Help
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Login;
