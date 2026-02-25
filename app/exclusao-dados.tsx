import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertCircle, Trash2, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ExclusaoDadosScreen() {
  const router = useRouter();
  const { user, signOut, isAuthenticated } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const CONFIRM_WORD = 'EXCLUIR';

  const handleDeleteAccount = async () => {
    if (confirmText.trim().toUpperCase() !== CONFIRM_WORD) {
      Alert.alert('Erro', `Digite "${CONFIRM_WORD}" para confirmar a exclusão.`);
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para excluir sua conta.');
      return;
    }

    Alert.alert(
      '⚠️ Confirmação Final',
      'Esta ação é IRREVERSÍVEL. Todos os seus dados serão permanentemente excluídos. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir Permanentemente',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              // Deletar dados do usuário no Supabase
              const userId = user.id;

              // Deletar expenses
              await supabase.from('expenses').delete().eq('user_id', userId);
              // Deletar operations
              await supabase.from('operations').delete().eq('user_id', userId);
              // Deletar sectors
              await supabase.from('sectors').delete().eq('user_id', userId);

              console.log('[DELETE ACCOUNT] Dados deletados com sucesso');
              setDeleteSuccess(true);

              setTimeout(async () => {
                await signOut();
                router.replace('/');
              }, 3000);
            } catch (error) {
              console.error('[DELETE ACCOUNT] Erro:', error);
              Alert.alert(
                'Erro',
                'Não foi possível excluir a conta. Entre em contato pelo email controledemaquinaagricola@gmail.com'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (deleteSuccess) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <CheckCircle size={80} color={colors.success} />
          <Text style={styles.successTitle}>Conta Excluída</Text>
          <Text style={styles.successText}>Seus dados foram removidos permanentemente.</Text>
          <Text style={styles.successText}>Redirecionando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Excluir Conta</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.iconSection}>
            <AlertCircle size={64} color="#DC2626" />
            <Text style={styles.title}>Excluir Minha Conta</Text>
            <Text style={styles.subtitle}>Esta ação não pode ser desfeita</Text>
          </View>

          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠️ ATENÇÃO</Text>
            <Text style={styles.warningText}>
              Ao excluir sua conta,{' '}
              <Text style={styles.warningBold}>
                todos os seus dados serão permanentemente removidos
              </Text>
              , incluindo:
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoItem}>• Todos os setores cadastrados</Text>
            <Text style={styles.infoItem}>• Todas as operações</Text>
            <Text style={styles.infoItem}>• Todos os lançamentos de despesas</Text>
            <Text style={styles.infoItem}>• Relatórios e históricos</Text>
            <Text style={styles.infoItem}>• Perfil e configurações</Text>
            <Text style={styles.infoItem}>• Assinatura (será cancelada)</Text>
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Observações Importantes:</Text>
            <Text style={styles.noteText}>• Esta ação é irreversível</Text>
            <Text style={styles.noteText}>• Sua assinatura será cancelada automaticamente</Text>
            <Text style={styles.noteText}>• Você poderá criar uma nova conta no futuro</Text>
          </View>

          {isAuthenticated ? (
            <>
              <View style={styles.confirmSection}>
                <Text style={styles.confirmLabel}>
                  Para confirmar, digite &quot;
                  <Text style={styles.confirmKeyword}>{CONFIRM_WORD}</Text>&quot; abaixo:
                </Text>
                <TextInput
                  style={styles.confirmInput}
                  value={confirmText}
                  onChangeText={setConfirmText}
                  placeholder={`Digite ${CONFIRM_WORD}`}
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  editable={!isDeleting}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  (isDeleting || confirmText.trim().toUpperCase() !== CONFIRM_WORD) &&
                    styles.deleteButtonDisabled,
                ]}
                onPress={handleDeleteAccount}
                disabled={isDeleting || confirmText.trim().toUpperCase() !== CONFIRM_WORD}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Trash2 size={20} color="#FFF" />
                    <Text style={styles.deleteButtonText}>Excluir Conta Permanentemente</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.loginRequired}>
              <Text style={styles.loginRequiredText}>
                Você precisa estar logado para excluir sua conta.
              </Text>
            </View>
          )}

          <View style={styles.supportSection}>
            <Text style={styles.supportText}>Precisa de ajuda? Entre em contato:</Text>
            <Text style={styles.supportEmail}>controledemaquinaagricola@gmail.com</Text>
          </View>
        </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 15,
    color: '#991B1B',
    lineHeight: 22,
    textAlign: 'center',
  },
  warningBold: {
    fontWeight: '700',
    color: '#DC2626',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoItem: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 28,
  },
  noteCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 22,
    marginBottom: 4,
  },
  confirmSection: {
    marginBottom: 24,
  },
  confirmLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  confirmKeyword: {
    fontWeight: '700',
    color: '#DC2626',
    fontSize: 17,
  },
  confirmInput: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: colors.border,
    textAlign: 'center',
    fontWeight: '600',
    color: colors.text,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    minHeight: 56,
  },
  deleteButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 30,
    minHeight: 56,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  supportSection: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  supportText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  supportEmail: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  loginRequired: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginRequiredText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.success,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
});
