/**
 * Tela de Chat com Assistente Virtual - GPTMaker
 *
 * Chatbot inteligente para suporte aos usuários do Rumo Operacional
 * Integrado com GPTMaker AI (mesmo widget do Rumo Máquinas)
 *
 * Na web usa iframe direto, no mobile usa WebView
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';

// URL do widget GPTMaker (compartilhado entre apps Rumo)
const GPTMAKER_WIDGET_URL =
  'https://app.gptmaker.ai/widget/3EE28E7D9571839058B3C61B3FF95368/iframe';

// WebView só é usado no mobile (não funciona na web)
let WebView: React.ComponentType<Record<string, unknown>> | null = null;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    WebView = require('react-native-webview').WebView;
  } catch {
    WebView = null;
  }
}

function WebIframe({ src, onLoad }: { src: string; onLoad: () => void }) {
  return (
    <iframe
      src={src}
      onLoad={onLoad}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        flex: 1,
      }}
      allow="microphone; camera"
      title="Suporte Rumo Operacional"
    />
  );
}

export default function ChatbotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [webViewKey, setWebViewKey] = useState(0);

  const handleReload = useCallback(() => {
    setIsLoading(true);
    setWebViewKey((prev) => prev + 1);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Sparkles size={22} color="#FFD700" />
          <Text style={styles.headerText}>Suporte Rumo</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
            <RefreshCw size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat widget */}
      <View style={styles.webViewContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando assistente...</Text>
          </View>
        )}
        {Platform.OS === 'web' ? (
          <WebIframe key={webViewKey} src={GPTMAKER_WIDGET_URL} onLoad={handleLoadEnd} />
        ) : WebView ? (
          <WebView
            key={webViewKey}
            source={{ uri: GPTMAKER_WIDGET_URL }}
            style={[styles.webView, isLoading && styles.webViewHidden]}
            onLoadEnd={handleLoadEnd}
            onLoadStart={() => setIsLoading(true)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo={true}
            mixedContentMode="compatibility"
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            allowsProtectedMedia={true}
            mediaCapturePermissionGrantType="grant"
            originWhitelist={['*']}
            scalesPageToFit={true}
            scrollEnabled={true}
            bounces={false}
            overScrollMode="never"
            cacheEnabled={true}
            cacheMode="LOAD_DEFAULT"
            userAgent={`RumoOperacional/${Platform.OS === 'ios' ? 'iOS' : 'Android'} Mobile App`}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>WebView não disponível neste dispositivo</Text>
          </View>
        )}
      </View>

      {/* Rodapé com dica */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <Text style={styles.footerText}>
          💡 Tire suas dúvidas sobre custos, operações, setores e lançamentos!
        </Text>
      </View>
    </View>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  reloadButton: {
    padding: 8,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  webView: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  webViewHidden: {
    opacity: 0,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },
  footer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
