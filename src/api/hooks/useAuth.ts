import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/auth.service';
import { useDispatch } from 'react-redux';
import {
  setUser,
  setAuthentication,
  logout,
  setMobile,
  setToken,
} from '../../store/reducer/auth';
import { useEffect } from 'react';
import { showToast } from '../../components/common/toast';

export function useLogin() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ number, password }: { number: string; password: string }) =>
      AuthService.login(number, password),

    onSuccess: data => {
      console.log('LOGIN RESPONSE ===>', data);

      if (data?.success) {
        // Save authentication state
        dispatch(setAuthentication(true));

        // Save user info
        dispatch(setUser(data.user));
        dispatch(setToken(data.token));

        // Save mobile (optional if you need separately)
        dispatch(setMobile(data.user.mobile));

        // Optionally, store the token somewhere (AsyncStorage / SecureStore)
        // await AsyncStorage.setItem('token', data.token);

        // Invalidate any queries if needed
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });

        // Show success toast
        showToast({ message: data.msg, type: 'success' });
      } else {
        showToast({ message: data.msg || 'Login failed', type: 'error' });
      }
    },

    onError: (error: any) => {
      console.log('LOGIN ERROR ===>', error);

      const message =
        error?.response?.data?.msg || error?.message || 'Something went wrong';
      showToast({ message, type: 'error' });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({
      fullName,
      number,
      password,
    }: {
      fullName: string;
      number: string;
      password: string;
    }) => AuthService.register(fullName, number, password),
  });
}

export function useCurrentUser() {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: AuthService.getCurrentUser,
  });
  console.log(query.data, "----astrologer detail")

  useEffect(() => {
    if (query.data) {
      dispatch(setUser(query.data));
    }
  }, [query.data, dispatch]);

  return query; // returns { data, isLoading, error, ... }
}

export function useDeviceToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deviceToken }: { deviceToken: string }) =>
      AuthService.deviceToken(deviceToken),

    onSuccess: () => {
      queryClient.clear();
    },
  });
}
