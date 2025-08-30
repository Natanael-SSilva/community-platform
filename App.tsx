import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { supabase } from './src/services/supabase';
import LoginScreen from './src/screens/login';
import RegisterScreen from './src/screens/register';
import WelcomeScreen from './src/screens/welcome';
import TabNavigator from './src/navigation/TabNavigator'; 
// IMPORTANDO A NOVA TELA
import ConfirmEmailScreen from './src/screens/confirmEmail';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session && session.user ? (
          <Stack.Screen name="App" component={TabNavigator} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
            {/* ADICIONANDO A NOVA TELA À PILHA DE NAVEGAÇÃO */}
            <Stack.Screen 
              name="ConfirmEmail" 
              component={ConfirmEmailScreen} 
              options={{ title: 'Confirmação Pendente' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}