import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Wallet {
  balance: number;
  lockedBalance: number;
  totalBalance: number;
}

interface WalletPayload {
  balance: number;
  lockedBalance: number;
}

const initialState: Wallet = {
  balance: 0,
  lockedBalance: 0,
  totalBalance: 0,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletBalance: (state, action: PayloadAction<WalletPayload>) => {
      state.balance = action.payload.balance;
      state.lockedBalance = action.payload.lockedBalance;
      state.totalBalance =
        action.payload.balance - action.payload.lockedBalance;
    },
  },
});

export const { setWalletBalance } = walletSlice.actions;
export default walletSlice.reducer;
