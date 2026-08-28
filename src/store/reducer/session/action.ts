import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../api/client';

export const startCall = createAsyncThunk<
  any, // response type as any
  any, // argument type
  { rejectValue: any }
>('call/start', async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/v1/call/send/notification', payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
