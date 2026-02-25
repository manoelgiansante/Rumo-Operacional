import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Mail,
  Shield,
  Database,
  Lock,
  UserCheck,
  Bell,
  Globe,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const showBackButton = params.back !== 'false';

  const handleEmailPress = () => {
    Linking.openURL('mailto:controledemaquinaagricola@gmail.com');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {showBackButton && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Política de Privacidade</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.heroSection}>
          <Shield size={48} color={colors.primary} />
          <Text style={styles.title}>Política de Privacidade</Text>
          <Text style={styles.appName}>Rumo Operacional - Gestão de Custo Operacional Rural</Text>
          <Text style={styles.updateDate}>Última atualização: 25 de fevereiro de 2026</Text>
        </View>

        {/* Introdução */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Esta Política de Privacidade descreve como a{' '}
            <Text style={styles.bold}>MM CAMPO FORTE LTDA</Text>, inscrita no CNPJ
            57.169.838/0001-20, coleta, usa, armazena e protege as informações dos usuários do
            aplicativo <Text style={styles.bold}>Rumo Operacional</Text>.
          </Text>
          <Text style={styles.paragraph}>
            Ao utilizar nosso aplicativo, você concorda com os termos desta Política de Privacidade.
            Caso não concorde com qualquer disposição aqui descrita, recomendamos que não utilize o
            aplicativo.
          </Text>
        </View>

        {/* Lei Geral de Proteção de Dados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>1. Lei Geral de Proteção de Dados (LGPD)</Text>
          </View>
          <Text style={styles.paragraph}>
            Esta Política de Privacidade está em conformidade com a{' '}
            <Text style={styles.bold}>
              Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD)
            </Text>
            , que regula o tratamento de dados pessoais no Brasil, incluindo nos meios digitais, por
            pessoa natural ou por pessoa jurídica de direito público ou privado.
          </Text>
          <Text style={styles.paragraph}>
            Nos termos da LGPD, informamos que a{' '}
            <Text style={styles.bold}>MM CAMPO FORTE LTDA</Text> atua como Controladora dos dados
            pessoais coletados por meio deste aplicativo, sendo responsável pelas decisões
            referentes ao tratamento de dados pessoais.
          </Text>
        </View>

        {/* Dados Coletados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>2. Dados Coletados</Text>
          </View>
          <Text style={styles.paragraph}>
            O aplicativo pode coletar os seguintes tipos de dados:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Dados de identificação:</Text> nome, e-mail, telefone e
              informações de cadastro;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Dados de uso:</Text> informações sobre como você utiliza o
              aplicativo, incluindo registros de setores, operações, lançamentos de despesas e
              relatórios operacionais;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Dados do dispositivo:</Text> modelo do dispositivo,
              sistema operacional, identificadores únicos e informações de rede;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Dados financeiros:</Text> valores de despesas,
              fornecedores, notas fiscais e informações de custos operacionais inseridos pelo
              usuário;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Dados de assinatura:</Text> informações relacionadas ao
              plano de assinatura contratado.
            </Text>
          </View>
        </View>

        {/* Finalidade do Tratamento */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserCheck size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>3. Finalidade do Tratamento de Dados</Text>
          </View>
          <Text style={styles.paragraph}>
            Os dados coletados são utilizados para as seguintes finalidades, conforme Art. 7º da
            LGPD:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Execução do contrato e prestação dos serviços do aplicativo;
            </Text>
            <Text style={styles.bulletItem}>
              • Permitir o funcionamento correto de recursos como registro de operações,
              gerenciamento de custos e geração de relatórios;
            </Text>
            <Text style={styles.bulletItem}>
              • Melhoria contínua da experiência do usuário e das funcionalidades oferecidas;
            </Text>
            <Text style={styles.bulletItem}>
              • Envio de notificações sobre vencimentos, alertas e atualizações importantes;
            </Text>
            <Text style={styles.bulletItem}>
              • Garantir a segurança e integridade do aplicativo;
            </Text>
            <Text style={styles.bulletItem}>
              • Cumprimento de obrigações legais e regulatórias;
            </Text>
            <Text style={styles.bulletItem}>
              • Proteção do crédito e exercício regular de direitos.
            </Text>
          </View>
        </View>

        {/* Base Legal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>4. Base Legal para o Tratamento</Text>
          </View>
          <Text style={styles.paragraph}>
            O tratamento de dados pessoais realizado pelo aplicativo tem como bases legais, conforme
            Art. 7º da LGPD:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Consentimento do titular:</Text> fornecido de forma livre,
              informada e inequívoca no momento do cadastro e ao aceitar os Termos de Uso;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Execução de contrato:</Text> necessário para a prestação
              dos serviços contratados;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Legítimo interesse:</Text> para melhoria dos serviços e
              personalização da experiência;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Cumprimento de obrigação legal:</Text> quando exigido por
              lei ou regulamentação aplicável.
            </Text>
          </View>
        </View>

        {/* Compartilhamento de Dados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>5. Compartilhamento de Dados</Text>
          </View>
          <Text style={styles.paragraph}>
            O{' '}
            <Text style={styles.bold}>
              Rumo Operacional NÃO vende, aluga ou compartilha dados pessoais ou dados financeiros
              com terceiros
            </Text>{' '}
            para fins comerciais ou de marketing.
          </Text>
          <Text style={styles.paragraph}>
            Os dados poderão ser compartilhados apenas nas seguintes hipóteses:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Com prestadores de serviços essenciais para o funcionamento do aplicativo
              (hospedagem, processamento de pagamentos), que estão sujeitos a obrigações contratuais
              de confidencialidade;
            </Text>
            <Text style={styles.bulletItem}>
              • Quando exigido por lei, ordem judicial ou autoridade competente;
            </Text>
            <Text style={styles.bulletItem}>
              • Para proteção dos direitos, propriedade ou segurança da MM CAMPO FORTE LTDA, dos
              usuários ou de terceiros.
            </Text>
          </View>
        </View>

        {/* Armazenamento e Segurança */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>6. Armazenamento e Segurança dos Dados</Text>
          </View>
          <Text style={styles.paragraph}>
            Adotamos medidas técnicas e organizacionais adequadas para proteger os dados pessoais
            contra acesso não autorizado, perda acidental, destruição ou uso indevido, incluindo:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Criptografia de dados em trânsito e em repouso;</Text>
            <Text style={styles.bulletItem}>• Controle de acesso restrito aos dados;</Text>
            <Text style={styles.bulletItem}>• Monitoramento e auditoria de acessos;</Text>
            <Text style={styles.bulletItem}>• Backups regulares e seguros;</Text>
            <Text style={styles.bulletItem}>
              • Servidores seguros com certificações de segurança.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Os dados são armazenados em servidores seguros localizados em data centers com
            certificações internacionais de segurança.
          </Text>
        </View>

        {/* Retenção de Dados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>7. Período de Retenção dos Dados</Text>
          </View>
          <Text style={styles.paragraph}>
            Os dados pessoais serão mantidos pelo tempo necessário para cumprir as finalidades para
            as quais foram coletados, incluindo para atender requisitos legais, contábeis ou de
            relatórios, conforme Art. 16 da LGPD.
          </Text>
          <Text style={styles.paragraph}>
            Após o término do tratamento, os dados serão eliminados, salvo quando a lei autorizar
            sua conservação.
          </Text>
        </View>

        {/* Direitos do Titular */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserCheck size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              8. Direitos do Titular dos Dados (Art. 18 da LGPD)
            </Text>
          </View>
          <Text style={styles.paragraph}>
            Conforme a LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Confirmação e acesso:</Text> confirmar a existência de
              tratamento e acessar seus dados;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Correção:</Text> solicitar a correção de dados
              incompletos, inexatos ou desatualizados;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Anonimização, bloqueio ou eliminação:</Text> solicitar a
              anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados
              em desconformidade;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Portabilidade:</Text> solicitar a portabilidade dos dados
              a outro fornecedor;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Eliminação:</Text> solicitar a eliminação dos dados
              tratados com consentimento;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Informação sobre compartilhamento:</Text> obter informação
              sobre entidades com as quais seus dados foram compartilhados;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Revogação do consentimento:</Text> revogar o consentimento
              a qualquer momento;
            </Text>
            <Text style={styles.bulletItem}>
              • <Text style={styles.bold}>Oposição:</Text> opor-se ao tratamento de dados quando
              realizado em desconformidade com a lei.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Para exercer qualquer um desses direitos, entre em contato conosco pelo e-mail informado
            ao final desta política.
          </Text>
        </View>

        {/* Consentimento */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>9. Consentimento do Usuário</Text>
          </View>
          <Text style={styles.paragraph}>
            A coleta de dados ocorre{' '}
            <Text style={styles.bold}>somente após o consentimento explícito do usuário</Text>,
            solicitado de forma clara no primeiro acesso ao aplicativo e sempre que uma nova
            permissão for necessária.
          </Text>
          <Text style={styles.paragraph}>
            O usuário pode revogar seu consentimento a qualquer momento através das configurações do
            aplicativo ou do próprio dispositivo, ciente de que isso poderá impactar o funcionamento
            de algumas funcionalidades.
          </Text>
        </View>

        {/* Cookies e Tecnologias */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>10. Cookies e Tecnologias Similares</Text>
          </View>
          <Text style={styles.paragraph}>
            O aplicativo pode utilizar tecnologias como cookies, tokens de autenticação e
            armazenamento local para melhorar a experiência do usuário, lembrar preferências e
            manter a sessão ativa.
          </Text>
        </View>

        {/* Menores de Idade */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>11. Menores de Idade</Text>
          </View>
          <Text style={styles.paragraph}>
            O aplicativo não é destinado a menores de 18 anos. Não coletamos intencionalmente dados
            de menores de idade. Caso tome conhecimento de que dados de um menor foram coletados
            inadvertidamente, entre em contato conosco para que possamos tomar as providências
            necessárias.
          </Text>
        </View>

        {/* Transferência Internacional */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>12. Transferência Internacional de Dados</Text>
          </View>
          <Text style={styles.paragraph}>
            Os dados poderão ser transferidos e armazenados em servidores localizados fora do
            Brasil. Nesse caso, garantimos que a transferência ocorrerá em conformidade com a LGPD,
            assegurando níveis adequados de proteção de dados.
          </Text>
        </View>

        {/* Alterações */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>13. Alterações nesta Política</Text>
          </View>
          <Text style={styles.paragraph}>
            Esta Política de Privacidade pode ser atualizada periodicamente para refletir alterações
            em nossas práticas, tecnologias, requisitos legais ou outros fatores. Recomendamos que o
            usuário revise este conteúdo regularmente.
          </Text>
          <Text style={styles.paragraph}>
            Alterações significativas serão comunicadas por meio do aplicativo ou por e-mail, quando
            aplicável.
          </Text>
        </View>

        {/* Contato */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mail size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>14. Contato e Encarregado de Dados (DPO)</Text>
          </View>
          <Text style={styles.paragraph}>
            Em caso de dúvidas sobre esta Política de Privacidade, sobre o tratamento de seus dados
            pessoais, ou para exercer seus direitos como titular de dados, entre em contato:
          </Text>

          <View style={styles.contactBox}>
            <Text style={styles.contactLabel}>Controladora:</Text>
            <Text style={styles.contactValue}>MM CAMPO FORTE LTDA</Text>

            <Text style={styles.contactLabel}>CNPJ:</Text>
            <Text style={styles.contactValue}>57.169.838/0001-20</Text>

            <Text style={styles.contactLabel}>E-mail:</Text>
            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={styles.contactLink}>controledemaquinaagricola@gmail.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rodapé Legal */}
        <View style={styles.legalFooter}>
          <Text style={styles.legalText}>
            Esta Política de Privacidade está em conformidade com:
          </Text>
          <Text style={styles.legalItem}>• Lei nº 13.709/2018 (LGPD)</Text>
          <Text style={styles.legalItem}>• Marco Civil da Internet (Lei nº 12.965/2014)</Text>
          <Text style={styles.legalItem}>• Código de Defesa do Consumidor (Lei nº 8.078/1990)</Text>
          <Text style={styles.legalItem}>• Constituição Federal, Art. 5º, X e XII</Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  appName: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  updateDate: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 10,
    flex: 1,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
    marginBottom: 12,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
  bulletList: {
    marginTop: 8,
    marginBottom: 8,
  },
  bulletItem: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
    marginBottom: 8,
    paddingLeft: 8,
  },
  contactBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 8,
  },
  contactValue: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  contactLink: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  legalFooter: {
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  legalText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  legalItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    paddingLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
