import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { View, ActivityIndicator, Text } from 'react-native';
import * as Linking from 'expo-linking';

import { supabase } from './src/services/supabase';
import AuthNavigator, { AuthStackParamList } from './src/navigation/AuthNavigator';
import AppNavigator, { AppStackParamList } from './src/navigation/AppNavigator';

// Cria um prefixo para o nosso deep link, baseado no 'scheme' definido em app.json.
const prefix = Linking.createURL('/');

/**
 * @description
 * O componente raiz do aplicativo.
 * Sua responsabilidade é gerenciar o estado da sessão de autenticação e
 * configurar o deep linking para o fluxo de recuperação de senha.
 */
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_OUT') {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * @description
   * Configuração do Deep Linking para o React Navigation.
   * Conecta URLs a telas específicas do aplicativo.
   */
  // A tipagem combina as telas de ambos os navegadores.
  const linking: LinkingOptions<AuthStackParamList & AppStackParamList> = {
    prefixes: [prefix],
    config: {
      // O objeto 'screens' define o mapeamento de URL para tela.
      screens: {
        // CORREÇÃO: Mapeamos a rota 'reset-password' do deep link diretamente
        // para a tela 'ResetPassword'. O React Navigation irá encontrá-la
        // no navegador que estiver ativo (neste caso, o AuthNavigator).
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
    <NavigationContainer linking={linking} fallback={<Text>Carregando...</Text>}>
      {session && session.user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}