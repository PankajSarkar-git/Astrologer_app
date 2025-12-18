import { api } from '../client';

type GetTransactionsParams = {
  page?: number;
};

/* ================= WALLET SERVICE ================= */

export const WalletService = {
  /* -------- TRANSACTION HISTORY -------- */
  getTransactions: async (params?: GetTransactionsParams) => {
    const page = params?.page ?? 1;

    const res = await api.get('/api/v1/users/wallet', {
      params: { page },
    });

    return res.data;
  },

  /* -------- WITHDRAW REQUEST -------- */
  withdraw: async (amount: number) => {
    const res = await api.get('/api/v1/withdraw/request', {
      params: { amount },
    });

    return res.data;
  },

  /* -------- TOP UP (USER ONLY) -------- */
  topUp: async (amount: number) => {
    const res = await api.post('/api/v1/payment/topup', {
      amount,
    });

    return res.data;
  },
};
