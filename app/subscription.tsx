import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Check, Star, Zap, Shield, Infinity, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { subscriptionPlans } from '@/mocks/data';

export default function SubscriptionScreen() {
  const router = useRouter();
  const plan = subscriptionPlans[0]; // Plano único premium

  const handleSubscribe = () => {
    Alert.alert(
      'Assinatura',
      'Funcionalidade de pagamento em desenvolvimento. Em breve você poderá assinar o plano Premium!',
      [{ text: 'OK' }]
    );
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
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Zap size={32} color={colors.accent} />
          </View>
          <Text style={styles.heroTitle}>Agrofinance Premium</Text>
          <Text style={styles.heroSubtitle}>
            Gestão completa para sua propriedade rural
          </Text>
        </View>

        {/* Card do Plano Único */}
        <View style={[styles.planCard, styles.planCardPopular]}>
          <View style={styles.popularBadge}>
            <Star size={12} color={colors.textLight} />
            <Text style={styles.popularText}>Plano Completo</Text>
          </View>

          <View style={styles.planHeader}>
            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.planPricing}>
              <Text style={styles.planCurrency}>R$</Text>
              <Text style={styles.planPrice}>
                {plan.price.toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.planPeriod}>/mês</Text>
            </View>
          </View>

          <View style={styles.planFeatures}>
            {plan.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <View style={[styles.checkIcon, styles.checkIconPopular]}>
                  <Check size={14} color={colors.primary} />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.planButton, styles.planButtonPopular]}
            onPress={handleSubscribe}
          >
            <Text style={[styles.planButtonText, styles.planButtonTextPopular]}>
              Assinar Agora
            </Text>
          </TouchableOpacity>
        </View>

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
            <Text style={styles.faqQuestion}>Posso cancelar a qualquer momento?</Text>
            <Text style={styles.faqAnswer}>
              Sim! Você pode cancelar sua assinatura quando quiser, sem multas ou taxas adicionais.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Como funciona o período de teste?</Text>
            <Text style={styles.faqAnswer}>
              Oferecemos 14 dias de teste gratuito em todos os planos pagos. Você pode testar todas as funcionalidades antes de decidir.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Posso mudar de plano depois?</Text>
            <Text style={styles.faqAnswer}>
              Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. O valor será ajustado proporcionalmente.
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
});
