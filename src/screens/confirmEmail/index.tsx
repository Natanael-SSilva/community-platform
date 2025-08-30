import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './style';

// Tipos para a navegação e para os parâmetros da rota
type AuthStackParamList = {
    Login: undefined;
    ConfirmEmail: { email: string };
};
type ConfirmEmailNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ConfirmEmail'>;
type ConfirmEmailRouteProp = RouteProp<AuthStackParamList, 'ConfirmEmail'>;

const ConfirmEmailScreen = () => {
    const navigation = useNavigation<ConfirmEmailNavigationProp>();
    const route = useRoute<ConfirmEmailRouteProp>();
    const { email } = route.params; // Pega o email passado pela tela de cadastro

    return (
        <SafeAreaView style={styles.container}>
            <Ionicons name="mail-unread-outline" size={100} color="#3F83F8" style={styles.icon} />
            <Text style={styles.title}>Confirme seu E-mail</Text>
            <Text style={styles.message}>
                Enviamos um link de confirmação para o e-mail:
            </Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.message}>
                Por favor, clique no link para ativar sua conta e poder fazer o login.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Voltar para Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ConfirmEmailScreen;