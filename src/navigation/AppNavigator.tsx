import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/editProfile';
import ChangePasswordScreen from '../screens/changePassword';
import AddServiceScreen from '../screens/addService';
import ServiceDetailScreen from '../screens/serviceDetail';

// O mapa de telas agora inclui ServiceDetail e o parâmetro que ele espera (serviceId)
export type AppStackParamList = {
  MainTabs: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  AddService: undefined;
  ServiceDetail: { serviceId: number };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Alterar Senha' }} />
      <Stack.Screen name="AddService" component={AddServiceScreen} options={{ title: 'Cadastrar Serviço' }} />
      {/* A nova tela de detalhes do serviço foi adicionada à pilha */}
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ title: 'Detalhes do Serviço' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;