import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/welcome';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import ConfirmEmailScreen from '../screens/confirmEmail';

// MELHORIA: Definimos um "mapa" das nossas telas de autenticação
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ConfirmEmail: { email: string }; // A tela ConfirmEmail espera um parâmetro 'email'
};

// MELHORIA: Informamos ao navegador sobre o nosso "mapa" de telas
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
      <AuthStack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} options={{ title: 'Confirmação Pendente' }} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;