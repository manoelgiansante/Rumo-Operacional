import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function TermsScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termos de Uso</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.paragraph}>
          Este aplicativo é oferecido por <Text style={styles.bold}>MM CAMPO FORTE LTDA</Text>,
          inscrita no CNPJ 57.169.838/0001-20, com contato pelo e-mail{' '}
          <Text style={styles.link}>controledemaquinaagricola@gmail.com</Text>, doravante denominada
          &quot;Aplicativo&quot;.
        </Text>

        <Text style={styles.paragraph}>
          O presente termo regula o uso deste aplicativo e suas funcionalidades de gestão de custos
          operacionais rurais, incluindo setores, operações, lançamentos de despesas, verificação de
          notas fiscais e relatórios.
        </Text>

        <Text style={styles.sectionTitle}>1. Responsabilidade do Usuário</Text>
        <Text style={styles.paragraph}>
          Ao utilizar o aplicativo, o usuário declara estar ciente de que todas as informações
          inseridas são de sua responsabilidade e concorda com o tratamento dos dados fornecidos
          conforme a Política de Privacidade.
        </Text>
        <Text style={styles.paragraph}>
          O aplicativo fornece informações e relatórios de forma automatizada, sem substituir
          orientações técnicas, contábeis ou financeiras profissionais.
        </Text>
        <Text style={styles.paragraph}>
          O usuário reconhece que eventuais erros de operação, inserção de dados ou interpretação
          são de sua responsabilidade.
        </Text>

        <Text style={styles.sectionTitle}>2. Proteção de Dados</Text>
        <Text style={styles.paragraph}>
          O usuário autoriza o tratamento dos seus dados pessoais exclusivamente para o
          funcionamento do aplicativo, conforme a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados
          – LGPD).
        </Text>
        <Text style={styles.paragraph}>
          Nenhum dado será compartilhado com terceiros sem consentimento expresso.
        </Text>
        <Text style={styles.paragraph}>
          O aplicativo adota medidas técnicas e administrativas para proteger as informações
          armazenadas.
        </Text>

        <Text style={styles.sectionTitle}>3. Assinaturas e Pagamentos</Text>
        <Text style={styles.paragraph}>
          O usuário está ciente de que o aplicativo oferece planos pagos e que as transações são
          realizadas exclusivamente pelas lojas oficiais (App Store e Google Play) ou via Stripe (na
          versão web), sujeitas às políticas e taxas dessas plataformas.
        </Text>
        <Text style={styles.paragraph}>
          O usuário pode cancelar sua assinatura diretamente nas lojas ou via o painel web a
          qualquer momento.
        </Text>

        <Text style={styles.sectionTitle}>4. Atualizações dos Termos</Text>
        <Text style={styles.paragraph}>
          O aplicativo poderá atualizar estes termos a qualquer momento.
        </Text>
        <Text style={styles.paragraph}>
          Caso haja alterações relevantes, o usuário será notificado e deverá aceitar novamente os
          termos antes de continuar o uso.
        </Text>

        <Text style={styles.sectionTitle}>5. Cancelamento e Exclusão</Text>
        <Text style={styles.paragraph}>
          O usuário pode cancelar sua assinatura ou excluir sua conta dentro do aplicativo.
        </Text>
        <Text style={styles.paragraph}>
          A exclusão da conta implica na remoção definitiva dos dados pessoais armazenados, conforme
          os termos da LGPD.
        </Text>

        <Text style={styles.sectionTitle}>6. Foro</Text>
        <Text style={styles.paragraph}>
          Este termo é regido pelas leis da República Federativa do Brasil.
        </Text>
        <Text style={styles.paragraph}>
          Fica eleito o foro da comarca de Araraquara – SP para dirimir quaisquer dúvidas ou
          controvérsias relacionadas a este documento.
        </Text>

        <View style={styles.acceptSection}>
          <Text style={styles.acceptText}>
            Ao utilizar o aplicativo Rumo Operacional, o usuário declara que leu, entendeu e aceita
            integralmente os Termos de Uso e a Política de Privacidade.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 MM CAMPO FORTE LTDA. Todos os direitos reservados.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F6F0',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 12,
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  acceptSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  acceptText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
