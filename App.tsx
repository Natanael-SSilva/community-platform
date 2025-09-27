import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { View, ActivityIndicator, Text } from 'react-native';
import * as Linking from 'expo-linking';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from './src/services/supabase';

// Importação dos componentes de Navegação
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';

import { AuthStackParamList, AppStackParamList } from './src/navigation/types';

// Cria um prefixo para o nosso deep link, baseado no 'scheme' definido em app.json.
const prefix = Linking.createURL('/');

/**
 * @description
 * O componente raiz do aplicativo.
 * Suas responsabilidades são:
 * 1. Prover o contexto de Área Segura para toda a aplicação.
 * 2. Gerenciar o estado da sessão de autenticação.
 * 3. Configurar o deep linking para fluxos como a recuperação de senha.
 */
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão inicial para evitar que a tela de login pisque na abertura.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Ouve as mudanças de estado (login, logout, TOKEN_REFRESHED, PASSWORD_RECOVERY)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Garante que o loading seja desativado em todos os eventos relevantes
      if (
        _event === 'SIGNED_OUT' ||
        _event === 'SIGNED_IN' ||
        _event === 'PASSWORD_RECOVERY'
      ) {
        setLoading(false);
      }
    });

    // Limpa a inscrição ao desmontar o componente para evitar vazamentos de memória.
    return () => subscription.unsubscribe();
  }, []);

  /**
   * @description
   * Configuração do Deep Linking para o React Navigation.
   * Conecta URLs (como as de e-mail) a telas específicas do aplicativo.
   */
  const linking: LinkingOptions<AuthStackParamList & AppStackParamList> = {
    prefixes: [prefix],
    config: {
      screens: {
        // Mapeia a rota 'reset-password' do deep link diretamente para a tela 'ResetPassword'.
        ResetPassword: 'reset-password',
      },
    },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3F83F8" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        linking={linking}
        fallback={<Text>Carregando...</Text>}
      >
        {session && session.user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
