import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { 
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  Star,
  LogOut,
  Trash2,
  Plus,
  User,
  Mail,
  Edit3,
  Cloud,
  CloudOff
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { operations, deleteOperation, sectors, deleteSector } = useApp();
  const { signOut, isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState(true);

  const handleDeleteOperation = (id: string, name: string) => {
    Alert.alert(
      'Excluir Operação',
      `Deseja excluir "${name}"? Os lançamentos associados permanecerão no sistema.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteOperation(id)
        },
      ]
    );
  };

  const handleDeleteSector = (id: string, name: string) => {
    Alert.alert(
      'Excluir Setor',
      `Deseja excluir "${name}"? As operações e lançamentos associados permanecerão no sistema.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteSector(id)
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seção de Conta - Sempre no topo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          {isAuthenticated ? (
            // Usuário logado
            <View style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <View style={styles.accountAvatar}>
                  <User size={24} color={colors.primary} strokeWidth={1.5} />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountEmail}>{user?.email}</Text>
                  <View style={styles.syncBadge}>
                    <Cloud size={12} color={colors.success} strokeWidth={1.5} />
                    <Text style={styles.syncText}>Sincronizado</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.accountButton}
                onPress={() => {
                  Alert.alert(
                    'Sair da Conta',
                    'Seus dados locais serão mantidos. Deseja sair?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { 
                        text: 'Sair', 
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await signOut();
                          } catch (error) {
                            Alert.alert('Erro', 'Não foi possível sair da conta');
                          }
                        }
                      },
                    ]
                  );
                }}
              >
                <LogOut size={16} color={colors.error} strokeWidth={1.5} />
                <Text style={styles.accountButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Usuário não logado
            <View style={styles.accountCardGuest}>
              <View style={styles.guestIcon}>
                <CloudOff size={24} color={colors.textMuted} strokeWidth={1.5} />
              </View>
              <Text style={styles.guestTitle}>Modo Offline</Text>
              <Text style={styles.guestDescription}>
                Seus dados estão salvos apenas neste dispositivo. Crie uma conta para sincronizar na nuvem.
              </Text>
              
              <View style={styles.authButtons}>
                <TouchableOpacity 
                  style={styles.authButtonPrimary}
                  onPress={() => router.push('/login')}
                >
                  <Mail size={16} color={colors.textLight} strokeWidth={1.5} />
                  <Text style={styles.authButtonPrimaryText}>Criar Conta</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.authButtonSecondary}
                  onPress={() => router.push('/login')}
                >
                  <Text style={styles.authButtonSecondaryText}>Já tenho conta</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Seção de Setores */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Setores</Text>
            <TouchableOpacity onPress={() => router.push('/add-sector')}>
              <Plus size={20} color={colors.primary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {sectors.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum setor cadastrado</Text>
            </View>
          ) : (
            sectors.map((sector) => (
              <View key={sector.id} style={styles.operationItem}>
                <View style={[styles.operationDot, { backgroundColor: sector.color }]} />
                <View style={styles.operationInfo}>
                  <Text style={styles.operationName}>{sector.name}</Text>
                  <Text style={styles.operationDescription}>{sector.description}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => router.push(`/edit-sector?id=${sector.id}` as any)}
                >
                  <Edit3 size={16} color={colors.textMuted} strokeWidth={1.5} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSector(sector.id, sector.name)}
                >
                  <Trash2 size={16} color={colors.error} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Seção de Operações */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Operações</Text>
            <TouchableOpacity onPress={() => router.push('/add-operation')}>
              <Plus size={20} color={colors.primary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {operations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma operação cadastrada</Text>
            </View>
          ) : (
            operations.map((operation) => (
              <View key={operation.id} style={styles.operationItem}>
                <View style={[styles.operationDot, { backgroundColor: operation.color }]} />
                <View style={styles.operationInfo}>
                  <Text style={styles.operationName}>{operation.name}</Text>
                  <Text style={styles.operationDescription}>{operation.description}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => router.push(`/edit-operation?id=${operation.id}` as any)}
                >
                  <Edit3 size={16} color={colors.textMuted} strokeWidth={1.5} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteOperation(operation.id, operation.name)}
                >
                  <Trash2 size={16} color={colors.error} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Preferências */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={18} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.settingLabel}>Notificações</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={notifications ? colors.primary : colors.textMuted}
            />
          </View>
        </View>

        {/* Assinatura */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assinatura</Text>
          
          <TouchableOpacity 
            style={styles.subscriptionCard}
            onPress={() => router.push('/subscription')}
          >
            <View style={styles.subscriptionIcon}>
              <Star size={20} color={colors.accent} strokeWidth={1.5} />
            </View>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>Plano Premium</Text>
              <Text style={styles.subscriptionText}>
                Todas as funcionalidades liberadas
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        {/* Suporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <HelpCircle size={18} color={colors.textSecondary} strokeWidth={1.5} />
            </View>
            <Text style={styles.menuLabel}>Central de Ajuda</Text>
            <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Shield size={18} color={colors.textSecondary} strokeWidth={1.5} />
            </View>
            <Text style={styles.menuLabel}>Privacidade</Text>
            <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Agrofinance v1.0.0</Text>
          <Text style={styles.footerSubtext}>Custo Operacional Rural</Text>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  // Conta - Logado
  accountCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountEmail: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncText: {
    fontSize: 12,
    color: colors.success,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  accountButtonText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
  },
  // Conta - Não logado
  accountCardGuest: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  guestIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  guestDescription: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  authButtons: {
    width: '100%',
    gap: 10,
  },
  authButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  authButtonPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textLight,
  },
  authButtonSecondary: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  authButtonSecondaryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  // Operações e Setores
  operationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  operationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  operationInfo: {
    flex: 1,
  },
  operationName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  operationDescription: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  editButton: {
    padding: 8,
    marginRight: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  // Preferências
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  // Assinatura
  subscriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accent + '30',
  },
  subscriptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  subscriptionText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  // Menu
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 2,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textMuted,
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 30,
  },
});
