import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/welcome';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import ConfirmEmailScreen from '../screens/confirmEmail';
import ForgotPasswordScreen from '../screens/forgotPassword';
import ResetPasswordScreen from '../screens/resetPassword';

/**
 * @description
 * Define o mapa de rotas e os parâmetros esperados para a pilha de navegação de autenticação.
 * Exportar este tipo garante uma única fonte de verdade para a estrutura de navegação.
 */
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ConfirmEmail: { email: string };
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

/**
 * @description
 * Componente de navegação que gerencia todas as telas do fluxo de autenticação.
 * @returns {React.FC} O navegador da pilha de autenticação.
 */
const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        // Isso define o texto do botão "voltar" no iOS como uma string vazia,
        // resultando no mesmo efeito visual de esconder o texto.
        headerBackTitle: '',
        headerTintColor: '#2D3748', // Cor padrão para o ícone de voltar
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
      <AuthStack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} options={{ title: 'Confirmação Pendente' }} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Recuperar Senha' }} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Redefinir Senha' }} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;