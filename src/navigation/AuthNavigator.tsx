import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types'; // Importa os tipos do arquivo central

// Importação das telas que este navegador gerencia
import WelcomeScreen from '../screens/welcome';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import ConfirmEmailScreen from '../screens/confirmEmail';
import ForgotPasswordScreen from '../screens/forgotPassword';
import ResetPasswordScreen from '../screens/resetPassword';

// Cria o navegador de pilha com a tipagem correta
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

/**
 * @description
 * Componente de navegação que gerencia todas as telas relacionadas ao fluxo de autenticação
 * (telas que o usuário vê antes de fazer o login).
 * @returns {React.FC} O navegador da pilha de autenticação.
 */
const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerBackTitle: '', // Esconde o texto do botão "voltar" no iOS
        headerTintColor: '#2D3748',
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