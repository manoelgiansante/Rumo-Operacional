import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CrossAppService } from '@/lib/crossApp';

interface SubscriptionBannerProps {
  email?: string;
  hasBonus?: boolean;
  isPremium?: boolean;
  onSubscribe?: () => void;
  compact?: boolean;
}

export function SubscriptionBanner({ 
  email, 
  hasBonus = false, 
  isPremium = false,
  onSubscribe, 
  compact = false 
}: SubscriptionBannerProps) {
  
  const openRumoFinance = async () => {
    const deepLink = CrossAppService.getDeepLink('finance');
    
    try {
      const canOpen = await Linking.canOpenURL(deepLink);
      if (canOpen) {
        await Linking.openURL(deepLink);
      } else {
        console.log('Rumo Finance não instalado');
      }
    } catch (err) {
      console.error('Erro ao abrir Rumo Finance:', err);
    }
  };

  // Se tem bônus ativo via Rumo Finance
  if (hasBonus) {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <LinearGradient
          colors={['#f59e0b', '#d97706']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="star" size={compact ? 24 : 32} color="#fff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, compact && styles.titleCompact]}>
                Premium via Rumo Finance
              </Text>
              <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
                Acesso completo incluso na sua assinatura!
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={openRumoFinance}
            >
              <Ionicons name="apps" size={16} color="#f59e0b" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Se já é premium diretamente
  if (isPremium) {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <LinearGradient
          colors={['#10b981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={compact ? 24 : 32} color="#fff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, compact && styles.titleCompact]}>
                Assinatura Premium Ativa
              </Text>
              <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
                Acesso a todos os recursos!
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Se não é premium, mostrar banner de upgrade
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="rocket" size={compact ? 24 : 32} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, compact && styles.titleCompact]}>
              Upgrade para Premium
            </Text>
            <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
              Desbloqueie recursos avançados
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onSubscribe}
          >
            <Text style={styles.actionButtonText}>R$ 49,90</Text>
            <Ionicons name="arrow-forward" size={16} color="#6366f1" />
          </TouchableOpacity>
        </View>
        
        {!compact && (
          <View style={styles.benefitsContainer}>
            <Text style={styles.tipText}>
              💡 Dica: Assine o Rumo Finance Intermediário e ganhe este app grátis!
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

// Banner compacto para header
export function PremiumBadge({ hasBonus }: { hasBonus?: boolean }) {
  if (hasBonus) {
    return (
      <View style={styles.badge}>
        <Ionicons name="star" size={12} color="#f59e0b" />
        <Text style={[styles.badgeText, { color: '#f59e0b' }]}>BÔNUS</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.badge}>
      <Ionicons name="diamond" size={12} color="#10b981" />
      <Text style={[styles.badgeText, { color: '#10b981' }]}>PREMIUM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
    }),
  },
  containerCompact: {
    marginVertical: 8,
  },
  gradient: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  titleCompact: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  subtitleCompact: {
    fontSize: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  benefitsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  tipText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default SubscriptionBanner;
