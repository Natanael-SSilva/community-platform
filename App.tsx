import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { View, ActivityIndicator, Text } from 'react-native';
import * as Linking from 'expo-linking';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from './src/services/supabase';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthStackParamList, AppStackParamList } from './src/navigation/types';

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (
        _event === 'SIGNED_OUT' ||
        _event === 'SIGNED_IN' ||
        _event === 'PASSWORD_RECOVERY'
      ) {
        setLoading(false);
      }
    });

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
