import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './style';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

/**
 * A tela de boas-vindas é a primeira tela que um usuário não autenticado vê.
 * Ela apresenta o propósito do aplicativo e fornece as ações primárias:
 * fazer login ou criar uma nova conta.
 * @returns {React.FC} O componente da tela de boas-vindas.
 */
const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    /**
     * Navega para a tela de Login.
     * Esta função encapsula a ação de navegação para melhorar a legibilidade
     * e facilitar futuras manutenções (ex: adicionar um evento de analytics).
     */
    const navigateToLogin = () => {
        navigation.navigate('Login');
    };

    /**
     * Navega para a tela de Cadastro (Register).
     */
    const navigateToRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.contentContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Sua comunidade, conectada.</Text>
                <Text style={styles.subtitle}>
                    Encontre ajuda ou ofereça seus talentos. Fortaleça a economia local com um toque.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.button, styles.buttonPrimary]} 
                    onPress={navigateToLogin}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonTextPrimary}>Fazer Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.buttonSecondary]} 
                    onPress={navigateToRegister}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonTextSecondary}>Criar Conta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;