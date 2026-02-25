import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  X,
  Check,
  Star,
  Zap,
  Shield,
  Infinity,
  RefreshCw,
  Crown,
  Link2,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { STRIPE_PAYMENT_LINKS } from '@/constants/product-ids';

type PlanKey = 'basic' | 'pro' | 'provider' | 'enterprise';
type BillingPeriod = 'monthly' | 'yearly';

const PLAN_INFO: Record<
  PlanKey,
  { name: string; monthlyPrice: string; yearlyPrice: string; features: string[] }
> = {
  basic: {
    name: 'Básico',
    monthlyPrice: '79,00',
    yearlyPrice: '787,00',
    features: ['Até 3 setores', 'Lançamentos ilimitados', 'Relatórios básicos', 'Backup na nuvem'],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: '249,00',
    yearlyPrice: '2.480,00',
    features: [
      'Setores ilimitados',
      'Relatórios avançados',
      'Exportação PDF e Excel',
      'Integração entre apps',
      'Múltiplas fazendas',
      'Suporte prioritário',
    ],
  },
  provider: {
    name: 'Prestador Pro',
    monthlyPrice: '399,00',
    yearlyPrice: '3.974,00',
    features: [
      'Tudo do Pro',
      'Gestão de clientes',
      'Agenda de serviços',
      'Relatórios por cliente',
      'Equipe ilimitada',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: '599,00',
    yearlyPrice: '5.966,00',
    features: [
      'Tudo do Prestador Pro',
      'API personalizada',
      'Suporte dedicado',
      'Dashboard multi-fazenda',
      'SSO corporativo',
    ],
  },
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('pro');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const { isAuthenticated, isPremium, trialDaysRemaining, needsPayment } = useAuth();

  const daysLeft = trialDaysRemaining();
  const showPaymentRequired = needsPayment();

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Necessário',
        'Faça login para assinar o plano Premium e ter acesso a todos os apps Rumo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/login') },
        ]
      );
      return;
    }

    const plan = PLAN_INFO[selectedPlan];
    const price =
      billingPeriod === 'monthly' ? `R$ ${plan.monthlyPrice}/mês` : `R$ ${plan.yearlyPrice}/ano`;

    if (Platform.OS === 'web') {
      handleStripeCheckout();
    } else {
      Alert.alert(
        '💳 Assinar ' + plan.name,
        `Você será redirecionado para o checkout seguro do Stripe.\n\nValor: ${price}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => handleStripeCheckout() },
        ]
      );
    }
  };

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    try {
      const linkKey = `${selectedPlan}_${billingPeriod}` as keyof typeof STRIPE_PAYMENT_LINKS;
      const paymentUrl = STRIPE_PAYMENT_LINKS[linkKey];
      const supported = await Linking.canOpenURL(paymentUrl);
      if (supported) {
        await Linking.openURL(paymentUrl);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link de pagamento. Tente novamente.');
      }
    } catch {
      Alert.alert('Erro', 'Falha ao abrir checkout. Verifique sua conexão e tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plano Premium</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status atual */}
        {isAuthenticated && (
          <View
            style={[
              styles.statusBanner,
              isPremium
                ? styles.statusPremium
                : showPaymentRequired
                  ? styles.statusExpired
                  : styles.statusTrial,
            ]}
          >
            <Crown size={20} color={colors.textLight} />
            <Text style={styles.statusText}>
              {isPremium
                ? '✨ Você é Premium!'
                : showPaymentRequired
                  ? '⚠️ Assinatura expirada'
                  : `🕐 Trial: ${daysLeft} dias restantes`}
            </Text>
          </View>
        )}

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Zap size={32} color={colors.accent} />
          </View>
          <Text style={styles.heroTitle}>Rumo Premium</Text>
          <Text style={styles.heroSubtitle}>Escolha o plano ideal para sua operação</Text>
        </View>

        {/* Billing Toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, billingPeriod === 'monthly' && styles.toggleBtnActive]}
            onPress={() => setBillingPeriod('monthly')}
          >
            <Text
              style={[
                styles.toggleBtnText,
                billingPeriod === 'monthly' && styles.toggleBtnTextActive,
              ]}
            >
              Mensal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, billingPeriod === 'yearly' && styles.toggleBtnActive]}
            onPress={() => setBillingPeriod('yearly')}
          >
            <Text
              style={[
                styles.toggleBtnText,
                billingPeriod === 'yearly' && styles.toggleBtnTextActive,
              ]}
            >
              Anual 💰
            </Text>
          </TouchableOpacity>
        </View>

        {/* Plan Cards */}
        {(Object.keys(PLAN_INFO) as PlanKey[]).map((planKey) => {
          const plan = PLAN_INFO[planKey];
          const isSelected = selectedPlan === planKey;
          const isPopular = planKey === 'pro';
          const displayPrice = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          const periodLabel = billingPeriod === 'monthly' ? '/mês' : '/ano';

          return (
            <TouchableOpacity
              key={planKey}
              style={[
                styles.planCard,
                isSelected && styles.planCardPopular,
                !isSelected && styles.planCardUnselected,
              ]}
              onPress={() => setSelectedPlan(planKey)}
              activeOpacity={0.7}
            >
              {isPopular && (
                <View style={styles.popularBadge}>
                  <Star size={12} color={colors.textLight} />
                  <Text style={styles.popularText}>Mais Popular</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planPricing}>
                  <Text style={styles.planCurrency}>R$</Text>
                  <Text style={[styles.planPrice, isSelected && { color: colors.primary }]}>
                    {displayPrice}
                  </Text>
                  <Text style={styles.planPeriod}>{periodLabel}</Text>
                </View>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <View style={[styles.checkIcon, isSelected && styles.checkIconPopular]}>
                      <Check size={14} color={isSelected ? colors.primary : colors.success} />
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {isSelected && (
                <TouchableOpacity
                  style={[
                    styles.planButton,
                    styles.planButtonPopular,
                    (isPremium || isProcessing) && styles.planButtonDisabled,
                  ]}
                  onPress={handleSubscribe}
                  disabled={isPremium || isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color={colors.textLight} size="small" />
                  ) : (
                    <Text style={[styles.planButtonText, styles.planButtonTextPopular]}>
                      {isPremium ? 'Assinatura Ativa ✓' : 'Assinar Agora'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Benefícios */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Por que escolher o Premium?</Text>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Infinity size={20} color={colors.primary} strokeWidth={1.5} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Sem Limites</Text>
              <Text style={styles.benefitDescription}>
                Cadastre quantos setores, operações e lançamentos precisar
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Link2 size={20} color={colors.primary} strokeWidth={1.5} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Integração Total</Text>
              <Text style={styles.benefitDescription}>
                Login único para Operacional, Finance e Máquinas
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <RefreshCw size={20} color={colors.primary} strokeWidth={1.5} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Sincronização na Nuvem</Text>
              <Text style={styles.benefitDescription}>
                Seus dados seguros e acessíveis em qualquer dispositivo
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Shield size={20} color={colors.primary} strokeWidth={1.5} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Suporte Prioritário</Text>
              <Text style={styles.benefitDescription}>
                Atendimento rápido para todas as suas dúvidas
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Dúvidas frequentes</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>A assinatura vale para todos os apps?</Text>
            <Text style={styles.faqAnswer}>
              Sim! Sua assinatura dá acesso ao ecossistema completo: Rumo Operacional, Rumo Finance
              e Rumo Máquinas.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Posso cancelar a qualquer momento?</Text>
            <Text style={styles.faqAnswer}>
              Sim! Você pode cancelar sua assinatura quando quiser, sem multas ou taxas adicionais.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Como funciona o período de teste?</Text>
            <Text style={styles.faqAnswer}>
              Oferecemos 7 dias de teste gratuito com acesso a todos os recursos. Você pode testar
              tudo antes de decidir.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  planCardPopular: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  planCardUnselected: {
    opacity: 0.7,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: colors.textLight,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  planCurrency: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primary,
    marginHorizontal: 4,
  },
  planPeriod: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 6,
  },
  planFeatures: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkIconPopular: {
    backgroundColor: colors.primary + '20',
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  planButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  planButtonPopular: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  planButtonDisabled: {
    backgroundColor: colors.success,
    borderColor: colors.success,
    opacity: 0.9,
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  planButtonTextPopular: {
    color: colors.textLight,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  benefitsSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    gap: 8,
  },
  statusTrial: {
    backgroundColor: colors.primary,
  },
  statusPremium: {
    backgroundColor: colors.success,
  },
  statusExpired: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  appsIncluded: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  appsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  appsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  appBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});
