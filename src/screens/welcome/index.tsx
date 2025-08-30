import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
// Importa o tipo 'NativeStackNavigationProp' para nos dar autocompletar e segurança de tipos
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { styles } from './style';

// Define os tipos das telas que nossa navegação pode acessar
type AuthStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
};

// Define o tipo da prop de navegação para esta tela
type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
    // Pega o "controle remoto" da navegação
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    // eslint-disable-next-line @typescript-eslint/no-require-imports
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Plataforma de Serviços Comunitários</Text>
                <Text style={styles.subtitle}>Conectando vizinhos, fortalecendo a comunidade.</Text>
            </View>

            <View style={styles.buttonContainer}>
                {/* Botão para navegar para a tela de Login */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Fazer Login</Text>
                </TouchableOpacity>

                {/* Botão para navegar para a tela de Cadastro */}
                <TouchableOpacity 
                    style={[styles.button, styles.buttonOutline]} 
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={[styles.buttonText, styles.buttonOutlineText]}>Criar Conta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;