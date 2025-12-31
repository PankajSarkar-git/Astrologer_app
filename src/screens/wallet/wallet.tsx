import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import PageWithHeader from '../../components/layout/page-with-header';
import WalletTransactionCard from './components/transaction-card';
import AboutIcon from '../../assets/icons/about-icon';

import { COLORS } from '../../constant/colors';
import { scale, verticalScale, moderateScale } from '../../utils/sizer';
import { textStyle } from '../../constant/text-style';

import { Transaction } from '../../utils/types';
import { useWalletTransactions } from '../../api/hooks/useWallet';
import { useWithdraw } from '../../api/hooks/useWallet';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hook';
import { setWalletBalance } from '../../store/reducer/wallet';
import { showToast } from '../../components/common/toast';

const AstrologerWallet = () => {
  const onEndReachedCalledDuringMomentum = useRef(false);
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState('');

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useWalletTransactions();

  const { mutate: withdraw, isPending } = useWithdraw();

  /* ---------- SET WALLET DATA TO REDUX ---------- */
  useEffect(() => {
    const wallet = data?.pages?.[0]?.wallet;
    if (!wallet) return;

    dispatch(
      setWalletBalance({
        balance: wallet.balance ?? 0,
        lockedBalance: wallet.lockedBalance ?? 0,
      }),
    );
  }, [data, dispatch]);

  /* ---------- READ WALLET FROM REDUX ---------- */
  const { balance, lockedBalance, totalBalance } = useAppSelector(
    s => s.wallet,
  );

  /* ---------- TRANSACTIONS ---------- */
  const transactions: Transaction[] =
    data?.pages.flatMap(p => p.wallet?.transactions ?? []) ?? [];

  /* ---------- WITHDRAW ---------- */
  const handleWithdraw = () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      showToast({
        type: 'error',
        message: 'Enter a valid amount',
      });
      return;
    }

    if (numericAmount > totalBalance) {
      showToast({
        type: 'error',
        message: 'Insufficient balance',
      });
      return;
    }

    withdraw(numericAmount, {
      onSuccess: () => {
        setAmount('');
      },
    });
  };

  return (
    <PageWithHeader scrollEnabled={false} title="Wallet">
      <View style={styles.container}>
        {/* BALANCE CARD */}
        <View style={styles.balanceCard}>
          <Text style={[textStyle.fs_abyss_14_400, styles.balanceLabel]}>
            Available Balance
          </Text>

          <Text style={[textStyle.fs_abyss_24_400, styles.balanceValue]}>
            ₹{totalBalance.toFixed(2)}
          </Text>

          <View style={{ marginTop: verticalScale(8) }}>
            <Text style={[textStyle.fs_abyss_12_400, styles.balanceSub]}>
              Wallet: ₹{balance.toFixed(2)}
            </Text>
            <Text style={[textStyle.fs_abyss_12_400, styles.balanceSub]}>
              Locked: ₹{lockedBalance.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* WITHDRAW SECTION */}
        <View style={styles.withdrawContainer}>
          <Text style={[textStyle.fs_abyss_14_400]}>Withdraw Amount</Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
            style={styles.withdrawInput}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[styles.withdrawButton, isPending && { opacity: 0.6 }]}
            onPress={handleWithdraw}
            disabled={isPending}
          >
            <Text style={styles.withdrawButtonText}>
              {isPending ? 'Processing...' : 'Withdraw'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* TRANSACTIONS */}
        <View style={styles.listContainer}>
          <Text style={[textStyle.fs_abyss_20_400]}>Transactions</Text>

          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <WalletTransactionCard transaction={item} />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={{
              paddingBottom: scale(16),
              paddingHorizontal: scale(4),
              flexGrow: transactions.length === 0 ? 1 : 0,
            }}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (!onEndReachedCalledDuringMomentum.current && hasNextPage) {
                fetchNextPage();
                onEndReachedCalledDuringMomentum.current = true;
              }
            }}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" />
                </View>
              ) : null
            }
            ListEmptyComponent={
              !isLoading && !isError ? (
                <View style={styles.emptyState}>
                  <AboutIcon color={COLORS.theme.primary} />
                  <Text style={[textStyle.fs_mont_16_500]}>
                    No Transactions Found
                  </Text>
                </View>
              ) : null
            }
          />

          {isLoading && (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
      </View>
    </PageWithHeader>
  );
};

export default AstrologerWallet;

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    backgroundColor: COLORS.theme.white,
  },
  balanceCard: {
    backgroundColor: COLORS.theme.primary,
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(24),
  },
  balanceLabel: {
    color: COLORS.theme.white,
  },
  balanceValue: {
    color: COLORS.theme.white,
    marginTop: verticalScale(8),
  },
  balanceSub: {
    color: COLORS.theme.white,
    opacity: 0.8,
  },
  withdrawContainer: {
    marginBottom: verticalScale(24),
  },
  withdrawInput: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.theme.primary,
    paddingVertical: verticalScale(8),
    marginTop: verticalScale(8),
    fontSize: 16,
    color: COLORS.theme.black,
  },
  withdrawButton: {
    marginTop: verticalScale(16),
    backgroundColor: COLORS.theme.primary,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(6),
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: COLORS.theme.white,
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: scale(16),
  },
  footerLoader: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
