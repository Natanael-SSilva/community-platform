import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/editProfile';
import ChangePasswordScreen from '../screens/changePassword';
import AddServiceScreen from '../screens/addService';

// Mapa de telas para a área logada, agora incluindo a tela de adicionar serviço
export type AppStackParamList = {
  MainTabs: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  AddService: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Alterar Senha' }} />
      {/* A nova tela de cadastro de serviço adicionada à pilha */}
      <Stack.Screen name="AddService" component={AddServiceScreen} options={{ title: 'Cadastrar Serviço' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;