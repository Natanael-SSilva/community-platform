import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { styles } from './style';

// Tipagem para a navegação
type AuthStackParamList = {
    ConfirmEmail: { email: string };
};
type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const RegisterScreen = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    // ... (restante dos seus states continua igual)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        setError('');
        if (!email || !password || !username || !confirmPassword) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { data: { username: username, full_name: username } }
        });

        if (error) {
            setError(error.message);
        } else {
            // SUCESSO! Navega para a tela de confirmação, passando o email
            navigation.navigate('ConfirmEmail', { email: email });
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* O resto do seu JSX continua exatamente o mesmo */}
            <Text style={styles.title}>Crie sua Conta</Text>
            
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Nome de usuário" value={username} onChangeText={text => { setUsername(text); setError(''); }} autoCapitalize="none" />
            </View>
            
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={text => { setEmail(text); setError(''); }} keyboardType="email-address" autoCapitalize="none" />
            </View>
            
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={text => { setPassword(text); setError(''); }} secureTextEntry={!isPasswordVisible} />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Confirmar Senha" value={confirmPassword} onChangeText={text => { setConfirmPassword(text); setError(''); }} secureTextEntry={!isConfirmPasswordVisible} />
                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                    <Ionicons name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSignUp} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default RegisterScreen;