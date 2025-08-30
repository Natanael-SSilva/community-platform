import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { supabase } from '../../services/supabase'; // Importamos nosso cliente Supabase
import { styles } from './style';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Campo para o nome de usuário do perfil

    // Função que lida com o cadastro do usuário
    const handleSignUp = async () => {
        if (!email || !password || !username) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        // Usamos a função signUp do Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                // Aqui passamos dados extras que queremos associar ao usuário,
                // como o nome de usuário que irá para a tabela 'profiles'.
                data: {
                    username: username,
                    full_name: username, // Podemos usar o username como nome completo inicial
                }
            }
        });

        if (error) {
            // Se houver um erro, exibe para o usuário
            Alert.alert("Erro no Cadastro", error.message);
        } else {
            // Se o cadastro for bem-sucedido
            Alert.alert(
                "Cadastro realizado!",
                "Enviamos um e-mail de confirmação para você. Por favor, verifique sua caixa de entrada."
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Crie sua Conta</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Nome de usuário"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            
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
                secureTextEntry // Esconde a senha
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default RegisterScreen;