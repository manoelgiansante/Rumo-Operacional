import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface FinancialSummary {
  totalExpenses: number;
  totalRevenues: number;
  balance: number;
  pendingExpenses: number;
}

interface RecentTransaction {
  id: string;
  type: 'expense' | 'revenue';
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function FinanceIntegrationScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalExpenses: 0,
    totalRevenues: 0,
    balance: 0,
    pendingExpenses: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'error'>('connected');

  const loadFinancialData = useCallback(async () => {
    try {
      setSyncStatus('syncing');

      // Carregar despesas do mesmo Supabase compartilhado
      const { data: expenses, error: expError } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })
        .limit(50);

      if (expError) throw expError;

      // Carregar receitas
      const { data: revenues, error: revError } = await supabase
        .from('revenues')
        .select('*')
        .order('date', { ascending: false })
        .limit(50);

      if (revError) throw revError;

      // Calcular sumário
      const totalExpenses = expenses?.reduce((acc, e) => acc + (e.amount || 0), 0) || 0;
      const totalRevenues = revenues?.reduce((acc, r) => acc + (r.amount || 0), 0) || 0;
      const pendingExpenses =
        expenses
          ?.filter((e) => e.status === 'pending')
          .reduce((acc, e) => acc + (e.amount || 0), 0) || 0;

      setSummary({
        totalExpenses,
        totalRevenues,
        balance: totalRevenues - totalExpenses,
        pendingExpenses,
      });

      // Combinar e ordenar transações recentes
      const allTransactions: RecentTransaction[] = [
        ...(expenses || []).slice(0, 5).map((e) => ({
          id: e.id,
          type: 'expense' as const,
          description: e.description || 'Despesa',
          amount: e.amount || 0,
          date: e.date,
          category: e.category || 'Outros',
        })),
        ...(revenues || []).slice(0, 5).map((r) => ({
          id: r.id,
          type: 'revenue' as const,
          description: r.description || 'Receita',
          amount: r.amount || 0,
          date: r.date,
          category: r.category || 'Vendas',
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      setRecentTransactions(allTransactions);
      setSyncStatus('connected');
    } catch (error) {
      console.error('Error loading financial data:', error);
      setSyncStatus('error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFinancialData();
  }, [loadFinancialData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'connected':
        return colors.success;
      case 'syncing':
        return colors.warning;
      case 'error':
        return colors.error;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'connected':
        return 'Sincronizado';
      case 'syncing':
        return 'Sincronizando...';
      case 'error':
        return 'Erro de conexão';
    }
  };

  const openRumoFinance = () => {
    Alert.alert(
      'Abrir Rumo Finance',
      'O app Rumo Finance será aberto para gerenciamento financeiro completo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir',
          onPress: () => {
            // Deep link para o Rumo Finance
            // Linking.openURL('rumofinance://');
            Alert.alert('Em breve', 'Integração com deep link em desenvolvimento');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dados financeiros...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Integração Financeira</Text>
          <View style={[styles.syncBadge, { backgroundColor: getSyncStatusColor() + '20' }]}>
            <View style={[styles.syncDot, { backgroundColor: getSyncStatusColor() }]} />
            <Text style={[styles.syncText, { color: getSyncStatusColor() }]}>
              {getSyncStatusText()}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* App Connection Banner */}
        <TouchableOpacity style={styles.connectionBanner} onPress={openRumoFinance}>
          <View style={styles.connectionIconContainer}>
            <Ionicons name="link" size={28} color={colors.textLight} />
          </View>
          <View style={styles.connectionInfo}>
            <Text style={styles.connectionTitle}>Conectado ao Rumo Finance</Text>
            <Text style={styles.connectionSubtitle}>
              Dados financeiros sincronizados automaticamente
            </Text>
          </View>
          <Ionicons name="open-outline" size={22} color={colors.textLight} />
        </TouchableOpacity>

        {/* Financial Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.revenueCard]}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="trending-up" size={24} color={colors.success} />
              </View>
              <Text style={styles.cardLabel}>Receitas</Text>
              <Text style={[styles.cardValue, { color: colors.success }]}>
                {formatCurrency(summary.totalRevenues)}
              </Text>
            </View>

            <View style={[styles.summaryCard, styles.expenseCard]}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="trending-down" size={24} color={colors.error} />
              </View>
              <Text style={styles.cardLabel}>Despesas</Text>
              <Text style={[styles.cardValue, { color: colors.error }]}>
                {formatCurrency(summary.totalExpenses)}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.balanceCard,
              summary.balance >= 0 ? styles.positiveBalance : styles.negativeBalance,
            ]}
          >
            <View style={styles.balanceLeft}>
              <Ionicons
                name={summary.balance >= 0 ? 'wallet' : 'alert-circle'}
                size={32}
                color={colors.textLight}
              />
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Saldo Atual</Text>
                <Text style={styles.balanceValue}>{formatCurrency(summary.balance)}</Text>
              </View>
            </View>
            {summary.pendingExpenses > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>
                  {formatCurrency(summary.pendingExpenses)} pendente
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações Recentes</Text>
            <TouchableOpacity onPress={openRumoFinance}>
              <Text style={styles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
              <Text style={styles.emptySubtext}>Adicione despesas ou receitas no Rumo Finance</Text>
            </View>
          ) : (
            recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        transaction.type === 'revenue'
                          ? colors.success + '20'
                          : colors.error + '20',
                    },
                  ]}
                >
                  <Ionicons
                    name={transaction.type === 'revenue' ? 'arrow-down' : 'arrow-up'}
                    size={18}
                    color={transaction.type === 'revenue' ? colors.success : colors.error}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription} numberOfLines={1}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionCategory}>
                    {transaction.category} • {formatDate(transaction.date)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: transaction.type === 'revenue' ? colors.success : colors.error },
                  ]}
                >
                  {transaction.type === 'revenue' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/add-expense')}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.error + '20' }]}>
                <Ionicons name="add-circle" size={28} color={colors.error} />
              </View>
              <Text style={styles.actionText}>Nova Despesa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={openRumoFinance}>
              <View
                style={[styles.actionIconContainer, { backgroundColor: colors.success + '20' }]}
              >
                <Ionicons name="cash" size={28} color={colors.success} />
              </View>
              <Text style={styles.actionText}>Nova Receita</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={openRumoFinance}>
              <View
                style={[styles.actionIconContainer, { backgroundColor: colors.primary + '20' }]}
              >
                <Ionicons name="bar-chart" size={28} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Relatórios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={openRumoFinance}>
              <View
                style={[styles.actionIconContainer, { backgroundColor: colors.warning + '20' }]}
              >
                <Ionicons name="calendar" size={28} color={colors.warning} />
              </View>
              <Text style={styles.actionText}>Previsões</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Integration Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Sobre a Integração</Text>
            <Text style={styles.infoText}>
              Os dados operacionais do Rumo Operacional são automaticamente sincronizados com o Rumo
              Finance. Despesas e custos registrados aqui aparecem no seu controle financeiro
              completo.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerCenter: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    maxWidth: isWeb ? 800 : undefined,
    alignSelf: isWeb ? 'center' : undefined,
    width: isWeb ? '100%' : undefined,
  },
  connectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  connectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textLight,
  },
  connectionSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  revenueCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  cardIconContainer: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 20,
  },
  positiveBalance: {
    backgroundColor: colors.success,
  },
  negativeBalance: {
    backgroundColor: colors.error,
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceInfo: {
    marginLeft: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textLight,
  },
  pendingBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  transactionCategory: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 44) / 2,
    maxWidth: isWeb ? 180 : undefined,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
});
