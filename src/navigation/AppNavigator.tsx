import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';
import { AppStackParamList } from './types'; // Importa do arquivo central

// Importação dos navegadores e telas que este navegador gerencia
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/editProfile';
import ChangePasswordScreen from '../screens/changePassword';
import AddServiceScreen from '../screens/addService';
import ServiceDetailScreen from '../screens/serviceDetail';
import ChatScreen from '../screens/chat';
import CompleteProfileScreen from '../screens/completeProfile';

const Stack = createNativeStackNavigator<AppStackParamList>();

/**
 * @description
 * Navegador principal para usuários autenticados.
 * Este componente verifica se o perfil do usuário está completo para
 * definir a rota inicial: a tela para completar o perfil ou a tela principal com abas.
 * @returns {React.FC} O navegador da pilha principal do app.
 */
const AppNavigator: React.FC = () => {
    const [isProfileComplete, setProfileComplete] = useState<boolean | null>(null);

    useEffect(() => {
        const checkProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, phone, location')
                    .eq('id', user.id)
                    .single();
                
                setProfileComplete(!!(profile && profile.full_name && profile.phone && profile.location));
            }
        };
        checkProfile();
    }, []);

    // Exibe um loading enquanto o perfil é verificado.
    if (isProfileComplete === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3F83F8" />
            </View>
        );
    }

    return (
        <Stack.Navigator 
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