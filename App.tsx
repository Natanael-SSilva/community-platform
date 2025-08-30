import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { supabase } from './src/services/supabase';

// Importando nossas telas
import LoginScreen from './src/screens/login';
import RegisterScreen from './src/screens/register';
import WelcomeScreen from './src/screens/welcome';
import HomeScreen from './src/screens/home';

// Cria o "controlador" da nossa pilha de navegação
const Stack = createNativeStackNavigator();

export default function App() {
  // O 'session' vai guardar a informação do usuário logado.
  // Se for 'null', o usuário não está logado.
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // 1. Tenta pegar a sessão que já existe quando o app abre
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Ouve em tempo real as mudanças na autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // 3. Limpa a inscrição quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session && session.user ? (
          // Se EXISTE uma sessão (usuário logado), mostra a tela Home
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} // Esconde o cabeçalho
          />
        ) : (
          // Se NÃO EXISTE sessão, mostra as telas de autenticação
          <>
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Login' }} // Mostra um cabeçalho simples
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