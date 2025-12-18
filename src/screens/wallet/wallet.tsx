import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import PageWithHeader from '../../components/layout/page-with-header';
import WalletTransactionCard from './components/transaction-card';
import AboutIcon from '../../assets/icons/about-icon';

import { COLORS } from '../../constant/colors';
import { scale, verticalScale, moderateScale } from '../../utils/sizer';
import { textStyle } from '../../constant/text-style';

import { Transaction } from '../../utils/types';
import { useWalletTransactions } from '../../api/hooks/useWallet';

const AstrologerWallet = () => {
  const onEndReachedCalledDuringMomentum = useRef(false);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useWalletTransactions();

  /* ---------- FLATTEN DATA ---------- */
  const transactions: Transaction[] =
    data?.pages.flatMap(p => p.wallet?.transactions ?? []) ?? [];

  const walletBalance = data?.pages?.[0]?.wallet?.balance ?? 0;

  return (
    <PageWithHeader scrollEnabled={false}>
      <View style={styles.container}>
        {/* BALANCE CARD */}
        <View style={styles.balanceCard}>
          <Text style={[textStyle.fs_abyss_14_400, styles.balanceLabel]}>
            Available Balance
          </Text>
          <Text style={[textStyle.fs_abyss_24_400, styles.balanceValue]}>
            ₹{Number(walletBalance).toFixed(2)}
          </Text>
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
