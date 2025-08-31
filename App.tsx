import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';

import { supabase } from './src/services/supabase';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator'; // Usando o novo navegador principal

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      // Tornamos a busca da sessão mais segura
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erro ao buscar sessão:", error);
      }
      setSession(data?.session ?? null); // Se data ou session for nulo, retorna null
      setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    };

    fetchSession();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3F83F8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* A lógica principal agora renderiza o navegador apropriado:
        - AppNavigator: Para usuários logados (contém a TabBar e a tela de Editar Perfil).
        - AuthNavigator: Para usuários não logados.
      */}
      {session && session.user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}