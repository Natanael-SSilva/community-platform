import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Certifique-se de que os caminhos de importação estão corretos
import { supabase } from './src/services/supabase';
import LoginScreen from './src/screens/login';
import RegisterScreen from './src/screens/register';
import WelcomeScreen from './src/screens/welcome';
import TabNavigator from './src/navigation/TabNavigator'; 

// Cria o controlador da nossa pilha de navegação
const Stack = createNativeStackNavigator();

export default function App() {
  // Guarda a sessão do usuário
  const [session, setSession] = useState<Session | null>(null);

  // Este hook roda quando o app inicia para verificar a sessão
  useEffect(() => {
    // Pega a sessão atual, se existir
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Ouve em tempo real as mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpa a inscrição para evitar vazamentos de memória
    return () => subscription.unsubscribe();
  }, []);

  // O NavigationContainer é o invólucro principal da navegação
  return (
    <NavigationContainer>
      {/* O Stack.Navigator controla a pilha de telas */}
      <Stack.Navigator>
        {session && session.user ? (
          // Se o usuário estiver logado, renderiza o TabNavigator
          <Stack.Screen 
            name="App" 
            component={TabNavigator} 
            options={{ headerShown: false }} 
          />
        ) : (
          // Se não estiver logado, renderiza as telas de autenticação dentro de um Fragment
          <>
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Login' }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Cadastro' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}