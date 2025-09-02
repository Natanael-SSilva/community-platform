import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';
// Importação de todas as telas que este navegador controla
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/editProfile';
import ChangePasswordScreen from '../screens/changePassword';
import AddServiceScreen from '../screens/addService';
import ServiceDetailScreen from '../screens/serviceDetail';
import ChatScreen from '../screens/chat';
import CompleteProfileScreen from '../screens/completeProfile';

/**
 * @description
 * Mapa de rotas para a área logada do aplicativo.
 * Centralizar este tipo é uma prática de "Clean Code" que garante consistência.
 */
export type AppStackParamList = {
  MainTabs: undefined;
  CompleteProfile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  AddService: undefined;
  ServiceDetail: { serviceId: number };
  Chat: {
    conversationId: number;
    recipient: { id: string; full_name: string; avatar_url: string; };
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

/**
 * @description
 * Navegador para usuários autenticados.
 * Ele verifica se o perfil do usuário está completo para definir a rota inicial.
 * Se o perfil estiver incompleto, força o fluxo de onboarding (`CompleteProfile`).
 * Caso contrário, direciona para a tela principal (`MainTabs`).
 */
const AppNavigator: React.FC = () => {
    const [isProfileComplete, setProfileComplete] = useState<boolean | null>(null);

    useEffect(() => {
        const checkProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('full_name, phone, location') // Verificamos campos que só são preenchidos no onboarding
                    .eq('id', user.id)
                    .single();
                
                // O perfil é considerado completo se todos os campos essenciais do onboarding existirem
                if (profile && profile.full_name && profile.phone && profile.location) {
                    setProfileComplete(true);
                } else {
                    setProfileComplete(false);
                }
            }
        };
        checkProfile();
    }, []);

    // Exibe um loading enquanto a verificação do perfil está em andamento
    if (isProfileComplete === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3F83F8" />
            </View>
        );
    }

    return (
        <Stack.Navigator 
            // A rota inicial é definida dinamicamente com base na verificação do perfil
            initialRouteName={isProfileComplete ? "MainTabs" : "CompleteProfile"}
        >
            <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Alterar Senha' }} />
            <Stack.Screen name="AddService" component={AddServiceScreen} options={{ title: 'Cadastrar Serviço' }} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ title: 'Detalhes do Serviço' }} />
            <Stack.Screen 
                name="Chat" 
                component={ChatScreen} 
                options={({ route }: NativeStackScreenProps<AppStackParamList, 'Chat'>) => ({ 
                    title: route.params.recipient.full_name 
                })} 
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;