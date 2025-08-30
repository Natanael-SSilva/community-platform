import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
// CORREÇÃO: O caminho para o estilo deve ser relativo à pasta 'register'
// Certifique-se que o arquivo style.ts está em 'src/screens/register/style.ts'
import { styles } from '../register/style';

const LoginScreen = () => {
    // Seus states continuam os mesmos
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleLogin = async () => {
        setError('');
        if (!email || !password) {
            setError("Por favor, preencha e-mail e senha.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // Supabase retorna um erro específico se o email não for confirmado
            if (error.message === 'Email not confirmed') {
                setError('Por favor, confirme seu e-mail antes de fazer o login.');
            } else {
                setError('E-mail ou senha inválidos.');
            }
        } else {
            // SUCESSO! Mostra o modal com check verde
            setShowSuccess(true);
            // O listener no App.tsx cuidará da navegação após a sessão ser atualizada.
            // O modal vai desaparecer quando o componente for desmontado pela navegação.
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Modal de sucesso foi mantido aqui para o feedback visual no login */}
            <Modal transparent={true} visible={showSuccess} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Ionicons name="checkmark-circle" size={80} color="#48BB78" />
                    </View>
                </View>
            </Modal>

            {/* O resto do seu JSX continua exatamente o mesmo */}
            <Text style={styles.title}>Acesse sua Conta</Text>
            
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={text => { setEmail(text); setError(''); }} keyboardType="email-address" autoCapitalize="none" />
            </View>
            
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={text => { setPassword(text); setError(''); }} secureTextEntry={!isPasswordVisible} />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" style={styles.icon} />
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LoginScreen;