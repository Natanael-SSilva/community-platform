import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { supabase } from '../../services/supabase'; // Importamos nosso cliente Supabase
import { styles } from '../register/style'; // Reutilizando o estilo do registro

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Função que lida com o login do usuário
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha e-mail e senha.");
            return;
        }

        // Usamos a função signInWithPassword do Supabase Auth
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // Se houver um erro, exibe para o usuário
            Alert.alert("Erro no Login", error.message);
        } else {
            // Se o login for bem-sucedido, podemos navegar para a tela principal.
            // Por enquanto, vamos apenas mostrar um alerta.
            Alert.alert("Login realizado!", "Você será redirecionado em breve.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Acesse sua Conta</Text>
            
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LoginScreen;