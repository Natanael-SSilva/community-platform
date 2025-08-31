import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/editProfile';
import ChangePasswordScreen from '../screens/changePassword';

// Mapa de telas para a área logada, agora incluindo a tela de alterar senha
export type AppStackParamList = {
  MainTabs: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      {/* A primeira tela é o nosso conjunto de abas */}
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
      {/* A tela de edição de perfil será aberta por cima das abas */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Editar Perfil' }} 
      />
      {/* A tela de alterar senha também será aberta por cima das abas */}
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        options={{ title: 'Alterar Senha' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;