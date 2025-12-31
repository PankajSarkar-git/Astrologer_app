import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDetail } from '../../../utils/types';

export interface AstrologerProfile {
  id: string;
  about: string | null;
  blocked: boolean;
  experienceYears: number;
  expertise: string;
  imgUri: string;
  languages: string;
  pricePerMinuteChat: number;
  pricePerMinuteVoice: number;
  pricePerMinuteVideo: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  astrologer_detail: AstrologerProfile;
  name: string;
  token: string | null;
  mobile: string | null;
  firstTime: boolean;
  freeChatModalShown: boolean;
  otp: string;
  user: UserDetail;
  isProfileComplete: boolean;
  isProfileModalOpen: boolean;
  astroId: string;
}

const isProfileComplete = (user: UserDetail): boolean =>
  Boolean(
    user.name &&
      user.gender &&
      user.birthDate &&
      user.birthTime &&
      user.birthPlace &&
      user.latitude &&
      user.longitude,
  );

const initialState: AuthState = {
  isAuthenticated: false,
  name: '',
  token: null,
  mobile: null,
  firstTime: true,
  freeChatModalShown: false,
  otp: '',
  isProfileComplete: false,
  isProfileModalOpen: false,
  astroId: '',
  astrologer_detail: {
    id: '',
    about: null,
    blocked: false,
    experienceYears: 0,
    expertise: '',
    imgUri: '',
    languages: '',
    pricePerMinuteChat: 0,
    pricePerMinuteVoice: 0,
    pricePerMinuteVideo: 0,
  },

  user: {
    id: '',
    name: '',
    gender: 'MALE',
    birthDate: new Date().toISOString().split('T')[0],
    birthTime: new Date().toTimeString().split(' ')[0],
    birthPlace: '',
    latitude: 0,
    longitude: 0,
    mobile: '',
    role: 'USER',
    walletBalance: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imgUri: '',
    freeChatUsed: false,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.isAuthenticated = false;
      state.token = null;
      state.mobile = null;
    },
    setAstroId: (state, action: PayloadAction<string>) => {
      state.astroId = action.payload;
    },
    setMobile: (state, action: PayloadAction<string>) => {
      state.mobile = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.user.walletBalance = action.payload;
    },

    setFirstTime: state => {
      state.firstTime = false;
    },

    setFreeChatUsed: state => {
      state.user.freeChatUsed = true;
    },

    setFreeChatModalShown: state => {
      state.freeChatModalShown = true;
    },

    setUser: (state, action: PayloadAction<UserDetail>) => {
      state.user = action.payload;
      state.name = action.payload.name;
      state.isProfileComplete = isProfileComplete(action.payload);
    },

    toggleProfileModal: state => {
      if (!state.isProfileModalOpen && !state.isProfileComplete) {
        state.isProfileModalOpen = true;
      } else {
        state.isProfileModalOpen = false;
      }
    },

    setAstrologer: (state, action: PayloadAction<AstrologerProfile>) => {
      state.astrologer_detail = action.payload;
    },

    setAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {
  logout,
  setMobile,
  setBalance,
  setFirstTime,
  setFreeChatUsed,
  setFreeChatModalShown,
  setUser,
  toggleProfileModal,
  setAstrologer,
  setAuthentication,
  setToken,
  setAstroId,
} = authSlice.actions;

export default authSlice.reducer;
