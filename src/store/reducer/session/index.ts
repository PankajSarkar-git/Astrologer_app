import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CallSession,
  ChatSession,
  Message,
  UserDetail,
} from '../../../utils/types';

/* ================= TYPES ================= */

export type SessionRequest = {
  userId: string;
  type: 'VIDEO' | 'AUDIO' | 'CHAT';
};

export interface SessionState {
  activeSession: ChatSession | null;
  session: ChatSession | null;
  callSession: CallSession | null;

  user: UserDetail | null;
  otherUser: UserDetail | null;

  sessionEnded: boolean;

  messages: Message[];

  queueRequestCount: number;
  countRefresh: boolean;

  sessionRequest: SessionRequest | null;
  requests: SessionRequest[];
}

/* ================= INITIAL STATE ================= */

const initialState: SessionState = {
  activeSession: null,
  session: null,
  callSession: null,

  user: null,
  otherUser: null,

  sessionEnded: true,

  messages: [],

  queueRequestCount: 0,
  countRefresh: true,

  sessionRequest: null,
  requests: [],
};

/* ================= SLICE ================= */

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    /* -------- SESSION -------- */

    setSession(state, action: PayloadAction<ChatSession | null>) {
      console.log("==================setSession------", action.payload);
      state.session = action.payload;
    },

    setActiveSession(state, action: PayloadAction<ChatSession | null>) {
      state.activeSession = action.payload;
    },

    clearActiveSession(state) {
      state.activeSession = null;
    },

    clearSession(state) {
      state.session = null;
      state.messages = [];
    },

    /* -------- CALL -------- */

    setCallSession(state, action: PayloadAction<CallSession | null>) {
      state.callSession = action.payload;
    },

    clearCallSession(state) {
      state.callSession = null;
    },

    /* -------- USERS -------- */

    setChatUser(state, action: PayloadAction<UserDetail | null>) {
      state.user = action.payload;
    },

    setOtherUser(state, action: PayloadAction<UserDetail | null>) {
      state.otherUser = action.payload;
    },

    /* -------- MESSAGES -------- */

    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },

    addMessage(state, action: PayloadAction<Message>) {
      state.messages = [action.payload, ...state.messages];
    },

    prependMessages(state, action: PayloadAction<Message[]>) {
      state.messages = [...state.messages, ...action.payload];
    },

    /* -------- SESSION REQUESTS -------- */

    setRequest(state, action: PayloadAction<SessionRequest | null>) {
      state.sessionRequest = action.payload;
    },

    setRequestList(state, action: PayloadAction<SessionRequest[]>) {
      state.requests = action.payload;
    },

    /* -------- QUEUE -------- */

    incrementQueueRequest(state) {
      state.queueRequestCount += 1;
    },

    clearQueueRequestCount(state) {
      state.queueRequestCount = 0;
    },

    setQueueCount(state, action: PayloadAction<number>) {
      state.queueRequestCount = action.payload;
    },

    toggleCountRefresh(state) {
      state.countRefresh = !state.countRefresh;
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  setSession,
  setActiveSession,
  clearActiveSession,
  clearSession,

  setCallSession,
  clearCallSession,

  setChatUser,
  setOtherUser,

  setMessages,
  addMessage,
  prependMessages,

  setRequest,
  setRequestList,

  incrementQueueRequest,
  clearQueueRequestCount,
  setQueueCount,
  toggleCountRefresh,
} = sessionSlice.actions;

export default sessionSlice.reducer;
